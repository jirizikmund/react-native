/**
 * Copyright (c) 2015-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 * @flow
 * @format
 */

'use strict';

require('../../setupBabel')();

const Metro = require('metro');

const {Terminal} = require('metro-core');

const morgan = require('morgan');
const path = require('path');
const MiddlewareManager = require('./middleware/MiddlewareManager');

const {ASSET_REGISTRY_PATH} = require('../core/Constants');

import type {ConfigT} from 'metro';

export type Args = {|
  +assetExts: $ReadOnlyArray<string>,
  +cert: string,
  +customLogReporterPath?: string,
  +host: string,
  +https: boolean,
  +maxWorkers: number,
  +key: string,
  +nonPersistent: boolean,
  +platforms: $ReadOnlyArray<string>,
  +port: number,
  +projectRoot: string,
  +providesModuleNodeModules: Array<string>,
  +resetCache: boolean,
  +sourceExts: $ReadOnlyArray<string>,
  +transformer?: string,
  +verbose: boolean,
  +watchFolders: $ReadOnlyArray<string>,
|};

async function runServer(args: Args, config: ConfigT) {
  const terminal = new Terminal(process.stdout);
  const ReporterImpl = getReporterImpl(args.customLogReporterPath || null);
  const reporter = new ReporterImpl(terminal);
  const middlewareManager = new MiddlewareManager(args);

  middlewareManager.getConnectInstance().use(morgan('combined'));

  args.watchFolders.forEach(middlewareManager.serveStatic);

  const serverInstance = await Metro.runServer({
    config: {
      ...config,
      assetRegistryPath: ASSET_REGISTRY_PATH,
      enhanceMiddleware: middleware =>
        middlewareManager.getConnectInstance().use(middleware),
      hmrEnabled: true,
      maxWorkers: args.maxWorkers,
      reporter,
      secure: args.https,
      secureKey: args.key,
      secureCert: args.cert,
      transformModulePath: args.transformer
        ? path.resolve(args.transformer)
        : config.getTransformModulePath(),
      watch: !args.nonPersistent,
    },
    host: args.host,
    port: args.port,
  });

  // In Node 8, the default keep-alive for an HTTP connection is 5 seconds. In
  // early versions of Node 8, this was implemented in a buggy way which caused
  // some HTTP responses (like those containing large JS bundles) to be
  // terminated early.
  //
  // As a workaround, arbitrarily increase the keep-alive from 5 to 30 seconds,
  // which should be enough to send even the largest of JS bundles.
  //
  // For more info: https://github.com/nodejs/node/issues/13391
  //
  // $FlowFixMe (site=react_native_fb)
  serverInstance.keepAliveTimeout = 30000;
}

function getReporterImpl(customLogReporterPath: ?string) {
  if (customLogReporterPath == null) {
    return require('metro/src/lib/TerminalReporter');
  }
  try {
    // First we let require resolve it, so we can require packages in node_modules
    // as expected. eg: require('my-package/reporter');
    /* $FlowFixMe: can't type dynamic require */
    return require(customLogReporterPath);
  } catch (e) {
    if (e.code !== 'MODULE_NOT_FOUND') {
      throw e;
    }
    // If that doesn't work, then we next try relative to the cwd, eg:
    // require('./reporter');
    /* $FlowFixMe: can't type dynamic require */
    return require(path.resolve(customLogReporterPath));
  }
}

module.exports = runServer;
