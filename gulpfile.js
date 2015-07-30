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
var WWW = 'www';
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

/**
 * Tracks the filesystem for changes and recompiles necessary files
 */
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

/**
 * Downloads data from the CMS and writes it to disk
 *
 * TODO: make this work
 */
gulp.task('data', function() {
  return console.error("need to configure gulp data command");
});

/**
 * Moves all static assets to the cordova www/ directory
 *
 * TODO: Should this all be implemented via Cordova hooks?
 * @see http://cordova.apache.org/docs/en/edge/guide_appdev_hooks_index.md.html
 */
gulp.task('static', function() {
  var files = [
    'src/audio',
    'src/fonts',
    'src/images'
  ];

  var dist_files = [
    'tmp/data.json'
  ];

  gulp.src(files, { base: 'src/' }).pipe(gulp.dest(WWW));
  gulp.src(dist_files, { base: 'tmp/' }).pipe(gulp.dest(DIST));
});

/**
 * These tasks are required before performing any cordova builds
 */
gulp.task('prebuild', [
  'static',
  'scripts',
  'styles',
  'html',
  'data'
]);

/**
 * Builds all platforms
 */
gulp.task('build', ['prebuild'], function(done) {
  exec('cordova build', done);
});

/**
 * Only builds Android
 */
gulp.task('build-android', ['prebuild'], function(done) {
  exec('cordova build android', done);
});

/**
 * Only builds iOS
 */
gulp.task('build-ios', ['prebuild'], function(done) {
  exec('cordova build ios', done);
});

// TODO
gulp.task('build-web', ['prebuild'], function(done) {
  return console.error("NOT YET IMPLEMENTED");
});

// TODO
gulp.task('build-firefoxos', ['prebuild'], function(done) {
});
