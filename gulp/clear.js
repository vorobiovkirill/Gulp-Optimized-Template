'use strict';

const gulp = require('gulp');
const cache = require('gulp-cache');

/**
 * Clear cashe
 * -----------------------------------------------------------------------------
 */

gulp.task('clear', + 'Clear Cache', () =>
	cache.clearAll()
);
