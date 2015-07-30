'use strict';

// System
var exec = require('child_process').exec;
var fs = require('fs');

// Local Gulp
var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

// Local
var Handlebars = require('handlebars');

// Constants
var DIST = 'www/dist';
var CSS_FILENAME = 'app.css';
var JS_FILENAME = 'app.js';

var HTML_OUTPUT = 'www/index.html';

// TODO: There's some way to clean this up with /**/...
var PATHS = {
  scripts: [
    'src/scripts/lib/*.js',
    'src/scripts/modules/*.js',
    'src/scripts/modules/screens/*.js',
    'src/scripts/bootstrap.js'
  ],
  styles: [
    'src/styles/*.less',
    'src/styles/screens/*.less'
  ],
  html: [
    'src/html/*.html',
    'src/html/screens/*.html'
  ]
};

gulp.task('default', [
  'scripts',
  'styles',
  'html'
]);

// TODO: Generate Sourcemaps
gulp.task('scripts', function() {
  return gulp
    .src(PATHS.scripts)
    .pipe(uglify())
    .pipe(concat(JS_FILENAME))
    .pipe(gulp.dest(DIST));
});

// TODO: https://github.com/postcss/autoprefixer
// TODO: Generate Sourcemaps
gulp.task('styles', function() {
  return gulp
    .src(PATHS.styles)
    .pipe(less())
    .pipe(concat(CSS_FILENAME))
    .pipe(minifyCss())
    .pipe(gulp.dest(DIST));
});

// TODO: ASYNC
gulp.task('html', function() {
  var screens = fs.readdirSync('src/html/screens/');
  var index = fs.readFileSync('src/html/index.html').toString();
  var template = Handlebars.compile(index);

  var data = {
      // TODO: Read this from config.xml
      title: "Game of Life",
      cordova: true, // TODO: Make this dynamic
      screens: []
  };

  for (var i = 0; i < screens.length; i++) {
      var screen = screens[i];
      if (screen.charAt(0) === '.') {
        continue;
      }
      var content = fs.readFileSync('src/html/screens/' + screen);
      data.screens.push(content);
  }

  fs.writeFileSync(HTML_OUTPUT, template(data));
});

gulp.task('watch', ['scripts', 'styles', 'html'], function() {
  gulp.watch(PATHS.scripts, [
    'scripts'
  ]);

  gulp.watch(PATHS.styles, [
    'styles'
  ]);

  gulp.watch(PATHS.html, [
    'html'
  ]);
});

// TODO: Download data to tmp/data.json
gulp.task('data', function() {
  return console.error("need to configure gulp data command");
});

// TODO
gulp.task('build', ['scripts', 'styles', 'html', 'data'], function(done) {
  console.log('start');
  // src/audio to www
  // src/fonts to www
  // src/images to www
  // tmp/data.json to www/dist/data.json
  exec('cordova build', function() { // TODO: Divvy tasks for each platform
    console.log('fin');
    done();
  });
});

gulp.task('build-android', function() {
});

gulp.task('build-ios', function() {
});

gulp.task('build-web', function() {
});
