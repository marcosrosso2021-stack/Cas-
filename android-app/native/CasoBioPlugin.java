package fr.caso.app;

import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;
import android.security.keystore.KeyGenParameterSpec;
import android.security.keystore.KeyProperties;
import android.util.Base64;

import androidx.annotation.NonNull;
import androidx.biometric.BiometricManager;
import androidx.biometric.BiometricPrompt;
import androidx.core.content.ContextCompat;
import androidx.fragment.app.FragmentActivity;

import com.getcapacitor.JSObject;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;

import java.security.KeyStore;
import java.security.SecureRandom;

import javax.crypto.Cipher;
import javax.crypto.KeyGenerator;
import javax.crypto.SecretKey;
import javax.crypto.spec.GCMParameterSpec;

/**
 * Clé biométrique du coffre casô (même contrat que le plugin iPhone) : disponible, creer, lire, effacer.
 *
 * Un secret de 32 octets est tiré au hasard, puis chiffré par une clé AES-256-GCM qui reste dans le Keystore Android.
 * Cette clé ne sert qu'après une empreinte ou un visage reconnu (classe « forte »), et elle est détruite si les
 * empreintes du téléphone changent. Le secret chiffré est rangé dans les préférences privées de l'appli.
 * Aucune donnée biométrique ne quitte le téléphone ; rien n'est écrit dans les journaux.
 */
@CapacitorPlugin(name = "CasoBio")
public class CasoBioPlugin extends Plugin {
    private static final String ALIAS = "caso_coffre_bio";
    private static final String PREFS = "caso_bio";
    private static final String STORE = "AndroidKeyStore";
    private static final String ALGO = "AES/GCM/NoPadding";

    private SharedPreferences prefs() {
        return getContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    private boolean possible() {
        return BiometricManager.from(getContext())
                .canAuthenticate(BiometricManager.Authenticators.BIOMETRIC_STRONG) == BiometricManager.BIOMETRIC_SUCCESS;
    }

    @PluginMethod
    public void disponible(PluginCall call) {
        JSObject r = new JSObject();
        r.put("ok", possible());
        r.put("type", "empreinte");
        call.resolve(r);
    }

    private SecretKey nouvelleCle() throws Exception {
        KeyStore ks = KeyStore.getInstance(STORE);
        ks.load(null);
        if (ks.containsAlias(ALIAS)) ks.deleteEntry(ALIAS);
        KeyGenParameterSpec.Builder b = new KeyGenParameterSpec.Builder(ALIAS,
                KeyProperties.PURPOSE_ENCRYPT | KeyProperties.PURPOSE_DECRYPT)
                .setBlockModes(KeyProperties.BLOCK_MODE_GCM)
                .setEncryptionPaddings(KeyProperties.ENCRYPTION_PADDING_NONE)
                .setKeySize(256)
                .setUserAuthenticationRequired(true);
        if (Build.VERSION.SDK_INT >= 24) b.setInvalidatedByBiometricEnrollment(true);
        if (Build.VERSION.SDK_INT >= 30) b.setUserAuthenticationParameters(0, KeyProperties.AUTH_BIOMETRIC_STRONG);
        else b.setUserAuthenticationValidityDurationSeconds(-1);
        KeyGenerator g = KeyGenerator.getInstance(KeyProperties.KEY_ALGORITHM_AES, STORE);
        g.init(b.build());
        return g.generateKey();
    }

    private SecretKey cle() throws Exception {
        KeyStore ks = KeyStore.getInstance(STORE);
        ks.load(null);
        return (SecretKey) ks.getKey(ALIAS, null);
    }

    private interface Suite {
        void faire(Cipher c) throws Exception;
    }

    /** Demande l'empreinte ou le visage ; le chiffrement ne peut servir qu'une fois la personne reconnue. */
    private void demander(final PluginCall call, final Cipher cipher, final Suite suite) {
        final String raison = call.getString("raison", "Ouvrir casô");
        final FragmentActivity act = getActivity();
        if (act == null) {
            call.reject("indisponible");
            return;
        }
        act.runOnUiThread(() -> {
            try {
                BiometricPrompt prompt = new BiometricPrompt(act, ContextCompat.getMainExecutor(act),
                        new BiometricPrompt.AuthenticationCallback() {
                            @Override
                            public void onAuthenticationSucceeded(@NonNull BiometricPrompt.AuthenticationResult result) {
                                try {
                                    BiometricPrompt.CryptoObject o = result.getCryptoObject();
                                    if (o == null || o.getCipher() == null) {
                                        call.reject("refuse");
                                        return;
                                    }
                                    suite.faire(o.getCipher());
                                } catch (Exception e) {
                                    call.reject("refuse");
                                }
                            }

                            @Override
                            public void onAuthenticationError(int code, @NonNull CharSequence msg) {
                                call.reject(code == BiometricPrompt.ERROR_USER_CANCELED
                                        || code == BiometricPrompt.ERROR_NEGATIVE_BUTTON
                                        || code == BiometricPrompt.ERROR_CANCELED ? "annule" : "refuse");
                            }
                        });
                BiometricPrompt.PromptInfo info = new BiometricPrompt.PromptInfo.Builder()
                        .setTitle(raison)
                        .setNegativeButtonText(getContext().getString(android.R.string.cancel))
                        .setAllowedAuthenticators(BiometricManager.Authenticators.BIOMETRIC_STRONG)
                        .setConfirmationRequired(false)
                        .build();
                prompt.authenticate(info, new BiometricPrompt.CryptoObject(cipher));
            } catch (Exception e) {
                call.reject("indisponible");
            }
        });
    }

    @PluginMethod
    public void creer(final PluginCall call) {
        if (!possible()) {
            call.reject("indisponible");
            return;
        }
        final Cipher c;
        try {
            c = Cipher.getInstance(ALGO);
            c.init(Cipher.ENCRYPT_MODE, nouvelleCle());
        } catch (Exception e) {
            call.reject("indisponible");
            return;
        }
        demander(call, c, cipher -> {
            byte[] secret = new byte[32];
            new SecureRandom().nextBytes(secret);
            byte[] ct = cipher.doFinal(secret);
            prefs().edit()
                    .putString("iv", Base64.encodeToString(cipher.getIV(), Base64.NO_WRAP))
                    .putString("ct", Base64.encodeToString(ct, Base64.NO_WRAP))
                    .apply();
            JSObject r = new JSObject();
            r.put("secret", Base64.encodeToString(secret, Base64.NO_WRAP));
            java.util.Arrays.fill(secret, (byte) 0);
            call.resolve(r);
        });
    }

    @PluginMethod
    public void lire(final PluginCall call) {
        final String iv = prefs().getString("iv", null);
        final String ct = prefs().getString("ct", null);
        if (iv == null || ct == null) {
            call.reject("absente");
            return;
        }
        final Cipher c;
        try {
            SecretKey k = cle();
            if (k == null) {
                call.reject("absente");
                return;
            }
            c = Cipher.getInstance(ALGO);
            c.init(Cipher.DECRYPT_MODE, k, new GCMParameterSpec(128, Base64.decode(iv, Base64.NO_WRAP)));
        } catch (Exception e) {
            // empreintes du téléphone changées : la clé a été détruite par Android
            call.reject("invalide");
            return;
        }
        demander(call, c, cipher -> {
            byte[] secret = cipher.doFinal(Base64.decode(ct, Base64.NO_WRAP));
            JSObject r = new JSObject();
            r.put("secret", Base64.encodeToString(secret, Base64.NO_WRAP));
            java.util.Arrays.fill(secret, (byte) 0);
            call.resolve(r);
        });
    }

    @PluginMethod
    public void effacer(PluginCall call) {
        try {
            KeyStore ks = KeyStore.getInstance(STORE);
            ks.load(null);
            if (ks.containsAlias(ALIAS)) ks.deleteEntry(ALIAS);
        } catch (Exception e) {
            // rien à effacer
        }
        prefs().edit().clear().apply();
        call.resolve();
    }
}
