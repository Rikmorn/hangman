/**
 * Created by robertosousa on 01/03/2016.
 */

'use strict';

var app = require('angular').module('hangmanApp');

app.controller('GameCtrl', require('./GameCtrl'));
app.controller('ManagementCtrl', require('./ManagementCtrl'));