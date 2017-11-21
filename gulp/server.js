'use strict';

const browserSync = require('browser-sync');
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
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', 'start server & open browser', () =>

	browserSync({
		server: {
			baseDir: dirs.srcPath
		},
		logPrefix: "gulp-optimized-template",
		port: 8080,
		startPath: 'index.html',
		notify: false
	})

);
