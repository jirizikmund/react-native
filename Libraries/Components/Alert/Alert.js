/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule Alert
 */
'use strict';

const AlertButton = require('AlertButton');
const AlertManager = require('AlertManager');
const PropTypes = require('ReactPropTypes');
const React = require('React');

const manager = new AlertManager();

const Alert = React.createClass({
  propTypes: {
    /**
     * The title of the alert.
     */
    title: PropTypes.string,
    /**
     * The message of the alert.
     */
    message: PropTypes.string,
    /**
     * Called when the alert is closed from a source other than the
     * buttons. This is called on Android when the back button is pressed
     * or the user touches outside the alert.
     */
    onDismiss: PropTypes.func,
    /**
     * Whether the alert can be closed with the back button ou by touching
     * outside.
     *
     * @platform android
     */
    cancelable: PropTypes.bool,
  },

  componentDidMount() {
    manager.add(this);
  },

  componentWillUnmount() {
    manager.remove(this);
  },

  render() {
    return null;
  },
});

Alert.alert = manager.alert.bind(manager);
Alert.prompt = manager.prompt.bind(manager);
Alert.Button = AlertButton;

module.exports = Alert;
