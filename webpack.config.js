var path = require('path')
var webpack = require('webpack')
var fs = require('fs')
var path = require('path')
let COMPONENT = process.argv[2]

module.exports = {
    entry: path.join(__dirname, 'components', COMPONENT, 'init.js'),
    externals: {
        react: 'React',
        reactDOM: 'ReactDOM'
    },
    output: {
        path: path.join(__dirname, 'components', COMPONENT, 'build'),
        filename:  'app.js',
        //publicPath: '/components/' + COMPONENT
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /(node_modules|bower_components)/,
            },
            {
                 test: /\.scss$/,
                 loader: 'style!css!sass',
                 exclude: /(node_modules|bower_components)/,
            },
            {
              test: /\.css$/,
              loader: 'style!css',
              exclude: /(node_modules|bower_components)/,
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.DedupePlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    stats: {
        colors: true
    }
}
