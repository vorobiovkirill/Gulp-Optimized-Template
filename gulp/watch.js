'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
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
 * Watch task
 * -----------------------------------------------------------------------------
 */

gulp.task('watch', ['injects', 'sprites', 'styles', 'sass-lint', 'scripts', 'server'], () => {

	gulp.watch(dirs.srcPath + '/**/*.html', reload);
	gulp.watch(dirs.srcPath + '/sass/**/*.sass', ['styles']);
	gulp.watch(dirs.srcPath + '/js/**/*.js', reload);
	gulp.watch(dirs.srcPath + '/images/**/*', reload);

});
