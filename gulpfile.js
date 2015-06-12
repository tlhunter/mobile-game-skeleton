var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');
var less = require('gulp-less');
var minifyCss = require('gulp-minify-css');

gulp.task('default', [
	'scripts',
	'styles'
]);

gulp.task('scripts', function() {
	return gulp
		.src([
			'public/scripts/lib/*.js',
			'public/scripts/modules/*.js',
			'public/scripts/modules/screens/*.js',
			'public/scripts/bootstrap.js'
		])
		.pipe(uglify())
		.pipe(concat('app.js'))
		.pipe(gulp.dest('public/scripts'));
});

gulp.task('styles', function() {
	return gulp
		.src([
			'public/styles/*.css',
			'public/styles/*.less',
			'public/styles/screens/*.css',
			'public/styles/screens/*.less'
		])
		.pipe(less())
		.pipe(concat('app.css'))
		.pipe(minifyCss())
		.pipe(gulp.dest('public/styles'));
});
