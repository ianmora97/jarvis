var gulp        = require('gulp');
var sass        = require('gulp-sass');
var concat      = require('gulp-concat');
var browserSync = require('browser-sync').create();

// Compile sass into CSS & auto-inject into browsers
gulp.task('sass', function() {
    return gulp.src("scss/*.scss")
        .pipe(sass())
        .pipe(gulp.dest("css"))
        .pipe(browserSync.stream());
});

// move animate.css to web/css
gulp.task('animate', function() {
    return gulp.src('node_modules/animate.css/animate.css')
        .pipe(concat('animate.css'))
        .pipe(gulp.dest("css"));
});

// move bootstrap JS and Jquery
gulp.task('js', function() {
    return gulp.src([
            'node_modules/jquery/dist/jquery.min.js',
            'node_modules/bootstrap/dist/js/bootstrap.bundle.min.js'
        ])
        .pipe(concat('jq-bs-bundle.js'))
        .pipe(gulp.dest('js'));
});

// watching scss/html files
gulp.task('serve', gulp.series('sass','js','animate', function() {
    gulp.watch("scss/*.scss", gulp.series('sass'));
}));

gulp.task('default', gulp.series('serve'));