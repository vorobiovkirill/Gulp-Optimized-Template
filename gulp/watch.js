'use strict';

const browserSync = require('browser-sync');
const gulp = require('gulp');
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
 * Watch task
 * -----------------------------------------------------------------------------
 */

gulp.task('watch', ['injects', 'sprites', 'styles', 'sass-lint', 'libs', 'scripts', 'server'], () =>

	gulp.watch(dirs.srcPath + '/**/*.html', reload),
	gulp.watch(dirs.srcPath + '/sass/**/*.sass', ['styles']),
	gulp.watch(dirs.srcPath + '/js/**/*.js', reload),
	gulp.watch(dirs.srcPath + '/images/**/*', ['sprites'], reload)

);
