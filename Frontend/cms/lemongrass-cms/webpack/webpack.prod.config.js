const webpack = require('webpack');
const packageJson = require('../package.json');
const ReplaceInFileWebpackPlugin = require('replace-in-file-webpack-plugin');
const merge = require('webpack-merge');
const HtmlWebPackPlugin = require("html-webpack-plugin");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin");
const UglifyJsPlugin = require("uglifyjs-webpack-plugin");
const Dotenv = require('dotenv-webpack');
const baseConfig = require('./webpack.base.config.js');

module.exports = merge(baseConfig, {
  mode: 'production',
  devtool: false,
  optimization: {
    minimizer: [
      new UglifyJsPlugin({
        cache: true,
        parallel: true,
        sourceMap: false,
        uglifyOptions: {
          compress: {
            drop_console: true,
          }
        }
      }),
      new OptimizeCSSAssetsPlugin({
        cssProcessorOptions: {
          map: false
        }
      })
    ],
    splitChunks: {
      chunks: 'async',
      minSize: 30000,
      maxSize: 0,
      minChunks: 1,
      maxAsyncRequests: 5,
      maxInitialRequests: 3,
      automaticNameDelimiter: '~',
      name: true,
      cacheGroups: {
        vendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true
        }
      }
    }

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
              sourceMap: false
            }
          },
          {
            loader: "sass-loader",
            options: {
              sourceMap: false
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
    new ReplaceInFileWebpackPlugin([
      {
        files: ['package.json'],
        rules: [
          {
            search: /PROD_v.\d+\S*.\d+/gmi,
            replace: function (match) {
              const v = packageJson.version;
              return `PROD_v.${v}`;
            }
          }]
      },
      {
        dir: 'config',
        files: ['config.js'],
        rules: [{
          search: /process\.env\.NODE_ENV = '(.*?)'/gmi,
          replace: 'process.env.NODE_ENV = \'Prod\''
        }]
      }
    ]),
    new HtmlWebPackPlugin({
      template: "./client/html/index.html",
      filename: "./index.html",
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: true
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
