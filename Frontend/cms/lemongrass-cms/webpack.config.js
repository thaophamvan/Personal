const path = require('path')
const webpack = require('webpack')
const HtmlWebPackPlugin = require("html-webpack-plugin")
const MiniCssExtractPlugin = require("mini-css-extract-plugin")
const OptimizeCSSAssetsPlugin = require("optimize-css-assets-webpack-plugin")
const UglifyJsPlugin = require("uglifyjs-webpack-plugin")
const CleanWebpackPlugin = require('clean-webpack-plugin')
const Dotenv = require('dotenv-webpack');

module.exports = (env, argv) => {
  // @see https://github.com/webpack/webpack/issues/6460#issuecomment-364286147
  const PROD_MODE = argv.mode === 'production'

  const plugins = [
    new Dotenv({
      path: './.env',
      safe: false,
    }),
    new HtmlWebPackPlugin({
      template: "./client/html/index.html",
      filename: "./index.html",
      // @see https://github.com/jantimon/html-webpack-plugin#options
      // @see https://github.com/kangax/html-minifier#options-quick-reference
      // @see https://github.com/jantimon/html-webpack-plugin/issues/363#issue-162800498
      minify: {
        collapseWhitespace: true,
        preserveLineBreaks: PROD_MODE ? false : true
      }
    }),
    new MiniCssExtractPlugin({
      filename: "[name].[hash].css",
      chunkFilename: "[id].[hash].css"
    }),
    // @see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29#issuecomment-382424129
    new webpack.SourceMapDevToolPlugin({
      filename: "[file].map"
    }),
    // @see https://github.com/johnagan/clean-webpack-plugin#usage
    new CleanWebpackPlugin(['dist', 'build'], {
      root: path.join(process.cwd(), "public"),
      verbose: true, 
      dry: false
    }),
  ]

  return {
    entry: "./client/index.js",
    output: {
      path: path.resolve(__dirname, "public/dist"),
      publicPath: '/dist',
      filename: "[name].[hash].js",
    },
    // @see https://webpack.js.org/configuration/devtool/
    // @see https://github.com/webpack-contrib/mini-css-extract-plugin/issues/29#issuecomment-382424129
    // devtool: 'cheap-module-eval-source-map',
    optimization: {
      // @see https://github.com/webpack-contrib/mini-css-extract-plugin#minimizing-for-production
      minimizer: [
        new UglifyJsPlugin({
          cache: true,
          parallel: true,
          sourceMap: true // set to true if you want JS source maps
        }),
        // @see https://github.com/NMFR/optimize-css-assets-webpack-plugin/issues/71#issuecomment-412143710
        new OptimizeCSSAssetsPlugin({
          cssProcessorOptions: {
            map: true
          }
        })
      ]
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
    plugins: plugins
  }
}
