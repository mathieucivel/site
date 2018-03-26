const merge = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  devtool: 'inline-source-map',
  devServer: {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || 8036,
    contentBase: './dist',
    watchContentBase: true,
    historyApiFallback: true
  }
);
