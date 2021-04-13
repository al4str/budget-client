const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

/**
 * @param {string} tagName
 * @param {Object} attributes
 * */
function getCustomHTMLTag(tagName, attributes) {
  return HtmlWebpackPlugin.createHtmlTagObject(tagName, attributes);
}

/**
 * @param {string} url
 * @param {string|'prefetch'|'preload'} hintType
 * */
function getHintHTMLTag(url, hintType) {
  return HtmlWebpackPlugin.createHtmlTagObject('link', {
    rel: hintType,
    href: url,
    as: getResourceDirective(url),
    crossorigin: 'anonymous',
  });
}

/**
 * @param {string} url
 * */
function getModuleHTMLTag(url) {
  return HtmlWebpackPlugin.createHtmlTagObject('script', {
    src: url,
    type: 'module',
    crossorigin: 'anonymous',
  });
}

/**
 * @param {string} url
 * */
function getNoModuleHTMLTag(url) {
  return HtmlWebpackPlugin.createHtmlTagObject('script', {
    src: url,
    defer: true,
    nomodule: true,
    crossorigin: 'anonymous',
  });
}

/**
 * @param {string} url
 * */
function getStyleHTMLTag(url) {
  return HtmlWebpackPlugin.createHtmlTagObject('link', {
    rel: 'stylesheet',
    href: url,
    crossorigin: 'anonymous',
  });
}

/**
 * @param {Array<HtmlWebpackPlugin.HtmlTagObject>} tags
 * @return {BuildGroupedTags}
 * */
function getGroupedTags(tags) {
  return tags.reduce((result, tag) => {
    if (tag.attributes.rel === 'prefetch') {
      result.prefetchTags.push(tag);
    }
    else if (tag.attributes.rel === 'preload') {
      result.preloadTags.push(tag);
    }
    else if (tag.attributes.rel === 'stylesheet') {
      result.styleTags.push(tag);
    }
    else if (tag.attributes.type === 'module') {
      result.moduleTags.push(tag);
    }
    else if (tag.attributes.nomodule === true) {
      result.nomoduleTags.push(tag);
    }
    else {
      result.metaTags.push(tag);
    }
    return result;
  }, {
    metaTags: [],
    prefetchTags: [],
    preloadTags: [],
    styleTags: [],
    moduleTags: [],
    nomoduleTags: [],
  });
}

/**
 * @typedef {Object} BuildGroupedTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} metaTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} prefetchTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} preloadTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} styleTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} moduleTags
 * @property {Array<HtmlWebpackPlugin.HtmlTagObject>} nomoduleTags
 * */

/**
 * @param {HtmlWebpackPlugin.HtmlTagObject} tag
 * @return {string}
 * */
function htmlTagObjectToString(tag) {
  const attributes = Object
    .entries(tag.attributes || {})
    .filter(([, value]) => value)
    .map(([name, value]) => {
      if (value === true) {
        return name;
      }
      return `${name}="${value}"`;
    })
    .join(' ');
  return [
    '<',
    tag.tagName,
    ...(attributes
      ? [' ', attributes]
      : []),
    ...(tag.voidTag
      ? ['/>']
      : ['>', '</', tag.tagName, '>']),
  ].join('');
}

/**
 * @param {Array<HtmlWebpackPlugin.HtmlTagObject>} tags
 * @return {string}
 * */
function htmlTagObjectsToString(tags) {
  return tags
    .map((tag) => htmlTagObjectToString(tag))
    .join('\n');
}

/**
 * @param {string} url
 * */
function getResourceDirective(url) {
  const ext = path.extname(url);
  switch (ext) {
    case '.mjs':
    case '.js':
      return 'script';
    case '.css':
      return 'style';
    case '.ttf':
    case '.woff':
    case '.woff2':
      return 'font';
    case '.jpeg':
    case '.jpg':
    case '.gif':
    case '.png':
    case '.svg':
    case '.webp':
      return 'image';
    case '.mp3':
    case '.aac':
      return 'audio';
    case '.mp4':
      return 'video';
    default:
      return undefined;
  }
}

/**
 * @return {BuildTagsStore}
 * */
function createInterBuildTagsStore() {
  /** @type {Map<string, HtmlWebpackPlugin.HtmlTagObject>} */
  const TAGS_MAP = new Map();

  function addTags(tags) {
    tags.forEach((tag) => {
      const key = htmlTagObjectToString(tag);
      if (!TAGS_MAP.has(key)) {
        TAGS_MAP.set(key, tag);
      }
    });
  }

  function getTags() {
    return Array.from(TAGS_MAP.values());
  }

  return {
    addTags,
    getTags,
  };
}

/**
 * @typedef {Object} BuildTagsStore
 * @property {BuildTagsStoreAdd} addTags
 * @property {BuildTagsStoreGet} getTags
 * */

/**
 * @typedef {Function} BuildTagsStoreAdd
 * @param {Array<HtmlWebpackPlugin.HtmlTagObject>} tags
 * @return {void}
 * */

/**
 * @typedef {Function} BuildTagsStoreGet
 * @return {Array<HtmlWebpackPlugin.HtmlTagObject>}
 * */

module.exports = {
  getCustomHTMLTag,
  getHintHTMLTag,
  getModuleHTMLTag,
  getNoModuleHTMLTag,
  getStyleHTMLTag,
  getGroupedTags,
  htmlTagObjectsToString,
  createInterBuildTagsStore,
};
