const path = require('path');
const ExtractTextPlugin = require('extract-text-webpack-plugin');
const HtmlPlugin = require('html-webpack-plugin');
const CopyPlugin = require('copy-webpack-plugin');
const pkg = require('../package.json');

const options = {
  minimizeCss: false,
};

module.exports = {
  entry: path.resolve(__dirname, './src/index.js'),
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: 'site.js',
  },
  module: {
    loaders: [
      {
        test: /.jsx?$/,
        loader: 'babel-loader',
        exclude: /node_modules/,
        query: {
          presets: ['react'],
          plugins: [require('babel-plugin-transform-object-rest-spread')], // eslint-disable-line
        },
      },
      {
        test: /\.styl$/,
        use: ExtractTextPlugin.extract({
          use: `css-loader${options.minimizeCss ? '?minimize' : ''}!stylus-loader`,
        }),
      },
    ],
  },
  plugins: [
    new ExtractTextPlugin('styles.css'),
    new HtmlPlugin({
      title: `Klara UI | ${pkg.version}`,
    }),
    new CopyPlugin([{ from: 'src/assets', to: 'assets' }]),
  ],
};
