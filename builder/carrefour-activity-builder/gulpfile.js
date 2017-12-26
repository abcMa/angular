var gulp = require('gulp');
var del = require('del');
var util = require('gulp-util');
var webserver = require('gulp-webserver');
var runSequence = require('run-sequence');
var px2rem = require('gulp-px2rem');
var replace = require('gulp-replace');
var rename = require('gulp-rename');
var uglify = require('gulp-uglify');
var htmlmin = require('gulp-htmlmin');
var cssmin = require('gulp-cssmin');
var fs = require('fs');
var moment = require('moment');

var currentTime = moment().format('YYYYMMDDHHmmss');

// 启动开发服务器
gulp.task('webserver', function () {
    return gulp.src('./.assets')
        .pipe(webserver({
            host: 'localhost',
            port: 8889,
            open: 'index.html',
            livereload: true
        }));
});

// html
gulp.task('html', function () {
    return gulp.src('index.html')
        .pipe(rename('tmp.html'))
        .pipe(htmlmin({collapseWhitespace: true}))
        .pipe(gulp.dest('./.tmp/'));
});

// css
gulp.task('css', function () {
    return gulp.src('index.css')
        // .pipe(px2rem({
        //     rootValue: '16',
        //     replace: true
        // }))
        .pipe(rename('tmp.css'))
        .pipe(cssmin())
        .pipe(gulp.dest('./.tmp/'));
});

// script
gulp.task('script:dev', function () {
    return gulp.src('index.js')
        .pipe(rename('tmp.js'))
        .pipe(gulp.dest('./.tmp/'));
});

gulp.task('script:export', function () {
    return gulp.src('index.js')
        .pipe(uglify({
            mangle: false
        }))
        .pipe(rename('tmp.js'))
        .pipe(gulp.dest('./.tmp/'));
});

// libs
gulp.task('libs', function () {
    return gulp.src(['config.js','./libs/*.*'])
        .pipe(gulp.dest('.assets/libs/'));
});

// resources
gulp.task('resources:dev', function () {
    return gulp.src('./resources/*.*')
        .pipe(gulp.dest('.assets/resources'));
});

gulp.task('resources:export', function () {
    return gulp.src('./resources/*.*')
        .pipe(gulp.dest('./dist' + currentTime + '/resources'));
});

// build
function build(src) {
    return gulp.src(src)
        .pipe(replace('<!-- html-replace -->', fs.readFileSync('./.tmp/tmp.html')))
        .pipe(replace('/* css-replace */', fs.readFileSync('./.tmp/tmp.css')))
        .pipe(replace('/* script-replace */', fs.readFileSync('./.tmp/tmp.js')));
}

gulp.task('build:dev', ['html', 'css', 'script:dev', 'libs', 'resources:dev'], function () {
    return build('./template/dev.html')
        .pipe(rename('index.html'))
        .pipe(gulp.dest('.assets/'));
});

gulp.task('build:export', ['html', 'css', 'script:export', 'resources:export'], function () {
    return build('./template/export.html')
        .pipe(rename('export.html'))
        .pipe(gulp.dest('dist' + currentTime + '/'));
});

gulp.task('watch', function () {
    gulp.watch('*.*', function () {
        runSequence('build:dev');
    });
});

// 清理之前生成的构建文件
gulp.task('clean', function () {
    del.sync(['./.assets/', './.tmp/', './dist/']);

});

// 开发打包
gulp.task('dev', ['clean', 'build:dev', 'watch'], function (done) {
    runSequence('webserver', done);
});

// 输出
gulp.task('export', ['clean', 'build:export'], function () {
    util.log("Export activity to ./dist/ successfully.");
});

// 默认dev
gulp.task('default', ['dev']);
