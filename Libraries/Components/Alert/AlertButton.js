/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule AlertButton
 * @flow
 */
'use strict';

const PropTypes = require('ReactPropTypes');
const React = require('React');

const AlertButton = React.createClass({
  propTypes: {
    /**
     * Called when the button is pressed.
     */
    onPress: PropTypes.func,
    /**
     * Text of the button.
     */
    text: PropTypes.string,
    /**
     * Whether the style of the button is cancel.
     *
     * @platform ios
     */
    cancel: PropTypes.bool,
    /**
     * Whether the style of the button is destructive.
     *
     * @platform ios
     */
    destructive: PropTypes.bool,
  },

  getDefaultProps() {
    return {
      destructive: false,
      cancel: false,
    };
  },

  render(): ?ReactElement {
    return null;
  },
});

module.exports = AlertButton;
