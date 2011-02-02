/*
 * input-test.js: Tests for Loggly input requests
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

require.paths.unshift(require('path').join(__dirname, '..', 'lib'));
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    helpers = require('./helpers');
    
var options = {},
    testContext = {},
    config = helpers.loadConfig(),
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
    },
    "the getInput() method": {
      topic: function () {
        loggly.getInput('test', this.callback);
      },
      "should return a valid inputs": function (err, input) {
        assert.isNull(err);
        helpers.assertInput(input);
        testContext.input = input;
      }
    },
    "the log() method": {
      "when passed a callback": {
        topic: function () {
          loggly.log(
            config.inputs[0].token,
            'this is a test logging message from /test/input-test.js', 
            this.callback);
        },
        "should log messages to loggly": function (err, result) {
          assert.isNull(err);
          assert.isObject(result);
          assert.equal(result.response, 'ok');
        }
      },
      "when not passed a callback": {
        topic: function () {
          var emitter = loggly.log(config.inputs[0].token, 'this is a test logging message from /test/input-test.js');
          emitter.on('log', this.callback.bind(null, null));
        },
        "should log messages to loggly": function (err, result) {
          assert.isNull(err);
          assert.isObject(result);
          assert.equal(result.response, 'ok');
        }
      }
    }
  }
}).addBatch({
  "When using an instance of an input": {
    "the log() method": {
      "when passed a callback": {
        topic: function () {
          testContext.input.log('this is a test logging message from /test/input-test.js', this.callback)
        },
        "should log messages to loggly": function (err, result) {
          assert.isNull(err);
          assert.isObject(result);
          assert.equal(result.response, 'ok');
        }
      },
      "when not passed a callback": {
        topic: function () {
          var emitter = testContext.input.log('this is a test logging message from /test/input-test.js');
          emitter.on('log', this.callback.bind(null, null));
        },
        "should log messages to loggly": function (err, result) {
          assert.isNull(err);
          assert.isObject(result);
          assert.equal(result.response, 'ok');
        }
      }
    }
  }
}).export(module);