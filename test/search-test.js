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

vows.describe('node-loggly/search').addBatch({
  "When using the node-loggly client": {
    "the search() method": {
      "when searching without chaining": {
        topic: function () {
          loggly.search('logging message', this.callback);
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      },
      "when searching with chaining": {
        topic: function () {
          loggly.search('logging message')
                .meta({ inputname: 'test' })
                .run(this.callback);
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      }
    },
    "the facet() method": {
      "when searching by ip": {
        topic: function () {
          loggly.facet('ip', 'test', this.callback);
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      },
      "when using chained searches": {
        topic: function () {
          loggly.facet('ip', 'test')
                .context({ from: 'NOW-1MONTH' })
                .run(this.callback);
        },
        "should return a set of valid search results": function (err, results) {
          helpers.assertSearch(err, results);
        }
      }
    }
  }
}).export(module);