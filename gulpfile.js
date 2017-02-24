"use strict"

// // ============================================
// // Подключаем/регистрируем GULP пакеты/модули
// // ============================================
const gulp         = require('gulp'), // Подключаем Gulp
			sass         = require('gulp-sass'), //Подключаем Sass пакет,
			browserSync  = require('browser-sync'), // Подключаем Browser Sync
			concat       = require('gulp-concat'), // Подключаем gulp-concat (для конкатенации файлов)
			uglify       = require('gulp-uglify'), // Подключаем gulp-uglify (для сжатия JS)
			cleanCSS     = require('gulp-clean-css'), // Подключаем пакет для минификации CSS
			rename       = require('gulp-rename'), // Подключаем библиотеку для переименования файлов
			del          = require('del'), // Подключаем библиотеку для удаления файлов и папок
			cache        = require('gulp-cache'), // Подключаем библиотеку кеширования
			autoprefixer = require('gulp-autoprefixer'), // Подключаем библиотеку для автоматического добавления префиксов
			csscomb 		 = require('gulp-csscomb'), // Подключаем библиотеку для сортировки css свойств
			notify       = require("gulp-notify"), // Подключаем обработчик ошибок Notify
			plumber      = require('gulp-plumber'), // Подключаем Plumber
			sourcemaps   = require('gulp-sourcemaps'), // Подключаем SourceMaps
			size         = require('gulp-size'), // Подключаем Size
			spritesmith  = require('gulp.spritesmith'), //Подключаем генератор спрайтов,
			combineMq    = require('gulp-combine-mq'); //Подключаем комбинатрор медиа правил

// // ==========================================================
// Создаем задачу для browserSync (Обновление без перезагрузки)
// // ==========================================================
gulp.task('browser-sync', function() {

	browserSync({ // Выполняем browserSync
		server: { // Определяем параметры сервера
			baseDir: 'src' // Директория для сервера - src
		},
		logPrefix: "optimizedtemplate",
		port: 8080,
		startPath: 'index.html',
		notify: false // Отключаем уведомления
	});

});

// // ======================
// Создаем задачу для SASS
// // ======================
gulp.task('styles', function() {

	return gulp.src('src/sass/**/*.sass') // Берем все файлы с расширением sass
	.pipe(plumber({
		errorHandler: notify.onError(function(err) {
			return {
				title: 'Error in styles. It would be necessary to correct',
				message: err.message
			};
		})
	}))
	.pipe(sass()) // Преобразуем Sass/Bourbon/Neat в CSS посредством gulp-sass
	.pipe(autoprefixer(['last 15 versions'])) // добавляем вендорные префиксы
	.pipe(csscomb()) // Сортировка css свойств
	.pipe(cleanCSS()) // Минимифицируем CSS
	.pipe(rename({suffix: '.min', prefix : ''})) // Добавляем к файлу суфикс .min
	.pipe(sourcemaps.write('./maps')) // Записываем карту кода как отдельный файл
	.pipe(size({
		title: 'Размер',
		showFiles: true,
		showTotal: false,
	}))
	.pipe(gulp.dest('src/css')) // Выгружаем результата в папку src/css
	.pipe(browserSync.reload({stream: true})) // Обновляем CSS на странице при изменении
});

// // ===================================================
// Создаем задачу js скриптов (сборка/сжимание/выгрузка)
// // ===================================================
gulp.task('scripts', function() {

	return gulp.src([ // Берем все необходимые библиотеки
		'bower_components/jquery/dist/jquery.min.js', // Берем jQuery
		// сюда через заяпятую перечисляем все библиотеки
		])
		.pipe(concat('libs.min.js')) // Собираем их в кучу в новом файле libs.min.js
		.pipe(uglify()) // Сжимаем JS файл
		.pipe(gulp.dest('src/js')); // Выгружаем в папку src/js

	});


// // ===============
// Sprite задача
// // ===============
gulp.task('sprite', function() {
	var spriteData =
				gulp.src('./images/sprites/*.*') // путь, откуда берем картинки для спрайта
				.pipe(spritesmith({
					imgName: 'sprite.png',
					cssName: 'sprite.css',
					cssFormat: 'css',
					algorithm: 'top-down',
					padding: 5
				}));
		spriteData.img.pipe(gulp.dest('./images/sprites/')); // путь, куда сохраняем картинку
		spriteData.css.pipe(gulp.dest('./images/sprites/')); // путь, куда сохраняем стили
	});

// // =============================
// Создаем задачу для очистки кеша
// // =============================
gulp.task('clearcache', function (callback) {

	return cache.clearAll();

});

// // ========================
// Создаем задачу для очистки
// // ========================
gulp.task('removebuild', function() {

	return del.sync('build'); // Удаляем папку build перед сборкой

});

// // =========================================
// Создаем задачу для финальной сборки проекта
// // =========================================
gulp.task('build', ['removebuild', 'styles', 'scripts'], function() {

	var buildCss = gulp.src('src/css/**/*')
	.pipe(gulp.dest('build/css')) // Переносим css в build

	var buildFonts = gulp.src('src/fonts/**/*') // Переносим шрифты в build
	.pipe(gulp.dest('build/fonts'))

	var buildJs = gulp.src('src/js/**/*') // Переносим скрипты в build
	.pipe(gulp.dest('build/js'))

	var buildHtml = gulp.src('src/*.html') // Переносим HTML в build
	.pipe(gulp.dest('build'))

	var buildImages = gulp.src('src/images/**/*') // Переносим images в build
	.pipe(gulp.dest('build/images'))

	var buildImg = gulp.src('src/img/**/*') // Переносим img в build
	.pipe(gulp.dest('build/img'));

});

// // ========================================
// Создаем задачу для слежения за изменениями
// // ========================================
//
gulp.task('watch', ['styles', 'scripts', 'browser-sync'], function() {

	gulp.watch('src/sass/**/*.sass', ['styles']); // Наблюдение за sass файлами в папке sass
	gulp.watch('src/libs/**/*.js', ['scripts']); // Наблюдение за js файлами в папке libs
	gulp.watch('src/js/**/*.js').on("change", browserSync.reload); // Наблюдение за js файлами в папке js
	gulp.watch('src/*.html').on("change", browserSync.reload); // Наблюдение за html файлами в корне проекта

});

// // ===============
// Дефолтная задача
// // ===============
gulp.task('default', ['watch']); // Дефолтная задача запускающаяя слежение
