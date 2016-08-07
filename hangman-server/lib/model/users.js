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
 * @api {get} /users/:id Get user
 * @apiName GetUser
 * @apiGroup User
 *
 * @apiParam (URL Parameters) {String{24}} id User ID
 *
 * @apiDescription
 * Gets an existing user
 */
module.exports.get = function (data) {
  return schema.users.get()
    .strict(data)
    .then(R.prop('id'))
    .then(store.users.findById)
    .then(function (res) {
      if (R.isNil(res)) {
        throw error(404, 'Not found', 'User not found');
      }
      return res;
    })
};

/**
 * @api {post} /users Create a new user
 * @apiName CreateUser
 * @apiGroup User
 *
 * @apiDescription
 * Create a new user with the provided email
 */
module.exports.create = function (data) {
  return schema.users.create()
    .strict(data)
    .then(store.users.insert)
};