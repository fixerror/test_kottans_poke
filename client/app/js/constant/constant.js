/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .constant('myConfig',  {
            'base_url': 'http://pokeapi.co/',
            'limit_url': 'api/v1/pokemon/?limit=12',
    });
}());