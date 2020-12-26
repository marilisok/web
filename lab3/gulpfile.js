const gulp = require('gulp');
const less = require('gulp-less');
const babel = require('gulp-babel');
const pug = require('gulp-pug');
const del = require('del');

gulp.task('cleanJs', function() {
    return del('./public/gulpScripts/*.js');
});

gulp.task('makeJs', function() {
    return gulp.src('./public/scripts/*.js')
        .pipe(babel())
        .pipe(gulp.dest('./public/gulpScripts/'));
});

gulp.task('cleanCss', function() {
    return del('./public/stylesheets/*.css');
});

gulp.task('makeCss', function() {
    return gulp.src('./public/less/*.less')
        .pipe(less())
        .pipe(gulp.dest('./public/stylesheets/'))
});
