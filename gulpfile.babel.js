import 'babel-core/register';
import gulp from 'gulp';
import sass from 'gulp-sass';
import autoprefixer from 'gulp-autoprefixer';
import minimise from 'gulp-cssnano';
import concat from 'gulp-concat';
import plumber from 'gulp-plumber';
import sequence from 'run-sequence';
import rename from 'gulp-rename';

import webpack from 'webpack';
import webpackStream from 'webpack-stream';

import { Server } from 'karma';
import { config as webpackConfigSrc } from './webpack.config.js';

let talkToMeSource = './src/js/*.js';
let jsDest = './build/js';

let htmlSource = './src/*.html';
let htmlDest = './build';

let testConfigSrc = __dirname + '/src/tests/karma.config.js';
let testSource = './src/tests/**/*.js';

let jsNames = { base : 'talk-to-me.js', entry :  'js/talk-to-me-base.js' }; 

let karmaServer = (configSrc, browsers, done) => new Server({
        configFile: configSrc,
        singleRun: true,
        autoWatch: false,
        browsers: browsers
    }, () => {
        done();
    }).start();

gulp.task('js:base', () => {
    let entry = {};
    entry['talk-to-me'] = jsNames.entry;
    let config = Object.assign({}, webpackConfigSrc, { entry });
    return gulp.src(`./src/${jsNames.entry}`)
        .pipe(plumber())
        .pipe(webpackStream(config))
        .pipe(gulp.dest(jsDest));
});

gulp.task('html', () => {
    return gulp.src(htmlSource)
        .pipe(gulp.dest(htmlDest));
});

gulp.task('karma:browser-tests', done => {
    return karmaServer(testConfigSrc, ['Chrome'], done);
});

gulp.task('watch', function() {
    gulp.watch(htmlSource, ['html']);
    gulp.watch(talkToMeSource, ['js:base']);
    gulp.watch(testConfigSrc, ['karma:browser-tests']);
});

gulp.task('default', ['html', 'js:base', 'watch']);
gulp.task('base', ['html', 'js:base']);