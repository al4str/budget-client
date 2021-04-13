module.exports = {
  /**
   * @param {BuildParams} params
   * */
  getEntry(params) {
    const mainEntry = params.modern
      ? ['./src/entry/modern.js']
      : ['./src/entry/legacy.js'];

    return [
      ...mainEntry,
    ];
  },
};
