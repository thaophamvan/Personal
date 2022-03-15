const path = require('path');
const webpack = require('webpack');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
  mode: 'development',
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: true,
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: false
        }
      }),
    ],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: "babel-loader"
      },
      {
        test: /\.scss$/,
        exclude: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              sourceMap: true
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: true
            }
          }
        ]
      },
      {
        test: /\.module.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: "css-loader",
            options: {
              modules: true,
              localIdentName: '[folder]__[local]--[hash:base64:5]'
            }
          },
          "sass-loader"
        ]
      }
    ]
  },

  plugins: [
    new Dotenv({
      path: './.env',
      safe: false,
    }),
    new ReplaceInFileWebpackPlugin([{
      dir: 'config',
      files: ['config.js'],
      rules: [{
        search: /process\.env\.NODE_ENV = '(.*?)'/gmi,
        replace: 'process.env.NODE_ENV = \'Local\''
      }]}
    ]),
    new HtmlWebPackPlugin({
      template: "./client/html/index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: false,
        preserveLineBreaks: false
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].bundle.[hash].css",
      chunkFilename: "[id].bundle.[hash].css"
    }),
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
  ],
});
