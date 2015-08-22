import gulp from 'gulp';
import babel from 'gulp-babel';
import rename from 'gulp-rename';


let [SRC, DST] = ['src', 'dist'];

gulp.task('build', () => {
  let clean = (path) => {
    path.basename = path.basename.replace('.es6', '');
    return path;
  };

  return gulp.src([`${SRC}/**/*.es6.js`, `!${SRC}/**/*.spec.es6.js`])
    .pipe(babel())
    .pipe(rename(clean))
    .pipe(gulp.dest(DST))
});


gulp.task('default', gulp.series('build'));