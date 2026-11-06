package fr.caso.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;

import org.json.JSONArray;

/** Android efface les zones au redémarrage ou après une mise à jour : on les réinscrit. */
public class BootReceiver extends BroadcastReceiver {
    @Override
    public void onReceive(Context c, Intent intent) {
        SharedPreferences sp = c.getSharedPreferences("caso_geo", Context.MODE_PRIVATE);
        String s = sp.getString("sites", null);
        if (s == null) return;
        try {
            GeofenceHelper.register(c, new JSONArray(s));
        } catch (Exception e) {
            // liste illisible : casô la reconstruira à son prochain réveil
        }
    }
}
