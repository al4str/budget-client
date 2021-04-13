const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  cssLoader(params) {
    if (params.production) {
      return {
        loader: MiniCssExtractPlugin.loader,
        options: {
          esModule: false,
        },
      };
    }
    return {
      loader: 'style-loader',
      options: {
        esModule: false,
      },
    };
  },
};
