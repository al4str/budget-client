const fs = require('fs');
const path = require('path');
const { ROOT_DIR, PUBLIC_PATH } = require('../constants');
const { imageToDataURL } = require('./imageToDataURL');
const { minifyHTML } = require('./html');
const {
  getCopiedAssetsFromStats,
  getAssetsMap,
  getRoutesChunksMap,
} = require('./assets');
const {
  getGroupedTags,
  htmlTagObjectsToString,
} = require('./tags');

const TEMPLATE_PATH = path.join(ROOT_DIR, 'src/templates/index.html');

/**
 * @param {Object} params
 * @param {Array} params.tags
 * @param {webpack.Stats} params.stats
 * @return {Array<BuildTemplateToken>}
 * */
function getTokens(params) {
  const { tags, stats } = params;
  const groupedTags = getGroupedTags(tags);
  const copiedAssets = getCopiedAssetsFromStats(stats, PUBLIC_PATH);
  const assetsMap = getAssetsMap(copiedAssets);
  const routesChunksMap = getRoutesChunksMap(stats, PUBLIC_PATH);
  const splashIconPath = path.resolve(ROOT_DIR, 'src/static/icons/take-5000.png');
  const splashIconURL = imageToDataURL(splashIconPath);

  return [
    ['metaTags', htmlTagObjectsToString(groupedTags.metaTags)],
    ['prefetchTags', htmlTagObjectsToString(groupedTags.prefetchTags)],
    ['preloadTags', htmlTagObjectsToString(groupedTags.preloadTags)],
    ['styleTags', htmlTagObjectsToString(groupedTags.styleTags)],
    ['assetsMap', assetsMap],
    ['routesChunksMap', routesChunksMap],
    ['moduleTags', htmlTagObjectsToString(groupedTags.moduleTags)],
    ['nomoduleTags', htmlTagObjectsToString(groupedTags.nomoduleTags)],
    ['splashIconURL', splashIconURL],
  ];
}

/**
 * @typedef {[string, string]} BuildTemplateToken
 * */

/**
 * @param {Array<BuildTemplateToken>} tokens
 * @return {string}
 * */
function injectTokens(tokens) {
  const templateContent = fs
    .readFileSync(TEMPLATE_PATH)
    .toString();
  return tokens.reduce((result, [name, value]) => {
    return result.replace(`__${name}__`, value);
  }, templateContent);
}

/**
 * @param {string} html
 * @return {void}
 * */
function throwIfUnusedTokensExist(html) {
  const matches = /__(a-z+)__/i.exec(html);
  if (matches) {
    const tokens = matches
      .slice(1)
      .map((token) => `"${token}"`)
      .join(', ');
    throw new Error(`Unused HTML token(s): ${tokens}`);
  }
}

/**
 * @param {Object} params
 * @param {Array} params.tags
 * @param {webpack.Stats} params.stats
 * @return {string}
 * */
function renderTemplate(params) {
  const tokens = getTokens(params);
  const rawHTML = injectTokens(tokens);
  throwIfUnusedTokensExist(rawHTML);
  return minifyHTML(rawHTML);
}

module.exports = {
  getTokens,
  injectTokens,
  renderTemplate,
};
