/**
 * Created by FixError on 23.03.2016.
 */
(function () {
    angular.module('app.kottans').factory('builtService', builtService);
    function builtService( pokemonServiceImpl, $q, $log, notifier) {

        function showError(message) {
            notifier.error(message);
        }

        function successInfo(message) {
            notifier.success(message);
        }

        function pokemonImpl(value) {
            var deferred = $q.defer();
                    pokemonServiceImpl.pokemon(value).then(function (data) {
                        deferred.resolve(data);
                    }).catch(showError);
            return deferred.promise;
        }

        return pokemonImpl;

    }

    builtService.$inject = [
        'pokemonServiceImpl',
        '$q',
        '$log',
        'notifier'
    ];
}());