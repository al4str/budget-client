const { jsLoader } = require('./script');
const { svgLoader } = require('./svg');
const { styleLoader } = require('./style');
const { fontLoader } = require('./font');
const { warmupThreadLoader } = require('./thread');

const loaders = [
  jsLoader,
  svgLoader,
  styleLoader,
  fontLoader,
];

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getLoaders(params) {
    return loaders
      .map((loader) => loader(params))
      .filter((loader) => !!loader);
  },
  warmupThreadLoader,
};
