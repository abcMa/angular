package com.phonegap.plugins.barcodescanner;

import com.google.zxing.Result;
import cn.carrefour.app.mobile.R;

import android.app.Activity;
import android.content.Intent;
import android.os.Bundle;
import android.util.Log;
import android.view.LayoutInflater;
import android.view.View;
import android.widget.Button;
import android.widget.TextView;
import me.dm7.barcodescanner.zxing.ZXingScannerView;

public class ScannerActivity extends Activity implements ZXingScannerView.ResultHandler {
    private ZXingScannerView mScannerView;

    @Override
    public void onCreate(Bundle state) {
        super.onCreate(state);
        mScannerView = new ZXingScannerView(this);   // Programmatically initialize the scanner view
        LayoutInflater layoutInflater = LayoutInflater.from(this);
		layoutInflater.inflate(R.layout.navbar, mScannerView);
        setContentView(mScannerView);                // Set the scanner view as the content view
    }

    @Override
    public void onResume() {
        super.onResume();
        mScannerView.setResultHandler(this); // Register ourselves as a handler for scan results.
        mScannerView.startCamera();          // Start camera on resume
    }

    @Override
    public void onPause() {
        super.onPause();
        mScannerView.stopCamera();           // Stop camera on pause
    }

    @Override
    public void handleResult(Result rawResult) {
        // Do something with the result here
        Log.v("scanner", rawResult.getText()); // Prints scan results
        Log.v("scanner", rawResult.getBarcodeFormat().toString()); // Prints the scan format (qrcode, pdf417 etc.)
        Intent result = new Intent ();
        result.putExtra("SCAN_RESULT", rawResult.getText());
        result.putExtra("SCAN_RESULT_FORMAT", rawResult.getBarcodeFormat().toString());
        setResult(Activity.RESULT_OK, result);
        finish();
    }

    public void leftButtonClickHandler(View source) {
    	Intent result = new Intent ();
        setResult(Activity.RESULT_CANCELED, result);
        finish();
    }
}
