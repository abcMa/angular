package com.comall.cordova.cmshare;

import android.content.Intent;
import android.content.pm.ApplicationInfo;
import android.content.pm.PackageInfo;
import android.content.pm.PackageManager;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.util.Log;

import com.sina.weibo.sdk.WbSdk;
import com.sina.weibo.sdk.api.ImageObject;
import com.sina.weibo.sdk.api.TextObject;
import com.sina.weibo.sdk.api.WebpageObject;
import com.sina.weibo.sdk.api.WeiboMultiMessage;
import com.sina.weibo.sdk.auth.AuthInfo;
import com.sina.weibo.sdk.share.WbShareCallback;
import com.sina.weibo.sdk.share.WbShareHandler;
import com.sina.weibo.sdk.utils.Utility;
import com.tencent.connect.share.QQShare;
import com.tencent.connect.share.QzoneShare;
import com.tencent.tauth.IUiListener;
import com.tencent.tauth.Tencent;
import com.tencent.tauth.UiError;

import org.apache.cordova.CallbackContext;
import org.apache.cordova.CordovaInterface;
import org.apache.cordova.CordovaPlugin;
import org.apache.cordova.CordovaWebView;
import org.json.JSONArray;
import org.json.JSONException;

import java.io.IOException;
import java.io.InputStream;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.ArrayList;

/**
 * Created by co-mall on 2017/6/15.
 */

public class CMShare extends CordovaPlugin implements WbShareCallback {
    private static final String TAG = "CMShare";
    private CallbackContext mContext;

    private Tencent mTencent;
    private WbShareHandler shareHandler;

    private String title;
    private String text;
    private String imageUrl;
    private String targetUrl;
    private String type;

    @Override
    public void initialize(CordovaInterface cordova, CordovaWebView webView) {
        super.initialize(cordova, webView);
        String mAppid = preferences.getString("QQ_APPKEY", "1105051318");
        String sinaAppKey = preferences.getString("SINA_APPKEY", Constants.APP_KEY);
        String redirectUrl = preferences.getString("SINA_REDIRECT_URL", Constants.REDIRECT_URL);
        if (mTencent == null) {
            mTencent = Tencent.createInstance(mAppid, cordova.getActivity());
        }
        WbSdk.install(cordova.getActivity(), new AuthInfo(cordova.getActivity(), sinaAppKey, redirectUrl, Constants.SCOPE));


    }

    @Override
    public boolean execute(String action, JSONArray args,
                           CallbackContext callbackContext) throws JSONException {
        mContext = callbackContext;
        // 分享
        if ("shareToPlatform".equals(action)) {
            title = args.getString(0);
            text = args.getString(1);
            imageUrl = args.getString(2);
            targetUrl = args.getString(3);
            type = args.getString(4);


            cordova.getActivity().runOnUiThread(new Runnable() {
                @Override
                public void run() {
                    if (type.equals("qq")) {
                        qqShare();
                    } else if (type.equals("qzone")) {
                        shareToQzone();
                    } else if (type.equals("sina")) {
                        weiboShare();
                    }

                }
            });
            return true;

        }

        // 检查应用是否安装
        if ("checkAppInstalled".equals(action)) {
            String type = args.getString(0);
            boolean installed = false;

            if (type.equals("qq")) {
                installed = isPkgInstalled("com.tencent.mobileqq");
            } else if (type.equals("wechat")) {
                installed = isPkgInstalled("com.tencent.mm");
            } else {
                return false;
            }
            callbackContext.success(installed ? "1" : "0");
            return true;
        }


        return false;
    }

    private void weiboShare() {
        shareHandler = new WbShareHandler(cordova.getActivity());
        shareHandler.registerApp();
        new ImageTask().execute(imageUrl);
    }


    private void qqShare() {
        final Bundle params = new Bundle();
        params.putInt(QQShare.SHARE_TO_QQ_KEY_TYPE, QQShare.SHARE_TO_QQ_TYPE_DEFAULT);
        params.putString(QQShare.SHARE_TO_QQ_TITLE, title);
        params.putString(QQShare.SHARE_TO_QQ_SUMMARY, text);
        params.putString(QQShare.SHARE_TO_QQ_TARGET_URL, targetUrl);
        params.putString(QQShare.SHARE_TO_QQ_IMAGE_URL, imageUrl);
        params.putString(QQShare.SHARE_TO_QQ_APP_NAME, getApplicationName());
        mTencent.shareToQQ(cordova.getActivity(), params, qqShareListener);
    }

    private void shareToQzone() {
        ArrayList<String> pics = new ArrayList<String>();
        pics.add(imageUrl);
        //分享类型
        final Bundle params = new Bundle();
        params.putInt(QzoneShare.SHARE_TO_QZONE_KEY_TYPE, QzoneShare.SHARE_TO_QZONE_TYPE_IMAGE_TEXT);
        params.putString(QzoneShare.SHARE_TO_QQ_TITLE, title);//必填
        params.putString(QzoneShare.SHARE_TO_QQ_SUMMARY, text);//选填
        params.putString(QzoneShare.SHARE_TO_QQ_TARGET_URL, targetUrl);//必填
        params.putStringArrayList(QzoneShare.SHARE_TO_QQ_IMAGE_URL, pics);
        mTencent.shareToQzone(cordova.getActivity(), params, qqShareListener);
    }


    private IUiListener qqShareListener = new IUiListener() {
        @Override
        public void onCancel() {
            mContext.success("fail");
            Log.e(TAG, "fail");
        }

        @Override
        public void onComplete(Object response) {
            // TODO Auto-generated method stub
            mContext.success("qq");
            Log.e(TAG, "success" + type);
        }

        @Override
        public void onError(UiError e) {
            // TODO Auto-generated method stub
            mContext.success("fail");
            Log.e(TAG, "fail");
        }

    };
    private IUiListener qZoneShareListener = new IUiListener() {
        @Override
        public void onCancel() {
            mContext.success("fail");
            Log.e(TAG, "fail");
        }

        @Override
        public void onComplete(Object response) {
            // TODO Auto-generated method stub
            mContext.success("Qzone");
            Log.e(TAG, "success" + type);
        }

        @Override
        public void onError(UiError e) {
            // TODO Auto-generated method stub
            mContext.success("fail");
            Log.e(TAG, "fail");
        }

    };

    private class ImageTask extends AsyncTask<String, Void, Bitmap> {

        @Override
        protected void onPostExecute(Bitmap bitmap) {
            super.onPostExecute(bitmap);
            ImageObject mImageObject = new ImageObject();
            mImageObject.setImageObject(bitmap);
            WeiboMultiMessage weiboMessage = new WeiboMultiMessage();
            weiboMessage.textObject = getTextObj();
            weiboMessage.imageObject = mImageObject;
            weiboMessage.mediaObject = getWebpageObj(bitmap);
            shareHandler.shareMessage(weiboMessage, false);

        }

        @Override
        protected Bitmap doInBackground(String... params) {
            Bitmap mBitmap = null;
            try {
                URL mURL = new URL(imageUrl);
                InputStream mInputStream = mURL.openConnection().getInputStream();
                mBitmap = BitmapFactory.decodeStream(mInputStream);
            } catch (MalformedURLException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
            return mBitmap;
        }

    }


    private String getApplicationName() {
        PackageManager packageManager = null;
        ApplicationInfo applicationInfo = null;
        try {
            packageManager = cordova.getActivity().getPackageManager();
            applicationInfo = packageManager.getApplicationInfo(cordova.getActivity().getPackageName(), 0);
        } catch (PackageManager.NameNotFoundException e) {
            applicationInfo = null;
        }
        String applicationName =
                (String) packageManager.getApplicationLabel(applicationInfo);
        return applicationName;
    }


    @Override
    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        if (requestCode == com.tencent.connect.common.Constants.REQUEST_QQ_SHARE) {
            Tencent.onActivityResultData(requestCode, resultCode, data, qqShareListener);
        } else if (requestCode == com.tencent.connect.common.Constants.REQUEST_QZONE_SHARE) {
            Tencent.onActivityResultData(requestCode, resultCode, data, qZoneShareListener);
        }
    }

    @Override
    public void onNewIntent(Intent intent) {
        super.onNewIntent(intent);
		if(shareHandler!=null){
			shareHandler.doResultIntent(intent, this);
		}
        
    }


    @Override
    public void onResume(boolean multitasking) {
        super.onResume(multitasking);
    }


    @Override
    public void onDestroy() {
        super.onDestroy();
        if (mTencent != null) {
            mTencent.releaseResource();
        }
    }

    /**
     * 创建文本消息对象。
     *
     * @return 文本消息对象。
     */
    private TextObject getTextObj() {
        TextObject textObject = new TextObject();
        textObject.text = text;
        textObject.title = title;
        textObject.actionUrl = targetUrl;
        return textObject;
    }


    /**
     * 创建多媒体（网页）消息对象。
     *
     * @return 多媒体（网页）消息对象。
     * @param bitmap
     */
    private WebpageObject getWebpageObj(Bitmap bitmap) {
        WebpageObject mediaObject = new WebpageObject();
        mediaObject.identify = Utility.generateGUID();
        mediaObject.title = title;
        mediaObject.description = text;
        mediaObject.setThumbImage(bitmap);
        mediaObject.actionUrl = targetUrl;
        mediaObject.defaultText = title;
        return mediaObject;
    }


    @Override
    public void onWbShareSuccess() {
        mContext.success("sina");
        Log.e(TAG, "success");
    }

    @Override
    public void onWbShareCancel() {
        mContext.success("fail");
        Log.e(TAG, "fail");
    }

    @Override
    public void onWbShareFail() {
        mContext.success("fail");
        Log.e(TAG, "fail");
    }

    private boolean isPkgInstalled(String pkgName) {
        PackageInfo packageInfo = null;
        try {
            packageInfo = this.cordova.getActivity().getPackageManager().getPackageInfo(pkgName, 0);
        } catch (PackageManager.NameNotFoundException e) {
            packageInfo = null;
            e.printStackTrace();
        }
        if (packageInfo == null) {
            return false;
        } else {
            return true;
        }
    }
}
