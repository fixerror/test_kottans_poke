/**
 * Created by FixError on 16.03.2016.
 */

var gulp = require('gulp');
var plugins = require('gulp-load-plugins')({lazy: true});
var del = require('del');
var bowerFiles = require('main-bower-files');
var config = require('./gulp.config')();
var bowerSync = require('browser-sync');
var es = require('event-stream');
var concat = require('gulp-concat');
var beeper = require('beeper');
var colour = require('colour');
var ghPages = require('gulp-gh-pages');
var cleanCSS = require('gulp-clean-css');
var print = require('gulp-print');
var minifyJS = require('gulp-minify');
var settingsBootstrap = true;

/*===================================================================*/
/*========START LOG ERROR============================================*/
/*===================================================================*/
{
    function onError(error) {
        beeper();
        console.log([
            '',
            '=====ERROR MESSAGE START========'.bold.red.underline,
            ("[" + error.name + " in " + error.plugin + "]").red.bold.inverse,
            error.message,
            '=====ERROR MESSAGE END========'.bold.red.underline,
            ''
        ].join('\n'));
        this.end();
    }
}
/*===================================================================*/
/*========END LOG ERROR==============================================*/
/*===================================================================*/

/*===================================================================*/
/*========START PIPE ================================================*/
/*===================================================================*/
{
    var pipes = {};

    pipes.builtBootstapDev = function () {
        /*
         *  .bootstrap.json ===>
         *  "main": [
         *           "dist/css/bootstrap.css",
         *           "dist/js/bootstrap.js",
         *           "dist/fonts/**"
         *          ]
         *
         *          ||
         *
         *  "main": [
         *           "dist/css/bootstrap.min.css",
         *           "dist/js/bootstrap.min.js",
         *           "dist/fonts/**"
         *          ]
         */
        return gulp.src('./setting/bootstrap/.bower.json')
            .pipe(gulp.dest('./bower_components/bootstrap/'));
    };

    pipes.VendorScripts = function () {
        return plugins.order(['jquery.js', 'angular.js', 'angular-ui-router.js', 'bootstrap.js', 'lodash.js']);
    };

    pipes.validatedAppScripts = function () {
        return gulp.src(config.js.scripts)
            .pipe(plugins.jshint())
            .pipe(plugins.jshint.reporter('jshint-stylish'));
    };

    pipes.builtAppScriptsDev = function () {
        return pipes.validatedAppScripts()
            // .pipe(plugins.ngAnnotate())
            .pipe(plugins.concat('app.js'))
            .pipe(gulp.dest(config.dist.scripts));
    };

    pipes.builtVendorScriptsStyleDev = function () {
        var filterJS = plugins.filter('**/*.js', {restore: true});
        var filterCSS = plugins.filter('**/*.css', {restore: true});
        var filterFonts = plugins.filter(
            ['**/**.otf',
                '**/**.eot',
                '**/**.svg',
                '**/**.ttf',
                '**/**.woff',
                '**/**.woff2'],
            {restore: true});
        return gulp.src(bowerFiles())
            .pipe(plugins.plumber({
                    errorHandler: onError
                }
            ))
            .pipe(filterJS)
            .pipe(gulp.dest(config.dist.dev + '/vendor/js'))
            .pipe(filterJS.restore)
            .pipe(filterCSS)
            .pipe(gulp.dest(config.dist.dev + '/vendor/css'))
            .pipe(filterCSS.restore)
            .pipe(filterFonts)
            .pipe(gulp.dest(config.dist.dev + '/vendor/fonts'))
            .pipe(filterFonts.restore);
    };


    pipes.buildAppStyleCssDev = function () {
        return gulp.src(config.css.styleCSS)
            .pipe(plugins.plumber({
                    errorHandler: onError
                }
            ))
            .pipe(plugins.concat('styles.css'))
            /*.pipe(plugins.uncss({
             html: [config.clientIndex]
             }))*/
            .pipe(gulp.dest(config.dist.css));
    };

    pipes.processedImagesDev = function () {
        return gulp.src(config.img.imgPath)
            .pipe(gulp.dest(config.dist.img));
    };

    pipes.processedPartialsFilesDev = function () {
        return gulp.src(config.partialas)
            .pipe(gulp.dest(config.dist.dev));
    };

    pipes.builtIndexDev = function () {
        var filterJSCSS = plugins.filter(['**/*.js', '**/*.css'], {restore: true});
        var orderedVenderScripts = pipes.builtVendorScriptsStyleDev()
            .pipe(pipes.VendorScripts())
            .pipe(filterJSCSS);
        var orderedAppScriptsDev = pipes.builtAppScriptsDev();
        var orderedAppStyleDev = pipes.buildAppStyleCssDev();
        return gulp.src(config.clientIndex)
            .pipe(gulp.dest(config.dist.dev))
            .pipe(plugins.plumber({
                    errorHandler: onError
                }
            ))
            .pipe(plugins.inject(orderedVenderScripts, {relative: true, name: 'vendor'}))
            .pipe(plugins.inject(orderedAppScriptsDev, {relative: true}))
            .pipe(plugins.inject(orderedAppStyleDev, {relative: true}))
            .pipe(gulp.dest(config.dist.dev))
    };

    pipes.builtAppDev = function () {
        return es.merge(pipes.builtIndexDev(), pipes.processedImagesDev(), pipes.processedPartialsFilesDev());
    };

    pipes.copyServer = function () {
        return gulp.src(config.server + '/**/*')
            .pipe(gulp.dest(config.dist.server));
    }
}
/*===================================================================*/
/*========END PIPE ==================================================*/
/*===================================================================*/


/*===================================================================*/
/*========START DEV TASK ============================================*/
/*===================================================================*/

{
    gulp.task('built-setting-bootstap-dev', pipes.builtBootstapDev);
    gulp.task('settings', function () {
        if (settingsBootstrap) {
            return pipes.builtBootstapDev;
        }
        return;
    });
    gulp.task('built-vendor-dev', pipes.builtVendorScriptsStyleDev);
    gulp.task('built-app-scripts-dev', pipes.builtAppScriptsDev);
    gulp.task('built-app-style-dev', pipes.buildAppStyleCssDev);
    gulp.task('built-img-dev', pipes.processedImagesDev);
    gulp.task('built-partials-dev', pipes.processedPartialsFilesDev);
    gulp.task('built-index-dev', pipes.builtIndexDev);
    gulp.task('built-app-dev', pipes.builtAppDev);
    gulp.task('copy-server-dev', pipes.copyServer);
    gulp.task('clean-dev', function () {
        return del(config.dist.dev);
    });
    gulp.task('clean-build-app-dev', ['clean-dev'], pipes.builtAppDev);
    gulp.task('deploy-dev', function () {
        return gulp.src('./dist.dev/**/*')
            .pipe(ghPages());
    });

    /*=======================================*/
    /*========START BROWSER-SYNC DEV ========*/
    /*=======================================*/
    {
        gulp.task('watch-dev', ['settings', 'clean-build-app-dev'], function () {
            var reload = bowerSync.reload;
            bowerSync({
                port: 8000,
                server: {
                    baseDir: config.dist.dev
                }
            });
            //watch index
            gulp.watch(config.clientIndex, function () {
                return pipes.builtIndexDev()
                    .pipe(reload({stream: true}));
            });
            //watch js
            gulp.watch(config.js.scripts, function () {
                return pipes.builtAppScriptsDev()
                    .pipe(reload({stream: true}));
            });
            // watch html partials
            gulp.watch(config.partialas, function () {
                return pipes.processedPartialsFilesDev()
                    .pipe(reload({stream: true}));

            });
            // watch css
            gulp.watch(config.css.styleCSS, function () {
                return pipes.buildAppStyleCssDev()
                    .pipe(reload({stream: true}));
            });
        });
    }
}
/*=====================================*/
/*========END BROWSER-SYNC DEV ========*/
/*=====================================*/

/*===================================================================*/
/*========END DEV TASK ==============================================*/
/*===================================================================*/

/*===================================================================*/
/*========START PROD TASK ===========================================*/
/*===================================================================*/
pipes.processedImagesProd = function () {
    return gulp.src(config.dist.img+'/*')
        .pipe(gulp.dest(config.prod.img));
};

pipes.processedPartialasProd = function () {
    return gulp.src(config.dist.partialas+'/*')
        .pipe(gulp.dest(config.prod.partialas));
};

pipes.processedCSSProd = function () {
    return gulp.src([config.dist.css+'/*', config.dist.vendorCss+'/*'])
        .pipe(cleanCSS({debug: true, keepSpecialComments: 0}))
        .pipe(concat('all.min.css'))
        .pipe(gulp.dest(config.prod.css));
};

pipes.builtAppScriptsProd = function () {
    return gulp.src(config.dist.scripts+'/*')
        .pipe(plugins.concat('app.js'))
        .pipe(minifyJS({ ext: { min: '.min.js' }, noSource: true}))
        .pipe(gulp.dest(config.prod.scripts));
};


pipes.builtVendorScriptsProd = function () {
    return gulp.src(config.dist.vendorJS+'/*')
        .pipe(pipes.VendorScripts())
        .pipe(plugins.concat('vendor.js'))
        .pipe(minifyJS({ ext: { min: '.min.js' }, noSource: true}))
        .pipe(gulp.dest(config.prod.scripts));
};

pipes.builtIndexProd = function () {
    var cssProd= pipes.processedCSSProd();
    var appScriptsProd = pipes.builtAppScriptsProd();
    var vendorScriptsProd = pipes.builtVendorScriptsProd();

    return gulp.src(config.clientIndex)
        .pipe(gulp.dest(config.prod.prod))
        .pipe(plugins.plumber({
                errorHandler: onError
            }
        ))
        .pipe(plugins.inject(vendorScriptsProd, {relative: true, name: 'vendor'}))
        .pipe(plugins.inject(appScriptsProd, {relative: true}))
        .pipe(plugins.inject(cssProd, {relative: true}))
        .pipe(gulp.dest(config.prod.prod));
};

pipes.copyServer = function () {
    return gulp.src(config.server + '/**/*')
        .pipe(gulp.dest(config.prod.server));
}

pipes.builtAppProd = function () {
    return es.merge(pipes.builtIndexProd(), pipes.processedImagesProd(), pipes.pipes.processedPartialasProd ());
};

pipes.builtAppProdServer = function () {
    return es.merge(pipes.builtIndexProd(), pipes.processedImagesProd(), pipes.processedPartialasProd (), pipes.copyServer());
};



gulp.task('clean-prod', function () {
    return del(config.prod.prod);
});

gulp.task('built-app-prod',['clean-prod'],pipes.builtAppProd);

gulp.task('serv-prod',['clean-prod'],pipes.builtAppProdServer);

gulp.task('deploy-prod', function () {
    return gulp.src(['./dist.prod/**/*', '!./dist.prod/server/**'])
        .pipe(ghPages());
});

/*===================================================================*/
/*========END PROD TASK ==============================================*/
/*===================================================================*/