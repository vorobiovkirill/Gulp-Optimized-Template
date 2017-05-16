'use strict';

/*
 * Optimized Template Copyright © 2017, Kirill Vorobyov mishkacod@gmail.com
 * ISC Licensed
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
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');
const spritesmith = require('gulp.spritesmith');
const uglify = require('gulp-uglify');


/**
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', () => {
	// Create and initialize local server
	browserSync.init({
		server: {
			baseDir: 'src'
		},
		logPrefix: "optimizedtemplate",
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

	return gulp.src('src/sass/**/*.sass')
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
		.pipe(autoprefixer(['last 15 versions', '> 1%', 'ie 8']))
		.pipe(csscomb())
		.pipe(cleanCSS())
		.pipe(rename({
			suffix: '.min',
			extname: '.css'
		}))
		.pipe(sourcemaps.write('/'))
		.pipe(size({
			title: 'Размер',
			showFiles: true,
			showTotal: false,
		}))
		.pipe(gulp.dest('src/css'))
		.pipe(browserSync.reload({
			stream: true
		}));
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
		.pipe(gulp.dest('src/js'));
});

/**
 * Optimize images
 * -----------------------------------------------------------------------------
 */

gulp.task('images', () =>

	gulp.src('src/images/**/*')
		.pipe(imagemin({
			interlaced: true,
			progressive: true,
			optimizationLevel: 5
		}))
		.pipe(gulp.dest('src/images/'))
		.pipe(size({
			title: 'Размер',
			showFiles: true,
			showTotal: false,
		}))
);

/**
 * Build sprites
 * -----------------------------------------------------------------------------
 */

gulp.task('sprites', () => {
	var spriteData =
		gulp.src('./src/images/sprites/*.*')
			.pipe(spritesmith({
				imgName: 'sprite.png',
				cssName: '_sprites.sass',
				cssFormat: 'sass',
				algorithm: 'top-down',
				padding: 5
			}));
	spriteData.img.pipe(gulp.dest('./src/images/'));
	spriteData.css.pipe(gulp.dest('./src/sass/helpers/'));
});

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('clean', () => {
	return del.sync('build');
});

/**
 * Build task
 * -----------------------------------------------------------------------------
 */

gulp.task('build', ['clean', 'sprites', 'images', 'styles', 'scripts'], () => {

	const buildCss = gulp.src('src/css/**/*')
		.pipe(gulp.dest('build/css'));

	const buildFonts = gulp.src('src/fonts/**/*')
		.pipe(gulp.dest('build/fonts'));

	const buildJs = gulp.src('src/js/**/*')
		.pipe(gulp.dest('build/js'));

	const buildHtml = gulp.src('src/*.html')
		.pipe(gulp.dest('build'));

	const buildImages = gulp.src('src/images/**/*')
		.pipe(gulp.dest('build/images'));

});

/**
 * Watch task
 * -----------------------------------------------------------------------------
 */

gulp.task('watch', ['images', 'styles', 'scripts', 'server'], () => {
	gulp.watch('src/*.html', browserSync.reload);
	gulp.watch('src/sass/**/*.sass', ['styles']);
	gulp.watch('src/libs/**/*.js', ['scripts']);
	gulp.watch('src/js/**/*.js', browserSync.reload);
	gulp.watch('src/images/**/*', browserSync.reload);
});

/**
 * Default task
 * -----------------------------------------------------------------------------
 */

gulp.task('default', ['watch']);
