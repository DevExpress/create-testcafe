const gulp         = require('gulp');
const del          = require('del');
const childProcess = require('child_process');

gulp.task('lint', () => {
    const eslint = require('gulp-eslint');

    return gulp
        .src([
            'src/**/*.js',
            'src/**/*.ts',
            'test/**/*.js',
            'Gulpfile.js',
        ])
        .pipe(eslint())
        .pipe(eslint.format())
        .pipe(eslint.failAfterError());
});

gulp.task('clean', () => {
    return del('dist');
});

gulp.task('compile', () => {
    return childProcess.spawn('tsc', { shell: true, stdio: 'inherit' });
});

gulp.task('fast-build', gulp.series('clean', 'compile'));
gulp.task('build', gulp.parallel('lint', 'fast-build'));
