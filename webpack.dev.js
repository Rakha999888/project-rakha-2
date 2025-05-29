const { merge } = require('webpack-merge');
const path = require('path');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  devtool: 'inline-source-map',
  devServer: {
    static: path.resolve(__dirname, 'dist'),
    open: true,
    port: 5000,
    host: '0.0.0.0',
    client: {
      overlay: {
        errors: true,
        warnings: true,
      },
      webSocketURL: {
        hostname: '0.0.0.0',
        pathname: '/ws',
        port: 5000
      }
    },
    allowedHosts: 'all',
    headers: {
      'Access-Control-Allow-Origin': '*',
    },
    compress: true,
  },
});
