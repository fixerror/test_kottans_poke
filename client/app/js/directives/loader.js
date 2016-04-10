/**
 * Created by FixError on 06.04.2016.
 */
(function () {
    angular.module('app.kottans')
        .directive('loader',loader);
    function loader($rootScope) {
        return function ($scope, element) {
            $scope.$on("loader_show", function () {
                return element.show();
            });
            return $scope.$on("loader_hide", function () {
                return element.hide();
            });
        };
    }
    loader.$inject = [
        '$rootScope'
    ];
}());