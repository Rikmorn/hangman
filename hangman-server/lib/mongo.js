/**
 * @module mongo
 *
 * @description Factory an instance of promisified mongo
 */
'use strict';

/**
 * Dependencies
 */
var mongodb = require('mongodb');
var P       = require('bluebird');
var R       = require('ramda');
var config  = require('config').get('mongo');
var logger  = require('../lib/logger').get('mongo');

var Collection  = mongodb.Collection;
var MongoClient = mongodb.MongoClient;
var ObjectID    = mongodb.ObjectID;

/**
 * Promisifiy
 */
P.promisifyAll(MongoClient);
P.promisifyAll(Collection.prototype);

/**
 * Get collection with specified name in db and ensure they are indexed correctly
 * @param name
 * @param db
 * @returns {*}
 */
function getCollection(name, db) {
  return db.collection(name);
}

/**
 * @method connect
 */
var connect = module.exports.connect = function () {

  var db = config.db;

  return MongoClient
    .connectAsync(config.host + db)
    .catch(function (err) {
      logger.error('Mongo error %s', err.message, err.stack);
      throw err;
    });
};


/**
 * @method update
 */
module.exports.update = function (name, data) {

  var db = config.db;

  logger.info('Mongo update on %s', name, data);

  return connect(db)
    .then(R.partial(getCollection, [name]))
    .then(function (collection) {
      return collection.updateOneAsync({_id: data._id}, data)
        .then(function () {
          return collection.findOneAsync(data);
        });
    });
};

/**
 * @method insert
 */
module.exports.insert = function (name, data) {

  var db = config.db;

  logger.info('Mongo insert on %s', name, data);

  return connect(db)
    .then(R.partial(getCollection, [name]))
    .then(function (collection) {
      return collection.updateOneAsync(data, {$setOnInsert: data}, {upsert: true})
        .then(function () {
          return collection.findOneAsync(data);
        })
    });

};

/**
 * @method findOne
 */
module.exports.findOne = function (name, data) {

  data   = R.defaultTo({}, data);
  var db = config.db;

  logger.info('Mongo find one on %s', name, data);

  return connect(db)
    .then(R.partial(getCollection, [name]))
    .then(function (collection) {
      return collection.findOneAsync(data);
    })
};


/**
 * @method findAll
 */
module.exports.findAll = function (name, data) {

  data   = R.defaultTo({}, data);
  var db = config.db;

  logger.info('Mongo find on %s', name, data || {});

  return connect(db)
    .then(R.partial(getCollection, [name]))
    .then(function (collection) {
      return collection.findAsync(data);
    })
    .then(function (data) {
      return P.promisify(data.toArray, {context: data})();
    });
};