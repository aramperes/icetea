const webpack = require("webpack");
const CopyWebpackPlugin = require('copy-webpack-plugin');
module.exports = {
  entry: "./src/web/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/public"
  },
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css", ".png", ".jpg", ".jpeg"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" },
      { test: /\.css$/, use: ['style-loader', 'css-loader'] }
    ]
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new CopyWebpackPlugin([
      { from: 'src/public', to: '.' }
    ]),
  ],
  externals: {
    React: 'react',
    ReactDOM: 'react-dom'
  }
};
