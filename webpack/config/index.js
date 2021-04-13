const {
  getMode,
  getTarget,
  getStats,
  getEntry,
  getDevtool,
  getOutput,
  getResolve,
  getOptimization,
  getDevServer,
} = require('./fields');
const { getLoaders, warmupThreadLoader } = require('./loaders');
const { getPlugins } = require('./plugins');

/**
 * @param {BuildParams} params
 * @return {webpack.Configuration}
 * */
function getConfig(params) {
  warmupThreadLoader(params);

  return {
    mode: getMode(params),
    target: getTarget(params),
    stats: getStats(params),
    entry: getEntry(params),
    devtool: getDevtool(params),
    devServer: getDevServer(params),
    output: getOutput(params),
    resolve: getResolve(params),
    optimization: getOptimization(params),
    module: {
      rules: getLoaders(params),
    },
    plugins: getPlugins(params),
  };
}

module.exports = {
  getConfig,
};

/**
 * @typedef {Object} BuildParams
 * @property {boolean} production
 * @property {boolean} modern
 * @property {boolean} analyze
 * @property {BuildTagsStore} tagsStore
 * */
