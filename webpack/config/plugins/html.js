const HtmlWebpackPlugin = require('html-webpack-plugin');
const { getTokens, injectTokens } = require('../../utils/templates');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  htmlPlugin(params) {
    const type = params.modern
      ? 'modern'
      : 'legacy';
    return new HtmlWebpackPlugin({
      inject: false,
      filename: params.production
        ? `${type}/index.html`
        : 'index.html',
      templateParameters(compilation, files, tags) {
        if (params.production) {
          return {};
        }
        /** @type {webpack.Stats} */
        const stats = compilation.getStats();
        return {
          tokens: getTokens({
            tags: tags.headTags,
            stats,
          }),
        };
      },
      templateContent({ tokens }) {
        if (params.production) {
          return '';
        }
        return injectTokens(tokens);
      },
    });
  },
};
