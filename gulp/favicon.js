'use strict';

const gulp = require('gulp');
const favicons = require("gulp-favicons");

/**
 * Path
 * -----------------------------------------------------------------------------
 */

const dirs = {
	buildPath: './dist/',
	srcPath: './src/'
};

/**
 * Generate Favicon
 * -----------------------------------------------------------------------------
 */

gulp.task('favicon', + 'generate favicons', () =>

	gulp.src(dirs.srcPath + '/images/favicon.png')
		.pipe(favicons({
			appName: "Gulp Optimized Template",
			appDescription: "Gulp Optimized Template",
			developerName: 'vorobiov_k',
			developerURL: "http://localhost:8080/",
			background: "#000000",
			path: "/images/favicon/",
			url: '/',
			display: "standalone",
			orientation: "portrait",
			start_url: "/?homescreen=1",
			version: 1.0,
			logging: false,
			online: false,
			html: "index.html",
			replace: true,
			pipeHTML: true,
			icons: {
				android: false, // create Android homescreen icon
				appleIcon: false, // create Apple touch icons
				appleStartup: false, // create Apple startup images
				coast: false, // create Opera Coast icon
				favicons: true, // create regular favicons
				firefox: false, // create Firefox OS icons
				opengraph: true, // create Facebook OpenGraph image
				twitter: true, // create Twitter Summary Card image
				windows: false, // create Windows 8 tile icons
				yandex: false // create Yandex browser icon
			}
		}))
		.pipe(gulp.dest(dirs.srcPath + '/images/favicon/'))

);
