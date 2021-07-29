const path = require("path");

module.exports = {
  mode: process.env.NODE_ENV || "production",
  devtool: "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    port: 8080,
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};
