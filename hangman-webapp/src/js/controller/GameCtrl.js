'use strict';

var R = require('ramda');

module.exports = function ($scope, $routeParams, $log, $sce, $timeout, GameFactory, UserFactory) {

  var vm = {
    email   : '',
    attempt : '',
    userData: null,
    gameData: null,

    createUser: function () {
      UserFactory.getUser($scope.email)
        .then((user)=> {
          $scope.userData = user;

          GameFactory.getGame(user)
            .then((game)=> {
              $scope.gameData = game;
            })
            .catch((errorPayload)=> {
              $log.error('Failed to get or create game', errorPayload);
            });
        })
        .catch((errorPayload)=> {
          $log.error('Failed to create user', errorPayload);
        });
    },

    sendTry: function () {
      GameFactory.play($scope.userData, $scope.gameData._id, $scope.attempt)
        .then((game)=> {
          $scope.gameData = game;
          $scope.attempt  = '';
        })
        .catch((errorPayload)=> {
          $log.error('Failed to create create play', errorPayload);
        });
    },

    newGame: function () {
      GameFactory.newGame($scope.userData)
        .then((game)=> {
          $scope.gameData = game;
        })
        .catch((errorPayload)=> {
          $log.error('Failed to create new game', errorPayload);
        });
    }
  };

  Object.assign($scope, vm);

};