/**
 * @model assets
 */
'use strict';

/**
 * Dependencies
 */
var R          = require('ramda');
var config     = require('config');
var randomWord = require('random-words');

var schema = require('../schema');
var store  = require('../store');

var error = require('../errors').ResponseError;

/**
 * @api {get} /games Get all ongoing games
 * @apiName ListGames
 * @apiGroup Games
 *
 * @apiDescription
 * Gets status for specified game
 */
module.exports.list = store.games.findInProgress;

/**
 * @api {get} /games/:id Get game
 * @apiName GetGame
 * @apiGroup Games
 *
 * @apiParam (URL Parameters) {String{24}} id Game id
 *
 * @apiDescription
 * Gets status for specified game
 */
module.exports.get = function (data) {
  return schema.games.get()
    .strict(data)
    .then(R.prop('id'))
    .then(store.games.findById)
    .then(function (res) {
      if (R.isNil(res)) {
        throw error(404, 'Not found', 'Status not found');
      }
      return res;
    })
};

/**
 * @api {post} /games Create new game
 * @apiName CreateGame
 * @apiGroup Games
 *
 * @apiDescription
 * Creates a new game status, essentially the same as starting a new game
 */
module.exports.create = function (data) {
  return schema.games.create()
    .strict(data)
    .then(R.partial(store.games.findCompletedByUser, [data.userId]))
    .then(function (games) {
      if (!R.isNil(games)) {
        throw error(409, 'Conflict', {
          message: 'Cannot create new game, one is already in progress',
          gameId   : games[0]._id
        });
      }
    })
    .then(function () {
      var word = R.toLower(randomWord());
      return {
        ownerId  : data.userId,
        status   : {
          plays     : [], // player attempts
          completion: R.repeat('', R.length(word))
        },
        word     : word,
        triesLeft: config.attempts,
        state    : 0 // 1 won, 0 ongoing, -1 lost
      };
    })
    .then(store.games.create)
};
