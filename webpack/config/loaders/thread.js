const threadLoader = require('thread-loader');

/**
 * @param {BuildParams} params
 * */
function warmupThreadLoader(params) {
  threadLoader.warmup({
    poolTimeout: params.production
      ? 500
      : Infinity,
  }, [
    'babel-loader',
    '@babel/preset-env',
    '@babel/preset-react',
    '@babel/plugin-proposal-class-properties',
    '@babel/plugin-proposal-export-namespace-from',
    '@babel/plugin-proposal-export-default-from',
    '@babel/plugin-proposal-object-rest-spread',
    '@babel/plugin-syntax-dynamic-import',
  ]);
}

module.exports = {
  warmupThreadLoader,
  /**
   * @param {BuildParams} params
   * */
  threadLoader(params) {
    return {
      loader: 'thread-loader',
      options: {
        poolTimeout: params.production
          ? 500
          : Infinity,
      },
    };
  },
};
