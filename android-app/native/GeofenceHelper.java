package fr.caso.app;

import android.annotation.SuppressLint;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.os.Build;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.ArrayList;
import java.util.List;

/** Inscrit les zones de chantier auprès du système (Google Play Services). */
public class GeofenceHelper {

    private static final long VALIDITE_MS = 48L * 3600 * 1000;
    private static final int MAX_ZONES = 90;

    static PendingIntent pending(Context c) {
        Intent i = new Intent(c, GeofenceReceiver.class);
        int flags = PendingIntent.FLAG_UPDATE_CURRENT;
        if (Build.VERSION.SDK_INT >= 31) flags |= PendingIntent.FLAG_MUTABLE;
        return PendingIntent.getBroadcast(c, 7041, i, flags);
    }

    @SuppressLint("MissingPermission")
    static void register(Context c, JSONArray sites) {
        GeofencingClient client = LocationServices.getGeofencingClient(c);
        PendingIntent pi = pending(c);
        client.removeGeofences(pi);

        List<Geofence> list = new ArrayList<>();
        for (int k = 0; k < sites.length() && list.size() < MAX_ZONES; k++) {
            JSONObject o = sites.optJSONObject(k);
            if (o == null) continue;
            String id = o.optString("id", "");
            if (id.isEmpty()) continue;
            float rayon = (float) Math.max(100.0, o.optDouble("radius", 100.0));
            list.add(new Geofence.Builder()
                    .setRequestId(id)
                    .setCircularRegion(o.optDouble("lat"), o.optDouble("lng"), rayon)
                    .setExpirationDuration(VALIDITE_MS)
                    .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER
                            | Geofence.GEOFENCE_TRANSITION_DWELL
                            | Geofence.GEOFENCE_TRANSITION_EXIT)
                    .setLoiteringDelay(60000)
                    .build());
        }
        if (list.isEmpty()) return;

        GeofencingRequest req = new GeofencingRequest.Builder()
                .setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER)
                .addGeofences(list)
                .build();
        try {
            client.addGeofences(req, pi);
        } catch (SecurityException e) {
            // permission de localisation absente : rien à inscrire
        }
    }

    static void clear(Context c) {
        LocationServices.getGeofencingClient(c).removeGeofences(pending(c));
    }
}
