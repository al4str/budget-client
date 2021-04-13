module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getMode(params) {
    return params.production
      ? 'production'
      : 'development';
  },
};
