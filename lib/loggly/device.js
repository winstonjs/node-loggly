/*
 * device.js: Instance of a single Loggly device
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
require.paths.unshift(require('path').join(__dirname, '..'));

var loggly = require('loggly'),
    util = require('util'),
    interns = require('./interns');
 
var Device = function (details) {
  if (!details) {
    throw new Error("Device must be constructed with at least basic details.")
  }
  
  this._setProperties(details);
};

Device.prototype = {
  //
  // Sets the properties for this instance
  // Parameters: details
  //
  _setProperties: function (details) {
    // Set core properties
    this.id = details.id;
    this.name = details.name;
    this.input = details.input;
    this.ipAddress = details.ip;
    this.launched = details.launched;
    this.resourceUri = details.resource_uri;
  }
};

exports.Device = Device;
