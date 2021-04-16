"use strict";

// Load plugins
const browsersync = require("browser-sync").create();
const del = require("del");
const gulp = require("gulp");
const merge = require("merge-stream");
const sass = require('gulp-sass');
sass.compiler = require('node-sass');
const rename = require("gulp-rename");
// const uglify = require("gulp-uglify");

// BrowserSync
function browserSync(done) {
    browsersync.init({
        server: {
            baseDir: "./"
        },
        port: 3000
    });
    done();
}

// BrowserSync reload
function browserSyncReload(done) {
    browsersync.reload();
    done();
}

// Clean vendor
function clean() {
    return del(["./vendor/"]);
}

// Bring third party dependencies from node_modules into vendor directory
function modules() {
    // Bootstrap
    var bootstrap = gulp.src('./node_modules/bootstrap/dist/js/*.js')
        // .pipe(uglify())
        // .pipe(rename({suffix:".min"}))
        .pipe(gulp.dest('./vendor/bootstrap/js'));
    // jQuery
    var jquery = gulp.src('./node_modules/jquery/dist/*.js')
        .pipe(gulp.dest('./vendor/jquery'));
    // jQuery Easing
    var jqueryEasing = gulp.src('./node_modules/jquery.easing/*.js')
        .pipe(gulp.dest('./vendor/jquery-easing'));
    // fontawesome
    var font = gulp.src('./node_modules/@fortawesome/fontawesome-free/css/*.css')
        .pipe(gulp.dest('./vendor/fontawesome/css'));
    var webfont = gulp.src('./node_modules/@fortawesome/fontawesome-free/webfonts/*')
        .pipe(gulp.dest('./vendor/fontawesome/webfonts'))
    return merge(bootstrap, jquery, jqueryEasing, font, webfont);
}

// sass
function scsstocss(){
    return gulp.src('./scss/*.scss')
        .pipe(sass({outputStyle: 'compressed'}).on('error', sass.logError))
        .pipe(rename({
            suffix:".min"
        }))
        .pipe(gulp.dest('./css'));
}

// Watch files
function watchFiles() {
    gulp.watch("./scss/*.scss", scsstocss);
    gulp.watch("./**/*.css", browserSyncReload);
    gulp.watch("./**/*.html", browserSyncReload);
}

// Define complex tasks
const vendor = gulp.series(clean, modules);
const build = gulp.series(vendor, scsstocss);
const watch = gulp.series(build, gulp.parallel(watchFiles, browserSync));
// const watch = gulp.series(watchFiles);
// Export tasks
exports.clean = clean;
exports.vendor = vendor;
exports.build = build;
exports.watch = watch;
exports.default = build;
