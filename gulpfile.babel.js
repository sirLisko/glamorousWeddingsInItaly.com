'use strict';

import gulp from 'gulp';
import gulpLoadPlugins from 'gulp-load-plugins';
import browserSync from 'browser-sync';
import del from 'del';
import runSequence from 'run-sequence';

const $ = gulpLoadPlugins();

var onError = err => {
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


gulp.task('clear-cache', () =>
	$.cache.clearAll()
);

gulp.task('clean', cb =>
	del(['.tmp', 'dist/*', 'src/**/tmp'], {dot: true}, cb)
);

gulp.task('copy', () =>
	gulp.src([
		'./src/php/**/*',
		'./extras/**/*'
	])
	.pipe(gulp.dest('./dist'))
);


gulp.task('images', () =>
	gulp.src('public/images/**/*')
		.pipe($.cache($.imagemin({
			progressive: true,
			interlaced: true
		})))
		.pipe(gulp.dest('dist/images'))
		.pipe($.size({title: 'images'}))
);

gulp.task('image-responsive', () =>
	gulp.src('src/images/backgrounds/*')
		.pipe($.responsive({
			'*':
			[{
				width: 800,
				rename: {suffix: '@S'}
			},{
				width: 1200,
				rename: {suffix: '@M'}
			},{
				width: 1600,
				rename: {suffix: '@L'}
			}]
		}))
		.pipe(gulp.dest('public/images/backgrounds'))
);

gulp.task('image-gallery', () =>
	gulp.src('src/images/gallery/*')
		.pipe($.responsive({
			'*':
			[{
				width: 1000,
				withoutEnlargement: true
			}]
		}))
		.pipe(gulp.dest('public/images/gallery'))
);


gulp.task('js:quality', () =>
	gulp.src('./src/**/*.js')
		.pipe($.eslint())
		.pipe($.eslint.format()).on('error', onError)
);


gulp.task('js', () =>
	gulp.src('./src/javascripts/**/*.js')
		.pipe($.babel())
		.pipe($.concat('main.js'))
		.pipe($.uglify())
		.pipe(gulp.dest('./dist/js'))
		.pipe($.size({title: 'js'}))
);

gulp.task('js-watch', ['js', 'js:quality'], browserSync.reload);


gulp.task('html', () =>
	gulp.src(['./src/templates/*.html'])
		.pipe($.fileInclude()).on('error', onError)
		.pipe($.minifyHtml())
		.pipe(gulp.dest('./dist'))
		.pipe($.size({title: 'html'}))
);

gulp.task('localisation', ['html'], function() {
	var translations = ['en', 'it'];

	translations.forEach(function(translation){
		gulp.src('dist/*.html')
			.pipe(
				$.translator('locales/'+translation)
					.on('error', function(){
						$.utils.log.error(arguments);
					})
				)
			.pipe(gulp.dest('dist/' + (translation === 'en'? '' : translation)));
	});
});

gulp.task('html-watch', ['localisation'], browserSync.reload);


gulp.task('sass', () =>
	gulp.src('./src/styles/*.scss')
		.pipe($.sass()).on('error', onError)
		.pipe($.autoprefixer({
			browsers: ['> 5%'],
			cascade: false
		}))
    .pipe($.combineMq({ beautify: false }))
		.pipe($.csso())
		.pipe(gulp.dest('./dist/css'))
		.pipe(browserSync.stream())
		.pipe($.size({title: 'style'}))
);


gulp.task('icons', () =>
	gulp.src('src/svg/*.svg')
		.pipe($.rename({prefix: 'icon-'}))
		.pipe($.svgmin())
		.pipe($.svgstore({ inlineSvg: true }))
		.pipe($.cheerio($ => {
			$('svg').attr('style', 'display:none').find('[fill]').removeAttr('fill');
		}))
		.pipe(gulp.dest('src/templates/tmp'))
);


gulp.task('sitemap', ['html'], () =>
	gulp.src('./dist/**/*.html')
		.pipe($.sitemap({
			siteUrl: 'http://glamorousweddingsinitaly.com'
		}))
		.pipe(gulp.dest('./extras'))
);


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
		['icons', 'images', 'sass', 'js', 'copy'],
		['localisation'],
		cb
	)
);

gulp.task('test', ['js:quality']);
