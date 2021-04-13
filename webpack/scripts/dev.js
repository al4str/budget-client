#!/usr/bin/env node

process.env.NODE_ENV = 'development';

const consola = require('consola');
const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const { getParams } = require('../env-params');
const { PORT, HOST } = require('../constants');
const { getConfig } = require('../config');

const console = consola.withTag('dev');

async function buildForDevelopment() {
  try {
    const { modern, analyze } = getParams();
    const webpackConfig = getConfig({
      production: false,
      modern,
      analyze,
      tagsStore: {
        addTags: Function.prototype,
      },
    });
    const compiler = webpack(webpackConfig);
    const server = new WebpackDevServer(compiler, webpackConfig.devServer);
    server.listen(PORT, HOST, () => {
      console.info(`https://${HOST}:${PORT}`);
    });
  }
  catch (err) {
    console.warn('Compilation failed');
    console.error(err);
  }
}

(async () => {
  await buildForDevelopment();
})();
