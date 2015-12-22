/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PullToRefreshView
 */
'use strict';

const React = require('React');
const Platform = require('Platform');
const View = require('View');

const onlyChild = require('onlyChild');
const processColor = require('processColor');
const requireNativeComponent = require('requireNativeComponent');

if (Platform.OS === 'ios') {
  var RefreshLayoutConsts = {SIZE: {}};
} else if (Platform.OS === 'android') {
  var RefreshLayoutConsts = require('NativeModules').UIManager.AndroidSwipeRefreshLayout.Constants;
}

const NATIVE_REF = 'native_swiperefreshlayout';

/**
 * React view that supports a single scrollable child view (e.g. `ScrollView`). When this child
 * view is at `scrollY: 0`, swiping down triggers an `onRefresh` event.
 */
const PullToRefreshView = React.createClass({
  statics: {
    SIZE: RefreshLayoutConsts.SIZE,
  },

  propTypes: {
    ...View.propTypes,
    /**
     * Called when the view starts refreshing
     */
    onRefresh: React.PropTypes.func,
    /**
     * Whether the view should be indicating an active refresh
     */
    refreshing: React.PropTypes.bool,
    /**
     * Whether the pull to refresh functionality is enabled
     * @platform android
     */
    enabled: React.PropTypes.bool,
    /**
     * The colors (at least one) that will be used to draw the refresh indicator
     * @platform android
     */
    colors: React.PropTypes.arrayOf(React.PropTypes.string),
    /**
     * The background color of the refresh indicator
     * @platform android
     */
    progressBackgroundColor: React.PropTypes.string,
    /**
     * Size of the refresh indicator, see PullToRefreshView.SIZE
     * @platform android
     */
    size: React.PropTypes.oneOf(RefreshLayoutConsts.SIZE.DEFAULT, RefreshLayoutConsts.SIZE.LARGE),
  },

  _endRefreshing: null,

  componentWillReceiveProps(newProps) {
    if (!newProps.refreshing && this._endRefreshing) {
      this._endRefreshing();
      this._endRefreshing = null;
    }
  },

  render() {
    if (Platform.OS === 'ios') {
      return this._renderIOS();
    } else if (Platform.OS === 'android') {
      return this._renderAndroid();
    }
  },

  _renderIOS() {
    return React.cloneElement(onlyChild(this.props.children), {
      onRefreshStart: this._onRefreshIOS,
    });
  },

  _renderAndroid() {
    return (
      <NativePullToRefresh
        colors={this.props.colors && this.props.colors.map(processColor)}
        enabled={this.props.enabled}
        onRefresh={this._onRefreshAndroid}
        progressBackgroundColor={this.props.progressBackgroundColor}
        ref={NATIVE_REF}
        refreshing={this.props.refreshing}
        size={this.props.size}
        style={[{flex: 1}, this.props.style]}>
        {onlyChild(this.props.children)}
      </NativePullToRefresh>
    );
  },

  _onRefreshIOS(endRefreshing) {
    this._endRefreshing = endRefreshing;
    this.props.onRefresh && this.props.onRefresh();
  },

  _onRefreshAndroid() {
    this.props.onRefresh && this.props.onRefresh();
    this.refs[NATIVE_REF].setNativeProps({refreshing: !!this.props.refreshing});
  }
});

if (Platform.OS === 'android') {
  var NativePullToRefresh = requireNativeComponent(
    'AndroidSwipeRefreshLayout',
    PullToRefreshView
  );
}

module.exports = PullToRefreshView;
