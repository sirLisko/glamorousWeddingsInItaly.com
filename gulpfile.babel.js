'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
var browserSync = require('browser-sync').create();

const $ = gulpLoadPlugins();

let isDev = false;

var onError = function(err){
	$.util.log(
		err.plugin + ': ' + $.util.colors.red(err.message) + ' ' +
		((err.fileName) ?
			$.util.colors.bold(err.fileName.replace(process.cwd() + '/', '')) + ':' + err.lineNumber :
			''
		)
	);
	$.util.beep();

	if (isDev) {
		this.emit('end');
	} else {
		process.exit(1);
	}
};


gulp.task('copy', () => {
	return gulp.src(['./public/**/*'])
		.pipe(gulp.dest('./dist'));
});


gulp.task('js:quality', () => {
	return gulp.src('./src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format()).on('error', onError);
});


gulp.task('js', () => {
	return gulp.src('./src/javascripts/**/*.js')
		.pipe($.uglify())
		.pipe(gulp.dest('./dist/js'));
});

gulp.task('js-watch', ['js', 'js:quality'], browserSync.reload);


gulp.task('html', () => {
	return gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude()).on('error', onError)
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'));
});

gulp.task('html-watch', ['html'], browserSync.reload);


gulp.task('sass', () => {
	return gulp.src('./src/styles/*.scss')
		.pipe($.sass()).on('error', onError)
		.pipe($.autoprefixer({
			browsers: ['> 5%'],
			cascade: false
		}))
		.pipe($.combineMediaQueries())
		.pipe($.csso())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream());
});


gulp.task('watch', () => {
	isDev = true;

	browserSync.init({
		server: './dist'
	});

	gulp.start('default');
	gulp.watch('./src/**/*.html', ['html-watch']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['js-watch']);
});

gulp.task('default', ['html', 'sass', 'js:quality', 'js', 'copy']);
gulp.task('test', ['js:quality']);
