'use strict';

// System
var spawn = require('child_process').spawn;
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
var DATA_FILE = 'tmp/data.json';

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

/**
 * Deletes everything in the www directory.
 * If you're editing files in there you're doing something wrong!
 */
gulp.task('empty', function(done) {
  exec('rm -rf ./www/*', function(err, output) {
    if (err) {
      console.error(err);
      throw new Error(err);
    }

    console.log(output);
    console.log("Empty Task Completed");

    done();
  });
});

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
 */
gulp.task('data', function(done) {
  var dataDownload = spawn('./bin/datacache.sh');

  dataDownload.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  dataDownload.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  dataDownload.on('exit', jsonCleanup);

  function jsonCleanup() {
    fs.readFile(DATA_FILE, function(err, data) {
      if (err) {
        throw err;
      }

      var json = JSON.parse(data);

      var text = JSON.stringify(json, null, 2);

      fs.writeFile(DATA_FILE, text, function(err) {
        if (err) {
          throw err;
        }

        gulp.src(DATA_FILE, { base: 'tmp/' }).pipe(gulp.dest(DIST));
        done();
      });
    });
  }
});

/**
 * Moves all static assets to the cordova www/ directory
 *
 * TODO: Should this all be implemented via Cordova hooks?
 * @see http://cordova.apache.org/docs/en/edge/guide_appdev_hooks_index.md.html
 */
gulp.task('static-android', function() {
  return moveStatic(true, false);
});

gulp.task('static-ios', function() {
  return moveStatic(true, true);
});

gulp.task('static-web', function() {
  return moveStatic(false, false);
});

function moveStatic(cordova, ios) {
  var files = [
    'src/audio/**/*.wav',
    'src/audio/**/*.ogg',
    'src/fonts/**',
    'src/images/**'
  ];

  var files_ios = [
    'src/audio/**/*.wav',
    'src/audio/**/*.mp3',
    'src/fonts/**',
    'src/images/**'
  ];

  var web_only_files = [
    'src/manifest.json',
    'src/manifest.webapp',
    'src/favicon.ico'
  ];

  if (!cordova) {
    gulp.src(web_only_files, { base: 'src/' }).pipe(gulp.dest(WWW));
  }

  if (!ios) {
    gulp.src(files, { base: 'src/' }).pipe(gulp.dest(WWW));
  } else {
    gulp.src(files_ios, { base: 'src/' }).pipe(gulp.dest(WWW));
  }
}

/**
 * These tasks are required before performing any cordova builds
 */
gulp.task('prebuild-ios', [
  'empty', // TODO: Possible race condition of empty finishes after other tasks begin
  'data',
  'static-ios',
  'scripts',
  'styles',
  'html-cordova'
]);

gulp.task('prebuild-android', [
  'empty', // TODO: Possible race condition of empty finishes after other tasks begin
  'data',
  'static-android',
  'scripts',
  'styles',
  'html-cordova'
]);

gulp.task('prebuild-web', [
  'empty', // TODO: Possible race condition of empty finishes after other tasks begin
  'data',
  'static-web',
  'scripts',
  'styles',
  'html-web'
]);

/**
 * Only builds Android
 */
gulp.task('build-android', ['prebuild-android'], function(done) {
  var build = spawn('cordova', ['build', 'android', '--release']);

  build.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  build.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  build.on('exit', done);
});

gulp.task('sign-android', function(done) {
  return console.error("Run ./bin/sign-android.sh instead");
});

/**
 * Only builds iOS
 */
gulp.task('build-ios', ['prebuild-ios'], function(done) {
  var build = spawn('cordova', ['build', 'ios']);

  build.stdout.on('data', function(data) {
    console.log(data.toString());
  });

  build.stderr.on('data', function(data) {
    console.error(data.toString());
  });

  build.on('exit', done);
});

gulp.task('build-web', ['prebuild-web'], function(done) {
  console.log("Building for FirefoxOS and Web...");
  return gulp.src('www/**', { base: 'www/' }).pipe(gulp.dest(WEB_BUILD));
});
