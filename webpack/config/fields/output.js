const {
  DIST_DIR,
  PUBLIC_PATH,
} = require('../../constants');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getOutput(params) {
    const postfix = params.modern ? 'modern' : 'legacy';
    return {
      filename: params.production
        ? `${postfix}/[name].${postfix}.[contenthash:8].js`
        : `${postfix}/[name].${postfix}.[hash].js`,
      chunkFilename: params.production
        ? `${postfix}/[name].${postfix}.[contenthash:8].js`
        : `${postfix}/[name].${postfix}.[hash].js`,
      path: DIST_DIR,
      publicPath: PUBLIC_PATH,
      jsonpScriptType: params.modern
        ? 'module'
        : 'text/javascript',
      crossOriginLoading: params.modern
        ? 'anonymous'
        : false,
    };
  },
};
