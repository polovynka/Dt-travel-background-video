import gulp from 'gulp';

import browserSync, { notify } from 'browser-sync';
import sass from 'gulp-dart-sass';
import autoprefixer from 'gulp-autoprefixer';
import clean from 'gulp-clean-css';
import include from 'gulp-file-include';
import concat from 'gulp-concat';
import del from 'del';
import htmlmin from 'gulp-htmlmin';
import terser from 'gulp-terser';
import rename from 'gulp-rename';
import babel from 'gulp-babel';
import imagemin, { gifsicle, mozjpeg, optipng, svgo } from 'gulp-imagemin';
import webp from 'imagemin-webp';



// *HTML

const html = () => {
	return gulp.src('src/*.html')
		.pipe(include({
			prefix: '@@',
			basepath: '@file'
		}))
		.pipe(htmlmin({
			collapseWhitespace: true,
			removeComments: true
		}))
		.pipe(gulp.dest('docs'))
};

// *Styles

const styles = () => {
	return gulp.src('src/sass/*.scss')
		.pipe(sass({ outputStyle: 'compressed' }).on('error', sass.logError))
		.pipe(autoprefixer())
		.pipe(clean({ level: 2 }))
		.pipe(concat('styles.min.css'))
		.pipe(gulp.dest('docs/css'));
};

// *Fonts



const fontsMoving = () => {
	return gulp.src(['src/fonts/*.woff', 'src/fonts/*.woff2'])
		.pipe(gulp.dest('docs/fonts'))
};

// *Scripts

const scripts = () => {
	return gulp.src('src/js/**/*.js')
		.pipe(include())
		.pipe(babel({
			presets: ["@babel/preset-env"]
		}))
		.pipe(terser())
		.pipe(gulp.dest('docs/js'))
};

// *Images

const images = () => {
	return gulp.src('src/images/**/*')
		.pipe(imagemin([
			gifsicle({ interlaced: true }),
			mozjpeg({ quality: 75, progressive: true }),
			optipng({ optimizationLevel: 5 }),
			svgo({
				plugins: [
					{
						name: 'removeViewBox',
						active: true
					},
					{
						name: 'cleanupIDs',
						active: false
					}
				]
			})
		]))
		.pipe(gulp.dest('docs/images'))
};

const imgToWebp = () => {
	return gulp.src(['src/images/**/*.jpg', 'src/images/**/*.png'])
		.pipe(imagemin([
			webp({
				quality: 75
			})
		]))
		.pipe(rename((path) => {
			path.extname = '.webp';
		}))
		.pipe(gulp.dest('docs/images'))
}

// *Browser Sync

const sync = () => {
	browserSync.init({
		server: {
			baseDir: "docs"
		},
		open: false,
		notify: false
	})
	gulp.watch('src/**/*.html', gulp.series(html)).on('change', browserSync.reload)
	gulp.watch('src/sass/**/*.scss', gulp.series(styles)).on('change', browserSync.reload)
	gulp.watch('src/js/**/*.js', gulp.series(scripts)).on('change', browserSync.reload)
	gulp.watch('src/images/**/*', gulp.series(images, imgToWebp)).on('change', browserSync.reload)
};

// *Clear

const clear = () => {
	return del('docs')
};

// *Default export

export default gulp.series(
	clear,
	images,
	imgToWebp,
	scripts,
	styles,
	fontsMoving,
	html,
	sync
)


