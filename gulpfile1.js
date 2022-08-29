const gulp = require('gulp');
const ts = require('gulp-typescript');
// const stylus = require('gulp-stylus');
// const uglify = require('gulp-uglify');
const React = require('react');
// const reactDom = require('react-dom');
const rollup = require('gulp-rollup');
// const venus = require('@contentstack/venus-components');
// const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const sourcemaps = require('gulp-sourcemaps');
const tsProject = ts.createProject('tsconfig.json');
const jsImport = require('gulp-js-import');

// gulp.task('css-merge', function () {
//   return gulp.src('')
// })


gulp.task('import', function() {
  return gulp.src('./tmp/index.js')
        .pipe(jsImport({hideConsole: true}))
        .pipe(gulp.dest('dist'));
});

gulp.task('compile', function () {
  var result = gulp.src('rte/src/**/*{ts,tsx}')
   .pipe(tsProject())
  return result.js.pipe(gulp.dest('tmp'));
 });


 gulp.task('minify-css', () => {
  return gulp.src('rte/src/*.css')
    .pipe(cleanCSS({compatibility: 'ie8'}))
    .pipe(gulp.dest('tmp'));
});


//  gulp.task('pack-css', function () {    
//   return gulp.src(['assets/css/main.css', 'assets/css/custom.css'])
//       .pipe(concat('stylesheet.css'))
//       .pipe(cleanCss())
//  .pipe(gulp.dest('public/build/css'));
// });


gulp.task('js-merge', function () {
  return gulp
    .src(['./tmp/index.js'])
    .pipe(
      rollup({
        input: './tmp/index.js',
        output: {
          file: 'bundle.js',
          format: 'cjs',
        },
      })
    )
    .pipe(gulp.dest('./dist'));
});

gulp.task('watch', function () {
  gulp.watch(['dist/*', 'rte/src/*'], gulp.series('default'));
});
// gulp.task('build', gulp.series('tsToJs', 'rollup'));
gulp.task('default', gulp.series('minify-css','compile','js-merge'));
