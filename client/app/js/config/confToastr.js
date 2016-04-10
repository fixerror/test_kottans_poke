/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .config(['toastrConfig', function (toastrConfig) {
            angular.extend(toastrConfig, {
                autoDismiss: false,
                containerId: 'toast-container',
                maxOpened: 0,
                showDuration: "300",
                timeOut: "2000",
                positionClass: 'toast-top-center',
                preventDuplicates: false,
                preventOpenDuplicates: false,
                target: 'body'
            });
        }]);
}());