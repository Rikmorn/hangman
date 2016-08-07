/**
 * @module docs
 *
 * @description provides route handler for access to API docs
 */
'use strict';


/**
 * Dependencies
 */
var express = require('express');
var resolve = require('path').resolve;


/**
 * Middelware
 */
var sendFile = require('../lib/send-file');


/**
 * Expose module
 */
var router = module.exports = express.Router();


/**
 * Allow static files
 */
router.use(express.static(resolve(__dirname, '../../../docs/api/')));

