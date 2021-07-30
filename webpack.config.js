const path = require('path');
const CopyPlugin = require("copy-webpack-plugin");

module.exports = {
    entry: {
        index: './src/index.js'
    },
    output: {
        filename: 'index.js',
        path: path.resolve('/Users/redcartel/Unity/D20Tactics/Assets/StreamingAssets/Game')
    },
    plugins: [
        new CopyPlugin({
            patterns: [
                { from: "assets", to: "/Users/redcartel/Unity/D20Tactics/Assets/StreamingAssets/Game/assets" },
            ],
        }),
    ],
    module: {
        rules: [
            {
                test: /\.m?js$/,
                exclude: /(node_modules|bower_components)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ],
        
    },
    mode: 'development',
    devtool: false
};