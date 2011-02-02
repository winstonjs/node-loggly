/*
 * log-test.js: Tests for vanilla logging with no authentication.
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
    
var config = helpers.loadConfig(),
    loggly = require('loggly').createClient({ subdomain: config.subdomain });

vows.describe('node-loggly/inputs').addBatch({
  "When using the node-loggly client": {
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
}).export(module);