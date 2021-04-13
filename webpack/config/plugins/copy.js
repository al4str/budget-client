const CopyPlugin = require('copy-webpack-plugin');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  copyPlugin() {
    return new CopyPlugin({
      patterns: [
        {
          from: './src/static/favicons/*',
          to: 'favicons/[name].[contenthash:8].[ext]',
          toType: 'template',
          noErrorOnMissing: false,
        },
        {
          from: './src/static/i18n/*',
          to: 'i18n/[name].[contenthash:8].json',
          toType: 'template',
          noErrorOnMissing: true,
        },
        {
          from: './src/static/robots.txt',
          to: 'robots.txt',
          noErrorOnMissing: true,
        },
      ],
    });
  },
};
