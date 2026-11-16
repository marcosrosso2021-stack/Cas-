import Foundation
import Capacitor
import UIKit

/* Même contrat que le plugin Android : status, ensurePermissions, setGeofences, clearGeofences, drainEvents, openSettings. */
@objc(CasoGeofencePlugin)
public class CasoGeofencePlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CasoGeofencePlugin"
    public let jsName = "CasoGeofence"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "status", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "ensurePermissions", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "setGeofences", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "clearGeofences", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "drainEvents", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "openSettings", returnType: CAPPluginReturnPromise)
    ]

    public override func load() { CasoGeoCore.shared.start() }

    @objc func status(_ call: CAPPluginCall) {
        DispatchQueue.main.async { call.resolve(CasoGeoCore.shared.status()) }
    }

    @objc func ensurePermissions(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            CasoGeoCore.shared.ensurePermissions { call.resolve($0) }
        }
    }

    @objc func setGeofences(_ call: CAPPluginCall) {
        let sites = (call.getArray("sites") ?? []).compactMap { $0 as? [String: Any] }
        DispatchQueue.main.async {
            CasoGeoCore.shared.setSites(sites)
            call.resolve()
        }
    }

    @objc func clearGeofences(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            CasoGeoCore.shared.clear()
            call.resolve()
        }
    }

    @objc func drainEvents(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            call.resolve(["events": CasoGeoCore.shared.drain()])
        }
    }

    @objc func openSettings(_ call: CAPPluginCall) {
        DispatchQueue.main.async {
            if let url = URL(string: UIApplication.openSettingsURLString) { UIApplication.shared.open(url) }
            call.resolve()
        }
    }
}
