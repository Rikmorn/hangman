/**
 * @middleware send-file
 */
'use strict';


/**
 * Dependencies
 */
var resolve = require('path').resolve;


/**
 * Expose module
 */
module.exports = function (path, status) {

  status = status || 200;

  return function (req, res) {
    return res.status(status).sendFile(resolve(path));
  };
};