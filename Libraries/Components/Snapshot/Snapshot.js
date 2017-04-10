/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Snapshot
 * @flow
 */
'use strict';

const NativeModules = require('NativeModules');
const React = require('React');
const ReactNative = require('ReactNative');
const SnapshotableView = require('SnapshotableView');
const SnapshotView = require('SnapshotView');

const invariant = require('fbjs/lib/invariant');

export type SnapshotType = {
  id: string,
  width: number,
  height: number,
};

class Snapshot {
  static View = SnapshotView;
  static Snapshotable = SnapshotableView;

  static create(ref: React.Element<*>): Promise<SnapshotType> {
    const nodeHandle = ReactNative.findNodeHandle(ref);
    invariant(nodeHandle !== null, 'Invalid ref passed to `Snapshot.create`.');
    return NativeModules.SnapshotModule.create(nodeHandle);
  }

  static dispose(snapshot: ?SnapshotType) {
    if (!snapshot) {
      return;
    }
    NativeModules.SnapshotModule.dispose(snapshot.id);
  }
}

module.exports = Snapshot;
