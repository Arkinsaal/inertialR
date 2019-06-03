const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
  mode: 'development',
  entry: [
    './src/client/main',
  ],
  devtool: 'source-map',
  output: {
    path: `${__dirname}/dist/`,
    publicPath: '/',
    filename: '[name].js'
  },
  resolve: {
    alias: {
      Assets: path.resolve(__dirname, 'src/client/assets/'),
      Services: path.resolve(__dirname, 'src/client/services/'),
      Components: path.resolve(__dirname, 'src/client/components/'),
    },
    extensions: [ '.tsx', '.ts', '.js' ]
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        loader: 'babel-loader'
      },
      {
        test: /\.(png|svg|jpg|gif)$/,
        use: [{
          loader: 'file-loader',
          options: {
            name: '[name].[ext]',
            outputPath: 'assets',
          }
        }]
      },
      {
        test: /\.tsx?$/,
        use: 'ts-loader',
        exclude: /node_modules/
      }
    ]
  },
  plugins: [
    new CleanWebpackPlugin(),
    new HtmlWebpackPlugin({
      title: 'Intertial R',
      template: 'src/client/index.html',
    }),
    new MiniCssExtractPlugin({
      filename: '[name].css'
    }),
  ]
};
