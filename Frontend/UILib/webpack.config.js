const path = require('path')
const ExtractTextPlugin = require('extract-text-webpack-plugin')

module.exports = {
  entry: {
    app: './lib/index.js',
  },
  output: {
    path: path.resolve(__dirname, 'build'),
    publicPath: '/assets/',
    filename: 'bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.jsx?$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
      {
        test: /\.styl$/,
        loaders: ExtractTextPlugin.extract({
          use: 'css-loader!stylus-loader',
        }),
      },
    ],
  },
  plugins: [new ExtractTextPlugin('styles.css')],
}
