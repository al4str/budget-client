const BarPlugin = require('webpackbar');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  barPlugin(params) {
    return new BarPlugin({
      name: params.modern
        ? 'modern'
        : 'legacy',
    });
  },
};
