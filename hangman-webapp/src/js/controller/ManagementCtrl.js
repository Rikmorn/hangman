'use strict';

module.exports = function ($scope, $routeParams, $log, GameFactory) {
  GameFactory.getGames()
    .then((data) => {
      $scope.games = data;
    })
    .catch(function (errorPayload) {
      $log.error('Failure to load games', errorPayload);
    });

  var vm = {
    games: []
  };

  Object.assign($scope, vm);

};