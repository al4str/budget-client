module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getStats(params) {
    return params.production
      ? 'errors-warnings'
      : 'minimal';
  },
};
