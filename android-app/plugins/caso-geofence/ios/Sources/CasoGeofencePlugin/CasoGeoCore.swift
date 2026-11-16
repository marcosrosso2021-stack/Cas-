import Foundation
import CoreLocation

/*
 * Zones de chantier surveillées par iOS (CLCircularRegion).
 * iOS réveille l'appli à chaque entrée ou sortie, même fermée, et casô note l'heure du passage.
 * Les passages sont rangés dans UserDefaults jusqu'à ce que casô les lise (drainEvents).
 * iOS ne donne pas de « présence confirmée » : elle est déduite ici (60 s dans la zone sans sortie).
 */
public final class CasoGeoCore: NSObject, CLLocationManagerDelegate {
    public static let shared = CasoGeoCore()

    private let manager = CLLocationManager()
    private let store = UserDefaults.standard
    private let queueKey = "caso_geo_queue"      // [[String: Any]] : { site, type, ts }
    private let insideKey = "caso_geo_inside"    // [site: { at: ms, dwell: Bool }]
    private let dwellMs: Double = 60_000
    private let maxRegions = 20                  // limite d'iOS
    private var started = false

    /// À appeler le plus tôt possible : iOS ne livre les passages qu'à un gestionnaire déjà créé.
    public func start() {
        if started { return }
        started = true
        manager.delegate = self
    }

    private func nowMs() -> Double { (Date().timeIntervalSince1970 * 1000).rounded() }

    // MARK: file d'attente et état

    private var queue: [[String: Any]] {
        get { store.array(forKey: queueKey) as? [[String: Any]] ?? [] }
        set { store.set(newValue, forKey: queueKey) }
    }
    private var inside: [String: [String: Any]] {
        get { store.dictionary(forKey: insideKey) as? [String: [String: Any]] ?? [:] }
        set { store.set(newValue, forKey: insideKey) }
    }
    private func push(_ site: String, _ type: String, _ ts: Double) {
        var q = queue
        q.append(["site": site, "type": type, "ts": ts])
        queue = Array(q.suffix(500))
    }
    private func entered(_ site: String) {
        var m = inside
        if m[site] != nil { return }
        let t = nowMs()
        m[site] = ["at": t, "dwell": false]
        inside = m
        push(site, "enter", t)
    }
    private func left(_ site: String) {
        var m = inside
        if m[site] == nil { return }
        m.removeValue(forKey: site)
        inside = m
        push(site, "exit", nowMs())
    }

    // MARK: autorisations

    public func status() -> [String: String] {
        let s: CLAuthorizationStatus
        if #available(iOS 14.0, *) { s = manager.authorizationStatus } else { s = CLLocationManager.authorizationStatus() }
        switch s {
        case .authorizedAlways: return ["location": "granted", "background": "granted"]
        case .authorizedWhenInUse: return ["location": "granted", "background": "prompt"]
        case .notDetermined: return ["location": "prompt", "background": "prompt"]
        default: return ["location": "denied", "background": "denied"]
        }
    }

    /// Demande « Pendant l'utilisation », puis « Toujours » (iOS affiche la seconde demande plus tard).
    public func ensurePermissions(_ done: @escaping ([String: String]) -> Void) {
        start()
        let s = status()
        if s["location"] == "prompt" { manager.requestWhenInUseAuthorization() }
        else if s["background"] != "granted" && s["location"] == "granted" { manager.requestAlwaysAuthorization() }
        DispatchQueue.main.asyncAfter(deadline: .now() + 1.5) { done(self.status()) }
    }

    // MARK: zones

    public func setSites(_ sites: [[String: Any]]) {
        start()
        manager.monitoredRegions.forEach { manager.stopMonitoring(for: $0) }
        var keep = Set<String>()
        for s in sites.prefix(maxRegions) {
            guard let id = s["id"] as? String,
                  let lat = (s["lat"] as? NSNumber)?.doubleValue,
                  let lng = (s["lng"] as? NSNumber)?.doubleValue else { continue }
            let r0 = (s["radius"] as? NSNumber)?.doubleValue ?? 100
            let radius = min(max(r0, 100), manager.maximumRegionMonitoringDistance)
            let region = CLCircularRegion(center: CLLocationCoordinate2D(latitude: lat, longitude: lng),
                                          radius: radius, identifier: id)
            region.notifyOnEntry = true
            region.notifyOnExit = true
            manager.startMonitoring(for: region)
            manager.requestState(for: region)   // déjà dedans à l'inscription ? iOS répond dans didDetermineState
            keep.insert(id)
        }
        inside = inside.filter { keep.contains($0.key) }
    }

    public func clear() {
        start()
        manager.monitoredRegions.forEach { manager.stopMonitoring(for: $0) }
        inside = [:]
    }

    /// Rend les passages notés depuis la dernière lecture. Ajoute « dwell » 60 s après chaque entrée encore valable.
    public func drain() -> [[String: Any]] {
        start()
        var m = inside
        let t = nowMs()
        for (site, v) in m {
            let at = (v["at"] as? NSNumber)?.doubleValue ?? t
            if (v["dwell"] as? Bool) != true && t - at >= dwellMs {
                m[site] = ["at": at, "dwell": true]
                push(site, "dwell", at + dwellMs)
            }
        }
        inside = m
        let out = queue
        queue = []
        manager.monitoredRegions.forEach { manager.requestState(for: $0) } // rattrape un passage manqué
        return out
    }

    // MARK: CLLocationManagerDelegate

    public func locationManager(_ manager: CLLocationManager, didEnterRegion region: CLRegion) { entered(region.identifier) }
    public func locationManager(_ manager: CLLocationManager, didExitRegion region: CLRegion) { left(region.identifier) }
    public func locationManager(_ manager: CLLocationManager, didDetermineState state: CLRegionState, for region: CLRegion) {
        if state == .inside { entered(region.identifier) }
        else if state == .outside { left(region.identifier) }
    }
}
