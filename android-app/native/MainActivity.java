package fr.caso.app;

import android.os.Bundle;

import com.getcapacitor.BridgeActivity;

public class MainActivity extends BridgeActivity {
    @Override
    public void onCreate(Bundle savedInstanceState) {
        registerPlugin(CasoGeofencePlugin.class);
        registerPlugin(CasoBioPlugin.class);
        super.onCreate(savedInstanceState);
    }
}
