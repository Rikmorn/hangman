/**
 * @schema assets
 */
'use strict';


/**
 * Dependencies
 */
var Joi = require('joi');

/**
 * get user
 */
module.exports.get = Joi.object().keys({
  id: Joi.string().alphanum().length(24).required()
});

/**
 * create user
 */
module.exports.create = Joi.object().keys({
  email: Joi.string().email().required()
});
