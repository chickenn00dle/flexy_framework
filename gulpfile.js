var gulp = require('gulp'),
    gutil = require('gulp-util'),
    connect = require('gulp-connect'),
    concat = require('gulp-concat'),
    compass = require('gulp-compass'),
    coffee = require('gulp-coffee'),
    browserify = require('gulp-browserify');

var env,
    coffeeSources,
    jsSources,
    sassSources,
    htmlSources,
    jsonSources,
    sassStyle,
    outputDir;

env = process.env.NODE_ENV || 'development';

if (env === 'development'){
    outputDir = 'builds/development/';
    sassStyle = 'expanded';
} else {
    outputDir = 'builds/production/';
    sassStyle = 'compressed';
}

coffeeSources = ['components/coffee/*.coffee'];
jsSources = ['components/scripts/*.js'];
sassSources = ['components/sass/*.scss'];
htmlSources = [outputDir + '*.html'];
jsonSources = [outputDir + 'js/*.json'];

gulp.task('coffee', function(){
    gulp.src(coffeeSources)
        .pipe(coffee({bare: true})
            .on('error', gutil.log))
        .pipe(gulp.dest('components/scripts'))
});

gulp.task('html', function(){
    gulp.src(htmlSources)
        .pipe(connect.reload())
});

gulp.task('json', function(){
    gulp.src(jsonSources)
        .pipe(connect.reload())
});

gulp.task('js', function(){
    gulp.src(jsSources)
        .pipe(concat('script.js'))
        .pipe(browserify())
        .pipe(gulp.dest(outputDir + 'js'))
        .pipe(connect.reload())
});

gulp.task('compass', function(){
    gulp.src('components/sass/style.scss')
        .pipe(compass({
            sass: 'components/sass',
            image: outputDir + 'img',
            style: sassStyle
        })
            .on('error', gutil.log))
        .pipe(gulp.dest(outputDir + 'css'))
        .pipe(connect.reload())
});

gulp.task('connect', function(){
    connect.server({
        root: outputDir,
        livereload: true
    });
});

gulp.task('watch', function(){
    gulp.watch(coffeeSources, ['coffee']);
    gulp.watch(jsSources, ['js']);
    gulp.watch(sassSources, ['compass']);
    gulp.watch(htmlSources, ['html']);
    gulp.watch(jsonSources, ['json']);
});

gulp.task('default', ['html', 'json', 'coffee', 'js', 'compass', 'connect', 'watch']);
