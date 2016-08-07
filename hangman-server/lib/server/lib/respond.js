/**
 * @middleware respond
 *
 * @description handles model responses from core
 */
'use strict';


/**
 * Dependencies
 */
var R = require('ramda');
var P = require('bluebird');

var logger = require('../../logger');
//var pagination = require('./pagination');


/**
 * Expose module
 */
module.exports = function (model, status) {

  return function (req, res, next) {
    return P
      .try(function () {
        return R.compose(
          R.merge(req.query),
          R.merge(req.params)
        )(req.body);
      })
      .then(function (data) { // user user id if exists
        if (!R.isNil(req.headers['x-user'])) {
          return R.merge(R.assoc('userId', req.headers['x-user'], {}), data);
        }

        return data;
      })
      .then(model)
      //.then(pagination(
      //  paginate,
      //  {
      //    host    : req.get('host'),
      //    protocol: req.protocol,
      //    pathname: req.originalUrl
      //  },
      //  parseInt(R.path('query.page', req)) || 1,
      //  parseInt(R.path('query.size', req)) || 10
      //))
      //.spread(function (data, links, total) {
      //
      //  if (!paginate) {
      //    return data;
      //  }
      //
      //  if (links) {
      //    res.links(links);
      //  }
      //
      //  res.set('X-Total-Items', total);
      //
      //  return data;
      //})
      .bind(res)
      .then(res.status(status).json)
      .bind(this)
      .catch(SyntaxError, function (err) {
        logger.get('error').log(err.stack);
        throw Error('An unexpected error occured');
      })
      .catch(next);
  };
};
