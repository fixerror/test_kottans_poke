/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    var app = angular.module('app.kottans', ['ui.router', 'toastr']);

    app.run(['$rootScope', '$log', function ($rootScope, $log) {
            $rootScope._ = window._;
            $rootScope.$on('$stateNotFound', function (event, unfoundState, fromState, fromParams) {
            $log.error('The requested state was not found: ', unfoundState);
        });

        $rootScope.$on('$stateChangeError', function (event, toState, toParams, fromState, fromParams, error) {
            $log.error('An error occurred while changing states: ', error);
            $log.debug('event', event);
            $log.debug('toState', toState);
            $log.debug('toParams', toParams);
            $log.debug('fromState', fromState);
            $log.debug('fromParams', fromParams);
        });
    }]);
}());