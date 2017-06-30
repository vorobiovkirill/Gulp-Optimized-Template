'use strict';

const gulp = require('gulp');
const sassLint = require('gulp-sass-lint');

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
 * Lint Sass
 * -----------------------------------------------------------------------------
 */

gulp.task('sass-lint', 'linting sass files', () =>

	gulp.src(dirs.srcPath + '/sass/**/*.sass')
		.pipe(sassLint({
			options: {
				'config-file': '.sass-lint.yaml'
			}
		}))
		.pipe(sassLint.format())
		.pipe(sassLint.failOnError())

);
