const path = require("path");
const webpack = require("webpack");

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
        },
      },
    ],
  },

  optimization: {
    minimize: true,
  },
  plugins: [
    new webpack.DefinePlugin({
      // "process.env": {
      //   // This has effect on the react lib size
      //   NODE_ENV: JSON.stringify("development"),}})
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),
    new webpack.optimize.AggressiveMergingPlugin()//Merge chunks 
  ],
};