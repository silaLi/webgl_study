var private_config = './config/private.config.json'

var ToolsContainer = require('./tools.config.js');

var CleanWebpackPlugin = require('clean-webpack-plugin');
var SftpWebpackPlugin = require('sftp-webpack-plugin')

var webpack_config = {
    entry: {
        index_1_1: './front-src/entry/index_1_1.ts',
        index_3_1: './front-src/entry/index_3_1.ts'
    },
    output: {
        path: __dirname + '/dest/deploy/', // 输出文件的保存路径
        filename: '[name].entry.js' // 输出文件的名称
    },
    module: {
        loaders: [{
            test: /\.(js)$/,
            loaders: 'babel-loader?presets[]=es2015'
        }, {
            test: /\.(ts)$/,
            loaders: 'ts-loader'
        }, {
            test: /\.(scss|sass)$/,
            loaders: 'style-loader!css-loader!postcss-loader!sass-loader'
        }, {
            test: /\.(png|jpg)$/,
            loaders: ToolsContainer.getDependencies('urlPathLoader')
                // loaders: 'file-loader'
        }, {
            test: /\.html$/,
            loaders: 'html-loader'
        }]
    },
    plugins: [
        new CleanWebpackPlugin([__dirname + '/dest/deploy/'], {
            root: '', // An absolute path for the root  of webpack.config.js
            verbose: true, // Write logs to console.
            dry: false // Do not delete anything, good for testing.
        })
    ]
}

process.argv.forEach((argv) => {
    if (argv === '-p') {
        deploy();
    }
})
function deploy() {
    if (private_config.SftpWebpackPlugin.open === true) {
        webpack_config.plugins.push(new SftpWebpackPlugin({
            port: private_config.SftpWebpackPlugin.port,
            host: private_config.SftpWebpackPlugin.host,
            username: private_config.SftpWebpackPlugin.username,
            password: private_config.SftpWebpackPlugin.password,
            from: __dirname + '/dest/deploy/',
            to: private_config.SftpWebpackPlugin.to
        }))
    }
}

module.exports = webpack_config;