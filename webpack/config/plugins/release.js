const path = require('path');
const { createDirectory, writeFile } = require('../../utils/fs');
const { DIST_DIR, VERSION } = require('../../constants');

const pluginName = 'EmitJsonWebpackPlugin';

class EmitJsonWebpackPlugin {
  /**
   * @param {Object} params
   * @param {boolean} params.emit
   * @param {string} params.path
   * @param {Object} params.data
   * */
  constructor(params) {
    this.onEmit = this.onEmit.bind(this);
    this.emit = params.emit;
    this.path = params.path;
    this.data = params.data;
  }
  /**
   * @param {webpack.compilation} compilation
   * @param {Function} callback
   * @return {void}
   * */
  onEmit(compilation, callback) {
    const emit = this.emit;
    const filePath = this.path;
    const fileData = this.data;
    let fileContent = '{}';
    try {
      fileContent = JSON.stringify(fileData, null, 2);
    }
    catch (err) {
      callback(err);
      return;
    }
    if (emit) {
      createDirectory(DIST_DIR)
        .then(() => {
          return writeFile(path.join(DIST_DIR, filePath), fileContent);
        })
        .then(() => {
          callback();
        })
        .catch((err) => {
          callback(err);
        });
    }
    else {
      compilation.assets[filePath] = {
        size() {
          return fileContent.length;
        },
        source() {
          return fileContent;
        },
      };
      callback();
    }
  }
  /**
   * @param {webpack.Compiler} compiler
   * */
  apply(compiler) {
    compiler.hooks.emit.tapAsync(pluginName, this.onEmit);
  }
}

module.exports = {
  /**
   * @param {BuildParams} params
   * */
  releasePlugin(params) {
    return new EmitJsonWebpackPlugin({
      emit: !params.production,
      path: './meta.json',
      data: {
        version: VERSION,
      },
    });
  },
};
