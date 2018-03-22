var gulp = require('gulp'),
    sass = require('gulp-sass'),
    browserSync = require('browser-sync'),
    del = require('del'),
    imagemin = require('gulp-imagemin'), 
    pngquant = require('imagemin-pngquant'),
    cache = require('gulp-cache'),
    autoprefixer = require('gulp-autoprefixer');

gulp.task('sass', function(){ 
  return gulp.src('src/sass/**/*.sass')
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError)) 
    .pipe(autoprefixer({
      browsers: ['last 2 versions'],
      cascade: false
    }))
    .pipe(gulp.dest('src/css')) 
    .pipe(browserSync.reload({
      stream: true
    })) 
  });

gulp.task('browser-sync', function() {
  browserSync({ 
    server: { 
      baseDir: 'src' 
    },
    notify: false 
  });
});

gulp.task('watch', ['browser-sync', 'sass'], function() {
  gulp.watch('src/sass/**/*.sass', ['sass']);
  gulp.watch('src/*.html', browserSync.reload);
});

gulp.task('img', function() {
  return gulp.src('src/img/**/*')
    .pipe(cache(imagemin({ 
      interlaced: true,
      progressive: true,
      svgoPlugins: [{
        removeViewBox: false
      }],
      use: [pngquant()]
    })))
    .pipe(gulp.dest('dist/img'));
});

gulp.task('clean', function() {
  return del.sync('dist');
});

gulp.task('build', ['clean', 'img', 'sass'], function() {
  var buildCss = gulp.src([
      'src/css/main.css',
      'src/css/libs.min.css'
    ])
    .pipe(gulp.dest('dist/css'));

  var buildHtml = gulp.src('src/*.html')
    .pipe(gulp.dest('dist'));
});

gulp.task('clear', function () {
  return cache.clearAll();
})

gulp.task('default', ['watch']);
