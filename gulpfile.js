'use strict'

/**
 * Dependencies
 * -----------------------------------------------------------------------------
 */

const browserSync  = require('browser-sync');
const del          = require('del');
const gulp         = require('gulp');
const autoprefixer = require('gulp-autoprefixer');
const cleanCSS     = require('gulp-clean-css');
const combineMq    = require('gulp-combine-mq');
const concat       = require('gulp-concat');
const csscomb 		 = require('gulp-csscomb');
const notify       = require("gulp-notify");
const plumber      = require('gulp-plumber');
const rename       = require('gulp-rename');
const size         = require('gulp-size');
const sass         = require('gulp-sass');
const sourcemaps   = require('gulp-sourcemaps');
const spritesmith  = require('gulp.spritesmith');
const uglify       = require('gulp-uglify');

/**
 * Local dev server with live reload
 * -----------------------------------------------------------------------------
 */

gulp.task('server', function() {

	browserSync({
		server: {
			baseDir: 'src'
		},
		logPrefix: "optimizedtemplate",
		port: 8080,
		startPath: 'index.html',
		notify: false
	});

});

/**
 * Build styles with pre-processors and post-processors
 * -----------------------------------------------------------------------------
 */

gulp.task('styles', function() {

	return gulp.src('src/sass/**/*.sass')
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Error in styles. It would be necessary to correct',
				message: err.message
			};
		})
	}))
	.pipe(sass())
	.pipe(autoprefixer(['last 15 versions']))
	.pipe(csscomb())
	.pipe(cleanCSS())
	.pipe(rename({suffix: '.min', prefix : ''}))
	.pipe(sourcemaps.write('./maps'))
	.pipe(size({
		title: 'Размер',
		showFiles: true,
		showTotal: false,
	}))
	.pipe(gulp.dest('src/css'))
	.pipe(browserSync.reload({stream: true}));
});

/**
 * Build scripts with transpilers
 * -----------------------------------------------------------------------------
 */

gulp.task('scripts', function() {

	return gulp.src([
		'bower_components/jquery/dist/jquery.min.js',
		])
		.pipe(concat('libs.min.js'))
		.pipe(uglify())
		.pipe(gulp.dest('src/js'));

	});


/**
 * Build sprites
 * -----------------------------------------------------------------------------
 */

gulp.task('sprite', function() {
	var spriteData =
				gulp.src('./images/sprites/*.*')
				.pipe(spritesmith({
					imgName: 'sprite.png',
					cssName: 'sprite.css',
					cssFormat: 'css',
					algorithm: 'top-down',
					padding: 5
				}));
		spriteData.img.pipe(gulp.dest('./images/sprites/'));
		spriteData.css.pipe(gulp.dest('./images/sprites/'));
	});

/**
 * Remove build directory
 * -----------------------------------------------------------------------------
 */
gulp.task('clean', function() {

	return del.sync('build');

});

// // =========================================
// Создаем задачу для финальной сборки проекта
// // =========================================
gulp.task('build', ['clean', 'styles', 'scripts'], function() {

	var buildCss = gulp.src('src/css/**/*')
	.pipe(gulp.dest('build/css'));

	var buildFonts = gulp.src('src/fonts/**/*')
	.pipe(gulp.dest('build/fonts'));

	var buildJs = gulp.src('src/js/**/*')
	.pipe(gulp.dest('build/js'));

	var buildHtml = gulp.src('src/*.html')
	.pipe(gulp.dest('build'));

	var buildImages = gulp.src('src/images/**/*')
	.pipe(gulp.dest('build/images'));

	var buildImg = gulp.src('src/img/**/*')
	.pipe(gulp.dest('build/img'));

});

/**
 * Watch task
 * -----------------------------------------------------------------------------
 */
gulp.task('watch', ['styles', 'scripts', 'server'], function() {

	gulp.watch('src/sass/**/*.sass', ['styles']);
	gulp.watch('src/libs/**/*.js', ['scripts']);
	gulp.watch('src/js/**/*.js').on("change", browserSync.reload);
	gulp.watch('src/*.html').on("change", browserSync.reload);

});

/**
 * Default task
 * -----------------------------------------------------------------------------
 */
gulp.task('default', ['watch']); // Дефолтная задача запускающаяя слежение
