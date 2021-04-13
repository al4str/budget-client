const ESLintPlugin = require('eslint-webpack-plugin');
const eslintFormatter = require('eslint-friendly-formatter');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  eslintPlugin(params) {
    return !params.production
      ? new ESLintPlugin({
        formatter: eslintFormatter,
      })
      : null;
  },
};
