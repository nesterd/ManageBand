'use strict'
var path = require('path');
var webpack = require("webpack/lib/webpack")
var ManifestPlugin = require('webpack-manifest-plugin');
var ChunkManifestPlugin = require('chunk-manifest-webpack-plugin');
var WebpackMd5Hash = require('webpack-md5-hash');
module.exports = {
    entry: {
        'index': './index.jsx'
    },
    output: {
        path: "./Release",
        filename: "[name].js"
    },

    watchOptions: {
        aggregateTimeout: 100
    },

    module: {
        loaders: [{
            test: /\.jsx$/,
            loader: 'babel-loader',
            exclude: /node_modules/,
            query: {
                presets: ['es2015', 'react']
            }
        },
        {
            test: /\.css$/,
            loader: "style-loader!css-loader"
        }]
    },

    devtool: "source-map",

    plugins: [
         new webpack.optimize.CommonsChunkPlugin({ name: "vendor" })
    ]
}