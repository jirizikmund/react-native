/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SnapshotableView
 * @flow
 */
'use strict';

const NativeModules = require('NativeModules');
const React = require('React');
const ReactNative = require('ReactNative');
const View = require('View');
const ViewPropTypes = require('ViewPropTypes');

const invariant = require('fbjs/lib/invariant');

import type { SnapshotType } from 'Snapshot';

class SnapshotableView extends React.Component {
  static propTypes = ViewPropTypes;

  _setRef = ref => {
    this._ref = ref;
  };

  render() {
    return <View {...this.props} ref={this._setRef} drawableCacheEnabled />;
  }

  snapshot(): Promise<SnapshotType> {
    invariant(
      this._ref,
      'SnapshotableView must be mounted to capture snapshot.',
    );
    const nodeHandle = ReactNative.findNodeHandle(this._ref);
    return NativeModules.SnapshotModule.create(nodeHandle);
  }
}

module.exports = SnapshotableView;
