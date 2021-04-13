const crypto = require('crypto');
const Terser = require('terser-webpack-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const { FRAMEWORK_PACKAGES } = require('../../constants');

/**
 * @param {Object} module
 * @param {string} module.type
 * @return {boolean}
 * */
function isCssModule(module) {
  return module.type === 'css/mini-extract';
}

/**
 * @param {string} data
 * @return {string}
 * */
function getHash(data) {
  return crypto
    .createHash('sha1')
    .update(data)
    .digest('hex')
    .substring(0, 8);
}

/**
 * @param {boolean} modern
 * @return {function(name: string): string}
 * */
function getChunkNamer(modern) {
  return (name) => {
    return modern
      ? `${name}.modern`
      : `${name}.legacy`;
  };
}

module.exports = {
  /**
   * @param {BuildParams} params
   * @return {webpack.Configuration.optimization}
   * */
  getOptimization(params) {
    const namer = getChunkNamer(params.modern);
    const terser = new Terser({
      terserOptions: {
        safari10: !params.modern,
      },
    });
    if (params.production) {
      const cssMinimizer = new CssMinimizerPlugin({
        sourceMap: true,
      });

      return {
        minimize: true,
        minimizer: [
          terser,
          cssMinimizer,
        ],
        runtimeChunk: {
          name: 'runtime',
        },
        moduleIds: 'hashed',
        splitChunks: {
          chunks: 'all',
          name(_, chunks) {
            const names = chunks.reduce((result, chunk) => {
              return result + chunk.name;
            }, '');
            const hashedName = getHash(names);
            return namer(hashedName);
          },
          cacheGroups: {
            default: false,
            vendors: false,
            framework: {
              chunks: 'all',
              name: 'framework',
              test: new RegExp(`node_modules/(${FRAMEWORK_PACKAGES.join('|')})/`),
              priority: 40,
              enforce: true,
            },
            lib: {
              test(module) {
                return !isCssModule(module)
                  && module.size() > 160000
                  && /node_modules/.test(module.identifier());
              },
              name(module) {
                return getHash(module.libIdent({ context: '' }));
              },
              priority: 30,
              minChunks: 1,
              reuseExistingChunk: true,
            },
            commons: {
              name: 'commons',
              minChunks: 2,
              priority: 20,
            },
            shared: {
              test(module) {
                return !isCssModule(module);
              },
              priority: 10,
              minChunks: 2,
              reuseExistingChunk: true,
            },
          },
          maxAsyncRequests: Infinity,
          maxInitialRequests: 25,
          minSize: 20000,
        },
      };
    }
    return {
      minimizer: [
        terser,
      ],
    };
  },
};
