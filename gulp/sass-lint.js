'use strict';

const gulp = require('gulp');
const sassLint = require('gulp-sass-lint');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Lint Sass
 * -----------------------------------------------------------------------------
 */

gulp.task('sass-lint', 'linting sass files', () =>

	gulp.src(dirs.srcPath + '/sass/**/*.sass')
		.pipe(sassLint({
			configFile: '../.sass-lint.yml'
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())

);
