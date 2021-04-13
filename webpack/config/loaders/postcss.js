const { getTargetBrowsersConfig } = require('../../utils/targets');
const safariBorderRadiusClipFix = require('../../postcss/safari-border-radius');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  postcssLoader() {
    return {
      loader: 'postcss-loader',
      options: {
        sourceMap: true,
        postcssOptions: {
          plugins: [
            safariBorderRadiusClipFix(),
            ['postcss-preset-env', {
              browsers: getTargetBrowsersConfig(false),
            }],
            'autoprefixer',
            'cssnano',
          ],
        },
      },
    };
  },
};
