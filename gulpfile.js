var gulp = require('gulp');
var browserSync = require('browser-sync').create();
var sass = require('gulp-sass');
var compass = require('gulp-compass');
var concat = require('gulp-concat');
var gutil = require('gulp-util');


// Compile sass files on change
gulp.task('compass', function() {
  gulp.src('sass/**/*.s*ss')
    .pipe(compass({
      config_file: './config.rb',
      sass: 'sass',
      css: 'css'
    }))
    .pipe(browserSync.stream());
});

// Compile js files on change
gulp.task('js', function () {

    return gulp.src('./scripts/**/*.js')
      .pipe(concat('main.js'))
      .pipe(gulp.dest('js/'));
});
gulp.task('js-watch', ['js'], browserSync.reload);

// Static Server + watching scss/html files
gulp.task('serve', ['compass', 'js'], function() {

    browserSync.init({
        server : {
            baseDir: './'
        }
    });

    gulp.watch("scripts/**/*.js", ['js-watch']);
    gulp.watch("sass/**/*.s*ss", ['compass']);
    gulp.watch("*.html").on('change', browserSync.reload);
    gulp.watch("views/**/*.html").on('change', browserSync.reload);
});

gulp.task('default', ['serve']);
