/**
 * Created by robertosousa on 06/08/2016.
 */

var R       = require('ramda');
var winston = require('winston');

var containers = {
  access: {
    console: {
      label      : 'access',
      colorize   : true,
      prettyPrint: false,
      timestamp  : true,
      level      : 'silly'
    }
  },
  mongo : {
    console: {
      label    : 'mongo',
      colorize : true,
      timestamp: true,
      level    : 'silly'
    }
  },
  server: {
    console: {
      label    : 'server',
      colorize : true,
      timestamp: true,
      level    : 'silly'
    }
  },
  error : {
    console: {
      label           : 'error',
      colorize        : true,
      handleExceptions: false,
      prettyPrint     : true,
      timestamp       : true,
      level           : 'error'
    }
  }
};

var container = new winston.Container();

R.map(function create(key) {
  container.add(key, containers[key]);
})(R.keys(containers));

module.exports = container;