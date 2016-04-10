/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .config(['$logProvider', '$stateProvider', '$urlRouterProvider', function ($logProvider, $stateProvider, $urlRouterProvider) {
            $logProvider.debugEnabled(false);
            $urlRouterProvider.otherwise('/');
            $stateProvider.
                state('abstrc', {
                    abstract: true,
                    url: '',
                    templateUrl: './view/abstrc.html',
                    controller: 'AbstractCtrl',
                    controllerAs: 'abstrc'
                })
                .state('abstrc.pokemons', {
                    url: '/',
                    templateUrl: './view/pokemons.html',
                    controller: 'PokemonController',
                    controllerAs: 'pokemons'
                });
        }]);
}());