package com.facebook.react.views.snapshotview;

import android.graphics.Bitmap;
import android.graphics.Canvas;
import android.graphics.drawable.Drawable;
import android.view.View;
import android.view.ViewGroup;

import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.views.view.ReactViewGroup;

import javax.annotation.Nullable;

public class SnapshotView extends ViewGroup {
  @Nullable Bitmap mBitmap;

  public SnapshotView(ThemedReactContext context) {
    super(context);

    setWillNotDraw(false);
  }

  public void setCachedBitmap(Bitmap bitmap) {
    mBitmap = bitmap;
    invalidate();
  }

  @Override
  protected void onLayout(boolean b, int i, int i1, int i2, int i3) {

  }

  @Override
  protected void onDraw(Canvas canvas) {
    super.onDraw(canvas);

    if (mBitmap != null) {
      canvas.drawBitmap(mBitmap, 0, 0, null);
    }
  }
}
