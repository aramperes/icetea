module.exports = {
  entry: "./src/web/index.tsx",
  output: {
    filename: "bundle.js",
    path: __dirname + "/dist/public/js"
  },
  devtool: "source-map",
  resolve: {
    extensions: [".ts", ".tsx", ".js", ".json"]
  },
  module: {
    rules: [
      { test: /\.tsx?$/, loader: "awesome-typescript-loader" },
      { enforce: "pre", test: /\.js$/, loader: "source-map-loader" }
    ]
  },
  externals: {
    React: 'react',
    ReactDOM: 'react-dom'
  }
};
