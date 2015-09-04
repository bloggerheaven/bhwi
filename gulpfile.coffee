gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
ts = require 'gulp-typescript'
uglify = require 'gulp-uglify'

paths = {
  src: './src/*.ts'
  dist: './dist/'
  tmp: './tmp/'
}

gulp.task 'compile', ->
  gulp.src paths.src
  .pipe ts noImplicitAny: true, out: 'output.js'
  .js.pipe rename basename: 'bhwi', extname: '.js'
  .pipe gulp.dest paths.tmp


gulp.task 'release', ->
  gulp.src paths.src
  .pipe ts noImplicitAny: true, out: 'output.js'
  .js.pipe uglify()
  .pipe rename basename: 'bhwi', extname: '.min.js'
  .pipe gulp.dest paths.dist

gulp.task 'watch', ->
  gulp.watch [paths.src], ['compile']

gulp.task 'default', ['watch']
