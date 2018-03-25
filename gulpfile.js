var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");

gulp.task('default', function () {
  gulp.src('./img/*.jpg')
    .pipe(imageResize({
      height : 248,
    }))
    .pipe(rename(function(path) { path.basename += "-thumbnail"; }))
    .pipe(gulp.dest('./img/test/'));
});
