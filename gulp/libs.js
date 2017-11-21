'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const concat = require('gulp-concat');
const size = require('gulp-size');
const uglify = require('gulp-uglify');

const reload = browserSync.reload;

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Build scripts with transpilers
 * -----------------------------------------------------------------------------
 */

gulp.task('libs', 'Concat Libs', () =>

	gulp.src([
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
		.pipe(reload({
			stream: true
		}))

);
