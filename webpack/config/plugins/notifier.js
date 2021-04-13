const WebpackNotifierPlugin = require('webpack-notifier');
const { APP_NAME } = require('../../constants');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  notifierPlugin(params) {
    return !params.production
      ? new WebpackNotifierPlugin({
        title: APP_NAME,
        alwaysNotify: true,
      })
      : null;
  },
};
