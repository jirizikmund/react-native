/**
 * Copyright (c) 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule RCTRenderingPerf
 * @flow
 */
'use strict';

var invariant = require('fbjs/lib/invariant');
var performanceNow = require('fbjs/lib/performanceNow');

type perfModule = {
  start: () => void,
  stop: () => void,
}

var perfModules = [];
var enabled = false;

var RCTRenderingPerf = {
  // Once perf is enabled, it stays enabled
  toggle: function() {
    console.log('Render perfomance measurements enabled');
    enabled = true;
  },

  start: function() {
    if (!enabled) {
      return;
    }

    perfModules.forEach((module) => module.start());
  },

  stop: function() {
    if (!enabled) {
      return;
    }

    perfModules.forEach((module) => module.stop());
  },

  register: function(module: perfModule) {
    invariant(
      typeof module.start === 'function',
      'Perf module should have start() function'
    );
    invariant(
      typeof module.stop === 'function',
      'Perf module should have stop() function'
    );
    perfModules.push(module);
  }
};

module.exports = RCTRenderingPerf;
