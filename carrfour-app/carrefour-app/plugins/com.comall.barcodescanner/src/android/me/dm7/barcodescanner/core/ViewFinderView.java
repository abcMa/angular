package me.dm7.barcodescanner.core;

import cn.carrefour.app.mobile.R;

import android.content.Context;
import android.content.res.Configuration;
import android.content.res.Resources;
import android.graphics.Canvas;
import android.graphics.Paint;
import android.graphics.Point;
import android.graphics.Rect;
import android.util.AttributeSet;
import android.view.View;

public class ViewFinderView extends View {
    private static final String TAG = "ViewFinderView";

    private Rect mFramingRect;

    private static final int MIN_FRAME_WIDTH = 240;
    private static final int MIN_FRAME_HEIGHT = 240;

    private static final float LANDSCAPE_WIDTH_RATIO = 5f/8;
    private static final float LANDSCAPE_HEIGHT_RATIO = 5f/8;
    private static final int LANDSCAPE_MAX_FRAME_WIDTH = (int) (1920 * LANDSCAPE_WIDTH_RATIO); // = 5/8 * 1920
    private static final int LANDSCAPE_MAX_FRAME_HEIGHT = (int) (1080 * LANDSCAPE_HEIGHT_RATIO); // = 5/8 * 1080

    private static final float PORTRAIT_WIDTH_RATIO = 5f/8;
    private static final float PORTRAIT_HEIGHT_RATIO = 3f/8;
    private static final int PORTRAIT_MAX_FRAME_WIDTH = (int) (1080 * PORTRAIT_WIDTH_RATIO); // = 7/8 * 1080
    private static final int PORTRAIT_MAX_FRAME_HEIGHT = (int) (1920 * PORTRAIT_HEIGHT_RATIO); // = 3/8 * 1920

    private static final int[] SCANNER_ALPHA = {0, 64, 128, 192, 255, 192, 128, 64};
    private int scannerAlpha;
    private int laserMiddle;
    private static final int POINT_SIZE = 10;
    private static final long ANIMATION_DELAY = 17;

    public ViewFinderView(Context context) {
        super(context);
    }

    public ViewFinderView(Context context, AttributeSet attrs) {
        super(context, attrs);
    }

    public void setupViewFinder() {
        updateFramingRect();
        invalidate();
    }

    public Rect getFramingRect() {
        return mFramingRect;
    }

    @Override
    public void onDraw(Canvas canvas) {
        if(mFramingRect == null) {
            return;
        }

        drawViewFinderMask(canvas);
        drawViewFinderBorder(canvas);
        drawLaser(canvas);
    }

    public void drawViewFinderMask(Canvas canvas) {
        Paint paint = new Paint();
        Resources resources = getResources();
        paint.setColor(resources.getColor(R.color.viewfinder_mask));

        int width = canvas.getWidth();
        int height = canvas.getHeight();

        canvas.drawRect(0, 0, width, mFramingRect.top, paint);
        canvas.drawRect(0, mFramingRect.top, mFramingRect.left, mFramingRect.bottom + 1, paint);
        canvas.drawRect(mFramingRect.right + 1, mFramingRect.top, width, mFramingRect.bottom + 1, paint);
        canvas.drawRect(0, mFramingRect.bottom + 1, width, height, paint);
    }

    public void drawViewFinderBorder(Canvas canvas) {
        Paint paint = new Paint();
        Resources resources = getResources();
        paint.setColor(resources.getColor(R.color.viewfinder_border));
        paint.setStyle(Paint.Style.STROKE);
        paint.setStrokeWidth(resources.getInteger(R.integer.viewfinder_border_width));
        int lineLength = resources.getInteger(R.integer.viewfinder_border_length);

        canvas.drawLine(mFramingRect.left + 3, mFramingRect.top, mFramingRect.left + 3, mFramingRect.top + lineLength, paint);
        canvas.drawLine(mFramingRect.left, mFramingRect.top + 3, mFramingRect.left + lineLength, mFramingRect.top + 3, paint);

        canvas.drawLine(mFramingRect.left + 3, mFramingRect.bottom, mFramingRect.left + 3, mFramingRect.bottom - lineLength, paint);
        canvas.drawLine(mFramingRect.left, mFramingRect.bottom - 3, mFramingRect.left + lineLength, mFramingRect.bottom - 3, paint);

        canvas.drawLine(mFramingRect.right - 3, mFramingRect.top, mFramingRect.right - 3, mFramingRect.top + lineLength, paint);
        canvas.drawLine(mFramingRect.right, mFramingRect.top + 3, mFramingRect.right - lineLength, mFramingRect.top + 3, paint);

        canvas.drawLine(mFramingRect.right - 3, mFramingRect.bottom, mFramingRect.right - 3, mFramingRect.bottom - lineLength, paint);
        canvas.drawLine(mFramingRect.right, mFramingRect.bottom - 3, mFramingRect.right - lineLength, mFramingRect.bottom - 3, paint);
    }

    public void drawLaser(Canvas canvas) {
        Paint paint = new Paint();
        Resources resources = getResources();
        // Draw a red "laser scanner" line through the middle to show decoding is active
        paint.setColor(resources.getColor(R.color.viewfinder_laser));
        paint.setAlpha(SCANNER_ALPHA[2]);
        paint.setStyle(Paint.Style.FILL);
        // scannerAlpha = (scannerAlpha + 1) % SCANNER_ALPHA.length;
        int middle = laserMiddle + mFramingRect.top + 2 * POINT_SIZE;
        laserMiddle = (laserMiddle + 9) % (PORTRAIT_MAX_FRAME_HEIGHT - 4 * POINT_SIZE);
        canvas.drawRect(mFramingRect.left + 2 * POINT_SIZE, middle - 3, mFramingRect.right - 2 * POINT_SIZE, middle + 3, paint);

        postInvalidateDelayed(ANIMATION_DELAY,
                mFramingRect.left - POINT_SIZE,
                mFramingRect.top - POINT_SIZE,
                mFramingRect.right + POINT_SIZE,
                mFramingRect.bottom + POINT_SIZE);
    }

    @Override
    protected void onSizeChanged(int xNew, int yNew, int xOld, int yOld) {
        updateFramingRect();
    }

    public synchronized void updateFramingRect() {
        Point viewResolution = new Point(getWidth(), getHeight());
        if (viewResolution == null) {
            return;
        }
        int width;
        int height;
        int orientation = DisplayUtils.getScreenOrientation(getContext());

        if(orientation != Configuration.ORIENTATION_PORTRAIT) {
            width = findDesiredDimensionInRange(LANDSCAPE_WIDTH_RATIO, viewResolution.x, MIN_FRAME_WIDTH, LANDSCAPE_MAX_FRAME_WIDTH);
            height = findDesiredDimensionInRange(LANDSCAPE_HEIGHT_RATIO, viewResolution.y, MIN_FRAME_HEIGHT, LANDSCAPE_MAX_FRAME_HEIGHT);
        } else {
            width = findDesiredDimensionInRange(PORTRAIT_WIDTH_RATIO, viewResolution.x, MIN_FRAME_WIDTH, PORTRAIT_MAX_FRAME_WIDTH);
            height = findDesiredDimensionInRange(PORTRAIT_HEIGHT_RATIO, viewResolution.y, MIN_FRAME_HEIGHT, PORTRAIT_MAX_FRAME_HEIGHT);
        }

        int leftOffset = (viewResolution.x - width) / 2;
        int topOffset = (viewResolution.y - height) / 2;
        mFramingRect = new Rect(leftOffset, topOffset, leftOffset + width, topOffset + height);
    }

    private static int findDesiredDimensionInRange(float ratio, int resolution, int hardMin, int hardMax) {
        int dim = (int) (ratio * resolution);
        if (dim < hardMin) {
            return hardMin;
        }
        if (dim > hardMax) {
            return hardMax;
        }
        return dim;
    }

}
