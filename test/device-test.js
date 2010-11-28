/*
 * device-test.js: Tests for Loggly device requests
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

vows.describe('node-loggly/devices').addBatch({
  "When using the node-loggly client": {
    "the getDevices() method": {
      topic: function () {
        loggly.getDevices(this.callback);
      },
      "should return a list of valid devices": function (err, devices) {
        assert.isNull(err);
        devices.forEach(function (device) {
          helpers.assertDevice(device);
        });
      }
    },
    "the addDevice() method": {
      topic: function () {
        loggly.addDevice(512, '127.0.0.1', this.callback);
      },
      "should respond with 200 status code": function (err, res) {
        assert.isNull(err);
        assert.equal(res.statusCode, 200);
      }
    }
  }
}).export(module);