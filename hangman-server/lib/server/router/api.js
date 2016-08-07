/**
 * @routes api
 *
 * @description provides route handler for access to API docs
 */
'use strict';


/**
 * Dependencies
 */
var config  = require('config');
var express = require('express');

/**
 * Model
 */

var model   = require('../../model');
/**
 * Middleware
 */
var respond = require('../lib/respond');
var errors  = require('../../errors');

/**
 * Expose module
 */
var router = module.exports = express.Router();

/**
 * Users
 */

router.route('/users')
  .post(respond(model.users.create, 201))
  .all(errors.respond(405));

router.route('/users/:id')
  .get(respond(model.users.get, 200))
  .all(errors.respond(405));

router.route('/games')
  .get(respond(model.games.list, 200))
  .post(respond(model.games.create, 201))
  .all(errors.respond(405));

router.route('/games/:id')
  .get(respond(model.games.get, 200))
  .all(errors.respond(405));

router.route('/games/:id/play')
  .post(respond(model.play.new, 201))
  .all(errors.respond(405));

