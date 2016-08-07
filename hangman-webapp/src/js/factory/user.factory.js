/**
 * Created by robertosousa on 06/08/2016.
 */

"use strict";

var R = require('ramda');

module.exports = function ($q, $log, $http, localStorageService) {

  return {

    createUser: function (email) {
      $log.info('Creating user');

      return $http.post('/api/users', {email: email})
        .then(R.prop('data'))
        .then((payload)=> {
          localStorageService.set('user-' + email, payload);
          return payload;
        });
    },

    getUser: function (email) {
      // try from local, if null get from server
      $log.info('Getting user');

      var user = localStorageService.get('user-' + email);

      if (R.isNil(user)) {
        return this.createUser(email);
      }

      var deferred = $q.defer();
      deferred.resolve(user);

      return deferred.promise;
    }
  };

};