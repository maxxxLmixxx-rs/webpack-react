const path = require("path");
const MiniCssExtractPlugin = require("mini-css-extract-plugin");

/**
 * @1 .browserslist css-hot fix
 */

const node_env = process.env.NODE_ENV;
const mode = {
  isProduction: node_env === "production",
  isDevelopment: node_env === "development",
  default: node_env || "production",
};

module.exports = {
  mode: mode.default,
  /*1*/ target: mode.isDevelopment ? "web" : "browserslist",
  devtool: mode.isDevelopment && "source-map",
  devServer: {
    contentBase: path.resolve(__dirname, "dist"),
    hot: true,
    port: 8080,
  },
  plugins: [new MiniCssExtractPlugin()],
  resolve: {
    extensions: [".js", ".jsx", ".ts", ".tsx"],
  },
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          MiniCssExtractPlugin.loader,
          "css-loader",
          "postcss-loader",
          "sass-loader",
        ],
      },
      {
        test: /\.jsx?$/i,
        exclude: /node_modules/,
        use: { loader: "babel-loader" },
      },
    ],
  },
};
