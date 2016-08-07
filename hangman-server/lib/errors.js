/**
 * @module errors
 *
 * @description provides all error objects throughout the application
 */
'use strict';


/**
 * Dependencies
 */
var R      = require('ramda');
var util   = require('util');
var logger = require('../lib/logger').get('error');

/**
 * @object ResponseError
 *
 * @extends Error
 *
 * @description A standard http response error which uses defaults to create
 * standard responses for the API
 */
var ResponseError = module.exports.ResponseError = function (status, name, message, details) {

  if (!(this instanceof ResponseError)) {
    return new ResponseError(status, message, details);
  }

  Error.call(this);
  Error.captureStackTrace(this, ResponseError);

  this.status  = status;
  this.message = message;
  this.name    = name;
  this.details = details;

  return this;
};

util.inherits(ResponseError, Error);


/**
 * @method response
 *
 * @example Promise.catch(errors.response(401))
 *
 * @description Curries function throwing error
 */
module.exports.response = function (status, message, details) {
  return function () {
    throw new ResponseError(status, message, details);
  };
};


/**
 * @middleware respond
 *
 * @example app.use(errors.respond(401, 'Nope.Nope.Nope.'))
 *
 * @description Curries middleware for response error
 */
module.exports.respond = function (status, message, details) {
  return function (req, res, next) {
    next(new ResponseError(status, message, details));
  };
};

/**
 * @middleware handler
 *
 * @example app.use(errors.handler)
 *
 * @description Handles error responses if known type
 */
/*jshint unused:false*/
module.exports.handler = function (err, req, res, next) {

  var data = {
    status : err.status,
    name   : err.name,
    message: err.message
  };

  // If a valid response
  if (err.details) {
    data.details = err.details;
  }

  logger.error(err.stack);

  return res.status(data.status || 500).json(data);
};
