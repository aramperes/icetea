const webpack = require("webpack");
module.exports = {
  entry: "./src/web/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/public/js"
  },
  // devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json", ".css"]
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
    })
  ],
  externals: {
    React: 'react',
    ReactDOM: 'react-dom'
  }
};
