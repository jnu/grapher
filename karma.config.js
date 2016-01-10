/**
 * @fileOverview Karma test config
 */

var path = require('path');
var karmaWebpack = require('karma-webpack');
var webpackConfig = require('./webpack.config');


// Use the real module / loader configuration for the Karma-Webpack config,
// but drop the output config and add support for loading test stubs.
var karmaWebpackConfig = {
    module: webpackConfig.module,
    debug: true,
    devtool: null
};


module.exports = function(config) {
    config.set({
        // base path, that will be used to resolve files and exclude
        basePath: '',

        // list of files omitted as they should be passed in at runtime
        files: [
            'spec/**/*.js'
        ],

        preprocessors: {
            './**/*.js': ['webpack']
        },

        webpack: karmaWebpackConfig,

        frameworks: ['mocha', 'chai'],

        // test results reporter to use
        // possible values: 'dots', 'progress', 'junit'
        reporters: ['mocha', 'progress'],

        junitReporter: {
            useBrowserName: false,
            outputFile: 'test-results.junit.xml',
            suite: 'grapher'
        },

        // web server port
        port: 9876,

        // cli runner port
        runnerPort: 9100,

        // enable / disable colors in the output (reporters and logs)
        colors: true,

        // level of logging
        // possible values: LOG_DISABLE || LOG_ERROR || LOG_WARN || LOG_INFO || LOG_DEBUG
        logLevel: config.LOG_INFO,

        // enable / disable watching file and executing tests whenever any file changes
        autoWatch: true,

        // Start these browsers, currently available:
        // - Chrome
        // - ChromeCanary
        // - Firefox
        // - Opera
        // - Safari (only Mac)
        // - PhantomJS
        // - IE (only Windows)
        browsers: ['PhantomJS'],

        // If browser does not capture in given timeout [ms], kill it
        captureTimeout: 60000,

        plugins: [
            karmaWebpack,
            'karma-mocha',
            'karma-chai',
            'karma-mocha-reporter',
            'karma-phantomjs-launcher'
        ]
    });
};

