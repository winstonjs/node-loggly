/*
 * core.js: Core functions for accessing Loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.join(require('path').join(__dirname, '..'));

var util = require('util'),
    eyes = require('eyes'),
    interns = require('./interns'),
    loggly = require('loggly');

var core = exports;

core.getInputs = function (callback) {
  interns.loggly(interns.logglyUrl('inputs'), callback, function (res, body) {
    var inputs = [], results = JSON.parse(body);
    results.forEach(function (result) {
      inputs.push(new (loggly.Input)(result));
    });
    
    callback(null, inputs);
  });
};