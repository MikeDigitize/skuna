import "babel-core/register";
import gulp from "gulp";
import sass from "gulp-sass";
import autoprefixer from "gulp-autoprefixer";
import minimise from "gulp-cssnano";
import concat from "gulp-concat";
import plumber from "gulp-plumber";
import sequence from "run-sequence";

import webpack from "webpack";
import webpackStream from "webpack-stream";

let bootstrap4Source = "./src/scss/bootstrap-custom.scss";
let sassSource = "./src/scss/app.scss";
let stylesDest = "./build/css";
let outputtedCSSFileName = "skuna-app-styles.min.css";

let jsSource = "./src/js/app.js";
let jsDest = "./build/js";
let webpackConfigSrc = "./webpack.config.js";

let htmlSource = "./src/*.html";
let htmlDest = "./build";

let fontSource = "./src/fonts/**/*";
let fontDest = "./build/fonts";

gulp.task("js", () => {
    return gulp.src(jsSource)
        .pipe(plumber())
        .pipe(webpackStream(require(webpackConfigSrc)))
        .pipe(gulp.dest(jsDest));
});

gulp.task("js:prod", () => {
    let prodConfig = Object.assign({}, require(webpackConfigSrc), {
        watch : false
    });
    prodConfig.plugins.push(new webpack.optimize.UglifyJsPlugin());
    prodConfig.plugins.push(new webpack.DefinePlugin({
        'process.env.NODE_ENV':  '"production"'
    }));

    return gulp.src(jsSource)
        .pipe(plumber())
        .pipe(webpackStream(prodConfig))
        .pipe(gulp.dest(jsDest));
});

gulp.task("styles", () => {
    return gulp.src([bootstrap4Source, sassSource])
        .pipe(sass())
        .pipe(autoprefixer())
        .pipe(minimise())
        .pipe(concat(outputtedCSSFileName))
        .pipe(gulp.dest(stylesDest));
});

gulp.task("html", () => {
    return gulp.src(htmlSource)
        .pipe(gulp.dest(htmlDest));
});

gulp.task("fonts", () => {
    return gulp.src(fontSource)
        .pipe(gulp.dest(fontDest));
});

gulp.task("build:production", () => {
    return sequence("html", "styles", "js:prod");
});

gulp.task("watch", function() {
    gulp.watch([bootstrap4Source, sassSource], ["styles"]);
    gulp.watch(htmlSource, ["html"]);
    gulp.watch(jsSource, ["js"]);
});

gulp.task("default", ["html", "styles", "js", "fonts", "watch"]);