/**
 * @script master
 */
'use strict';


/**
 * Dependencies
 */
var R       = require('ramda');
var cluster = require('cluster');
var logger  = require('../logger').get('server');


module.exports = function (options) {
  var PROCESSES = R.defaultTo(1, options.cluster);

  /**
   * Run script
   */
  for (var i = 0; i < PROCESSES; i++) {
    cluster.fork();
  }

  cluster
    .on('fork', function (worker) {
      logger.info('Worker %s forked', worker.process.pid);
    })
    .on('online', function (worker) {
      logger.info('Worker %s online', worker.process.pid);
    })
    .on('listening', function (worker) {
      logger.info('Worker %s listening', worker.process.pid);
    })
    .on('disconnect', function (worker) {
      cluster.fork();
      logger.info('Worker %s disconnected', worker.process.pid);
    })
    .on('exit', function (worker, code, signal) {
      logger.info('Worker %s died', worker.process.pid);
    });
};
