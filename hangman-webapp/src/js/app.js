'use strict';

var angular = require('angular');

require('angular-route');
require('angular-ui-bootstrap');
require('angular-local-storage');

var app = angular.module('hangmanApp', ['ngRoute', 'ui.bootstrap', 'LocalStorageModule']);

require('./factory');
require('./controller');

app.config(function ($routeProvider, localStorageServiceProvider) {

  localStorageServiceProvider
    .setPrefix('hangman');

  $routeProvider
    .when('/', {
      templateUrl: 'views/templates/game.html',
      controller : 'GameCtrl'
    })
    .when('/management', {
      templateUrl: 'views/templates/management.html',
      controller : 'ManagementCtrl'
    })
    .otherwise({
      redirectTo: '/'
    });
});