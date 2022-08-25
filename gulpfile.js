const gulp = require('gulp');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
gulp.task('default', function () {
  return gulp.src('./rte/src/*.ts').pipe(tsProject()).pipe(gulp.dest('./dist'));
});
