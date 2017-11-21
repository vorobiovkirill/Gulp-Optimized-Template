'use strict';

const gulp = require('gulp');
const inject = require('gulp-inject');
const series = require('stream-series');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Injects styles and scripts
 * -----------------------------------------------------------------------------
 */

gulp.task('injects', 'injecting css and js files to index.html', () => {

	const injectCss = gulp.src(dirs.srcPath + '/css/*.css', { read: false });
	const injectLibsJs = gulp.src(dirs.srcPath + '/js/libs.min.js', { read: false });
	const injectCommonJs = gulp.src(dirs.srcPath + '/js/common.js', { read: false });

	return gulp.src(dirs.srcPath + '/**/*.html')
		.pipe(inject(series(injectCss, injectLibsJs, injectCommonJs), { relative: true }))
		.pipe(gulp.dest(dirs.srcPath));

});
