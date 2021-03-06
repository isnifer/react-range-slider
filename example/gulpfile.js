var gulp = require('gulp');
var browserify = require('gulp-browserify');
var $ = require('gulp-load-plugins')();    // Load plugins;
var path = require('path');
var sass = require('gulp-sass');
var connect = require('gulp-connect');

var root = path.resolve(__dirname)

// Sass
gulp.task('sass', function() {
    return gulp.src(root + '/style.scss')
        .pipe(sass())
        .pipe(gulp.dest(root + '/build'))
        .pipe($.size());
});

// index.html
gulp.task('index', function(){
    return gulp.src(root + '/index.html')
        .pipe(gulp.dest(root + '/build'))
        .pipe($.size())
})

// Reactjs jsx file
gulp.task('browserify', function() {
    return gulp.src('app.js')
        .pipe(browserify({
            insertGlobals : false,
            transform: ['babelify'],
            extensions: ['.js']
        })).on('error', function(e) {
            console.log(e)
            this.emit('end');
        })
        .pipe(gulp.dest(root + '/build/'))
        .pipe($.size());
});

// Connect
gulp.task('connect', function() {
    connect.server({
        root: 'build',
        livereload: true
    });
});

// Clean
gulp.task('clean', function() {
    return gulp.src([root + '/build/*'], {
        read: false
    })
    .pipe($.rimraf());
});

// Watch
gulp.task('watch', ['connect'], function() {
    // index html
    gulp.watch('index.html', ['index']);
    // Wathch .scss files
    gulp.watch('style.scss', ['sass']);
    // Watch .jsx files
    gulp.watch(['app.js', '../lib/**.js'], ['browserify']);

});

gulp.task('build', [ 'clean', 'index', 'sass', 'browserify']);
gulp.task('default', ['build']);
