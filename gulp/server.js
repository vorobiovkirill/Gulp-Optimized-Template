'use strict';

const browserSync = require('browser-sync');
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
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', 'start server & open browser', () => {

	return browserSync({
		server: {
			baseDir: dirs.srcPath
		},
		logPrefix: "gulp-optimized-template",
		port: 8080,
		startPath: 'index.html',
		notify: false
	});

});
