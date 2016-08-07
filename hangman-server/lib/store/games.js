var R        = require('ramda');
var P        = require('bluebird');
var config   = require('config');
var ObjectId = require('mongodb').ObjectID;

var mongo = require('../mongo');

var collection = 'games';

module.exports.findById = function (id) {
  return mongo.findOne(collection, R.assoc('_id', new ObjectId(id), {}));
};

module.exports.findCompletedByUser = function (user) {
  var search = {
    ownerId: user,
    state  : 0
  };

  return mongo.findOne(collection, search);
};

module.exports.findByIdAndUser = function (id, user) {
  var search = {
    _id    : new ObjectId(id),
    ownerId: user
  };

  return mongo.findOne(collection, search);
};

module.exports.findInProgress = function () {
  var search = {
    state: 0
  };

  return mongo.findAll(collection, search);
};

module.exports.create = function (game) {
  return mongo.insert(collection, game);
};

module.exports.updateState = function (userId, id, plays) {
  var _id = R.assoc('_id', new ObjectId(id), {});

  var gameStatus = {
    status: {
      plays: plays
    }
  };

  return mongo.upsert(collection, _id, gameStatus);
};

module.exports.update = function (data) {
  return mongo.update(collection, data);
};
