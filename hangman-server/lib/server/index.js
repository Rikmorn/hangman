/**
 * @module server
 *
 * @description
 * Creates instance of express server. Use as global express configuration.
 */
'use strict';

/**
 * Dependencies
 */
var R              = require('ramda');
var cors           = require('cors');
var config         = require('config');
var mongo          = require('../mongo');
var express        = require('express');
var errors         = require('../errors');
var compress       = require('compression');
var bodyParser     = require('body-parser');
var methodOverride = require('method-override');

/**
 * Routers
 */
var api = require('./router/api');
var docs = require('./router/docs');

/**
 * Expose module
 */
var server = module.exports = express();


/**
 * Settings; removes x-powered-by for security
 */
server.disable('server');
server.disable('x-powered-by');


/**
 * Lets you use HTTP verbs such as PUT or DELETE in places where the client doesn't support it.
 *
 * @description https://github.com/expressjs/method-override
 */
server.use(methodOverride());


/**
 * CORS policy
 *
 * @link https://github.com/troygoode/node-cors
 *
 * @description Enables CORS for all clients with no restrictions - handled by Nginx proxy
 */
server.use(cors());


/**
 * Node.js compression middleware.
 *
 * @description https://github.com/expressjs/compression
 */
server.use(compress({threshold: 256}));


/**
 * Node.js body parsing middleware.
 *
 * @description https://github.com/expressjs/body-parser
 */
server.use(bodyParser.json(config.server.bodyParser)); // Payload size can be up to 2MB


/**
 * Docs router
 */
server.use(config.routes.docs, docs);

/**
 * API router
 */
server.use(config.routes.api, api);


/**
 * Page not found
 */
server.use(errors.respond(404, "Not Found"));

/**
 * Return errors
 */
server.use(errors.handler);
