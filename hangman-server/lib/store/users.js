var R        = require('ramda');
var P        = require('bluebird');
var config   = require('config');
var ObjectId = require('mongodb').ObjectID;

var mongo = require('../mongo');

var collection = 'users';

module.exports.insert = function (data) {
  return mongo.insert(collection, data);
};

module.exports.findById = function (id) {
  return mongo.findOne(collection, R.assoc('_id', new ObjectId(id), {}));
};