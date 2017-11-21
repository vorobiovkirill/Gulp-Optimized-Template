'use strict';

const del = require('del');
const gulp = require('gulp');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */

gulp.task('del', () =>
	del.sync('dist')
);
