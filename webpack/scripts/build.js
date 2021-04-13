#!/usr/bin/env node

process.env.NODE_ENV = 'production';

const path = require('path');
const consola = require('consola');
const { getParams } = require('../env-params');
const { DIST_DIR } = require('../constants');
const { getConfig } = require('../config');
const { clearDirectory, createDirectory, writeFile } = require('../utils/fs');
const { getCompiler } = require('../utils/compilers');
const { createInterBuildTagsStore } = require('../utils/tags');
const { renderTemplate } = require('../utils/templates');

const console = consola.withTag('build');

async function buildForProduction() {
  try {
    const { analyze } = getParams();
    const tagsStore = createInterBuildTagsStore();
    await clearDirectory(DIST_DIR);
    await createDirectory(DIST_DIR);
    const modernConfig = getConfig({
      analyze,
      production: true,
      modern: true,
      tagsStore,
    });
    const legacyConfig = getConfig({
      analyze,
      production: true,
      modern: false,
      tagsStore,
    });
    const configs = [modernConfig, legacyConfig];
    const compilers = configs
      .map((config) => getCompiler(config));
    console.info('Compiling modern and legacy bundles...');
    /** @type {Array<BuildCompileResults>} */
    const results = await Promise.all(compilers.map((compiler) => {
      return compiler();
    }));
    results.forEach((result, index) => {
      const { err, stats } = result;
      const config = configs[index];
      if (err) {
        console.error(err);
      }
      if (stats) {
        console.log(stats.toString(config.stats));
      }
    });
    const [modernBuildResult] = results;
    if (!modernBuildResult.err) {
      console.info('Compiling templates...');
      /** @type {webpack.Stats & webpack.compilation.MultiStats} */
      const stats = modernBuildResult.stats;
      const html = renderTemplate({
        tags: tagsStore.getTags(),
        stats,
      });
      const htmlPath = path.join(DIST_DIR, 'index.html');
      await writeFile(htmlPath, html);
      console.success('Compiled successfully');
    }
  }
  catch (err) {
    console.warn('Compilation failed');
    console.error(err);
  }
}

(async () => {
  await buildForProduction();
})();
