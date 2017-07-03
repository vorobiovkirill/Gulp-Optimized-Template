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

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('del', () =>
	del.sync('build')
);
