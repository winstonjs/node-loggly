/*
 * input-test.js: Tests for Loggly input requests
 *
 * (C) 2010 Charlie Robbins
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
    "the search() method": {
      topic: function () {
        loggly.search('inputname:test', this.callback);
      },
      "should return a set of valid search results": function (err, results) {
        assert.isNull(err);
        assert.isObject(results);
        assert.isTrue(typeof results.data !== 'undefined');
        assert.isTrue(typeof results.numFound !== 'undefined');
        assert.isTrue(typeof results.context !== 'undefined');
      }
    }
  }
}).export(module);