/**
 * Created by robertosousa on 01/03/2016.
 */

'use strict';

var app = require('angular').module('hangmanApp');

app.factory('UserFactory', require('./user.factory'));
app.factory('GameFactory', require('./game.factory'));
