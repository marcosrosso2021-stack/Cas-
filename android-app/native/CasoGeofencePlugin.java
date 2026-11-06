package fr.caso.app;

import android.Manifest;
import android.content.Context;
import android.content.SharedPreferences;
import android.os.Build;

import com.getcapacitor.JSArray;
import com.getcapacitor.JSObject;
import com.getcapacitor.PermissionState;
import com.getcapacitor.Plugin;
import com.getcapacitor.PluginCall;
import com.getcapacitor.PluginMethod;
import com.getcapacitor.annotation.CapacitorPlugin;
import com.getcapacitor.annotation.Permission;
import com.getcapacitor.annotation.PermissionCallback;

/** Pont entre casô (JavaScript) et les zones de chantier surveillées par Android. */
@CapacitorPlugin(
        name = "CasoGeofence",
        permissions = {
                @Permission(alias = "location", strings = {
                        Manifest.permission.ACCESS_FINE_LOCATION,
                        Manifest.permission.ACCESS_COARSE_LOCATION}),
                @Permission(alias = "background", strings = {
                        Manifest.permission.ACCESS_BACKGROUND_LOCATION})
        })
public class CasoGeofencePlugin extends Plugin {

    private SharedPreferences prefs() {
        return getContext().getSharedPreferences("caso_geo", Context.MODE_PRIVATE);
    }

    /** setGeofences({ sites:[{ id, lat, lng, radius }] }) */
    @PluginMethod
    public void setGeofences(PluginCall call) {
        JSArray sites = call.getArray("sites");
        if (sites == null) { call.reject("sites manquant"); return; }
        prefs().edit().putString("sites", sites.toString()).apply();
        GeofenceHelper.register(getContext(), sites);
        call.resolve();
    }

    @PluginMethod
    public void clearGeofences(PluginCall call) {
        prefs().edit().remove("sites").apply();
        GeofenceHelper.clear(getContext());
        call.resolve();
    }

    /** Renvoie les passages notés par le système depuis le dernier appel, puis vide la file. */
    @PluginMethod
    public void drainEvents(PluginCall call) {
        String q;
        synchronized (GeofenceReceiver.class) {
            q = prefs().getString("queue", "[]");
            prefs().edit().putString("queue", "[]").apply();
        }
        JSObject ret = new JSObject();
        try {
            ret.put("events", new JSArray(q));
        } catch (Exception e) {
            ret.put("events", new JSArray());
        }
        call.resolve(ret);
    }

    @PluginMethod
    public void status(PluginCall call) {
        resolveStates(call);
    }

    /** Demande la localisation, puis « toujours » (Android 10 et plus). */
    @PluginMethod
    public void ensurePermissions(PluginCall call) {
        if (getPermissionState("location") != PermissionState.GRANTED) {
            requestPermissionForAlias("location", call, "locationCb");
        } else {
            backgroundStep(call);
        }
    }

    @PermissionCallback
    private void locationCb(PluginCall call) {
        if (getPermissionState("location") == PermissionState.GRANTED) {
            backgroundStep(call);
        } else {
            resolveStates(call);
        }
    }

    private void backgroundStep(PluginCall call) {
        if (Build.VERSION.SDK_INT >= 29 && getPermissionState("background") != PermissionState.GRANTED) {
            requestPermissionForAlias("background", call, "backgroundCb");
        } else {
            resolveStates(call);
        }
    }

    @PermissionCallback
    private void backgroundCb(PluginCall call) {
        resolveStates(call);
    }

    private void resolveStates(PluginCall call) {
        JSObject ret = new JSObject();
        ret.put("location", getPermissionState("location").toString());
        ret.put("background", Build.VERSION.SDK_INT >= 29
                ? getPermissionState("background").toString() : "granted");
        call.resolve(ret);
    }
}
