const { babelLoader } = require('./babel');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  svgLoader(params) {
    return {
      test: /\.svg$/,
      exclude: /node_modules/,
      use: [
        babelLoader(params),
        {
          loader: 'react-svg-loader',
          options: {
            jsx: true,
            svgo: {
              plugins: [
                {
                  removeViewBox: false,
                },
              ],
            },
          },
        },
      ],
    };
  },
};
