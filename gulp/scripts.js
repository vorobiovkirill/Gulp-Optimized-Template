'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
const jshint = require('gulp-jshint');
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

gulp.task('scripts', 'Concat Libs', () =>

	gulp.src([dirs.srcPath + '/js/common.js'])
		.pipe(jshint())
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
