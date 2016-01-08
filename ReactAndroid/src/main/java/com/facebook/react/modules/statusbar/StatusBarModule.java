/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 */

package com.facebook.react.modules.statusbar;

import android.annotation.TargetApi;
import android.app.Activity;
import android.graphics.Color;
import android.os.Build;
import android.support.v4.view.ViewCompat;
import android.view.View;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.UiThreadUtil;
import com.facebook.react.common.MapBuilder;

import java.util.Map;

/**
 * {@link NativeModule} that allows JS to control the app status bar.
 */
public class StatusBarModule extends ReactContextBaseJavaModule {

  private static final String HEIGHT_KEY = "HEIGHT";

  private static final boolean SUPPORTS_COLOR = Build.VERSION.SDK_INT >= Build.VERSION_CODES.LOLLIPOP;

  private int mInitialColor;
  private boolean mForcedColor = false;

  public StatusBarModule(ReactApplicationContext reactContext) {
    super(reactContext);
  }

  @Override
  public String getName() {
    return "StatusBar";
  }

  @Override
  public Map<String, Object> getConstants() {
    final Map<String, Object> constants = MapBuilder.newHashMap();
    constants.put(HEIGHT_KEY, 25);
    return constants;
  }

  @Override
  public void onCatalystInstanceDestroy() {
    super.onCatalystInstanceDestroy();
    if (mForcedColor) {
      setColor(mInitialColor);
    }
  }

  @ReactMethod
  @TargetApi(Build.VERSION_CODES.LOLLIPOP)
  public void getColor(Promise res) {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null || !SUPPORTS_COLOR) {
      res.resolve(Color.BLACK);
      return;
    }
    res.resolve(currentActivity.getWindow().getStatusBarColor());
  }

  @ReactMethod
  @TargetApi(Build.VERSION_CODES.LOLLIPOP)
  public void setColor(final int color) {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null || !SUPPORTS_COLOR) {
      return;
    }

    if (!mForcedColor) {
      mInitialColor = currentActivity.getWindow().getStatusBarColor();
      mForcedColor = true;
    }

    UiThreadUtil.runOnUiThread(
      new Runnable() {
        @Override
        public void run() {
          currentActivity.getWindow().setStatusBarColor(color);
        }
      }
    );
  }

  @ReactMethod
  public void setTranslucent(final boolean translucent) {
    final Activity currentActivity = getCurrentActivity();
    if (currentActivity == null) {
      return;
    }
    UiThreadUtil.runOnUiThread(
      new Runnable() {
        @Override
        public void run() {
          if (translucent) {
            currentActivity.getWindow().getDecorView().setSystemUiVisibility(
              View.SYSTEM_UI_FLAG_LAYOUT_STABLE | View.SYSTEM_UI_FLAG_LAYOUT_FULLSCREEN
            );
          } else {
            currentActivity.getWindow().getDecorView().setSystemUiVisibility(0);
          }
          ViewCompat.requestApplyInsets(currentActivity.getWindow().getDecorView());
        }
      }
    );
  }
}
