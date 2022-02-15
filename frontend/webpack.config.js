const path = require('path');
const webpack = require("webpack");
const CompressionPlugin = require('compression-webpack-plugin');
const TerserPlugin = require("terser-webpack-plugin");

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
          options: { presets: ['@babel/env', '@babel/preset-react'] },
        },
      },
    ],
  },

  performance: {
    hints: "warning", // enum
    maxAssetSize: 200000, // int (in bytes),
    maxEntrypointSize: 400000, // int (in bytes)
    assetFilter: function (assetFilename) {
      // Function predicate that provides asset filenames
      return assetFilename.endsWith('.css') || assetFilename.endsWith('.js');
    }
  },
  optimization: {
    // runtimeChunk: 'single',
    // splitChunks: {
    //   chunks: 'all',
    //   maxInitialRequests: Infinity,
    //   minSize: 0,
    //   cacheGroups: {
    //     vendor: {
    //       test: /[\\/]node_modules[\\/]/,
    //       name(module) {
    //         // get the name. E.g. node_modules/packageName/not/this/part.js
    //         // or node_modules/packageName
    //         const packageName = module.context.match(/[\\/]node_modules[\\/](.*?)([\\/]|$)/)[1];

    //         // npm package names are URL-safe, but some servers don't like @ symbols
    //         return `npm.${packageName.replace('@', '')}`;
    //       },
    //     },
    //   },
    // },
    chunkIds: "size",
    // method of generating ids for chunks
    moduleIds: "size",
    // method of generating ids for modules
    mangleExports: "size",
    // rename export names to shorter names
    minimize: true,
    minimizer: [new TerserPlugin()],
  },
  plugins: [
    // new CompressionPlugin({
    //   filename: '[name].gz[query]',
    //   algorithm: 'gzip',
    //   test: /\.(js|css|html|svg)$/,
    //   threshold: 8192,
    //   minRatio: 0.8
    // }),

    new webpack.DefinePlugin({
      'process.env': {
        'NODE_ENV': JSON.stringify('production')
      }
    }),

    new webpack.optimize.AggressiveMergingPlugin()
  ],
};