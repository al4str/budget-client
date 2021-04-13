const { dotenvPlugin } = require('./dotenv');
const { copyPlugin } = require('./copy');
const { notifierPlugin } = require('./notifier');
const { hmrPlugin } = require('./hmr');
const { cssExtract } = require('./mini-css-extract');
const { analyzePlugin } = require('./analyze');
const { styleLintPlugin } = require('./stylelint');
const { barPlugin } = require('./bar');
const { htmlPlugin } = require('./html');
const { releasePlugin } = require('./release');
const { htmlEnrichPlugin } = require('./html-enrich');
const { eslintPlugin } = require('./eslint');

const plugins = [
  notifierPlugin,
  barPlugin,
  dotenvPlugin,
  styleLintPlugin,
  copyPlugin,
  hmrPlugin,
  cssExtract,
  analyzePlugin,
  htmlPlugin,
  releasePlugin,
  htmlEnrichPlugin,
  eslintPlugin,
];

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getPlugins(params) {
    return plugins
      .map((plugin) => plugin(params))
      .filter((plugin) => !!plugin);
  },
};
