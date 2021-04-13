const StylelintPlugin = require('stylelint-webpack-plugin');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  styleLintPlugin(params) {
    const cacheLocation = params.modern
      ? 'node_modules/.cache/stylelint/modern'
      : 'node_modules/.cache/stylelint/legacy';

    return params.production
      ? null
      : new StylelintPlugin({
        cache: true,
        cacheLocation,
      });
  },
};
