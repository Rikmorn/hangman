/**
 * @module cluster
 */
'use strict';


/**
 * Dependencies
 */
var R       = require('ramda');
var cluster = require('cluster');


/**
 * Expose module
 */
module.exports = function (opts) {
  return require(cluster.isMaster ? './master' : './worker')(R.pick(['port', 'cluster'], opts));
};
