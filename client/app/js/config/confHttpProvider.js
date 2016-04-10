/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
    .config(['$httpProvider',function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
}());