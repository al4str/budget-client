const { HotModuleReplacementPlugin } = require('webpack');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  hmrPlugin(params) {
    return !params.production
      ? new HotModuleReplacementPlugin()
      : null;
  },
};
