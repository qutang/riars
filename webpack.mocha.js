const merge = require('webpack-merge');
const common = require('./webpack.common.js');
const path = require("path");
const webpack = require("webpack");
const {CleanWebpackPlugin} = require('clean-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = merge.strategy(
    {
        entry: 'replace',
        output: 'replace',
        plugins: 'replace'
    }
)(common, {
    entry: {
        test: path.join(__dirname, "test"),
    },
    output: {
        path: path.resolve(__dirname, "dist/"),
        filename: "test.bundle.js"
    },
    mode: 'development',
    devServer: {
        port: 3000,
        hotOnly: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin(),
        new CleanWebpackPlugin(),
        new HtmlWebpackPlugin({
            filename: 'test.html',
            chunks: ['test'],
            template: path.resolve(__dirname, "public", 'test.html'),
            title: 'RIAR unit test'
    })]
});