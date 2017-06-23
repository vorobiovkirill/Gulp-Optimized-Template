'use strict';

/*
 * Gulp Optimized Template Copyright © 2017, Kirill Vorobyov mishkacod@gmail.com
 * MIT Licensed
 */

/**
 * Dependencies
 * -----------------------------------------------------------------------------
 */

const browserSync = require('browser-sync');
const del = require('del');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cache = require('gulp-cache');
const cleanCSS = require('gulp-clean-css');
const combineMq = require('gulp-combine-mq');
const concat = require('gulp-concat');
const csscomb = require('gulp-csscomb');
const favicons = require("gulp-favicons");
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

const reload = browserSync.reload;

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './build/',
	srcPath: './src/'
};

const sprite = {
	src: './src/images/sprites/*.*'
};


/**
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', () => {

	return browserSync({
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
		.pipe(reload({ stream: true }));

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
		.pipe(gulp.dest(dirs.srcPath + '/js'))
		.pipe(reload({ stream: true }));

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

	const spriteData = gulp.src(sprite.src)
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
 * Generate Favicon
 * -----------------------------------------------------------------------------
 */

gulp.task("favicon", () => {

	return gulp.src(dirs.srcPath + '/images/favicon.png')
		.pipe(favicons({
			appName: "Gulp Optimized Template",
			appDescription: "Gulp Optimized Template",
			developerURL: "http://localhost:8080/",
			background: "#000000",
			path: "/images/favicon/",
			display: "standalone",
			orientation: "portrait",
			start_url: "/?homescreen=1",
			version: 1.0,
			logging: false,
			online: false,
			html: "index.html",
			pipeHTML: true,
			replace: true
		}))
		.pipe(gulp.dest(dirs.srcPath + '/images/favicon/'));
});

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('del', () =>
	del.sync('build')
);

/**
 * Clear cashe
 * -----------------------------------------------------------------------------
 */

gulp.task('clear', () =>
	cache.clearAll()
);

/**
 * Build task
 * -----------------------------------------------------------------------------
 */

gulp.task('build', ['del', 'sprites', 'styles', 'scripts', 'favicon', 'images', 'sass-lint'], () => {

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

gulp.task('watch', ['injects', 'sprites', 'styles', 'sass-lint', 'scripts', 'server'], () => {

	gulp.watch(dirs.srcPath + '/**/*.html', reload);
	gulp.watch(dirs.srcPath + '/sass/**/*.sass', ['styles']);
	gulp.watch(dirs.srcPath + '/js/**/*.js', reload);
	gulp.watch(dirs.srcPath + '/images/**/*', reload);

});

/**
 * Default task
 * -----------------------------------------------------------------------------
 */

gulp.task('default', ['watch']);
