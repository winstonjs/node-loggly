/*
 * input.js: Instance of a single Loggly input
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
require.paths.unshift(require('path').join(__dirname, '..'));

var loggly = require('loggly'),
    util = require('util'),
    interns = require('./interns');
 
var Input = function (details) {
  if (!details) {
    throw new Error("Input must be constructed with at least basic details.")
  }
  
  this._setProperties(details);
};

Input.prototype = {
  //
  // Sets the properties for this instance
  // Parameters: details
  //
  _setProperties: function (details) {
    // Set core properties
    this.id = details.id;
    this.name = details.name;
    this.service = details.service;
    this.create = details.created;
    this.discover = details.discover;
    this.discoverTime = details.discover_time;
    this.description = details.description;
  }
};

exports.Input = Input;
