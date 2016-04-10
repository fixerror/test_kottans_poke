/**
 * Created by FixError on 16.03.2016.
 */

(function () {

    angular.module('app.kottans')
        .factory('notifier', ['toastr',notifier]);

    function notifier(toastr) {
        return {
            success: success,
            error: error
        };

        function success(message) {
            toastr.success(message);
        }

        function error(message) {
            toastr.error(message);
        }
    }
}());