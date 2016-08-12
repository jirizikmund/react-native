package com.facebook.react.animated;

import com.facebook.react.bridge.ReadableArray;
import com.facebook.react.bridge.ReadableMap;

import javax.annotation.Nullable;

/**
 * Animated node that corresponds to {@code AnimatedInterpolation} from AnimatedImplementation.js.
 *
 * Currently only a linear interpolation is supported on an input range of an arbitrary size.
 */
/*package*/ class InterpolationAnimatedNode extends ValueAnimatedNode {

  private enum ExtrapolateType {
    IDENTITY("identity"),
    CLAMP("clamp"),
    EXTEND("extend");

    private final String mName;

    ExtrapolateType(String name) {
      mName = name;
    }

    public static ExtrapolateType fromString(String name) {
      for (ExtrapolateType type : ExtrapolateType.values()) {
        if (type.toString().equalsIgnoreCase(name)) {
          return type;
        }
      }
      throw new IllegalArgumentException("Unsupported extrapolate type : " + name);
    }

    @Override
    public String toString() {
      return mName;
    }
  }

  private static double[] fromDoubleArray(ReadableArray ary) {
    double[] res = new double[ary.size()];
    for (int i = 0; i < res.length; i++) {
      res[i] = ary.getDouble(i);
    }
    return res;
  }

  private static double interpolate(
      double value,
      double inputMin,
      double inputMax,
      double outputMin,
      double outputMax,
      ExtrapolateType extrapolateLeft,
      ExtrapolateType extrapolateRight) {
    double result = value;

    // Extrapolate
    if (result < inputMin) {
      switch (extrapolateLeft) {
        case IDENTITY:
          return result;
        case CLAMP:
          result = inputMin;
          break;
        case EXTEND:
          break;
      }
    }

    if (result > inputMax) {
      switch (extrapolateRight) {
        case IDENTITY:
          return result;
        case CLAMP:
          result = inputMax;
          break;
        case EXTEND:
          break;
      }
    }

    return outputMin + (outputMax - outputMin) *
      (result - inputMin) / (inputMax - inputMin);
  }

  /*package*/ static double interpolate(
      double value,
      double[] inputRange,
      double[] outputRange,
      ExtrapolateType extrapolateLeft,
      ExtrapolateType extrapolateRight
  ) {
    int rangeIndex = findRangeIndex(value, inputRange);
    return interpolate(
      value,
      inputRange[rangeIndex],
      inputRange[rangeIndex + 1],
      outputRange[rangeIndex],
      outputRange[rangeIndex + 1],
      extrapolateLeft,
      extrapolateRight);
  }

  private static int findRangeIndex(double value, double[] ranges) {
    int index;
    for (index = 1; index < ranges.length - 1; index++) {
      if (ranges[index] >= value) {
        break;
      }
    }
    return index - 1;
  }

  private final double mInputRange[];
  private final double mOutputRange[];
  private final ExtrapolateType mExtrapolateLeft;
  private final ExtrapolateType mExtrapolateRight;
  private @Nullable ValueAnimatedNode mParent;

  public InterpolationAnimatedNode(ReadableMap config) {
    mInputRange = fromDoubleArray(config.getArray("inputRange"));
    mOutputRange = fromDoubleArray(config.getArray("outputRange"));
    mExtrapolateLeft = ExtrapolateType.fromString(config.getString("extrapolateLeft"));
    mExtrapolateRight = ExtrapolateType.fromString(config.getString("extrapolateRight"));
  }

  @Override
  public void onAttachedToNode(AnimatedNode parent) {
    if (mParent != null) {
      throw new IllegalStateException("Parent already attached");
    }
    if (!(parent instanceof ValueAnimatedNode)) {
      throw new IllegalArgumentException("Parent is of an invalid type");
    }
    mParent = (ValueAnimatedNode) parent;
  }

  @Override
  public void onDetachedFromNode(AnimatedNode parent) {
    if (parent != mParent) {
      throw new IllegalArgumentException("Invalid parent node provided");
    }
    mParent = null;
  }

  @Override
  public void update() {
    if (mParent == null) {
      throw new IllegalStateException("Trying to update interpolation node that has not been " +
        "attached to the parent");
    }
    mValue = interpolate(mParent.mValue, mInputRange, mOutputRange, mExtrapolateLeft, mExtrapolateRight);
  }
}
