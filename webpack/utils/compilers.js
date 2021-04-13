const webpack = require('webpack');

/**
 * @param {webpack.Configuration} config
 * @return {function(): Promise<BuildCompileResults>}
 * */
function getCompiler(config) {
  const compiler = webpack(config);
  return () => new Promise((resolve) => {
    compiler.run((err, stats) => {
      resolve({ err, stats });
    });
  });
}

/**
 * @typedef {Object} BuildCompileResults
 * @property {null|Error} err
 * @property {webpack.compilation.MultiStats} stats
 * */

module.exports = {
  getCompiler,
};
