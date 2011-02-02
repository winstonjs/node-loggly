
/*
 * core.js: chainable search functions for Loggly
 *
 * (C) 2010 hij1nx
 * MIT LICENSE
 *
 */

//
// Sample Usage:
//
// client
//   .search('404')
//   .meta({ ip: '127.0.0.1' })
//   .context({ rows: 100 })
//   .run(function () { /* ... */ });
//

var Search = exports.Search = function(query, client, callback) {

  this.query = query;
  this.client = client;
  if (callback) {
    this.run(callback);
  }
};

Search.prototype.meta = function (cfg) {

  this.meta = cfg;
  return this;
};

Search.prototype.context = function (cfg) {

  this.context = cfg;
  return this;
};

Search.prototype.run = function (callback) {

  if (this.meta) {
    this.query.trim();
    this.query += ' ' + qs.unescape(qs.stringify(meta, ' ', ':'));
  }

  this.context = this.context || {};
  this.context.q = this.query;

  var searchOptions = {
    uri: this.logglyUrl('search?' + qs.stringify(this.context)),
    auth: this.client.config.auth
  };

  interns.loggly(searchOptions, callback, function (res, body) {
    cb(null, JSON.parse(body));
  });

  return this;
};
