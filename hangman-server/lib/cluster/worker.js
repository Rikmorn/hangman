/**
 * Dependencies
 */
var R       = require('ramda');
var domain  = require('domain');
var cluster = require('cluster');

var server = require('../server');
var logger = require('../logger').get('server');

module.exports = function (options) {

  var PORT = R.defaultTo(8882, options.port);

  /**
   * Initialisation
   */
  server.use(function graceful(req, res, next) {

    var d = domain.create();

    d.add(req);
    d.add(res);

    d.on('error', function gracefulHandler(err) {

      // log errors
      logger.error(err.stack);

      // gracefully refuse requests and close existing before exit
      app.close(function () {
        process.exit(1);
        logger.info('Server has been closed');
      });

      // if longer than 20 seconds force exit - doesn't block event loop
      setTimeout(function failsafe() {
        process.exit(1);
        logger.info('Server has been forced to close');
      }, 20000).unref();

      // @todo This should be within master code
      if (!cluster.worker.suicide) {
        cluster.worker.disconnect();
      }

      next(err);
    });

    d.run(function () {
      next();
    });

  });

  var app = server.listen(PORT, function () {

    logger.info('Server listening on', {
      port       : PORT,
      environment: server.get('env')
    });

  });
};


