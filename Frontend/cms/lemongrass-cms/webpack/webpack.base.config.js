const packageJson = require('../package.json');
const path = require('path');
const webpack = require('webpack');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const { BundleAnalyzerPlugin } = require('webpack-bundle-analyzer');
const vendors = ['react', 'react-dom', 'redux', 'react-router-dom', 'react-redux', 'moment', 'redux-thunk', 'axios',
'react-router-redux'];

/*  entry: {
    vendor: vendors,
    bundle: ['./client/index.js'],
  },*/

module.exports = {
  entry: {
    vendor: vendors,
    bundle: ['./client/index.js'],
  },
  
  plugins: [
    new CleanWebpackPlugin(['dist', 'build'], {
      root: path.join(process.cwd(), "public"),
      verbose: true, 
      dry: false
    }),
    new HtmlWebpackPlugin
    ({
      title: 'Production'
    }),
    new BundleAnalyzerPlugin({
      analyzerMode: /*module.process. ?*/ /*'static'*/ 'disabled',
    }),
  ],
  output: {
    filename: '[name].bundle.[hash].js',
    path: path.join(process.cwd(), "public/dist"),
    publicPath: '/dist',
  }
};