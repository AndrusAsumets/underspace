var path = require('path')
var webpack = require('webpack')
var path = require('path')
let COMPONENT = process.argv[2]

var config =  {
    entry: './components/' + COMPONENT + '/init.js',
    externals: {
        react: 'React',
        reactDOM: 'ReactDOM'
    },
    output: {
        path: __dirname + '/components/' + COMPONENT + '/build/',
        filename: 'app.js'
    },
    module: {
        loaders: [
            {
                test: /\.js$/,
                loaders: ['babel'],
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

webpack(config, function(err, stats) {
    if (err) console.log(err)
    console.log(stats)
})
