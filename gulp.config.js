/**
 * Created by FixError on 16.03.2016.
 */

module.exports = function () {
    /*========PATH SEGMENT============================================*/
    var path = require('path');
    var root = './';
    var client = path.join(root, 'client');
	var server = path.join(root, 'server');
    var clientApp = path.join(client, 'app');

    var config = {
        client: client,
		server: server,
        clientApp: clientApp,
        clientIndex: path.join(clientApp, 'index.html'),
        js: {
            scripts: path.join(clientApp, '**/*.js')
        },
        partialas: [path.join(clientApp, '**/*.html'), "!" + (path.join(clientApp, 'index.html'))],
        css: {
            styleCSS: path.join(clientApp, '**/*.css')
        },
        img: {
            imgPath: path.join(clientApp, '/img/**/*')
        },
		
        dist: {
			//server: path.join(root, 'dist.dev/server'),
            dev: path.join(root, 'dist.dev'),
            css: path.join(root, 'dist.dev/css'),
            img: path.join(root, 'dist.dev/img'),
            scripts: path.join(root, 'dist.dev/js'),
            partialas: path.join(root, 'dist.dev/view'),
            vendorCss : path.join(root, 'dist.dev/vendor/css'),
            vendorJS : path.join(root, 'dist.dev/vendor/js')
        },
        prod: {
            server: path.join(root, 'dist.prod/server'),
            prod: path.join(root, 'dist.prod'),
            css: path.join(root, 'dist.prod/css'),
            img: path.join(root, 'dist.prod/img'),
            scripts: path.join(root, 'dist.prod/js'),
            partialas: path.join(root, 'dist.prod/view')
        }
    };
    return config;
};
