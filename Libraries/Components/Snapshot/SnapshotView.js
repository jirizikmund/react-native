/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule SnapshotView
 * @flow
 */
'use strict';

const React = require('React');
const ViewPropTypes = require('ViewPropTypes');

const requireNativeComponent = require('requireNativeComponent');

const { PropTypes, Component } = React;

import type { SnapshotType } from 'Snapshot';

type Props = {
  snapshot: ?SnapshotType,
};

class SnapshotView extends Component {
  static propTypes = {
    ...ViewPropTypes,
    snapshot: PropTypes.object,
  };

  props: Props;

  render() {
    const { snapshot, ...others } = this.props;
    return <RCTSnapshotView {...others} snapshotId={snapshot.id} />;
  }
}

const RCTSnapshotView = requireNativeComponent('SnapshotView', SnapshotView, {
  nativeOnly: { snapshotId: true },
});

module.exports = SnapshotView;
