'use strict';

const gulp = require('gulp');
const imagemin = require('gulp-imagemin');
const pngquant = require('imagemin-pngquant');
const notify = require("gulp-notify");
const plumber = require('gulp-plumber');
const size = require('gulp-size');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Optimize images
 * -----------------------------------------------------------------------------
 */

gulp.task('images', 'minify images', () =>

	gulp.src(dirs.srcPath + '/images/**/*.*')
		.pipe(plumber({
			errorHandler: notify.onError(function (err) {
				return {
					title: 'Error in styles. It would be necessary to correct',
					message: err.message
				};
			})
		}))
		.pipe(imagemin({
			optimizationLevel: 7,
			progressive: true,
			interlaced: true,
			use: [pngquant()] // imagemin-pngquant
		}))
		.pipe(gulp.dest(dirs.srcPath + '/images/'))
		.pipe(size({
			title: 'Size',
			showFiles: true,
			showTotal: false,
		}))

);
