/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans').service('pokemonServiceImpl', pokemonServiceImpl);

    function pokemonServiceImpl(myConfig, $http, $q, $log) {
        var vm = this;
        vm.pokemon = function (next) {
            return $http.get(myConfig.base_url + (next || (myConfig.limit_url)))
                .then(function (response) {
                    return response.data;
                })
                .catch(function (response) {
                    $log.error('Error retrieving: ' + response.statusText);
                    return $q.reject('Error retrieving.');
                });
        };
    }

    pokemonServiceImpl.$inject = [
        'myConfig',
        '$http',
        '$q',
        '$log'
    ];

}());