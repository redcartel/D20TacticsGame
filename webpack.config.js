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
    mode: 'development'
};