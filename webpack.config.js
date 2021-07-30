const path = require('path')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const ReactRefreshBabelPlugin = require('react-refresh/babel')

/**
 * @1 .browserslist css-hot fix
 * @2 react-hot reload fix
 */

const node_env = process.env.NODE_ENV
const mode = {
    isProduction: node_env === 'production',
    isDevelopment: node_env === 'development',
    default: node_env || 'production',
}

const styles = {
    cssLoader: {
        loader: 'css-loader',
        options: {
            modules: true,
        },
    },
    postcssLoader: 'postcss-loader',
    sassLoader: 'sass-loader',
}

module.exports = {
    mode: mode.default,
    /*1*/ target: mode.isDevelopment ? 'web' : 'browserslist',
    /*2*/ entry: './src/index.tsx',
    devtool: mode.isDevelopment && 'source-map',
    output: {
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
        new MiniCssExtractPlugin(),
        new HtmlWebpackPlugin({
            template: './public/index.html',
        }),
        mode.isDevelopment && new ReactRefreshWebpackPlugin(),
    ].filter(Boolean),
    resolve: {
        extensions: ['.js', '.jsx', '.ts', '.tsx'],
    },
    module: {
        rules: [
            {
                test: /\.(png|jpe?g|webp|gif|svg)$/i,
                type: 'asset',
                parser: {
                    dataUrlCondition: {
                        maxSize: 8 * 1024,
                    },
                },
            },
            {
                test: /\.(sa|sc|c)ss$/i,
                use: [
                    MiniCssExtractPlugin.loader,
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
                            mode.isDevelopment && ReactRefreshBabelPlugin,
                        ].filter(Boolean),
                    },
                },
            },
        ],
    },
}
