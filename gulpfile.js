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
var WEB_BUILD = 'platforms/web/build';

// TODO: Read this from config.xml
var APP_TITLE = "Game of Life";

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
  'html-cordova'
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

gulp.task('html-cordova', function() {
  return buildHTML(true);
});

gulp.task('html-web', function() {
  return buildHTML(false);
});

// TODO: Async
function buildHTML(cordova) {
  var screens = fs.readdirSync('src/html/screens/');
  var index = fs.readFileSync('src/html/index.html').toString();
  var template = Handlebars.compile(index);

  var data = {
      title: APP_TITLE,
      cordova: cordova,
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
}

/**
 * Tracks the filesystem for changes and recompiles necessary files
 */
gulp.task('watch', ['scripts', 'styles', 'html-web'], function() {
  gulp.watch(PATHS.scripts, [
    'scripts'
  ]);

  gulp.watch(PATHS.styles, [
    'styles'
  ]);

  gulp.watch(PATHS.html, [
    'html-web'
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
gulp.task('static-cordova', function() {
  return moveStatic(true);
});

gulp.task('static-web', function() {
  return moveStatic(false);
});

function moveStatic(cordova) {
  var files = [
    'src/audio/**',
    'src/fonts/**',
    'src/images/**'
  ];

  // TODO: Data command should handle this
  var dist_files = [
    'tmp/data.json'
  ];

  var web_only_files = [
    'src/manifest.json',
    'src/manifest.webapp',
    'src/favicon.ico'
  ];

  if (!cordova) {
    gulp.src(web_only_files, { base: 'src/' }).pipe(gulp.dest(WWW));
  }

  gulp.src(files, { base: 'src/' }).pipe(gulp.dest(WWW));
  gulp.src(dist_files, { base: 'tmp/' }).pipe(gulp.dest(DIST));
}

/**
 * These tasks are required before performing any cordova builds
 */
gulp.task('prebuild-cordova', [
  'static-cordova',
  'scripts',
  'styles',
  'html-cordova',
  'data'
]);

gulp.task('prebuild-web', [
  'static-web',
  'scripts',
  'styles',
  'html-web',
  'data'
]);

/**
 * Builds all platforms
 */
gulp.task('build', function(done) {
  //exec('cordova build', done);
  return console.error("TODO: Figure out how everything can be built at once");
});

/**
 * Only builds Android
 */
gulp.task('build-android', ['prebuild-cordova'], function(done) {
  exec('cordova build android', done);
});

gulp.task('sign-android', function(done) {
  // First step done once
  // keytool -genkey -v -keystore NAME-mobileapps.keystore -alias NAMEmobileapps -keyalg RSA -keysize 2048 -validity 10000

  // Done by sign task
  // jarsigner -verbose -sigalg SHA1withRSA -digestalg SHA1 -keystore <keystorename> <Unsigned APK file> <Keystore Alias name>
  // zipalign -v 4 Example-release-unsigned.apk Example.apk
});

/**
 * Only builds iOS
 */
gulp.task('build-ios', ['prebuild-cordova'], function(done) {
  exec('cordova build ios', done);
});

gulp.task('build-web', ['prebuild-web'], function(done) {
  console.log("Building for FirefoxOS and Web...");
  return gulp.src('www/**', { base: 'www/' }).pipe(gulp.dest(WEB_BUILD));
});
