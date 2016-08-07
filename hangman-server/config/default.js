'use strict';

module.exports = {
  attempts: 6,
  routes  : {
    api : '/api',
    docs: '/api/docs'
  },

  server: {
    bodyParser: {
      limit: '2mb'
    }
  },

  mongo: {
    host: 'mongodb://' + process.env.MONGO_HOST + '/',
    db  : 'hangman'
  }
};
