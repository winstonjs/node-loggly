/*
 * helpers.js: Test helpers for node-loggly
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    vows = require('vows'),
    assert = require('assert'),
    loggly = require('../lib/loggly');

var helpers = exports;

helpers.validConfig = function (config) {
  return config
    && config.subdomain !== 'test-subdomain'
    && config.auth
    && config.auth.username !== 'test-username'
    && config.auth.password !== 'test-password'
    && config.token;
};

helpers.loadConfig = function () {
  try {
    var configFile = path.join(__dirname, 'data', 'test-config.json'),
        stats = fs.statSync(configFile)
        config = JSON.parse(fs.readFileSync(configFile).toString());
    
    if (!helpers.validConfig(config)) {
      util.puts('Config file test-config.json must be updated with valid data before running tests');
      process.exit(0);
    }

    helpers.config = config || {}
    return config || {};
  }
  catch (ex) {
    util.puts('Error parsing test-config.json');
    ex.stack.split('\n').forEach(function (line) {
      console.log(line);
    });
    
    process.exit(0);
  }
};

helpers.assertSearch = function (err, results) {
  assert.isNull(err);
  assert.isObject(results);
  assert.isArray(results.events);
  assert.isTrue(typeof results.total_events !== 'undefined');
};
