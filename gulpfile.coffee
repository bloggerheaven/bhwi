autoprefixer = require 'autoprefixer'
cssnano = require 'gulp-cssnano'
gulp = require 'gulp'
gutil = require 'gulp-util'
rename = require 'gulp-rename'
postcss = require 'gulp-postcss'
sass = require 'gulp-sass'
ts = require 'gulp-typescript'
uglify = require 'gulp-uglify'

helpers =
  do: (env, truthy, falsy = gutil.noop()) ->
    if gutil.env.type is env then truthy else falsy

paths =
  ts: './src/*.ts'
  scss: './src/*.scss'
  dist: './dist/'
  tmp: './tmp/'
  finalDest: -> helpers.do 'production', paths.dist, paths.tmp

gulp.task 'scss', ->
  gulp.src paths.scss
  .pipe sass 'error', sass.logError
  .pipe postcss [autoprefixer(browsers: ['last 2 versions'])]
  .pipe helpers.do 'production', cssnano()
  .pipe helpers.do 'production', rename extname: '.min.css'
  .pipe gulp.dest paths.finalDest

gulp.task 'ts', ->
  gulp.src paths.ts
  .pipe ts noImplicitAny: true, out: helpers.do 'production', 'bhwi.min.js', 'bhwi.js'
  .pipe helpers.do 'production', uglify()
  .pipe gulp.dest paths.finalDest

gulp.task 'compile', ['scss', 'ts']

gulp.task 'watch', ->
  gulp.watch [paths.ts], ['ts']
  gulp.watch [paths.scss], ['scss']

gulp.task 'default', ['watch']
