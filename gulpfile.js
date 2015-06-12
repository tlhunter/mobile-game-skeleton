var gulp = require('gulp');
var uglify = require('gulp-uglify');
var concat = require('gulp-concat');

gulp.task('default', function() {
});

gulp.task('scripts', function() {
    //uglifyjs public/scripts/lib/*.js public/scripts/modules/*.js public/scripts/modules/screens/*.js public/scripts/bootstrap.js -o public/scripts/app.js
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
