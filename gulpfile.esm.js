import sass from "gulp-sass";
import browserSync from "browser-sync";
import plumber from "gulp-plumber";
import notify from "gulp-notify";
import htmlclean from "gulp-htmlclean";
import concat from "gulp-concat";
import babel from "gulp-babel";
import minimize from "gulp-uglify";
import { src, watch, dest, series, parallel } from "gulp";

browserSync.create();

const css = () => {
  return src("./src/css/*.scss")
    .pipe(
      plumber({
        errorHandler: notify.onError("there is an error in sass file")
      })
    )
    .pipe(sass())
    .pipe(dest("dist/css"))
    .pipe(browserSync.stream());
};

const html = () => {
  return src("./src/html/*.html")
    .pipe(htmlclean())
    .pipe(dest("dist"))
    .pipe(browserSync.reload({ stream: true }));
};

const javascript = () => {
  return src("./src/js/*.js")
    .pipe(
      babel({
        presets: ["@babel/env"]
      })
    )
    .pipe(concat("main.js"))
    .pipe(minimize())
    .pipe(dest("dist"))
    .pipe(browserSync.reload({ stream: true }));
};

const watchServer = () => {
  watch("./src/css/*.scss", css);
  watch("./src/js/*.js", javascript);
  watch("./src/html/*.html", html);
};

const runServer = () => {
  parallel(css, html, javascript);
  browserSync.init({
    server: {
      baseDir: "./dist"
    }
  });
};

const serve = parallel(html, css, javascript, watchServer, runServer);

export default serve;
