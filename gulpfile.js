let gulp = require('gulp');
let babel = require('gulp-babel');
let uglify = require('gulp-uglify');

gulp.task('minify', () => {
  return gulp.src('./jsSrc/**/*.js')
    .pipe(babel({
      presets: ['es2015']
    }))
    .pipe(uglify())
    .pipe(gulp.dest('./js'))
    // [...]
});
