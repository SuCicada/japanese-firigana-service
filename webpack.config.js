const path = require('path');

module.exports = {
    target: 'node',

    entry: "./src/server.js",
    module: {
        rules: [
            {
                exclude: [/node_modules/],
                include: [/./,],
            },
        ],
    },
    resolve: {
        extensions: [".tsx", ".ts", ".js"],
    },
    output: {
        path: path.resolve(__dirname, 'dist'), // 输出目录
        filename: "index.js", // 需要跟你在src文件夹中导出文件的文件名一致
        globalObject: "this",
        libraryTarget: "umd", //支持库的引入方式
    },
};
