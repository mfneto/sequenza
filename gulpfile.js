var objDep = {
  gulp: require('gulp'),
  autoprefixer: require('gulp-autoprefixer'),
  connect: require('gulp-connect'),
  streamqueue: require('streamqueue'),
  sass: require('gulp-sass'),
  clean: require('gulp-clean'),
  cleancss: require('gulp-clean-css'),
  concat: require('gulp-concat'),
  concatcss: require('gulp-concat-css'),
  es: require('event-stream'),
  rename: require('gulp-rename'),
  runsequence: require('run-sequence'),
  plumber: require('gulp-plumber'),
  uglify: require('gulp-uglify'),
  sourcemaps: require('gulp-sourcemaps'),
  util: require('gulp-util')
};

with (objDep) {
  //app server teste
  gulp.task('connect', function () {
    connect.server({
      root: 'dist/',
      port: 8888
    });
  });

  //compile routine's
  var objModules = [
    {
      name: 'app',
      cwd: './app'
    }];

  var objLibsJs = ['./bower_components/jquery/dist/jquery.js',
    './bower_components/angular/angular.js',
    './bower_components/angular-route/angular-route.js',
    './bower_components/angular-animate/angular-animate.js',
    './bower_components/bootstrap/dist/js/bootstrap.js',
    './bower_components/angular-bootstrap/ui-bootstrap.min.js',
    './bower_components/angular-confirm/dist/angular-confirm.min.js',
    './bower_components/angular-block-ui/dist/angular-block-ui.min.js',
    './node_modules/ng-table/bundles/ng-table.min.js'];

  var objLibsCss = ['./bower_components/bootstrap/dist/css/bootstrap.css',
    './bower_components/font-awesome/css/font-awesome.css',
    './bower_components/animate.css/animate.css',
    './bower_components/angular-bootstrap/ui-bootstrap-csp.css',
    './bower_components/angular-confirm/dist/angular-confirm.min.css',
    './bower_components/angular-block-ui/dist/angular-block-ui.min.css',
    './node_modules/ng-table/bundles/ng-table.min.css'];

  gulp.task('run', function (callback) {
    util.log();
    util.log(util.colors.cyan('======================================================='));
    util.log(util.colors.cyan('==  BUILD AND RUN ===> SEQUENZA PROJECT =='));
    util.log(util.colors.cyan('======================================================='));
    util.log();

    runsequence(
      'clean',
      ['build'],
      'connect',
      callback
    );
  });

  gulp.task('build', function (callback) {
    util.log();
    util.log(util.colors.cyan('======================================================='));
    util.log(util.colors.cyan('== BUILD SEQUENZA PROJECT =='));
    util.log(util.colors.cyan('======================================================='));
    util.log();

    runsequence(
      'clean',
      ['build-lib-js', 'build-lib-css', 'build-lib-content', 'build-js', 'build-css', 'build-img', 'build-angular-partials', 'build-js-templates', 'build-html-index'],
      callback
    );
  });

  gulp.task('build-html-index', function () {
    return gulp.src('./app/index.html')
      .pipe(gulp.dest('./dist'));
  });

  gulp.task('build-angular-partials', function () {
    return gulp.src('./app/partials/*')
      .pipe(gulp.dest('./dist/partials'));
  });
  
  gulp.task('build-lib-js', function () {
    return gulp.src(objLibsJs)
      .pipe(gulp.dest('./dist/lib/js'));
  });

  gulp.task('build-img', function () {
    return gulp.src('./app/img/*')
      .pipe(gulp.dest('./dist/img'));
  });

  gulp.task('build-lib-content', function () {
    return gulp.src(['./bower_components/bootstrap/dist/fonts/*'])
      .pipe(gulp.dest('./dist/lib/fonts'));
  });

  gulp.task('build-lib-css', function () {
    return gulp.src(objLibsCss)
      .pipe(gulp.dest('./dist/lib/css'));
  });

  gulp.task('build-css', function () {
    var arrTasks = objModules.map(function (module) {
      return streamqueue({ objectMode: true },
        gulp.src(['./**/*.css'], { cwd: module.cwd }),
        gulp.src(['./**/*.scss'], { cwd: module.cwd })
          .pipe(sass())
      )
        .pipe(autoprefixer({
          remove: false
        }))
        .pipe(concatcss(module.name + '.css', { rebaseUrls: false }))
        .pipe(gulp.dest('./dist/css'))
        .pipe(cleancss({ compatibility: 'ie8' }))
        .pipe(rename({ dirname: '', suffix: '.min' }))
        .pipe(gulp.dest('./dist/css'));
    });
    return es.concat.apply(null, arrTasks);
  });

  gulp.task('build-js', function () {
    var arrTasks = objModules.map(function (module) {
      return streamqueue({ objectMode: true },
        gulp.src(['js/app.module.js',
        'js/block-ui.service.js',
        'js/api.service.js',
        'js/modal.service.js',
        'js/app.module.js',
        'js/input/input.directive.js',
        'js/grid.controller.js',
        'js/customer.controller.js',
        'js/config.js'
        ], { cwd: module.cwd })
      )
        .pipe(plumber())
        .pipe(concat(module.name + '.js'))
        .pipe(sourcemaps.init())
        .pipe(gulp.dest('./dist/js'))
        .pipe(uglify())
        .pipe(rename({ dirname: '', suffix: '.min' }))
        .pipe(sourcemaps.write('./maps'))
        .pipe(gulp.dest('./dist/js'));
    });
    return es.concat.apply(null, arrTasks);
  });

  gulp.task('build-js-templates', function () {
    var arrTasks = objModules.map(function (module) {
      return gulp.src(['js/*.html', 'js/**/*.html'], { cwd: module.cwd })
        .pipe(gulp.dest('./dist/js/templates'))
    });
    return es.concat.apply(null, arrTasks);
  });

  gulp.task('clean', function () {
    return gulp.src('./dist', { read: false }).pipe(clean());
  });
};