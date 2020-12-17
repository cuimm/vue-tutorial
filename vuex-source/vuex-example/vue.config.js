const path = require('path');

module.exports = {
  configureWebpack: {
    resolve: {
      modules: [path.resolve(__dirname, '../source'), path.resolve('node_modules')],
    },
  },
};
