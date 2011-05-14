/*
 * loggly.js: Wrapper for node-loggly object
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var loggly = exports;

//
// Export node-loggly core client APIs
//
loggly.createClient  = require('./loggly/core').createClient;
loggly.Loggly        = require('./loggly/core').Loggly;
loggly.Config        = require('./loggly/config').Config;

//
// Export Resources for node-loggly
//
loggly.Input         = require('./loggly/input').Input;
loggly.Device        = require('./loggly/device').Device;