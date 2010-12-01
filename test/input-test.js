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
        loggly.getInputs('test', this.callback);
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
  "When using the node-loggly client": {
    "the log() method": {
      topic: function () {
        loggly.log('this is a test logging message from /test/input-test.js', this.callback);
      },
      "should log messages to loggly": function (err, result) {
        assert.equal(result.response, 'success');
        assert.isObject(result)
      }
    }
  }
}).export(module);