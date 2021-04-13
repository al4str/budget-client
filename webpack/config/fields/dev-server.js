const fs = require('fs');
const { getStats } = require('./stats');
const { getOutput } = require('./output');
const {
  DIST_DIR,
  PORT,
  HOST,
  API_URL,
  SSL_KEY,
  SSL_CERT,
} = require('../../constants');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getDevServer(params) {
    if (params.production) {
      return {};
    }
    return {
      hot: true,
      port: PORT,
      host: HOST,
      https: {
        key: fs.readFileSync(SSL_KEY),
        cert: fs.readFileSync(SSL_CERT),
      },
      disableHostCheck: true,
      overlay: true,
      contentBase: [
        DIST_DIR,
      ],
      publicPath: getOutput(params).publicPath,
      index: 'index.html',
      historyApiFallback: true,
      stats: getStats(params),
      proxy: {
        '/api': {
          target: API_URL,
          pathRewrite: {
            '^/api': '',
          },
        },
      },
    };
  },
};
