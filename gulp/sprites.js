'use strict';

const gulp = require('gulp');
const spritesmith = require('gulp.spritesmith');

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

const sprite = {
	src: dirs.srcPath + '/images/sprites/*.*',
	img: dirs.srcPath + '/images/',
	css: dirs.srcPath + '/sass/helpers/'
};

/**
 * Build sprites
 * -----------------------------------------------------------------------------
 */

gulp.task('sprites', 'generate sprites', () => {

	const spriteSrc = gulp.src(sprite.src)
		.pipe(spritesmith({
			imgName: 'sprite.png',
			cssName: '_sprites.sass',
			cssFormat: 'sass',
			algorithm: 'top-down',
			padding: 5
		}));
	spriteSrc.img
		.pipe(gulp.dest(sprite.img));
	spriteSrc.css
		.pipe(gulp.dest(sprite.css));

});
