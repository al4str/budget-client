require('dotenv').config();

/**
 * @return {BuildEnvParams}
 * */
function getParams() {
  return {
    analyze: process.env.ANALYZE_BUNDLE === '1',
    production: process.env.NODE_ENV === 'production',
    modern: process.env.BROWSERSLIST_ENV === 'modern',
  };
}

module.exports = {
  getParams,
};

/**
 * @typedef {Object} BuildEnvParams
 * @property {boolean} production
 * @property {boolean} modern
 * @property {boolean} analyze
 * */
