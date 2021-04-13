// For IDEs usage only
// Auto alias path resolving
const path = require('path');

const root = process.cwd();

module.exports = {
  context: root,
  resolve: {
    alias: {
      '@': path.join(root, 'src'),
    },
    extensions: ['.js'],
  },
};
