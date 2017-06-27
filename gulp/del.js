'use strict';

const del = require('del');
const gulp = require('gulp');

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
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('del', () =>
	del.sync('build')
);
