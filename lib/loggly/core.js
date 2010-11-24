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
    config = require('./config'),
    interns = require('./interns'),
    loggly = require('loggly');

//
// function createClient (options)
//   Creates a new instance of a Loggly client.
//
exports.createClient = function (options) {
  return new Loggly(config.createConfig(options));
};

//
// Loggly (config)
//   Constructor for the Loggly object
//
var Loggly = function (config) {
  this.config = config;
};

//
// function getInputs (callback) 
//   Returns a list of all inputs for the authenicated account
//
Loggly.prototype.getInputs = function (callback) {
  interns.loggly(this.logglyUrl('inputs'), this.config.auth, callback, function (res, body) {
    var inputs = [], results = JSON.parse(body);
    results.forEach(function (result) {
      inputs.push(new (loggly.Input)(result));
    });
    
    callback(null, inputs);
  });
};

//
// function logglyUrl ([path, to, resource])
//   Helper method that concats the string params into a url
//   to request against a loggly serverUrl. 
//
Loggly.prototype.logglyUrl = function () {
  var args = Array.prototype.slice.call(arguments);
  return [this.config.logglyUrl].concat(args).join('/');
};

//
// Export the Loggly object
//
exports.Loggly = Loggly;