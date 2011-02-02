/*
 * search.js: chainable search functions for Loggly
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var interns = require('./interns');

//
// function Search (query, client, callback) 
//   Chainable search object for Loggly API
//
var Search = exports.Search = function (query, client, callback) {
  this.query = query;
  this.client = client;
  
  // If we're passed a callback, run immediately.
  if (callback) {
    this.callback = callback;
    this.run();
  }
};

//
// function meta (meta)
//   Sets the appropriate metadata for this search query:
//   e.g. ip, inputname
//
Search.prototype.meta = function (meta) {
  this.meta = meta;
  return this;
};

//
// function context (context)
//   Sets the appropriate context for this search query:
//   e.g. rows, start, from, until, order, format, fields
//
Search.prototype.context = function (context) {
  this.context = context;
  return this;
};

//
// function run (callback) 
//   
//
Search.prototype.run = function (callback) {
  // Trim the search query 
  this.query.trim();
  
  // Update the callback for this instance if it's passed
  this.callback = callback || this.callback;
  if (!this.callback) {
    throw new Error('Cannot run search without a callback function.');
  }
  
  // If meta was passed, update the search query appropriately
  if (this.meta) {
    this.query += ' ' + qs.unescape(qs.stringify(meta, ' ', ':'));
  }

  // Set the context for the query string
  this.context = this.context || {};
  this.context.q = this.query;

  var searchOptions = {
    uri: this.logglyUrl('search?' + qs.stringify(this.context)),
    auth: this.client.config.auth
  };

  interns.loggly(searchOptions, this.callback, function (res, body) {
    this.callback(null, JSON.parse(body));
  });
  
  return this;
};
