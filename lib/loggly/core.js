/*
 * core.js: Core functions for accessing Loggly
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var events = require('events'),
    qs = require('querystring'),
    config = require('./config'),
    common = require('./common'),
    Search = require('./search').Search,
    loggly = require('../loggly');

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
var Loggly = exports.Loggly = function (config) {
  this.config = config;
};

//
// function log (callback) 
//   logs args to input device
//
Loggly.prototype.log = function (inputId, msg, callback) {
  var emitter = new (events.EventEmitter)(),
      message;
      
  if (msg instanceof Object) {
    message = this.config.json ? JSON.stringify(msg) : common.serialize(msg);
  } 
  else {
    message = this.config.json ? JSON.stringify({ message : msg }) : msg;
  }

  var logOptions = {
    uri: this.config.inputUrl + inputId,
    method: 'POST', 
    body: message,
    headers: {
      'Content-Type': this.config.json ? 'application/json' : 'text/plain'
    }
  };

  common.loggly(logOptions, callback, function (res, body) {
    try {
      var result = JSON.parse(body);
      if (callback) {
        callback(null, result);
      }
      
      emitter.emit('log', result);
    }
    catch (ex) {
      if (callback) {
        callback(new Error('Unspecified error from Loggly: ' + ex));
      }
    }
  }); 
  
  return emitter; 
};

//
// function search (query, callback)
//   Returns a new search object which can be chained
//   with options or called directly if @callback is passed
//   initially.
//
// Sample Usage:
//
//   client.search('404')
//         .meta({ ip: '127.0.0.1' })
//         .context({ rows: 100 })
//         .run(function () { /* ... */ });
//
Loggly.prototype.search = function (query, callback) {
  return new Search(query, this, callback);
};

//
// function logglyUrl ([path, to, resource])
//   Helper method that concats the string params into a url
//   to request against a loggly serverUrl. 
//
Loggly.prototype.logglyUrl = function (/* path, to, resource */) {
  var args = Array.prototype.slice.call(arguments);
  return [this.config.logglyUrl].concat(args).join('/');
};