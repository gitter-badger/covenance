import gulp from 'gulp';
import babel from 'gulp-babel';


let [SRC, DST] = ['src', '.'];

gulp.task('test', () => {
  throw new Error("Write me!");
});


gulp.task('build', () => {
  return gulp.src([`${SRC}/**/*.es6.js`, `!${SRC}/**/*.spec.es6.js`])
    .pipe(babel())
    .pipe(gulp.dest(DST))
});


gulp.task('default', gulp.series('build', 'test'));