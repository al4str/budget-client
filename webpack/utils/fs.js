const fs = require('fs');
const rimraf = require('rimraf');

/**
 * @param {string} directory
 * @return {Promise}
 * */
function clearDirectory(directory) {
  return new Promise((resolve, reject) => {
    rimraf(directory, (err) => {
      if (err) {
        reject(err);
        return;
      }
      resolve();
    });
  });
}

/**
 * @param {string} directory
 * @return {Promise}
 * */
function createDirectory(directory) {
  return fs.promises.mkdir(directory, { recursive: true });
}

/**
 * @param {string} filePath
 * @param {string} content
 * @return {Promise}
 * */
function writeFile(filePath, content) {
  return fs.promises.writeFile(filePath, content);
}

/**
 * @param {string} filePath
 * @return {Promise}
 * */
function readFile(filePath) {
  return fs.promises.readFile(filePath, { encoding: 'utf-8' });
}

module.exports = {
  clearDirectory,
  createDirectory,
  writeFile,
  readFile,
};
