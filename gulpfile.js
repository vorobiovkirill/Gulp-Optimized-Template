'use strict';

/*
 * Gulp Optimized Template Copyright © 2017, Kirill Vorobyov mishkacod@gmail.com
 * MIT Licensed
 */

/**
 * Dependencies
 * -----------------------------------------------------------------------------
 */

const browserSync = require('browser-sync').create();
const del = require('del');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const combineMq = require('gulp-combine-mq');
const concat = require('gulp-concat');
const csscomb = require('gulp-csscomb');
const imagemin = require('gulp-imagemin');
const inject = require('gulp-inject');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const series = require('stream-series');
const size = require('gulp-size');
const sass = require('gulp-sass');
const sassLint = require('gulp-sass-lint');
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');
const uglify = require('gulp-uglify');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './build/',
	srcPath: './src/'
}

const sprite = {
	src: './src/images/sprites/*.*'
}

/**
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', () => {

	return browserSync.init({
		server: {
			baseDir: dirs.srcPath
		},
		logPrefix: "gulp-optimized-template",
		port: 8080,
		startPath: 'index.html',
		notify: false
	});

});

/**
 * Build styles with pre-processors and post-processors
 * -----------------------------------------------------------------------------
 */

gulp.task('styles', () => {

	return gulp.src(dirs.srcPath + '/sass/**/*.sass')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in styles. It would be necessary to correct',
					message: err.message
				};
			})
		}))
		.pipe(sourcemaps.init())
		.pipe(sass())
		.pipe(autoprefixer([
			'last 15 versions',
			'> 1%',
			'ie 8'
		]))
		.pipe(csscomb())
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min',
			extname: '.css'
		}))
		.pipe(sourcemaps.write('/'))
		.pipe(size({
			title: 'Size',
			showFiles: true,
			showTotal: false,
		}))
		.pipe(gulp.dest(dirs.srcPath + '/css'))
		.pipe(browserSync.reload({
			stream: true
		}));

});

/**
 * Lint Sass
 * -----------------------------------------------------------------------------
 */

gulp.task('sass-lint', () => {

	return gulp.src(dirs.srcPath + '/sass/**/*.sass')
		.pipe(sassLint({
			options: {
				'config-file': '.sass-lint.yaml'
			}
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError());

});

/**
 * Build scripts with transpilers
 * -----------------------------------------------------------------------------
 */

gulp.task('scripts', () => {

	return gulp.src([
		'bower_components/jquery/dist/jquery.min.js'
	])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(size({
			title: 'Size',
			showFiles: true,
			showTotal: false,
		}))
		.pipe(gulp.dest(dirs.srcPath + '/js'));

});

/**
 * Injects styles and scripts
 * -----------------------------------------------------------------------------
 */
gulp.task('injects', () => {

	const injectCss = gulp.src(dirs.srcPath + '/css/*.css', { read: false });
	const injectLibsJs = gulp.src(dirs.srcPath + '/js/libs.min.js', { read: false });
	const injectCommonJs = gulp.src(dirs.srcPath + '/js/common.js', { read: false });

	return gulp.src(dirs.srcPath + '/**/*.html')
		.pipe(inject(series(injectCss, injectLibsJs, injectCommonJs), { relative: true }))
		.pipe(gulp.dest(dirs.srcPath));

});

/**
 * Optimize images
 * -----------------------------------------------------------------------------
 */

gulp.task('images', () => {

	return gulp.src(dirs.srcPath + '/images/**/*.*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5
		}))
		.pipe(gulp.dest(dirs.srcPath + '/images/'))
		.pipe(size({
			title: 'Size',
			showFiles: true,
			showTotal: false,
		}));

});

/**
 * Build sprites
 * -----------------------------------------------------------------------------
 */

gulp.task('sprites', () => {

	var spriteData =
		gulp.src(sprite.src)
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: '_sprites.sass',
				cssFormat: 'sass',
				algorithm: 'top-down',
				padding: 5
			}));
	spriteData.img.pipe(gulp.dest(dirs.srcPath + '/images/'));
	spriteData.css.pipe(gulp.dest(dirs.srcPath + '/sass/helpers/'));

});

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('del', () => {

	return del.sync('build');

});

/**
 * Clear cashe
 * -----------------------------------------------------------------------------
 */

gulp.task('clear', () => {

	return cache.clearAll();

});

/**
 * Build task
 * -----------------------------------------------------------------------------
 */

gulp.task('build', ['del', 'sprites', 'styles', 'scripts', 'images', 'sass-lint'], () => {

	const buildCss = gulp.src(dirs.srcPath + '/css/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/css'));

	const buildFonts = gulp.src(dirs.srcPath + '/fonts/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/fonts'));

	const buildJs = gulp.src(dirs.srcPath + '/js/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/js'));

	const buildHtml = gulp.src(dirs.srcPath + '/**/*.html')
		.pipe(gulp.dest(dirs.buildPath));

	const buildImages = gulp.src(dirs.srcPath + '/images/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/images'));

});

/**
 * Watch task
 * -----------------------------------------------------------------------------
 */

gulp.task('watch', ['injects', 'sprites', 'styles', 'sass-lint', 'scripts', 'images', 'server'], () => {

	gulp.watch(dirs.srcPath + '/**/*.html', browserSync.reload);
	gulp.watch(dirs.srcPath + '/sass/**/*.sass', ['styles']);
	gulp.watch(dirs.srcPath + '/js/**/*.js', browserSync.reload);
	gulp.watch(dirs.srcPath + '/images/**/*', browserSync.reload);

});

/**
 * Default task
 * -----------------------------------------------------------------------------
 */

gulp.task('default', ['watch']);
