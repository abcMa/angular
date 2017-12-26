package com.comall.cordova.deploy;

import android.content.Context;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.content.pm.PackageManager.NameNotFoundException;
import android.content.res.AssetManager;
import android.content.SharedPreferences;
import android.os.AsyncTask;
import android.util.JsonReader;
import android.util.Log;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.apache.cordova.PluginResult;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.io.BufferedInputStream;
import java.io.BufferedOutputStream;
import java.io.BufferedReader;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.OutputStream;
import java.net.HttpURLConnection;
import java.net.MalformedURLException;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.HashSet;
import java.util.List;
import java.util.Map;
import java.util.Set;
import java.util.Iterator;
import java.util.zip.ZipEntry;
import java.util.zip.ZipFile;
import java.util.zip.ZipInputStream;

class JsonHttpResponse {
    Boolean error;
    JSONObject json;
}

public class Deploy extends CordovaPlugin {
    boolean debug = true;
    String checkUrl = null;
    Map<String, String> requestHeaders = null;

    SharedPreferences prefs = null;

    Context myContext = null;
    CordovaWebView v = null;
    String version_label = null;
    boolean ignore_deploy = false;
    JSONObject last_update;

    public static final String NO_DEPLOY_LABEL = "NO_DEPLOY_LABEL";
    public static final String NO_DEPLOY_AVAILABLE = "NO_DEPLOY_AVAILABLE";
    public static final String NOTHING_TO_IGNORE = "NOTHING_TO_IGNORE";

    /**
     * Sets the context of the Command. This can then be used to do things like
     * get file paths associated with the Activity.
     *
     * @param cordova The context of the main Activity.
     * @param webView The CordovaWebView Cordova is running in.
     */
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        this.myContext = this.cordova.getActivity().getApplicationContext();
        this.prefs = getPreferences();
        this.v = webView;
        this.version_label = prefs.getString("ionicdeploy_version_label", Deploy.NO_DEPLOY_LABEL);

        this.initVersionChecks();
    }

    // ======================================================================
    // SharedPreferences 属性的设置器和访问器
    // ======================================================================

    /**
     * 获取当前所使用的版本标记
     */
    private String getUUID() {
        return this.prefs.getString("uuid", Deploy.NO_DEPLOY_AVAILABLE);
    }

    /**
     * 获取当前所使用的版本标记
      */
    private String getUUID(String defaultUUID) {
        return this.prefs.getString("uuid", defaultUUID);
    }

    /**
     * 设置当前所使用的版本标记
     */
    private void setUUID(String value) {
        this.prefs.edit().putString("uuid", value).apply();
    }

    /**
     * 获取当前需要更新的版本标记
     */
    private String getUpstreamUUID(String defaultValue) {
        return this.prefs.getString("upstream_uuid", defaultValue);
    }

    /**
     * 设置当前需要更新的版本标记
     */
    private void setUpstreamUUID(String value) {
        this.prefs.edit().putString("upstream_uuid", value).apply();
    }

    /**
     * 获取当前需要更新的版本标记
     */
    private String getLoadedUUID(String defaultValue) {
        return this.prefs.getString("loaded_uuid", defaultValue);
    }

    /**
     * 设置当前需要更新的版本标记
     */
    private void setLoadedUUID(String value) {
        this.prefs.edit().putString("loaded_uuid", value).apply();
    }

    /**
     * 获取当前已下载的版本标记
     */
    private String getDownloadUUID(String defaultValue) {
        return this.prefs.getString("download_uuid", defaultValue);
    }

    /**
     * 设置当前已下载的版本标记
     */
    private void setDownloadUUID(String value) {
        this.prefs.edit().putString("download_uuid", value).apply();
    }

    /**
     * 获取所有已准备好的（下载并解压缩后的）更新包版本信息
     */
    private Set<String> getMyVersions() {
        return this.prefs.getStringSet("my_versions", new HashSet<String>());
    }

    /**
     * 设置所有已准备好的（下载并解压缩后的）更新包版本信息
     */
    private void setMyVersions(Set<String> value) {
        this.prefs.edit().putStringSet("my_versions", value).apply();
    }

    /**
     * 获取当前所有已准备好的（下载并解压缩后的）更新包的数量
     */
    private int getVersionCount(int defaultValue) {
        return this.prefs.getInt("version_count", defaultValue);
    }

    /**
     * 设置当前所有已准备好的（下载并解压缩后的）更新包的数量
     */
    private void setVersionCount(int value) {
        this.prefs.edit().putInt("version_count", value);
    }

    private PackageInfo getAppPackageInfo() throws NameNotFoundException {
        PackageManager packageManager = this.cordova.getActivity().getPackageManager();
        return packageManager.getPackageInfo(this.cordova.getActivity().getPackageName(), 0);
    }

    private void initVersionChecks() {
        String ionicdeploy_version_label = Deploy.NO_DEPLOY_LABEL;
        String uuid = this.getUUID();

        try {
            ionicdeploy_version_label = this.constructVersionLabel(this.getAppPackageInfo(), uuid);
        } catch (NameNotFoundException e) {
            logMessage("INIT", "Could not get package info");
        }

        if (!ionicdeploy_version_label.equals(Deploy.NO_DEPLOY_LABEL)) {
            if (this.debug) {
                logMessage("INIT", "Version Label 1: " + this.version_label);
                logMessage("INIT", "Version Label 2: " + ionicdeploy_version_label);
            }

            if (!this.version_label.equals(ionicdeploy_version_label)) {
                this.ignore_deploy = true;
                this.updateVersionLabel(uuid);
                this.prefs.edit().remove("uuid").apply();
            }
        }
    }

    private String constructVersionLabel(PackageInfo packageInfo, String uuid) {
        String version = packageInfo.versionName;
        String timestamp = String.valueOf(packageInfo.lastUpdateTime);
        return version + ":" + timestamp + ":" + uuid;
    }

    private String[] deconstructVersionLabel(String label) {
        return label.split(":");
    }

    public Object onMessage(String id, Object data) {
        boolean is_nothing = "file:///".equals(String.valueOf(data));
        boolean is_index = "file:///android_asset/www/index.html".equals(String.valueOf(data));
        boolean is_original = is_nothing || is_index;

            if ("onPageStarted".equals(id) && is_original) {
                final String uuid = this.getUUID();

            if (!Deploy.NO_DEPLOY_AVAILABLE.equals(uuid)) {
                logMessage("LOAD", "Init Deploy Version.");
                this.redirect(uuid, false);
            }
        }

        return null;
    }

    /**
     * Executes the request and returns PluginResult.
     *
     * @param action          The action to execute.
     * @param args            JSONArry of arguments for the plugin.
     * @param callbackContext The callback id used when calling back into JavaScript.
     * @return True if the action was valid, false if not.
     */
    public boolean execute(String action, JSONArray args, final CallbackContext callbackContext) throws JSONException {

        this.prefs = getPreferences();
        initApp();

        if (action.equals("initialize")) {
            JSONObject options = args.getJSONObject(0);

            if (options.has("checkUrl")) {
                this.checkUrl = options.getString("checkUrl");
            }
			else {
                callbackContext.error("checkUrl is undefined.");
            }

            if (options.has("requestHeaders")) {
                saveRequestHeaders(options.getJSONObject("requestHeaders"));
            }

            this.debug = !options.has("debug") || options.getBoolean("debug");

            callbackContext.success();
            return true;
        }
		else if (action.equals("check")) {
            logMessage("CHECK", "Checking for updates");
            final String channel_tag = args.getString(0);
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    checkForUpdates(callbackContext, channel_tag);
                }
            });
            return true;
        }
		else if (action.equals("download")) {
            logMessage("DOWNLOAD", "Downloading updates");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    downloadUpdate(callbackContext);
                }
            });
            return true;
        }
		else if (action.equals("extract")) {
            logMessage("EXTRACT", "Extracting update");
            final String uuid = this.getDownloadUUID("");
            cordova.getThreadPool().execute(new Runnable() {
                public void run() {
                    unzip("www.zip", uuid, callbackContext);
                }
            });
            return true;
        }
		else if (action.equals("redirect")) {
            final String uuid = this.getUUID("");
            this.redirect(uuid, true);
            return true;
        }
		else if (action.equals("info")) {
            this.info(callbackContext);
            return true;
        }
		else if (action.equals("getVersions")) {
            callbackContext.success(this.getDeployVersions());
            return true;
        }
		else if (action.equals("deleteVersion")) {
            final String uuid = args.getString(1);
            boolean status = this.removeVersion(uuid);
            if (status) {
                callbackContext.success();
            }
			else {
                callbackContext.error("Error attempting to remove the version, are you sure it exists?");
            }
            return true;
        }
		else {
            return false;
        }
    }

    private void info(CallbackContext callbackContext) {
        JSONObject json = new JSONObject();

        try {
            json.put("deploy_uuid", this.getUUID());
            json.put("binary_version", this.deconstructVersionLabel(this.version_label)[0]);
        } catch (JSONException e) {
            callbackContext.error("Unable to gather deploy info: " + e.toString());
        }

        callbackContext.success(json);
    }

    private void initApp() {
        // Used for keeping track of the order versions were downloaded
        int versionCount = this.getVersionCount(0);
        this.setVersionCount(versionCount);
    }

    private void checkForUpdates(CallbackContext callbackContext, final String channel_tag) {
        String ignore_version = this.prefs.getString("ionicdeploy_version_ignore", "");
        String deployed_version = this.getUUID("");
        String loaded_version = this.getLoadedUUID("");
        JsonHttpResponse response = postDeviceDetails(deployed_version, channel_tag);
        JSONObject result = new JSONObject();

        try {
            if (response.json != null) {
                // 避免断网崩溃问题
                this.last_update = null;
                Boolean compatible = Boolean.valueOf(response.json.getString("compatible_binary"));
                Boolean updatesAvailable = Boolean.valueOf(response.json.getString("update_available"));
                JSONObject update = response.json.getJSONObject("update");
                Boolean force = update.getInt("mandatoryStatus") == 1 ? true : false;
                String targetVersion = update.getString("version");

                result.put("force", force);
                result.put("targetVersion", targetVersion);

                if (!compatible) {
                    logMessage("CHECK", "Refusing update due to incompatible binary version");
                }
				else if (updatesAvailable) {
                    try {
                        String update_uuid = update.getString("version");
                        if (!update_uuid.equals(ignore_version) && !update_uuid.equals(loaded_version)) {
                            this.setUpstreamUUID(update_uuid);
                            this.last_update = update;
                        }
						else {
                            updatesAvailable = false;
                        }

                    }
					catch (JSONException e) {
                        result.put("update", false);
                        result.put("error", "Update information is not available");
                    }
                }

                result.put("update", updatesAvailable && compatible);
            }
			else {
                logMessage("CHECK", "Unable to check for updates.");
                result.put("update", false);
            }
            callbackContext.success(result);
        }
		catch (JSONException e) {
            logMessage("CHECK", e.toString());
            callbackContext.error("Error checking for updates.");
        }
    }

    private void downloadUpdate(CallbackContext callbackContext) {
        String upstream_uuid = this.getUpstreamUUID("");
        if (!upstream_uuid.equals("") && this.hasVersion(upstream_uuid)) {
            // Set the current version to the upstream uuid
            this.setUUID(upstream_uuid);
            callbackContext.success("false");
        } else {
            try {
                String url = this.last_update.getString("url");
                final DownloadTask downloadTask = new DownloadTask(this.myContext, callbackContext);
                downloadTask.execute(url);
            } catch (JSONException e) {
                logMessage("DOWNLOAD", e.toString());
                callbackContext.error("Error fetching download");
            }
        }
    }

    private JSONArray getDeployVersions() {
        Set<String> versions = this.getMyVersions();
        JSONArray deployVersions = new JSONArray();
        for (String version : versions) {
            String[] version_string = version.split("\\|");
            deployVersions.put(version_string[0]);
        }
        return deployVersions;
    }

    /**
     * Check to see if we already have the version to be downloaded
     */
    private boolean hasVersion(String uuid) {
        Set<String> versions = this.getMyVersions();

        logMessage("HASVER", "Checking " + uuid + "...");
        for (String version : versions) {
            version = version.split("\\|")[0];   // this format is "{version_uuid}|{version_count}"
            logMessage("HASVER", version + " == " + uuid);

            if (version.equals(uuid)) {
                logMessage("HASVER", "Yes");
                return true;
            }
        }

        logMessage("HASVER", "No");
        return false;
    }

    /**
     * Save a new version string to our list of versions
     */
    private void saveVersion(String uuid) {
        Integer versionCount = getVersionCount(0);

        versionCount += 1;
        uuid = uuid + "|" + versionCount.toString();

        // set this new version count
        setVersionCount(versionCount);

        // add and set my versions
        Set<String> versions = this.getMyVersions();
        versions.add(uuid);
        this.setMyVersions(versions);

        this.cleanupVersions();
    }

    private void cleanupVersions() {
        // Let's keep 3 versions around for now
        int versionCount = this.getVersionCount(0);
        Set<String> versions = this.getMyVersions();

        if (versionCount > 3) {
            int threshold = versionCount - 3;

            for (Iterator<String> i = versions.iterator(); i.hasNext(); ) {
                String version = i.next();
                String[] version_string = version.split("\\|");
                logMessage("VERSION", version);
                int version_number = Integer.parseInt(version_string[1]);
                if (version_number < threshold) {
                    logMessage("REMOVING", version);
                    i.remove();
                    removeVersion(version_string[0]);
                }
            }

            Integer version_c = versions.size();
            logMessage("VERSIONCOUNT", version_c.toString());
            this.setMyVersions(versions);
        }
    }

    private void removeVersionFromPreferences(String uuid) {
        Set<String> versions = this.getMyVersions();
        Set<String> newVersions = new HashSet<String>();

        for (String version : versions) {
            String[] version_string = version.split("\\|");
            String tempUUID = version_string[0];
            if (!tempUUID.equals(uuid)) {
                newVersions.add(version);
            }
            this.setMyVersions(newVersions);
        }
    }

    /**
     * Remove a deploy version from the device
     * @return boolean Success or failure
     */
    private boolean removeVersion(String uuid) {
        if (uuid.equals(this.getUUID())) {
            this.setUUID("");
            this.setLoadedUUID("");
        }
        File versionDir = this.myContext.getDir(uuid, Context.MODE_PRIVATE);
        if (versionDir.exists()) {
            String deleteCmd = "rm -r " + versionDir.getAbsolutePath();
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec(deleteCmd);
                removeVersionFromPreferences(uuid);
                return true;
            } catch (IOException e) {
                logMessage("REMOVE", "Failed to remove " + uuid + ". Error: " + e.getMessage());
            }
        }
        return false;
    }

    private JsonHttpResponse postDeviceDetails(String uuid, final String channel_tag) {
        JsonHttpResponse response = new JsonHttpResponse();
        Map<String, String> params = new HashMap<String, String>();

        try {
            params.put("device_app_version", this.deconstructVersionLabel(this.version_label)[0]);
            params.put("device_platform", "android");
            params.put("channel_tag", channel_tag);

            if (uuid != null && !uuid.trim().equals("")) {
                params.put("device_deploy_version", uuid);
            }

            StringBuilder urlStr = new StringBuilder();
            urlStr.append(this.checkUrl).append("?");
            for (Map.Entry<String, String> entry : params.entrySet()) {
                // 如果请求参数中有中文，需要进行URLEncoder编码 gbk/utf8
                urlStr.append(entry.getKey()).append("=").append(URLEncoder.encode(entry.getValue(), "utf-8"));
                urlStr.append("&");
            }
            urlStr.deleteCharAt(urlStr.length() - 1);
            logMessage("urlStr", urlStr.toString());
            URL url = new URL(urlStr.toString());
            HttpURLConnection conn = (HttpURLConnection) url.openConnection();

            conn.setRequestMethod("GET");
            conn.setRequestProperty("Content-Type", "application/json");
            conn.setRequestProperty("Accept", "application/json");
            conn.setRequestProperty("Charset", "utf-8");
            conn.setRequestProperty("Content-Length", "0");

            if (this.requestHeaders != null) {
                for (Map.Entry<String, String> entry : this.requestHeaders.entrySet()) {
                    conn.setRequestProperty(entry.getKey(), entry.getValue());
                }
            }

            InputStream in = new BufferedInputStream(conn.getInputStream());
            String result = readStream(in);

            response.json = new JSONObject(result);
        } catch (JSONException e) {
            response.error = true;
        } catch (MalformedURLException e) {
            response.error = true;
        } catch (IOException e) {
            response.error = true;
        }

        return response;
    }

    private SharedPreferences getPreferences() {
        // Request shared preferences for this app id
        return this.myContext.getSharedPreferences("com.ionic.deploy.preferences", Context.MODE_PRIVATE);
    }

    private String readStream(InputStream is) {
        try {
            ByteArrayOutputStream bo = new ByteArrayOutputStream();
            int i = is.read();
            while (i != -1) {
                bo.write(i);
                i = is.read();
            }
            return bo.toString();
        } catch (IOException e) {
            return "";
        }
    }

    private void logMessage(String tag, String message) {
        if (this.debug) {
            Log.i("IONIC.DEPLOY." + tag, message);
        }
    }

    private void updateVersionLabel(String ignore_version) {
        try {
            String ionicdeploy_version_label = this.constructVersionLabel(this.getAppPackageInfo(), this.getUUID());
            this.prefs.edit().putString("ionicdeploy_version_label", ionicdeploy_version_label).apply();
            this.version_label = prefs.getString("ionicdeploy_version_label", Deploy.NO_DEPLOY_LABEL);
            this.prefs.edit().putString("ionicdeploy_version_ignore", ignore_version).apply();
        } catch (NameNotFoundException e) {
            logMessage("LABEL", "Could not get package info");
        }
    }

    /**
     * Extract the downloaded archive
     */
    private void unzip(String zip, String uuid, CallbackContext callbackContext) {
        logMessage("UNZIP", uuid);

        if (!uuid.equals("") && this.hasVersion(uuid)) {
            callbackContext.success("done"); // we have already extracted this version
            return;
        }

        ZipFile zipFile = null;

        try {

            FileInputStream inputStream = this.myContext.openFileInput(zip);
            ZipInputStream zipInputStream = new ZipInputStream(inputStream);
            ZipEntry zipEntry;

            // Make the version directory in internal storage
            File versionDir = this.myContext.getDir(uuid, Context.MODE_PRIVATE);

            // 先复制应用中的 WWW 目录到热部署目录中
            logMessage("COPY_APP_WWW_DIR", versionDir.getAbsolutePath());
            copyWWWDirByAsset(versionDir.getPath());

            // 再将增量更新包中的文件解压缩到热部署目录中
            logMessage("UNZIP_DIR", versionDir.getAbsolutePath());

            zipFile = new ZipFile(this.myContext.getFileStreamPath(zip).getAbsolutePath());
            float entries = (float) zipFile.size();

            logMessage("ENTRIES", "Total: " + (int) entries);

            float extracted = 0.0f;

            while ((zipEntry = zipInputStream.getNextEntry()) != null) {
                File newFile = new File(versionDir + File.separator + zipEntry.getName());
                newFile.getParentFile().mkdirs();

                logMessage("UNZIP", "unzip " + newFile.getPath() + ", isDirectory: " + newFile.isDirectory() + ", isExists: " + newFile.exists());

                if (newFile.isDirectory()) {
                    if (!newFile.exists()) {
                        newFile.mkdirs();
                    }
                }
                else {
                    byte[] buffer = new byte[2048];

                    FileOutputStream fileOutputStream = new FileOutputStream(newFile);
                    BufferedOutputStream outputBuffer = new BufferedOutputStream(fileOutputStream, buffer.length);

                    int bits;

                    while ((bits = zipInputStream.read(buffer, 0, buffer.length)) != -1) {
                        outputBuffer.write(buffer, 0, bits);
                    }

                    outputBuffer.flush();
                    outputBuffer.close();
                }

                zipInputStream.closeEntry();

                // 输入进度百分比
                extracted += 1;
                float progress = (extracted / entries) * Float.valueOf("100.0f");
                logMessage("EXTRACT", "Progress: " + (int) progress + "%");

                PluginResult progressResult = new PluginResult(PluginResult.Status.OK, (int) progress);
                progressResult.setKeepCallback(true);
                callbackContext.sendPluginResult(progressResult);
            }

            zipInputStream.close();
        }
		catch (Exception e) {
            logMessage("UNZIP_STEP", "Exception: " + e.getMessage());
        }
        // close zipFile
        finally {
            try {
                if (zipFile != null) zipFile.close();
            } catch (IOException e) {}
        }

        // Save the version we just downloaded as a version on hand
        saveVersion(uuid);
        setUUID(uuid);

        this.ignore_deploy = false;
        this.updateVersionLabel(Deploy.NOTHING_TO_IGNORE);

        String wwwFile = this.myContext.getFileStreamPath(zip).getAbsolutePath();
        if (this.myContext.getFileStreamPath(zip).exists()) {
            String deleteCmd = "rm -r " + wwwFile;
            Runtime runtime = Runtime.getRuntime();
            try {
                runtime.exec(deleteCmd);
                logMessage("REMOVE", "Removed www.zip");
            } catch (IOException e) {
                logMessage("REMOVE", "Failed to remove " + wwwFile + ". Error: " + e.getMessage());
            }
        }

        callbackContext.success("done");
    }

    /**
     * 保存调用插件时所传入的 requestHeaders 数据到 this.requestHeaders。
     */
    private void saveRequestHeaders(JSONObject requestHeaders) {
        // 暂存当前的 this.requestHeaders，若所传入的数据无效，需还原为该暂存的数据。
        Map<String, String> historyRequestHeaders = this.requestHeaders;

        if (requestHeaders == null || requestHeaders.length() == 0) {
            return;
        }

        Iterator<String> it = requestHeaders.keys();
        this.requestHeaders = new HashMap<String, String>();

        try {
            while (it.hasNext()) {
                String key = it.next();
                String value = requestHeaders.getString(key);
                this.requestHeaders.put(key, value);
            }
        }
		catch (Exception e) {
            logMessage("SAVE_REQUEST_HEADERS", "a value's type is not string in requestHeaders.");
            this.requestHeaders = historyRequestHeaders;
        }
    }

    private void copyWWWDirByAsset(String targetPath) throws IOException {
        AssetManager assets = this.myContext.getAssets();
        List<String> fileIndexs = null;

        try {
            // 读取索引文件
            fileIndexs = readJSONFileByAsset(assets, "www.fileindex.json");
        }
		catch (Exception e) {
            // 若读取不到，则按照读取索引文件
            copyDirByAsset(assets, "www", targetPath);
        }

        if (fileIndexs != null) {
            for (int i = 0, l = fileIndexs.size(); i < l; i++) {
                try {
                    String filePath = fileIndexs.get(i);
                    copyFileByAsset(assets, "www" + File.separator + filePath, targetPath + File.separator + filePath);
                }
				catch (Exception e) {
                    logMessage("Deploy: copye file error.", e.getMessage());
                }
            }
        }

    }

    private List<String> readJSONFileByAsset(AssetManager assets, String filePath) throws IOException, JSONException {
        JsonReader reader = null;
        List<String> result = new ArrayList<String>();

        try {
            reader = new JsonReader(new BufferedReader(new InputStreamReader(assets.open(filePath), "UTF-8")));

            reader.beginArray();
            while (reader.hasNext()) {
                result.add(reader.nextString());
            }
            reader.endArray();

            return result;
        }
		finally {
            if (reader != null) {
                reader.close();
            }
        }
    }

    private void copyDirByAsset(AssetManager assets, String srcPath, String targetPath) throws IOException {
        String[] list = assets.list(srcPath);

        // 若能获取到其子资源列表，则确定 srcPath 为目录。
        // 而若未能获取到子资源列表，那么即便 srcPath 是一个目录，那也是一个空目录，不予拷贝。
        if (list.length > 0) {
            (new File(targetPath)).mkdirs();

            for (String name : list) {
                String subSrcPath = srcPath.length() == 0 ? name : srcPath + File.separator + name;
                String subTargetPath = targetPath + File.separator + name;

                try {
                    copyFileByAsset(assets, subSrcPath, subTargetPath);
                }
				catch (IOException e) {
                    // 若抛出 FileNotFoundException 异常，则 srcPath 可能是目录
                    copyDirByAsset(assets, subSrcPath, subTargetPath);
                }
            }
        }
    }

    private void copyFileByAsset(AssetManager assets, String srcPath, String targetPath) throws IOException {
        InputStream input = null;
        OutputStream output = null;

        File targetFile = new File(targetPath);

        try {
            input = assets.open(srcPath);
            try {
                output = new FileOutputStream(targetFile);
            }
			catch (FileNotFoundException e) {
                // 若抛出异常，且目标文件所在目录不存在，则尝试创建一次目录文件所在的目录，然后再获取一次输出流。
                File targetParentFile = targetFile.getParentFile();

                if (!targetParentFile.exists()) {
                    targetFile.getParentFile().mkdirs();
                    output = new FileOutputStream(targetFile);
                }
				else {
                    throw e;
                }
            }

            // 将源文件内容写入到目标文件
            byte[] buffer = new byte[1024];
            int byteCount;

            while ((byteCount = input.read(buffer)) != -1) {
                output.write(buffer, 0, byteCount);
            }
        }
		finally {
            if (input != null) { input.close(); }
            if (output != null) { output.close(); }
        }
    }

    private void redirect(final String uuid, final boolean recreatePlugins) {
        String ignore = this.prefs.getString("ionicdeploy_version_ignore", Deploy.NOTHING_TO_IGNORE);
        if (!uuid.equals("") && !this.ignore_deploy && !uuid.equals(ignore)) {
            this.setUUID(uuid);
            final File versionDir = this.myContext.getDir(uuid, Context.MODE_PRIVATE);
            final String deploy_url = versionDir.toURI() + "index.html";

            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    logMessage("REDIRECT", "Loading deploy version: " + uuid);
                    setLoadedUUID(uuid);
                    webView.loadUrlIntoView(deploy_url, recreatePlugins);
                }
            });
        }
    }

    private class DownloadTask extends AsyncTask<String, Integer, String> {
        private Context myContext;
        private CallbackContext callbackContext;

        public DownloadTask(Context context, CallbackContext callbackContext) {
            this.myContext = context;
            this.callbackContext = callbackContext;
        }

        @Override
        protected String doInBackground(String... sUrl) {
            InputStream input = null;
            FileOutputStream output = null;
            HttpURLConnection connection = null;
            try {
                URL url = new URL(sUrl[0]);
                connection = (HttpURLConnection) url.openConnection();
                connection.connect();

                // expect HTTP 200 OK, so we don't mistakenly save error report
                // instead of the file
                if (connection.getResponseCode() != HttpURLConnection.HTTP_OK) {
                    return "Server returned HTTP " + connection.getResponseCode()
                            + " " + connection.getResponseMessage();
                }

                // this will be useful to display download percentage
                // might be -1: server did not report the length
                float fileLength = (float) connection.getContentLength();

                logMessage("DOWNLOAD", "File size: " + fileLength);

                // download the file
                input = connection.getInputStream();
                output = this.myContext.openFileOutput("www.zip", Context.MODE_PRIVATE);

                byte data[] = new byte[4096];
                float total = 0;
                int count;
                while ((count = input.read(data)) != -1) {
                    total += count;

                    output.write(data, 0, count);

                    // Send the current download progress to a callback
                    if (fileLength > 0) {
                        float progress = (total / fileLength) * Float.valueOf("100.0f");
                        logMessage("DOWNLOAD", "Progress: " + (int) progress + "%");
                        PluginResult progressResult = new PluginResult(PluginResult.Status.OK, (int) progress);
                        progressResult.setKeepCallback(true);
                        callbackContext.sendPluginResult(progressResult);
                    }
                }
            } catch (Exception e) {
                callbackContext.error("Something failed with the download...");
                return e.toString();
            } finally {
                try {
                    if (output != null)
                        output.close();
                    if (input != null)
                        input.close();
                } catch (IOException ignored) {

                }

                if (connection != null)
                    connection.disconnect();
            }

            // Set the saved uuid to the most recently acquired upstream_uuid
            String uuid = getUpstreamUUID("");
            setDownloadUUID(uuid);

            callbackContext.success("true");
            return null;
        }
    }
}
