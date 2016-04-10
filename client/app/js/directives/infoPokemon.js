/**
 * Created by FixError on 06.04.2016.
 */
(function () {
    angular.module('app.kottans')
       .directive('infoPokemon',infoPokemon);
    function infoPokemon(){
        return{
            restrict: 'EA',
            templateUrl: 'view/info.html'
        };
    }

}());