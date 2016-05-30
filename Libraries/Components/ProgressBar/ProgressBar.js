/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ProgressBar
 * @flow
 */
'use strict';

const Image = require('Image');
const NativeMethodsMixin = require('NativeMethodsMixin');
const Platform = require('Platform');
const PropTypes = require('ReactPropTypes');
const React = require('React');
const StyleSheet = require('StyleSheet');
const View = require('View');

const requireNativeComponent = require('requireNativeComponent');

/**
 * Renders a progress bar.
 */
const ProgressBar = React.createClass({
  mixins: [NativeMethodsMixin],

  propTypes: {
    ...View.propTypes,

    /**
     * The progress bar style.
     */
    progressViewStyle: PropTypes.oneOf(['default', 'bar']),

    /**
     * The progress value (between 0 and 1).
     */
    progress: PropTypes.number,

    /**
     * The tint color of the progress bar.
     */
    color: PropTypes.string,

    /**
     * The tint color of the progress bar track.
     *
     * @platform ios
     */
    trackTintColor: PropTypes.string,

    /**
     * A stretchable image to display as the progress bar.
     *
     * @platform ios
     */
    progressImage: Image.propTypes.source,

    /**
     * A stretchable image to display behind the progress bar.
     *
     * @platform ios
     */
    trackImage: Image.propTypes.source,

    /**
     * If the progress bar will show indeterminate progress. Note that this
     * can only be false if styleAttr is Horizontal.
     *
     * @platform android
     */
    indeterminate: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      progressViewStyle: 'default',
      indeterminate: false,
    };
  },

  render() {
    return (
      <RCTProgressBar
        {...this.props}
        styleAttr="Horizontal"
        style={[styles.progressView, this.props.style]}
      />
    );
  },
});

const styles = StyleSheet.create({
  progressView: {
    height: Platform.OS === 'ios' ? 2 : null,
  },
});

let RCTProgressBar;
if (Platform.OS === 'ios') {
  RCTProgressBar = requireNativeComponent(
    'RCTProgressView',
    ProgressBar,
  );
} else if (Platform.OS === 'android') {
  RCTProgressBar = requireNativeComponent(
    'AndroidProgressBar',
    ProgressBar,
    {nativeOnly: {animating: true, styleAttr: true}},
  );
}

module.exports = ProgressBar;
