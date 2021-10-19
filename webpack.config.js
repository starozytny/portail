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
        'app': ['./assets/js/app.js', './assets/css/app.scss'],
        'homepage': ['./assets/js/homepage.js', './assets/css/homepage.scss'],
        'edl': ['./assets/js/pages/edl.js', './assets/css/pages/edl.scss'],
        'user': ['./assets/js/pages/user.js', './assets/css/pages/user.scss'],
        'security': ['./assets/js/pages/security.js', './assets/css/pages/security.scss'],
        'property': ['./assets/js/pages/property.js', './assets/css/pages/property.scss'],
        'tenant': ['./assets/js/pages/tenant.js', './assets/css/pages/tenant.scss'],
        'bibli': ['./assets/js/pages/bibli.js', './assets/css/pages/bibli.scss'],
        'modele': ['./assets/js/pages/modele.js', './assets/css/pages/modele.scss'],
    },
    output: {
        path: path.resolve(__dirname, 'public/assets'),
        publicPath: '',
    },
    optimization: {
        minimizer: [new TerserJSPlugin({}), new OptimizeCSSAssetsPlugin({})],
    },
    module: {
        rules: [
            {
                test: /\.(s[ac]ss|css)$/i,
                use: [
                    MiniCssExtractPlugin.loader,
                    'css-loader',
                    {
                        loader: 'sass-loader',
                        options: {
                            sourceMap: true,
                            sassOptions: {
                                includePaths: [path.resolve(__dirname, 'node_modules')],
                            },
                        },
                    },
                ],
            },
            {
                test: /\.?(js|jsx)$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ['@babel/preset-env', '@babel/preset-react']
                    }
                }
            },
        ],
    },
    resolve: {
        alias: {
            '@publicFolder': path.resolve(__dirname, './public'),
            '@dashboardComponents': path.resolve(__dirname, './assets/js/components'),
            '@pages': path.resolve(__dirname, './assets/js/pages'),
            '@nodeModulesFolder': path.resolve(__dirname, './node_modules'),
        },
        extensions: ['*', '.js', '.jsx'],
    },
    plugins: [
        new CleanWebpackPlugin(),
        new WebpackManifestPlugin({
            fileName: './manifest.json',
            publicPath: '/assets/',
        }),
        new MiniCssExtractPlugin({
            ignoreOrder: false,
            filename: '[name].css'
        }),
    ]
};