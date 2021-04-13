const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const { HOST } = require('../../constants');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  analyzePlugin(params) {
    return params.analyze
      ? new BundleAnalyzerPlugin({
        openAnalyzer: true,
        analyzerHost: HOST,
        analyzerPort: params.modern
          ? 8888
          : 8887,
        reportTitle: params.modern
          ? 'Modern bundle'
          : 'Legacy bundle',
      })
      : null;
  },
};
