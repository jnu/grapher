/**
 * @fileOverview Webpack config
 */

var UglifyJsPlugin = require('webpack/lib/optimize/UglifyJsPlugin');
var OccurenceOrderPlugin = require('webpack/lib/optimize/OccurenceOrderPlugin');
var BannerPlugin = require('webpack/lib/BannerPlugin');
var path = require('path');

var PROD = process.env.NODE_ENV === 'production';

var filename = 'grapher' + (PROD ? '-min' : '') + '.js';

var plugins = [];

if (PROD) {
    plugins = plugins.concat([

        new UglifyJsPlugin(),

        new OccurenceOrderPlugin(),

        new BannerPlugin([
            'Ayasdi Inc. 2015',
            'Grapher.js may be freely distributed under the Apache 2.0 license.'
        ].join('\n'))

    ]);
}

module.exports = {

    context: path.join(__dirname, 'modules'),

    entry: './grapher.js',

    plugins: plugins,

    output: {
        path: path.resolve(__dirname, 'build'),
        filename: filename,
        libraryTarget: 'umd',
        library: 'Grapher',
        pathinfo: !PROD
    },

    devtool: PROD ? null : 'source-map',

    debug: !PROD

};
