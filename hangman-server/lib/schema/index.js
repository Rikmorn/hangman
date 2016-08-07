'use strict';

/**
 * Dependencies
 */

var R   = require('ramda');
var Joi = require('joi');
var P   = require('bluebird');

var errors        = require('../../lib/errors');
var ResponseError = errors.ResponseError;

var schemas = require('require-dir')();
/**
 * Promisify
 */
P.promisifyAll(Joi);

var OPTIONS = {
  valid : {
    abortEarly  : false,
    allowUnknown: true
  },
  strict: {
    abortEarly  : false,
    allowUnknown: false
  }
};

function validationAdapter(schema, options, data) {
  return Joi.validateAsync(data, schema, options).catch(function (err) {
    throw new ResponseError(400, 'Validation error', err.details);
  });
}

/**
 * Expose module
 */

module.exports = R.map(
  R.map(function (schemaObject) {
    return function (options) {
      return {
        valid : R.partial(validationAdapter, [schemaObject, R.merge(OPTIONS.valid, options)]),
        strict: R.partial(validationAdapter, [schemaObject, R.merge(OPTIONS.strict, options)])
      };
    }
  })
)(schemas);

