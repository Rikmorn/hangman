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
module.exports.updateStatus = Joi.object().keys({
  userId : Joi.string().alphanum().length(24).required(),
  id     : Joi.string().alphanum().length(24).required(),
  attempt: Joi.string().min(1).required()
});

module.exports.get = Joi.object().keys({
  userId: Joi.string().alphanum().length(24).required(),
  id    : Joi.string().alphanum().length(24).required()
});

module.exports.create = Joi.object().keys({
  userId: Joi.string().alphanum().length(24).required()
});
