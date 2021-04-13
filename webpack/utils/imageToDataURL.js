const fs = require('fs');

/**
 * @param {string} filePath
 * @return {string}
 * */
function imageToDataURL(filePath) {
  const binary = fs.readFileSync(filePath, 'binary');
  const base64String = Buffer
    .from(binary, 'binary')
    .toString('base64');

  return `data:image/png;base64,${base64String}`;
}

module.exports = {
  imageToDataURL,
};
