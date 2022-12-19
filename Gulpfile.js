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

gulp.task('compile', () => childProcess.spawn('tsc', { shell: true, stdio: 'inherit' }));

gulp.task('reinstall-package', gulp.series(
    () => childProcess.spawn('npm uninstall -g create-testcafe', { shell: true, stdio: 'inherit' }),
    () => childProcess.spawn('npm i -g', { shell: true, stdio: 'inherit' }),
));

gulp.task('test-mocha', () => {
    const mochaOpts = [
        'test/**/*test.js',
    ];

    return childProcess.spawn(`npx mocha ${ mochaOpts.join(' ') }`, { stdio: 'inherit', shell: true });
});

gulp.task('fast-build', gulp.series('clean', 'compile'));
gulp.task('build', gulp.parallel('lint', 'fast-build'));
gulp.task('test', gulp.series('build', 'reinstall-package', 'test-mocha'));
