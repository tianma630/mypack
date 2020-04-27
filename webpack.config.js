const path = require('path');

module.exports = {
  mode: 'development',
  entry:'./src/entry.js',
  output: {
    filename: "bundle-development.js",
    path: path.resolve(__dirname, './dist'),
}
}
