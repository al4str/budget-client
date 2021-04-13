const { minify } = require('html-minifier');

/**
 * @param {string} html
 * @return {string}
 * */
function minifyHTML(html) {
  return minify(html, {
    collapseBooleanAttributes: true,
    collapseInlineTagWhitespace: true,
    collapseWhitespace: true,
    minifyCSS: true,
    minifyJS: true,
    removeComments: true,
  });
}

module.exports = {
  minifyHTML,
};
