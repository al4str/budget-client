const { getTargetBrowsersConfig } = require('../../utils/targets');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  babelLoader(params) {
    const targets = getTargetBrowsersConfig(params.modern);
    const cacheDirectory = params.modern
      ? 'node_modules/.cache/babel-loader/modern'
      : 'node_modules/.cache/babel-loader/legacy';

    return {
      loader: 'babel-loader',
      options: {
        babelrc: false,
        presets: [
          ['@babel/preset-env', {
            bugfixes: true,
            loose: true,
            modules: false,
            corejs: 3,
            useBuiltIns: 'usage',
            targets,
          }],
          ['@babel/preset-react', {
            runtime: 'automatic',
          }],
        ],
        plugins: [
          '@babel/plugin-proposal-export-namespace-from',
          '@babel/plugin-proposal-export-default-from',
          '@babel/plugin-proposal-object-rest-spread',
          '@babel/plugin-syntax-dynamic-import',
        ],
        cacheDirectory,
        cacheCompression: false,
      },
    };
  },
};
