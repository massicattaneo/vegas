const path = require('path');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const CopyWebpackPlugin = require('copy-webpack-plugin');
const devServer = 'webpack-hot-middleware/client?reload=true';
const fs = require('fs');
const pkg = require('../package');

const config = {
    entry: {
        public: [
            'babel-regenerator-runtime',
            devServer,
            './src/system.js'
        ]
    },
    output: {
        path: path.join(__dirname, '/dist/'),
        filename: '[name].bundle.js'
    },
    mode: 'development',
    devtool: 'source-map',
    resolveLoader: {
        modules: ['modules/', 'node_modules']
    },
    module: {
        rules: [
            {
                test: /\.hbs$/,
                loader: 'handlebars-loader'
            },
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/
            },
            {
                test: /\.(jpe?g|gif|png|svg|woff|ttf|wav|mp3)$/,
                loader: 'file'
            },
            {
                test: /.(html)$/,
                exclude: [
                    path.resolve(__dirname, 'index.html')
                ],
                use: 'raw-loader'
            },
            {
                test: /.(xml)$/,
                use: 'raw-loader'
            },
            {
                test: /.(scss)$/,
                use: 'gml-scss-loader'
            },
            {
                test: /\.json$/,
                use: 'json-loader'
            },
            {
                test: /\.map$/,
                use: 'gml-map-loader'
            },
            {
                test: /\.vue/,
                use: 'raw-loader'
            }
        ]
    },
    resolve: {
        extensions: ['.js'],
        modules: ['modules/','node_modules'],
        descriptionFiles: ['package.json']
    },
    plugins: [
        new HtmlWebpackPlugin({
            chunks: ['public'],
            template: 'src/index.hbs',
            inject: false,
            filename: './index.html',
            version: pkg.version
        }),
        new CopyWebpackPlugin([
            { from: './src/assets', to: 'assets' }
        ]),
        new webpack.HotModuleReplacementPlugin(),
    ]
};

fs.readdirSync('./src/apps/').forEach(function (name) {
    if (fs.lstatSync('./src/apps/'+name).isDirectory()) {
        config.entry[name] = [
            'babel-regenerator-runtime',
            devServer,
            `./src/apps/${name}/index.js`
        ]
    }
});

module.exports = config;
