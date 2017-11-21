'use strict';

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
 * Build task
 * -----------------------------------------------------------------------------
 */

gulp.task('build', ['del', 'clear', 'favicon', 'sprites', 'images', 'styles', 'sass-lint', 'libs', 'scripts'], () => {

	const buildCss = gulp.src(dirs.srcPath + '/css/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/css'));

	const buildFonts = gulp.src(dirs.srcPath + '/fonts/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/fonts'));

	const buildJs = gulp.src(dirs.srcPath + '/js/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/js'));

	const buildHtml = gulp.src(dirs.srcPath + '/**/*.html')
		.pipe(gulp.dest(dirs.buildPath));

	const buildImages = gulp.src(dirs.srcPath + '/images/**/*')
		.pipe(gulp.dest(dirs.buildPath + '/images'));

});
