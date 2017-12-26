package com.comall.preference;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaPlugin;
import org.json.JSONArray;
import org.json.JSONException;

public class Preference extends CordovaPlugin{

    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {
        if ("get".equals(action)) {
            String key = args.getString(0);
            callbackContext.success(preferences.getString(key, ""));
            return true;
        }
        return false;
    }

}
