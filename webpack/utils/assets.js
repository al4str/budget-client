const path = require('path');
const {
  ASSETS_VAR_NAME,
  ROUTES_CHUNKS_VAR_NAME,
} = require('../constants');

const IGNORE_EXT_REG_EXP = /(\.html|gz|map|txt|ttf|woff2?)$/i;

/**
 * @param {webpack.Stats} stats
 * @param {string} publicPath
 * @return {Array<BuildCopiedAsset>}
 * */
function getCopiedAssetsFromStats(stats, publicPath) {
  const statsObject = stats.toJson({
    all: false,
    assets: true,
    cachedAssets: true,
  });
  return statsObject.assets
    .filter((asset) => asset.info.copied)
    .map((rawAsset) => {
      const dirPath = path
        .dirname(rawAsset.name)
        .replace(/^\/\.\./, '');
      const hashedName = path.basename(rawAsset.name);
      const originalName = path.basename(rawAsset.info.sourceFilename);
      return {
        originalPath: path.join(dirPath, originalName),
        outputPath: path.join(publicPath, dirPath, hashedName),
      };
    });
}

/**
 * @typedef {Object} BuildCopiedAsset
 * @property {string} originalPath
 * @property {string} outputPath
 * */

/**
 * @param {Array<BuildCopiedAsset>} assets
 * @return {string}
 * */
function getAssetsMap(assets) {
  const assetsMap = assets
    .filter((asset) => !IGNORE_EXT_REG_EXP.test(asset.originalPath))
    .reduce((result, asset) => {
      result[asset.originalPath] = asset.outputPath;
      return result;
    }, {});
  return [
    '<script>',
    `window['${ASSETS_VAR_NAME}']`,
    '=',
    'JSON.parse(\'',
    JSON.stringify(assetsMap, null, 0),
    '\')',
    '</script>',
  ].join('');
}

/**
 * @param {Array<BuildCopiedAsset>} assets
 * @param {string} originalPath
 * @return {string}
 * */
function getAssetURL(assets, originalPath) {
  const { outputPath } = assets.find((asset) => asset.originalPath === originalPath) || { outputPath: '' };
  return outputPath;
}

/**
 * @param {webpack.Stats} stats
 * @param {string} publicPath
 * @return {string}
 * */
function getRoutesChunksMap(stats, publicPath) {
  const statsObject = stats.toJson({
    all: false,
    logging: false,
    chunkGroups: true,
  });
  const routesChunksMap = Object
    .entries(statsObject.namedChunkGroups)
    .reduce((result, [name, group]) => {
      result[name] = group.assets
        .filter((asset) => {
          return ['.css', '.js'].includes(path.extname(asset));
        })
        .map((url) => path.join(publicPath, url));

      return result;
    }, {});

  return [
    '<script>',
    `window['${ROUTES_CHUNKS_VAR_NAME}']`,
    '=',
    'JSON.parse(\'',
    JSON.stringify(routesChunksMap, null, 0),
    '\')',
    '</script>',
  ].join('');
}

module.exports = {
  getCopiedAssetsFromStats,
  getAssetsMap,
  getAssetURL,
  getRoutesChunksMap,
};
