package fr.caso.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import org.json.JSONArray;
import org.json.JSONObject;

import java.util.List;

/**
 * Reçoit les passages de zone du système, même quand casô est fermé,
 * et les garde avec leur heure dans une file sur le téléphone.
 * casô les lit et les traite à son prochain réveil.
 */
public class GeofenceReceiver extends BroadcastReceiver {

    private static final int MAX_FILE = 500;

    @Override
    public void onReceive(Context c, Intent intent) {
        GeofencingEvent ev = GeofencingEvent.fromIntent(intent);
        if (ev == null || ev.hasError()) return;

        String type;
        switch (ev.getGeofenceTransition()) {
            case Geofence.GEOFENCE_TRANSITION_ENTER: type = "enter"; break;
            case Geofence.GEOFENCE_TRANSITION_DWELL: type = "dwell"; break;
            case Geofence.GEOFENCE_TRANSITION_EXIT:  type = "exit";  break;
            default: return;
        }
        List<Geofence> zones = ev.getTriggeringGeofences();
        if (zones == null || zones.isEmpty()) return;

        SharedPreferences sp = c.getSharedPreferences("caso_geo", Context.MODE_PRIVATE);
        synchronized (GeofenceReceiver.class) {
            try {
                JSONArray q = new JSONArray(sp.getString("queue", "[]"));
                long now = System.currentTimeMillis();
                for (Geofence g : zones) {
                    JSONObject o = new JSONObject();
                    o.put("site", g.getRequestId());
                    o.put("type", type);
                    o.put("ts", now);
                    q.put(o);
                }
                JSONArray out = q;
                if (q.length() > MAX_FILE) {
                    out = new JSONArray();
                    for (int k = q.length() - MAX_FILE; k < q.length(); k++) out.put(q.get(k));
                }
                sp.edit().putString("queue", out.toString()).apply();
            } catch (Exception e) {
                // file illisible : on ignore ce passage
            }
        }
    }
}
