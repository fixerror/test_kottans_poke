/**
 * Created by FixError on 06.04.2016.
 */
(function () {
    angular.module('app.kottans')
            .config(['$httpProvider',function ($httpProvider) {
                $httpProvider.interceptors.push('httpInterceptor');
            }]);
}());