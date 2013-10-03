/*
 * log-test.js: Tests for vanilla logging with no authentication.
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    helpers = require('./helpers');

var config = helpers.loadConfig(),
    loggly = require('../lib/loggly').createClient({ subdomain: config.subdomain, token: config.token }),
    logglyJSON = require('../lib/loggly').createClient({ subdomain: config.subdomain, token: config.token, json: true });

vows.describe('node-loggly/inputs (no auth)').addBatch({
  "When using the node-loggly client without authentication": {
    "the log() method": {
      "to a 'text' input": {
        "when passed a callback": {
          topic: function () {
            loggly.log(
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
            loggly.log('this is a test logging message from /test/input-test.js');
            loggly.on('log', this.callback.bind(null, null));
          },
          "should log messages to loggly": function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            assert.equal(result.response, 'ok');
          }
        }
      },
      "to a 'json' input": {
        "when passed a callback": {
          topic: function () {
            logglyJSON.log({
                timestamp: new Date().getTime(),
                message: 'this is a test logging message from /test/input-test.js'
            }, this.callback);
          },
          "should log messages to loggly": function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            assert.equal(result.response, 'ok');
          }
        },
        "when not passed a callback": {
          topic: function () {
            logglyJSON.log({
              timestamp: new Date().getTime(),
              message: 'this is a test logging message from /test/input-test.js'
            });
            logglyJSON.on('log', this.callback.bind(null, null));
          },
          "should log messages to loggly": function (err, result) {
            assert.isNull(err);
            assert.isObject(result);
            assert.equal(result.response, 'ok');
          }
        }
      }
    }
  }
}).export(module);