/*
 * loggly.js: Wrapper for node-loggly object
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */

require.paths.unshift(__dirname); 

var loggly = exports;

// Core
loggly.config           = require('loggly/config').config;
//loggly.createClient     = require('loggly/core').createClient;

// Inputs
loggly.Input            = require('loggly/input').Input; 
loggly.getInputs        = require('loggly/core').getInputs;