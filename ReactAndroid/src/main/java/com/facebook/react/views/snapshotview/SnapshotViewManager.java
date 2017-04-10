package com.facebook.react.views.snapshotview;

import android.graphics.Bitmap;
import android.graphics.drawable.BitmapDrawable;
import android.view.View;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.module.annotations.ReactModule;
import com.facebook.react.modules.snapshot.SnapshotModule;
import com.facebook.react.uimanager.BaseViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.ViewGroupManager;
import com.facebook.react.uimanager.annotations.ReactProp;
import com.facebook.react.views.view.ReactViewGroup;
import com.facebook.react.views.view.ReactViewManager;

@ReactModule(name = SnapshotViewManager.REACT_CLASS)
public class SnapshotViewManager extends ViewGroupManager<SnapshotView> {
  public static final String REACT_CLASS = "SnapshotView";

  private ReactApplicationContext mContext;
  private SnapshotModule mSnapshotModule;

  public SnapshotViewManager(ReactApplicationContext context) {
    super();

    mContext = context;
  }

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  protected SnapshotView createViewInstance(ThemedReactContext reactContext) {
    return new SnapshotView(reactContext);
  }

  @ReactProp(name = "snapshotId")
  public void setSnapshotId(SnapshotView view, String snapshotId) {
    Bitmap bitmap = getSnapshotModule().get(snapshotId);
    view.setCachedBitmap(bitmap);
  }

  private SnapshotModule getSnapshotModule() {
    if (mSnapshotModule == null) {
      mSnapshotModule = mContext.getNativeModule(SnapshotModule.class);
    }
    return mSnapshotModule;
  }
}
