const path = require('path');
const { ROOT_DIR } = require('../../constants');

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  fontLoader() {
    return {
      test: /\.(ttf|woff2?)$/i,
      use: [
        {
          loader: 'file-loader',
          options: {
            name: '[name].[contenthash:8].[ext]',
            /**
             * @param {string} url
             * @param {string} resourcePath
             * */
            outputPath(url, resourcePath) {
              const srcPath = path.join(ROOT_DIR, 'src/static');
              const dirPath = resourcePath.replace(`${srcPath}/`, '');
              const outDir = path.dirname(dirPath);
              const outPath = path.join(outDir, url);
              return outPath;
            },
          },
        },
      ],
    };
  },
};
