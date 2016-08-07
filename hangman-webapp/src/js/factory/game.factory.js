/**
 * Created by robertosousa on 06/08/2016.
 */

"use strict";

var R = require('ramda');

module.exports = function ($q, $log, $http, localStorageService) {

  return {
    _getGame: function (user, gameId) {
      var req = {
        method : 'GET',
        url    : '/api/games/' + gameId,
        headers: {
          'X-User': user._id
        }
      };

      return $http(req)
        .then(R.prop('data'));
    },

    newGame: function (user) {
      $log.info('Creating Game');

      var req = {
        method : 'POST',
        url    : '/api/games',
        headers: {
          'X-User': user._id
        }
      };

      return $http(req)
        .then(R.prop('data'))
        .then((payload)=> {
          localStorageService.set('game-' + user._id, payload._id);
          return payload;
        })
        .catch((err) => {
          if (err.status === 409) {
            return this._getGame(user, err.data.gameId);
          }

          throw err;
        })
    },

    getGame: function (user) {
      $log.info('Getting Game');

      var gameId = localStorageService.get('game-' + user._id);

      if (gameId) {
        return this._getGame(user, gameId);
      } else {
        return this.newGame(user);
      }
    },

    getGames: function () {
      $log.info('Getting all current games');

      return $http.get('/api/games')
        .then(R.prop('data'));
    },

    play: function (user, gameId, attempt) {
      $log.info('Making a play');

      var req = {
        method : 'POST',
        url    : '/api/games/' + gameId + '/play',
        headers: {
          'X-User': user._id
        },
        data   : {attempt: attempt}
      };

      return $http(req)
        .then(R.prop('data'));
    }
  };

};