'use strict';

const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');

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
 * Build sprites
 * -----------------------------------------------------------------------------
 */

gulp.task('sprites', 'generate sprites', () => {

	const spriteData = gulp.src(sprite.src)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprites.sass',
			cssFormat: 'sass',
			algorithm: 'top-down',
			padding: 5
		}));
	spriteData.img.pipe(gulp.dest(dirs.srcPath + '/images/'));
	spriteData.css.pipe(gulp.dest(dirs.srcPath + '/sass/helpers/'));

});
