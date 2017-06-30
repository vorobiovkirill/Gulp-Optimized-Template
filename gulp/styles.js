'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS = require('gulp-clean-css');
const combineMq = require('gulp-combine-mq');
const csscomb = require('gulp-csscomb');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const rename = require('gulp-rename');
const size = require('gulp-size');
const sass = require('gulp-sass');
const sourcemaps = require('gulp-sourcemaps');

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
 * Build styles with pre-processors and post-processors
 * -----------------------------------------------------------------------------
 */

gulp.task('styles', 'compile sass to css', () =>

	gulp.src(dirs.srcPath + '/sass/**/*.sass')
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
			basename: 'style',
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
		.pipe(reload({
			stream: true
		}))

);
