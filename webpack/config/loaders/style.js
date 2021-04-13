const { scssLoader } = require('./scss');
const { postcssLoader } = require('./postcss');
const { cssLoader } = require('./css');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  styleLoader(params) {
    return {
      test: /\.scss$/,
      use: [
        cssLoader(params),
        {
          loader: 'css-loader',
          options: {
            url: true,
            import: true,
            modules: {
              mode: 'local',
              localIdentName: '[local]-[contenthash:8]',
            },
            importLoaders: 2,
            sourceMap: true,
          },
        },
        postcssLoader(params),
        scssLoader(params),
      ],
    };
  },
};
