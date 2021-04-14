const Sass = require('sass');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  scssLoader() {
    return {
      loader: 'sass-loader',
      options: {
        sourceMap: true,
        implementation: Sass,
      },
    };
  },
};
