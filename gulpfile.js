var gulp = require('gulp');
var sourcemaps = require('gulp-sourcemaps');
var browserSync = require('browser-sync');
var sass        = require('gulp-sass');
var prefix      = require('gulp-autoprefixer');
// var cp          = require('child_process');
var concat = require('gulp-concat');
var uglify = require('gulp-uglify');
var babel = require('gulp-babel');
gulp.task('babel', function(){
  return gulp.src(['app/assets/js/*.jsx'])
    .pipe(babel({
      presets: ['react']
    }))
    .pipe(gulp.dest('app/assets/js'));
  });
gulp.task('scripts', function() {
  return gulp.src(['app/assets/**/*.js'])
  	.pipe(sourcemaps.init())    
    .pipe(concat('main.min.js'))
    .pipe(sourcemaps.write('.'))
    .pipe(gulp.dest('_build/assets/js/'));
});

gulp.task('compress', function() {
  return gulp.src('_build/assets/js/*.js')
    .pipe(uglify())
    .pipe(gulp.dest('.'));
});

gulp.task('rebuild', function () {
    browserSync.reload();
});

gulp.task('browser-sync', ['sass'], function() {
    browserSync({
        server: {
            baseDir: '_build'
        }
    });
});

gulp.task('copy', function(){
  return gulp.src('app/*.html')
  .pipe(gulp.dest('_build'));
})
gulp.task('copyResources', function(){
  return gulp.src('app/resources/*.json')
  .pipe(gulp.dest('_build/resources'));
})

gulp.task('sass', function () {
  gulp.src('app/assets/sass/**/*.sass')
  	.pipe(sourcemaps.init({
  		loadMaps: false,
  		debug: false
  	}))
    .pipe(sass({    
    	includePaths: ['app/assets/sass'],
    	outputStyle: 'nested'
    }).on('error', sass.logError))
    .pipe(prefix(['last 15 versions', '> 1%', 'ie 8', 'ie 7'], { cascade: true }))
    .pipe(sourcemaps.write('/')) 
    .pipe(gulp.dest('_build/assets/css'))
    .pipe(browserSync.reload({stream:true}))
    .pipe(gulp.dest('app/assets/css'))
});

gulp.task('watch', function() {
  gulp.watch(['app/assets/sass/*.sass','app/assets/sass/**/*.sass'], ['sass']);
  gulp.watch(['app/resources/*.json'], ['copyResources']);
  gulp.watch(['app/assets/js/*.jsx'], ['babel']);
  gulp.watch(['app/assets/js/*.js'], ['scripts','compress']);
  gulp.watch(['app/*.html'], ['copy']);
//  gulp.watch(['_jade/*.jade', '_jade/**/**/*.jade'], ['jade']);
  gulp.watch(['_build/*.html'], ['rebuild']);
});

gulp.task('default', ['copy','copyResources', 'scripts', 'watch', 'browser-sync' ]);  