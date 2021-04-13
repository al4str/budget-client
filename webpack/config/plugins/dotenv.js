const path = require('path');
const fs = require('fs');
const dotenv = require('dotenv');
const { DefinePlugin } = require('webpack');
const { ROOT_DIR, VERSION } = require('../../constants');

const envString = fs.readFileSync(path.join(ROOT_DIR, '.env'));

const envObject = dotenv.parse(envString);

const definitions = Object
  .entries(envObject)
  .concat([['NODE_ENV', process.env.NODE_ENV]])
  .concat([['BROWSERSLIST_ENV', process.env.BROWSERSLIST_ENV]])
  .concat([['PACKAGE_VERSION', VERSION]])
  .reduce((result, [key, value]) => {
    result[`process.env.${key}`] = JSON.stringify(value);
    return result;
  }, {});

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  dotenvPlugin() {
    return new DefinePlugin(definitions);
  },
};
