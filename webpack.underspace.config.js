var path = require('path');
var webpack = require('webpack');

module.exports = {
    entry: ['whatwg-fetch', './underspace.init'],
    output: {
        path: __dirname,
        filename: '/dist/lib/underspace.min.js',
        publicPath: 'http://localhost:3008/'
    },
    module: {
        loaders: [
            { test: require.resolve('react'), loader: 'expose?React' },
            { test: require.resolve('react-dom'), loader: 'expose?ReactDOM' },
            {
                test: /\.js$/,
                loaders: ['babel'],
                exclude: /node_modules/
            }
        ]
    },
    plugins: [
        new webpack.NoErrorsPlugin(),
        new webpack.optimize.UglifyJsPlugin({minimize: true}),
        new webpack.optimize.DedupePlugin(),
        new webpack.DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        })
    ],
    stats: {
        colors: true
    }
};
