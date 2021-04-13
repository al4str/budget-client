const { resolve } = require('../../../webpack.config');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getResolve() {
    return {
      alias: {
        ...(resolve.alias || {}),
      },
      extensions: [
        ...(resolve.extensions || []),
      ],
      symlinks: false,
    };
  },
};
