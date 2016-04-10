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
/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
    .config(['$httpProvider',function ($httpProvider) {
        $httpProvider.defaults.useXDomain = true;
        delete $httpProvider.defaults.headers.common['X-Requested-With'];
    }]);
}());
/**
 * Created by FixError on 06.04.2016.
 */
(function () {
    angular.module('app.kottans')
            .config(['$httpProvider',function ($httpProvider) {
                $httpProvider.interceptors.push('httpInterceptor');
            }]);
}());
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
/**
 * Created by FixError on 28.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .constant('_',  window._);
}());
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
/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .controller('AbstractCtrl', AbstractCtrl);
    function AbstractCtrl(builtService, notifier, $state, $filter, $log, $q) {
        var vm = this;
        vm.flagButton = true;
        vm.flagInfo = true;
        vm.pokemonAll = function (next) {
            var pokemonHttp = null;
            var pokemonALL = [];
            var headers = {};
            var pokemon = {};
            builtService(next).then(function (data) {
                _(data).forEach(function (value, key) {
                    if (key == "meta") {
                        headers.next = value.next;
                        headers.previous = value.previous;
                        headers["total_count"] = value["total_count"];
                        headers["total_count"] = value["total_count"];
                    }
                    if (key == "objects") {
                        pokemonHttp = value;
                    }
                });

                if (!_.isEmpty(pokemonHttp)) {
                    _(pokemonHttp).forEach(function (value, key) {
                        pokemon.name = value.name;
                        pokemon.attack = value.attack;
                        pokemon.defense = value.defense;
                        pokemon.exp = value.exp;
                        pokemon.hp = value.hp;
                        pokemon.sp_def = value.sp_def;
                        pokemon.sp_atk = value.sp_atk;
                        pokemon.speed = value.speed;
                        pokemon.weight = value.weight;
                        pokemon.types = value.types;
                        pokemon['national_id'] = value['national_id'];
                        pokemon.moves = value.moves.length;
                        pokemonALL.push(pokemon);
                        pokemon = {};
                    });
                }

                vm.headers = headers;
                vm.pokemons = pokemonALL;
                vm.flagButton = false;
            });

        };
        vm.check = true;
        vm.pokemonInfo = function (pokemon) {
            var type = [];
            _(pokemon.types).forEach(function (value, key) {
                    type.push(value.name);
            });

            vm.infos = {
                'types': _.join(type, ', '),
                'national_id': pokemon['national_id'],
                'name': pokemon.name,
                'attack': pokemon.attack,
                'sp_def': pokemon.sp_def,
                'defense': pokemon.defense,
                'exp': pokemon.exp,
                'hp': pokemon.hp,
                'sp_atk': pokemon.sp_atk,
                'speed': pokemon.speed,
                'weight': pokemon.weight,
                'moves': pokemon.moves
            };
            vm.flagInfo = false;
        };

    }

    AbstractCtrl.$inject = [
        'builtService',
        'notifier',
        '$state',
        '$filter',
        '$log',
        '$q'
    ];
}());
/**
 * Created by FixError on 16.03.2016.
 */
(function () {
    angular.module('app.kottans')
        .controller('PokemonController', [PokemonController]);
    function PokemonController() {
        var vm = this;
    }
}());
/**
 * Created by FixError on 06.04.2016.
 */
(function () {
    angular.module('app.kottans')
        .factory('httpInterceptor', httpInterceptor);

    function httpInterceptor($q, $rootScope, $log) {
        var numLoadings = 0;
        return {
            request: function (config) {
                numLoadings++;
                $rootScope.$broadcast("loader_show");
                return config || $q.when(config)
            },
            response: function (response) {
                if ((--numLoadings) === 0) {
                    $rootScope.$broadcast("loader_hide");
                }
                return response || $q.when(response);
            },
            responseError: function (response) {
                if (!(--numLoadings)) {
                    $rootScope.$broadcast("loader_hide");
                }
                return $q.reject(response);
            }
        };
    }


    httpInterceptor.$inject = [
        '$q',
        '$rootScope',
        '$log'
    ];
}());
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