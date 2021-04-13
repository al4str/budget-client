const MiniCssExtractPlugin = require('mini-css-extract-plugin');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  cssExtract(params) {
    return new MiniCssExtractPlugin({
      filename: params.production
        ? 'styles/[name].[contenthash:8].css'
        : 'styles/[name].[hash].css',
      chunkFilename: params.production
        ? 'styles/[id].[contenthash:8].css'
        : 'styles/[id].[hash].css',
      ignoreOrder: true,
      attributes: {
        crossorigin: '',
      },
      linkType: false,
    });
  },
};
