/*
 * helpers.js: Test helpers for node-loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var fs = require('fs'),
    util = require('util'),
    path = require('path'),
    vows = require('vows'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var loggly = require('loggly');

var helpers = exports;

helpers.loadConfig = function () {
  var config = JSON.parse(fs.readFileSync(path.join(__dirname, 'test-config.json')).toString());
  if (config.subdomain === 'test-subdomain' 
      || config.auth.username === 'test-username'
      || config.auth.password === 'test-password') {
    util.puts('Config file test-config.json must be updated with valid data before running tests');
    process.exit(0);
  }
  
  return config
};

helpers.assertInput = function (input) {
  assert.instanceOf(input, loggly.Input);
  assert.isNotNull(input.id);
  assert.isNotNull(input.name);
  assert.isNotNull(input.service);
  assert.isNotNull(input.create);
  assert.isNotNull(input.discover);
  assert.isNotNull(input.discoverTime);
  assert.isNotNull(input.description);
};
