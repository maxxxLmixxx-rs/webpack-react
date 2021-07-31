const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshBabelPlugin = require('react-refresh/babel')

/**
 * @1 .browserslist css-hot fix
 * @2 react-hot reload fix
 * @3 easier to debug production app
 *
 * devtool: mode.isDevelopment && 'source-map',
 */

const node_env = process.env.NODE_ENV
const mode = {
  isProduction: node_env === 'production',
  isDevelopment: node_env === 'development',
  default: node_env || 'production',
}

const nameGeneratorStore = {
  _store: {},
  _count: 0,
  _toLetters(num) {
    let mod = num % 26
    let pow = Math.floor(num / 26)
    let out = mod ? String.fromCharCode(96 + mod) : (pow--, 'z')
    return pow ? this._toLetters(pow) + out : out
  },
  generate(id) {
    if (!this._store[id]) {
      this._store[id] = this._toLetters(++this._count)
    }
    return this._store[id]
  },
}

const filenames = {
  _prod: (ext) => `[name].[contenthash:5]${ext}`,
  _dev: (ext) => `[name]${ext}`,
  _modeDepended(ext) {
    return mode.isDevelopment ? this._dev(ext) : this._prod(ext)
  },
  /** files */
  get js() {
    return this._modeDepended('.js')
  },
  get css() {
    return this._modeDepended('.css')
  },
  get assets() {
    return this._modeDepended('[ext]')
  },
  /** css-modules */
  get cssModulesDev() {
    return mode.isDevelopment ? '[path][name]__[local]' : undefined
  },
  get cssModulesProd() {
    return mode.isProduction
      ? (context, _, name) => {
          const unique = context.resourcePath + name
          return nameGeneratorStore.generate(unique)
        }
      : undefined
  },
}

const styles = {
  cssLoader: {
    loader: 'css-loader',
    options: {
      modules: {
        localIdentName: filenames.cssModulesDev,
        getLocalIdent: filenames.cssModulesProd,
      },
    },
  },
  postcssLoader: 'postcss-loader',
  sassLoader: 'sass-loader',
  extract: mode.isDevelopment ? 'style-loader' : MiniCssExtractPlugin.loader,
}

module.exports = {
  mode: mode.default,
  /*1*/ target: mode.isDevelopment ? 'web' : 'browserslist',
  /*2*/ entry: './src/index.tsx',
  /*3*/ devtool: 'source-map',
  output: {
    assetModuleFilename: filenames.assets,
    filename: filenames.js,
    clean: true,
  },
  devServer: {
    contentBase: path.resolve(__dirname, 'dist'),
    clientLogLevel: 'silent',
    open: true,
    hot: true,
    port: 8080,
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: filenames.css,
    }),
    new HtmlWebpackPlugin({
      template: './public/index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        {
          from: 'public',
          filter: (filepath) => !filepath.endsWith('index.html'),
        },
      ],
    }),
    mode.isDevelopment && new ReactRefreshWebpackPlugin(),
  ].filter(Boolean),
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx'],
  },
  module: {
    rules: [
      {
        test: /\.(png|jpe?g|webp|gif)$/i,
        type: 'asset',
        parser: {
          dataUrlCondition: {
            maxSize: 8 * 1024,
          },
        },
      },
      {
        test: /\.svg$/,
        issuer: /\.(js|ts)x?$/,
        oneOf: [
          {
            resourceQuery: /import/,
            use: ['svgo-loader'],
            type: 'asset/resource',
          },
          {
            use: ['@svgr/webpack', 'svgo-loader'],
          },
        ],
      },
      {
        test: /\.(sa|sc|c)ss$/i,
        use: [
          styles.extract,
          styles.cssLoader,
          styles.postcssLoader,
          styles.sassLoader,
        ],
      },
      {
        test: /\.(ts|js)x?$/i,
        exclude: /node_modules/,
        use: {
          loader: 'babel-loader',
          options: {
            plugins: [
              mode.isDevelopment && ReactRefreshBabelPlugin
            ].filter(Boolean),
          },
        },
      },
    ],
  },
}
