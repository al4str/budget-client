const Sass = require('sass');
const Fiber = require('fibers');

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
        sassOptions: {
          fiber: Fiber,
        },
      },
    };
  },
};
