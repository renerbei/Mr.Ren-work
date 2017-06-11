var gulp = require("gulp")
var uglify = require('gulp-uglify');
var minify = require('gulp-minify-css');
var htmlmin = require('gulp-htmlmin');
var concat = require('gulp-concat');
var sass = require('gulp-sass');
var webserver = require('gulp-webserver'); //web服务热启动
var browserify = require('gulp-browserify');//模块的打包
var url = require("url")
var rev = require('gulp-rev'); //- 对文件名加MD5后缀
var revCollector = require('gulp-rev-collector'); //- 路径替换




gulp.task("htmlmin",()=>{
	gulp.src("./write/html/*.html")
	.pipe(htmlmin({ collapseWhitespace: true }))
	.pipe(gulp.dest("./read/new/html/"))
})
gulp.task("minify",()=>{
	gulp.src("./write/css/*.css")
	.pipe(minify())
	.pipe(rev())
	.pipe(gulp.dest("./read/new/css/"))
	.pipe(rev.manifest()) //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev/css')); //将re-manifest.json存放到的路径
})
gulp.task("uglify",()=>{
	gulp.src("./write/js/*.js")
	.pipe(uglify())
	.pipe(rev())
	.pipe(gulp.dest("./read/new/js/"))
	.pipe(rev.manifest()) //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev/js')); //将re-manifest.json存放到的路径
})
gulp.task("sass",()=>{
	gulp.src("./write/css/*.sass")
	.pipe(sass())
	.pipe(minify())
	.pipe(rev())
	.pipe(gulp.dest("./read/new/css/"))
	.pipe(rev.manifest()) //- 生成一个rev-manifest.json
    .pipe(gulp.dest('./rev/css')); //将re-manifest.json存放到的路径
})


gulp.task("replace",["minify","uglify","sass"],()=>{
	setTimeout(function() {
        gulp.src(['./rev/**/*.json', './read/new/html/*.html']) //- 读取 rev-manifest.json 文件以及需要进行css名替换的文件
            .pipe(revCollector({
                replaceReved: true,
                dirReplacements: {
                    'css': 'css/',
                    'js': 'js/',
                }
            })) //- 执行文件内css名的替换
            .pipe(gulp.dest('./read/new/html/')); //- 替换后的文件输出的目录
    }, 2000)
})