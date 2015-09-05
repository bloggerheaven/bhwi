gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
sass = require 'gulp-sass'
ts = require 'gulp-typescript'
uglify = require 'gulp-uglify'

paths = {
  src: './src/*'
  ts: './src/*.ts'
  scss: './src/*.scss'
  dist: './dist/'
  tmp: './tmp/'
}

gulp.task 'scss', ->
  gulp.src paths.scss
  .pipe sass()
  .pipe gulp.dest paths.tmp

gulp.task 'scss:release', ->
  gulp.src paths.scss
  .pipe sass()
  .pipe gulp.dest paths.dist

gulp.task 'ts', ->
  gulp.src paths.ts
  .pipe ts noImplicitAny: true, out: 'output.js'
  .js.pipe rename basename: 'bhwi', extname: '.js'
  .pipe gulp.dest paths.tmp

gulp.task 'ts:release', ->
  gulp.src paths.ts
  .pipe ts noImplicitAny: true, out: 'output.js'
  .js.pipe uglify()
  .pipe rename basename: 'bhwi', extname: '.min.js'
  .pipe gulp.dest paths.dist

gulp.task 'compile', ['scss', 'ts']

gulp.task 'release', ['scss:release', 'ts:release']

gulp.task 'watch', ->
  gulp.watch [paths.ts], ['ts']
  gulp.watch [paths.scss], ['scss']

gulp.task 'default', ['watch']
