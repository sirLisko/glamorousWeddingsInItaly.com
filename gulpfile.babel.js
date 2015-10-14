'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();

var onError = function(err){
	$.util.log(
		err.plugin + ': ' + $.util.colors.red(err.message) + ' ' +
		((err.fileName) ?
			$.util.colors.bold(err.fileName.replace(process.cwd() + '/', '')) + ':' + err.lineNumber :
			''
		)
	);
	$.util.beep();

	if (!browserSync.active) {
		process.exit(1);
	}
};


gulp.task('clean', cb => 
	del(['.tmp', 'dist/*', 'src/**/tmp'], {dot: true}, cb)
);

gulp.task('copy', () => {
	gulp.src(['./public/**/*'])
		.pipe(gulp.dest('./dist'));
});


gulp.task('images', () =>
	gulp.src('public/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size({title: 'images'}))
);


gulp.task('js:quality', () => {
	gulp.src('./src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format()).on('error', onError);
});


gulp.task('js', () => {
	gulp.src('./src/javascripts/**/*.js')
		.pipe($.concat('main.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe($.size({title: 'js'}));
});

gulp.task('js-watch', ['js', 'js:quality'], browserSync.reload);


gulp.task('html', () => {
	gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude()).on('error', onError)
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'))
		.pipe($.size({title: 'html'}));
});

gulp.task('html-watch', ['html'], browserSync.reload);


gulp.task('sass', () => {
	gulp.src('./src/styles/*.scss')
		.pipe($.sass()).on('error', onError)
		.pipe($.autoprefixer({
			browsers: ['> 5%'],
			cascade: false
		}))
		.pipe($.combineMediaQueries())
		.pipe($.csso())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream())
		.pipe($.size({title: 'style'}));
});


gulp.task('icons', function(){
	gulp.src('public/svg/*.svg')
		.pipe($.rename({prefix: 'icon-'}))
		.pipe($.svgmin())
		.pipe($.svgstore({ inlineSvg: true }))
		.pipe($.cheerio(function ($) {
			$('svg').attr('style',  'display:none').find('[fill]').removeAttr('fill');
		}))
		.pipe(gulp.dest('src/templates/tmp'));
});


gulp.task('watch', ['default'], () => {
	browserSync({
		notify: false,
		server: './dist'
	});

	gulp.watch('./src/**/*.html', ['html-watch']);
	gulp.watch('./src/**/*.scss', ['sass']);
	gulp.watch('./src/**/*.js', ['js-watch']);
});

gulp.task('default', ['clean'], cb =>
	runSequence(
		['icons', 'images'],
		['html', 'sass', 'js:quality', 'js'],
		cb
	)
);

gulp.task('test', ['js:quality']);
