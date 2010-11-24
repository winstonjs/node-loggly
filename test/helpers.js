/*
 * helpers.js: Test helpers for node-loggly
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var path = require('path'),
    vows = require('vows'),
    assert = require('assert');
    
require.paths.unshift(path.join(__dirname, '..', 'lib'));

var loggly = require('loggly');

var helpers = exports;

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
