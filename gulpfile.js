var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');
var exec = require('child_process').exec;

var paths = {
  scripts: [
    'public/scripts/lib/*.js',
    'public/scripts/modules/*.js',
    'public/scripts/modules/screens/*.js',
    'public/scripts/bootstrap.js'
  ],
  styles: [
    'public/styles/*.css',
    'public/styles/*.less',
    'public/styles/screens/*.css',
    'public/styles/screens/*.less'
  ]
};

gulp.task('default', [
  'scripts',
  'styles'
]);

gulp.task('scripts', function() {
  return gulp
    .src(paths.scripts)
    .pipe(uglify())
    .pipe(concat('app.js'))
    .pipe(gulp.dest('public/dist'));
});

// TODO: https://github.com/postcss/autoprefixer
gulp.task('styles', function() {
  return gulp
    .src(paths.styles)
    .pipe(less())
    .pipe(concat('app.css'))
    .pipe(minifyCss())
    .pipe(gulp.dest('public/dist'));
});

gulp.task('watch', ['scripts', 'styles'], function() {
  gulp.watch(paths.scripts, [
    'scripts'
  ]);
  gulp.watch(paths.styles, [
    'styles'
  ]);
});

gulp.task('build', function(done) {
  console.log('start');
  exec('cordova build', function() {
    console.log('fin');
    done();
  });
});
