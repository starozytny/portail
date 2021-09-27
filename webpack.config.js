const path = require('path');
const webpack = require('webpack');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const { WebpackManifestPlugin } = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const OptimizeCSSAssetsPlugin = require('optimize-css-assets-webpack-plugin');
const TerserJSPlugin = require('terser-webpack-plugin');

module.exports = {
    mode: "development",
    entry: {
        'app/app': './assets/js/app.js'
    },
    output: {
        path: path.resolve(__dirname, 'public/assets'),
        publicPath: 'assets/',
    },
    optimization: {
        splitChunks: {
            chunks: 'all',
        },
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
        rules: [
            {
                test: /\.css$/,
                use: [MiniCssExtractPlugin.loader, 'css-loader']
            },
            // {
            //     test: /\.s[ac]ss$/i,
            //     use: [
            //         process.env.NODE_ENV !== "production" ? "style-loader" : MiniCssExtractPlugin.loader,
            //         'css-loader',
            //         {
            //             loader: 'sass-loader',
            //             options: {
            //                 sourceMap: true,
            //                 sassOptions: {
            //                     includePaths: [path.resolve(__dirname, 'node_modules')],
            //                 },
            //         },
            //     },],
            // },
            {
                test: /\.(png|jpe?g|gif)$/i,
                loader: 'file-loader',
                options: {
                    name: '[path][name].[ext]',
                },
            },
            {
                test: /\.(ttf|eot|svg|woff|woff2)(\?[\s\S]+)?$/,
                use: {
                    loader: 'file-loader',
                    options: {
                        name: '[path][name].[ext]',
                    },
                }
            },
        ],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({
            fileName: './manifest.json',
            publicPath: 'assets/',
        }),
        new MiniCssExtractPlugin({
            ignoreOrder: false
        }),
    ]
};