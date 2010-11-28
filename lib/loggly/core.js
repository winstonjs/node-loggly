/*
 * core.js: Core functions for accessing Loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.join(require('path').join(__dirname, '..'));

var util = require('util'),
    querystring = require('querystring'),
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
// function addDevice (inputId, address, callback) 
//   Adds the device at address to the input specified by inputId
//
Loggly.prototype.addDevice = function (inputId, address, callback) {
  var addOptions = {
    uri: this.logglyUrl('devices'),
    auth: this.config.auth,
    method: 'POST', 
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: querystring.stringify({ 'input_id': inputId, 'ip': address }).replace('"', '')
  };

  interns.loggly(addOptions, callback, function (res, body) {
    callback(null, res);
  });
};

//
// function getDevices (callback) 
//   Returns a list of all devices for the authenicated account
//
Loggly.prototype.getDevices = function (callback) {
  interns.loggly(this.logglyUrl('devices'), this.config.auth, callback, function (res, body) {
    var devices = [], results = JSON.parse(body);
    results.forEach(function (result) {
      devices.push(new (loggly.Device)(result));
    });
    
    callback(null, devices);
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