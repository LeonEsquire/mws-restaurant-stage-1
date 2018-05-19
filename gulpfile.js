var gulp = require('gulp');
var imageResize = require('gulp-image-resize');
var rename = require("gulp-rename");

gulp.task('default', function () {
  gulp.src('./img/*.jpg')
    .pipe(imageResize({
      width : 400,
    }))
    .pipe(rename(function(path) { path.basename += "_1x"; }))
    .pipe(gulp.dest('./img/1x/'));
});
