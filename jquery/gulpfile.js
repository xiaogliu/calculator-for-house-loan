// 引入gulp
var gulp = require('gulp');

// 引入依赖模块
var babel = require("gulp-babel");
var uglify = require('gulp-uglify');
var gutil = require('gulp-util');

gulp.task('default', function () {
  return gulp.src('js/main_js.js')
  		.pipe(babel())
      .pipe(uglify())
      .on('error', function (err) { gutil.log(gutil.colors.red('[Error]'), err.toString()); })
      .pipe(gulp.dest('build'))
});
