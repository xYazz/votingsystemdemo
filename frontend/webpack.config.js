const path = require("path");
const webpack = require("webpack");
const CompressionPlugin = require('compression-webpack-plugin');

module.exports = {
  entry: "./frontend/src/index.js",
  output: {
    path: path.resolve(__dirname, "./static/frontend"),
    filename: "[name].js",
  },

  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: { presets: ['@babel/env','@babel/preset-react'] },
        },
      },
    ],
  },

  optimization: {
    minimize: true,
  },
  plugins: [
    new CompressionPlugin({
      filename: '[path].gz[query]',
      algorithm: 'gzip',
      test: /\.(js|css|html|svg)$/,
      threshold: 8192,
      minRatio: 0.8
      }),
    new webpack.DefinePlugin({
      // "process.env": {
      //   // This has effect on the react lib size
      //   NODE_ENV: JSON.stringify("development"),}})
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    //new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
  ],
};