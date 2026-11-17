import Foundation
import Capacitor
import LocalAuthentication
import Security

/*
 * Clé biométrique du coffre casô (même contrat que le plugin Android) : disponible, creer, lire, effacer.
 *
 * Un secret de 32 octets est tiré au hasard et rangé dans le trousseau de l'iPhone (Keychain), lisible seulement
 * sur cet appareil, téléphone déverrouillé, après Face ID ou Touch ID. Si les visages ou empreintes enregistrés
 * changent, iOS rend le secret illisible. Il ne part ni dans iCloud ni dans une sauvegarde.
 * Aucune donnée biométrique ne quitte l'iPhone ; rien n'est écrit dans les journaux.
 */
@objc(CasoBioPlugin)
public class CasoBioPlugin: CAPPlugin, CAPBridgedPlugin {
    public let identifier = "CasoBioPlugin"
    public let jsName = "CasoBio"
    public let pluginMethods: [CAPPluginMethod] = [
        CAPPluginMethod(name: "disponible", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "creer", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "lire", returnType: CAPPluginReturnPromise),
        CAPPluginMethod(name: "effacer", returnType: CAPPluginReturnPromise)
    ]

    private let service = "fr.caso.app.coffre"
    private let account = "cle-bio"

    private func base() -> [String: Any] {
        return [
            kSecClass as String: kSecClassGenericPassword,
            kSecAttrService as String: service,
            kSecAttrAccount as String: account
        ]
    }

    @objc func disponible(_ call: CAPPluginCall) {
        let ctx = LAContext()
        var err: NSError?
        let ok = ctx.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &err)
        var type = ""
        if ctx.biometryType == .faceID { type = "face" } else if ctx.biometryType == .touchID { type = "empreinte" }
        call.resolve(["ok": ok, "type": type])
    }

    /* Face ID est demandé une fois à la création, puis le secret est rangé dans le trousseau. */
    @objc func creer(_ call: CAPPluginCall) {
        let raison = call.getString("raison") ?? "Ouvrir casô"
        let ctx = LAContext()
        var err: NSError?
        guard ctx.canEvaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, error: &err) else {
            call.reject("indisponible")
            return
        }
        ctx.evaluatePolicy(.deviceOwnerAuthenticationWithBiometrics, localizedReason: raison) { ok, _ in
            guard ok else {
                call.reject("annule")
                return
            }
            var bytes = [UInt8](repeating: 0, count: 32)
            guard SecRandomCopyBytes(kSecRandomDefault, bytes.count, &bytes) == errSecSuccess else {
                call.reject("indisponible")
                return
            }
            guard let acl = SecAccessControlCreateWithFlags(nil, kSecAttrAccessibleWhenPasscodeSetThisDeviceOnly,
                                                            .biometryCurrentSet, nil) else {
                call.reject("indisponible")
                return
            }
            SecItemDelete(self.base() as CFDictionary)
            var q = self.base()
            q[kSecValueData as String] = Data(bytes)
            q[kSecAttrAccessControl as String] = acl
            guard SecItemAdd(q as CFDictionary, nil) == errSecSuccess else {
                call.reject("indisponible")
                return
            }
            call.resolve(["secret": Data(bytes).base64EncodedString()])
        }
    }

    /* La lecture du trousseau déclenche Face ID / Touch ID ; sans visage ou empreinte reconnu, iOS ne rend rien. */
    @objc func lire(_ call: CAPPluginCall) {
        let ctx = LAContext()
        ctx.localizedReason = call.getString("raison") ?? "Ouvrir casô"
        var q = base()
        q[kSecReturnData as String] = true
        q[kSecMatchLimit as String] = kSecMatchLimitOne
        q[kSecUseAuthenticationContext as String] = ctx
        DispatchQueue.global(qos: .userInitiated).async {
            var out: CFTypeRef?
            let st = SecItemCopyMatching(q as CFDictionary, &out)
            if st == errSecSuccess, let d = out as? Data {
                call.resolve(["secret": d.base64EncodedString()])
            } else if st == errSecItemNotFound {
                call.reject("absente")
            } else if st == errSecUserCanceled {
                call.reject("annule")
            } else {
                call.reject("refuse")
            }
        }
    }

    @objc func effacer(_ call: CAPPluginCall) {
        SecItemDelete(base() as CFDictionary)
        call.resolve()
    }
}
