package com.facebook.react.modules.snapshot;

import android.graphics.Bitmap;
import android.view.View;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.uimanager.UIImplementation;
import com.facebook.react.uimanager.UIManagerModule;

import java.util.HashMap;
import java.util.Map;

@ReactModule(name = SnapshotModule.NAME)
public class SnapshotModule extends ReactContextBaseJavaModule {
  protected static final String NAME = "SnapshotModule";
  private static final String ERROR_CODE = "E_SNAPSHOT";

  private static int sSnapshotId = 0;

  private UIImplementation mUIImplementation;
  private Map<String, Bitmap> mSnapshotMap = new HashMap<>();

  public SnapshotModule(ReactApplicationContext context) {
    super(context);
  }

  @Override
  public void initialize() {
    super.initialize();

    mUIImplementation = getReactApplicationContext().getNativeModule(UIManagerModule.class).getUIImplementation();
  }

  @Override
  public String getName() {
    return NAME;
  }

  @ReactMethod
  public void create(final int viewTag, final Promise promise) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        View view = mUIImplementation.resolveView(viewTag);
        if (view == null) {
          promise.reject(ERROR_CODE, "View with tag " + viewTag + "doesn't exist.");
          return;
        }

        String snapshotId = "snapshot_" + sSnapshotId;

        Bitmap viewBitmap = view.getDrawingCache();
        if (viewBitmap == null) {
          promise.reject(ERROR_CODE, "Cannot find bitmap for view with tag " + viewTag + ".");
          return;
        }

        mSnapshotMap.put(snapshotId, Bitmap.createBitmap(viewBitmap));

        WritableMap result = Arguments.createMap();
        result.putString("id", snapshotId);
        result.putInt("width", view.getMeasuredWidth());
        result.putInt("height", view.getMeasuredHeight());
        sSnapshotId++;
        promise.resolve(result);
      }
    });
  }

  @ReactMethod
  public void dispose(final String snapshotId) {
    UiThreadUtil.runOnUiThread(new Runnable() {
      @Override
      public void run() {
        mSnapshotMap.remove(snapshotId);
      }
    });
  }

  public Bitmap get(String snapshotId) {
    UiThreadUtil.assertOnUiThread();
    return mSnapshotMap.get(snapshotId);
  }
}
