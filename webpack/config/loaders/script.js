const { threadLoader } = require('./thread');
const { babelLoader } = require('./babel');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  jsLoader(params) {
    return {
      test: /\.js$/,
      exclude: [/node_modules/],
      use: [
        threadLoader(params),
        babelLoader(params),
      ],
    };
  },
};
