'use strict';

var browserify  = require('browserify');
var del         = require('del');
var babel       = require('gulp-babel');
var source      = require('vinyl-source-stream');
var vinylPaths  = require('vinyl-paths');
var buffer      = require('vinyl-buffer');
var gulp        = require('gulp');
var ngAnnotate  = require('gulp-ng-annotate');
var through     = require('through2');
var globby      = require('globby');
var runSequence = require('run-sequence');
var sourcemaps  = require('gulp-sourcemaps');

// Define file path variables
var paths = {
  root : 'src/',      // App root path
  src  : 'src/js/',   // Source path
  build: 'build/'     // Distribution path
};

gulp.task('clean', function () {
  return gulp
    .src([paths.root + 'ngAnnotate', paths.build], {read: false})
    .pipe(vinylPaths(del));
});

gulp.task('views', function () {

  gulp.src([paths.root + 'views/**/*.html'])
    .pipe(gulp.dest(paths.build + 'views/'));

  gulp.src([paths.root + '*.html'])
    .pipe(gulp.dest(paths.build));
});

// "resources" - Copy various resource files to build for node to serve
gulp.task('resources', function () {
  gulp.src(paths.root + 'css/**/*')
    .pipe(gulp.dest(paths.build + 'css/'));
});

gulp.task('browserify', function () {
  var bundledStream = through();

  bundledStream
    .pipe(source('app.js'))
    .pipe(buffer())
    .pipe(sourcemaps.init({loadMaps: true}))
    //.on('error', gutil.log)
    .pipe(babel({
      presets: ["es2015"],
      plugins: ["transform-object-assign"]
    }))
    .pipe(ngAnnotate())
    .pipe(sourcemaps.write('./'))
    .pipe(gulp.dest(paths.build + 'js/'));

  globby([paths.root + 'js/**/_module.js', paths.root + 'js/**/*.js', '!' + paths.root + 'js/third-party/**'])
    .then(function (entries) {
      // create the Browserify instance.
      var b = browserify({
        insertGlobals: true,
        entries      : entries,
        debug        : true
      });

      // pipe the Browserify stream into the stream we created earlier
      // this starts our gulp pipeline.
      b.bundle().pipe(bundledStream);
    }).catch(function (err) {
      // ensure any errors from globby are handled
      bundledStream.emit('error', err);
    });

  // finally, we return the stream, so gulp knows when this task is done.
  return bundledStream;

});


gulp.task('build', () => {
  return runSequence('clean', ['browserify', 'views', 'resources']);
});