const gulp = require('gulp');
const ts = require('gulp-typescript');
const rollup = require('gulp-better-rollup');
const babel = require('rollup-plugin-babel');
const cleanCSS = require('gulp-clean-css');
const resolve = require('rollup-plugin-node-resolve');
const commonjs = require('rollup-plugin-commonjs');
const tsProject = ts.createProject('tsconfig.json');
const inline = require('gulp-inline')
, uglify = require('gulp-uglify');

gulp.task('compile', function () {
  var result = gulp.src('rte/src/**/*{ts,tsx}').pipe(tsProject());
  return result.js.pipe(gulp.dest('tmp'));
});

gulp.task('minify-css', () => {
  return gulp
    .src('rte/src/*.css')
    .pipe(cleanCSS({ compatibility: 'ie8' }))
    .pipe(gulp.dest('tmp'));
});

gulp.task('scripts', () => {
  return gulp
    .src('tmp/*.js').pipe(inline({base: 'tmp/',
    js: function() {
      return uglify({
          mangle: false
      });
    }}))
    .pipe(rollup({ plugins: [babel(), resolve(), commonjs()] }, 'umd'))
    .pipe(gulp.dest('dist/'));
});

gulp.task('default', gulp.series('compile', 'minify-css', 'scripts'));
