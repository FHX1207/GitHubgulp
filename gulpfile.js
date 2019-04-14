const gulp=require("gulp");
const sass=require("gulp-sass");
const server=require("gulp-webserver");
const babel=require("gulp-babel");
const minCss=require("gulp-clean-css");
const htmlmin=require("gulp-htmlmin");
const uglify=require("gulp-uglify");
let data=require("./data/infor.json");
let lists=require("./data/list.json");
let fs=require("fs");
let url=require("url");
let path=require("path");
//开发环境
gulp.task("devSass",()=>{
    return gulp.src("./src/sass/**/*.scss")
    .pipe(sass())
    .pipe(gulp.dest("./src/css/"))
})
gulp.task("devJs",()=>{
    return gulp.src("./src/js/**/*.js")
    .pipe(babel({
        presets: ['env']
    }))
    .pipe(gulp.dest("./build/js"))
})
gulp.task("devServer",()=>{
    return gulp.src("./src/")
    .pipe(server({
        port:9090,
        livereload:true,
        open:true,
      
        proxies:[
            {source:"/home",target:"http://localhost:3000/home"}
        ]

    }))
    
})
gulp.task("backweb",()=>{
    return gulp.src(".")
    .pipe(server({
        port:3000,
        middleware:(req,res,next)=>{
            let {pathname,query}=url.parse(req.url,true);
            res.setHeader("content-type","application/json");
            if(pathname=="/home/"){
                res.end("2222")
            }
        }
    }))
})

gulp.task("watch",()=>{
    gulp.watch(["./src/sass/**/*.scss","./src/js/**/*.js"],gulp.series("devSass","devJs"))
})
gulp.task("default",gulp.series("devSass","devJs","devServer","watch"))

//线上环境
gulp.task("zipJs",()=>{
    return gulp.src("./src/js/")
    .pipe(uglify())
    .pipe(gulp.dest("./build/js"))
})

gulp.task("zipHtml",()=>{
    return gulp.src("./src/index.html")
    .pipe(htmlmin())
    .pipe(gulp.dest("./build/"))
})
gulp.task("zipCss",()=>{
    return gulp.src("./src/css/index.css")
    .pipe(minCss())
    .pipe(gulp.dest("./build/css/"))
})

gulp.task("build",gulp.parallel("zipJs","zipCss","zipHtml"))



