const HtmlWebpackPlugin = require('html-webpack-plugin');
const { LINKS } = require('../../constants');
const {
  getCustomHTMLTag,
  getHintHTMLTag,
  getStyleHTMLTag,
  getModuleHTMLTag,
  getNoModuleHTMLTag,
} = require('../../utils/tags');
const {
  getCopiedAssetsFromStats,
  getAssetURL,
} = require('../../utils/assets');

const NAME = 'html-enrich';

const PLUGIN_NAME = `${NAME}-plugin`;

const HOOK_NAME = `${NAME}-alter-asset-tags`;

class HTMLEnrichPlugin {
  /**
   * @param {Object} params
   * @param {boolean} params.production
   * @param {boolean} params.modern
   * @param {Array<string>} params.preloadAssets
   * @param {BuildTagsStoreAdd} params.addTags
   * */
  constructor(params) {
    this.production = params.production;
    this.modern = params.modern;
    this.preloadAssets = params.preloadAssets;
    this.addTags = params.addTags;
  }
  /**
   * @param {webpack.Compiler} compiler
   * */
  apply(compiler) {
    const production = this.production;
    const modern = this.modern;
    const assetsToPreload = this.preloadAssets;
    const addTags = this.addTags;
    const publicPath = compiler.options.output.publicPath;
    compiler.hooks.compilation.tap(PLUGIN_NAME, (compilation) => {
      const hooks = HtmlWebpackPlugin.getHooks(compilation);
      hooks.alterAssetTags.tapAsync(HOOK_NAME, (data, cb) => {
        const stats = compilation.getStats();
        const copiedAssets = getCopiedAssetsFromStats(stats, publicPath);
        const metaLinksTags = LINKS
          .map((link) => {
            const outputPath = getAssetURL(copiedAssets, link.originalPath);
            if (!outputPath) {
              return null;
            }
            return getCustomHTMLTag('link', {
              ...link.attributes,
              href: outputPath,
            });
          })
          .filter((tag) => tag);
        const prefetchTags = [...data.assetTags.scripts, ...data.assetTags.styles]
          .filter((tag) => {
            return tag.attributes.href || (modern && tag.attributes.src);
          })
          .map((tag) => tag.attributes.src || tag.attributes.href)
          .map((url) => {
            return getHintHTMLTag(url, 'prefetch');
          });
        const preloadTags = assetsToPreload
          .map((originalPath) => {
            const outputPath = getAssetURL(copiedAssets, originalPath);
            if (!outputPath) {
              return null;
            }
            return getHintHTMLTag(outputPath, 'preload');
          })
          .filter((tag) => tag);
        const stylesTags = data.assetTags.styles
          .map((tag) => tag.attributes.href)
          .map((url) => {
            return getStyleHTMLTag(url);
          });
        const scriptTags = data.assetTags.scripts
          .map((tag) => tag.attributes.src)
          .map((url) => {
            return modern
              ? getModuleHTMLTag(url)
              : getNoModuleHTMLTag(url);
          });
        const tags = [
          ...data.assetTags.meta,
          ...metaLinksTags,
          ...prefetchTags,
          ...preloadTags,
          ...stylesTags,
          ...scriptTags,
        ];
        if (production) {
          addTags(tags);
        }
        cb(null, {
          assetTags: {
            meta: tags,
            styles: [],
            scripts: [],
          },
        });
      });
    });
  }
}

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  htmlEnrichPlugin(params) {
    return new HTMLEnrichPlugin({
      production: params.production,
      modern: params.modern,
      preloadAssets: [
        'assets/brand/logo-icon-white.svg',
      ],
      addTags: params.tagsStore.addTags,
    });
  },
};
