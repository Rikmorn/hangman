/**
 * @model assets
 */
'use strict';

/**
 * Dependencies
 */
var R      = require('ramda');
var config = require('config');

var schema = require('../schema');
var store  = require('../store');

var error = require('../errors').ResponseError;

/**
 * @api {post} /game/:id/play Update game status
 * @apiName CreatePlay
 * @apiGroup Games
 *
 * @apiParam (URL Parameters) {String{24}} id Game id
 *
 * @apiDescription
 * Updates the status for an existing game
 */
module.exports.new = function (data) {
  return schema.games.updateStatus()
    .strict(data)
    .then(R.partial(store.games.findByIdAndUser, [data.id, data.userId]))
    .then(function (res) {
      if (R.isNil(res)) {
        throw error(404, 'Not found', 'Game not found');
      }

      if (res.triesLeft <= 0) {
        throw error(409, 'Conflict', 'This game has been finished and cannot be updated');
      }

      if (res.state != 0) {
        var outcome = res.state === 1 ? 'won' : 'lost';
        throw error(409, 'Conflict', 'This game has been ' + outcome + ' and cannot be updated');
      }

      data.attempt = R.toLower(data.attempt);

      res.status.plays.push(data.attempt);

      if (data.attempt.length > 1) { // check word
        if (data.attempt === res.word) {
          res.state             = 1;
          res.status.completion = R.split('', data.attempt);
        } else {
          res.triesLeft--;
        }
      } else { // check char
        var newCompletion = R.addIndex(R.map)(function (val, i) {
          return (val === '' && res.word[i] === data.attempt) ? data.attempt : val;
        })(res.status.completion);

        if (R.join('', newCompletion) === res.word) {
          res.state = 1;
        } else {
          if (!R.find(R.equals(data.attempt), newCompletion)) {
            res.triesLeft--;
          }
        }

        res.status.completion = newCompletion;
      }

      if (res.triesLeft <= 0) {
        res.state = -1;
      }

      return store.games.update(res);
    })
};