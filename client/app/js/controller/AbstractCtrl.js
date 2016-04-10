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