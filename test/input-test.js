/*
 * input-test.js: Tests for Loggly input requests
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    eyes = require('eyes'),
    vows = require('vows'),
    helpers = require('./helpers'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var options = {}

var config = helpers.loadConfig(),
    loggly = require('loggly').createClient(config);

vows.describe('node-loggly/inputs').addBatch({
  "When using the node-loggly client": {
    "the getInputs() method": {
      topic: function () {
        loggly.getInputs(this.callback);
      },
      "should return a list of valid inputs": function (err, inputs) {
        assert.isNull(err);
        inputs.forEach(function (input) {
          helpers.assertInput(input);
        });
      }
    }
  }
}).addBatch({
  "When using the node-loggly client after creating a device ": {
    "the log() method": {
      topic: function () {
        loggly.log(this.callback);
      },
      "should log messages to loggly": function (err, devices) {
        assert.isTrue(false);
      }
    }
  }
}).export(module);