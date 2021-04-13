const fs = require('fs');
const path = require('path');
const consola = require('consola');
const { ROOT_DIR } = require('../constants');

const console = consola.withTag('utils/targets');

const defaultConfig = {
  modern: ['iOS >= 11'],
  legacy: ['iOS >= 9', 'not dead'],
};

/** @{null|BuildTargetsConfig} */
let prevConfig = null;

/**
 * @return {Buffer}
 * */
function readConfig() {
  try {
    return fs.readFileSync(path.join(ROOT_DIR, '.browserslistrc'));
  }
  catch (err) {
    console.warn(err);
    return Buffer.alloc(0);
  }
}

/**
 * @param {Buffer} buffer
 * @return {BuildTargetsConfig}
 * */
function parseConfig(buffer) {
  const sectionRegExp = /^\s*\[(.+)]\s*$/;
  try {
    return buffer
      .toString('utf-8')
      .replace(/#[^\n]*/g, '')
      .split(/[\n,]/)
      .map((line) => line.trim())
      .filter((line) => line !== '')
      .reduce((result, line) => {
        if (sectionRegExp.test(line)) {
          const section = line
            .match(sectionRegExp)[1]
            .trim();
          result.push({ name: section, targets: [] });
        }
        else {
          const section = result[result.length - 1];
          section.targets.push(line);
        }
        return result;
      }, [])
      .reduce((result, section) => {
        result[section.name] = section.targets;
        return result;
      }, {});
  }
  catch (err) {
    console.warn(err);
    return defaultConfig;
  }
}

/**
 * @return {BuildTargetsConfig}
 * */
function getConfig() {
  if (prevConfig) {
    return prevConfig;
  }
  const buffer = readConfig();
  const config = parseConfig(buffer);
  prevConfig = config;
  return config;
}

/**
 * @param {boolean} modern
 * @return {string}
 * */
function getTargetBrowsersConfig(modern) {
  const section = modern ? 'modern' : 'legacy';
  const config = getConfig();
  return config[section].join(', ');
}

/**
 * @typedef {Object} BuildTargetsConfig
 * @property {Array<string>} modern
 * @property {Array<string>} legacy
 * */

module.exports = {
  getTargetBrowsersConfig,
};
