var gulp = require('gulp'),
  runSequence = require('run-sequence'),
  rimraf = require('rimraf').sync,
  requireDir = require('require-dir'),
  browser = require('browser-sync'),
  config = require('./gulp/01-config');

requireDir('./gulp');



/**
 * Gulp task build:all.
 * Calls build:foundation and build:standalone.
 */
gulp.task('build:all', function(cb) {
    runSequence('build:foundation', 'build:standalone', cb);
});

/**
 * Gulp task build:foundation.
 * Calls js:foundation and css:foundation.
 */
gulp.task('build:foundation', gulp.parallel('js:foundation', 'css:foundation'));

/**
 * Gulp task build:standalone.
 * Calls js:standalone and css:standalone.
 */
gulp.task('build:standalone', gulp.parallel('js:standalone', 'css:standalone'));

/**
 * Gulp task dist.
 * Copies the built files into the dist folder.
 */
gulp.task('dist', gulp.series(gulp.parallel('js:min', 'css:min'), function() {
  // uninified files
  return gulp.src([config.buildPath + 'assets/*'])
    .pipe(gulp.dest(config.destPath));
}));

/**
 * Gulp task watch.
 * Watch files for changes and reloads the browser.
 */
gulp.task('watch', function() {
  gulp.watch('./js/**/*', [[['js:foundation'], 'js:standalone'], browser.reload]);
  gulp.watch('./scss/**/*', [[['css:foundation'], 'css:standalone'], browser.reload]);
  gulp.watch('./test/visual/*.html', [browser.reload]);
});

/**
 * Gulp task serve.
 * Starts a BrowerSync instance.
 */
gulp.task('serve', gulp.series('build:all', function() {
  browser.init({
    server: {
      baseDir: './test/visual',
      routes: {
        "/assets": "_build/assets",
        "/jquery": "node_modules/jquery",
        "/foundation-sites": "node_modules/foundation-sites",
        "/what-input": "node_modules/what-input"
      }
    }
  });
}));

/**
 * Gulp task default.
 * Calls build:all.
 */
gulp.task('default', gulp.series('serve', 'watch'));

/**
 * Gulp task clean.
 * Deletes the build folder.
 */
gulp.task('clean', function () {
  rimraf(config.buildPath);
});
