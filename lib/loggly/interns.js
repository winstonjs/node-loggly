/*
 * interns.js: Internal utility functions for requesting against Loggly APIs
 *
 * (C) 2010 Nodejitsu Inc.
 * MIT LICENSE
 *
 */

var request = require('request'),
    loggly = require('../loggly');

var interns = exports;

// Failure HTTP Response codes based
// off Loggly specification.
var failCodes = {
  400: "Bad Request",
  401: "Unauthorized",
  403: "Forbidden",
  404: "Not Found",
  409: "Conflict / Duplicate",
  410: "Gone",
  500: "Internal Server Error",
  501: "Not Implemented",
  503: "Throttled"
};

// Export the set of Failure Codes
interns.failCodes = failCodes;

// Success HTTP Response codes based
// off Loggly specification.
var successCodes = {
  200: "OK",
  201: "Created", 
  202: "Accepted",
  203: "Non-authoritative information",
  204: "Deleted",
};

// Export the set of Success Codes
interns.successCodes = successCodes;

//
// Core method that actually sends requests to Loggly.
// This method is designed to be flexible w.r.t. arguments 
// and continuation passing given the wide range of different
// requests required to fully implement the Loggly API.
// 
// Continuations: 
//   1. 'callback': The callback passed into every node-loggly method
//   2. 'success':  A callback that will only be called on successful requests.
//                  This is used throughout node-loggly to conditionally
//                  do post-request processing such as JSON parsing.
//
// Possible Arguments (1 & 2 are equivalent):
//   1. interns.loggly('some-fully-qualified-url', auth, callback, success)
//   2. interns.loggly('GET', 'some-fully-qualified-url', auth, callback, success)
//   3. interns.loggly('DELETE', 'some-fully-qualified-url', auth, callback, success)
//   4. interns.loggly({ method: 'POST', uri: 'some-url', body: { some: 'body'} }, callback, success)
//
interns.loggly = function () {
  var args = Array.prototype.slice.call(arguments),
      success = args.pop(),
      callback = args.pop(),
      uri, method, requestBody, auth, headers;
  
  // Now that we've popped off the two callbacks
  // We can make decisions about other arguments
  if (args.length == 1) {
    if(typeof args[0] === 'string') {
      // If we got a string assume that it's the URI 
      method = 'GET';
      uri = args[0];
    }
    else {
      method = args[0]['method'] || 'GET',
      uri = args[0]['uri'];
      requestBody = args[0]['body'];
      auth = args[0]['auth'];
      headers = args[0]['headers'];
    }
  }
  else if (args.length == 2) {
    method = 'GET';
    uri = args[0];
    auth = args[1];
  }
  else {
    method = args[0];
    uri = args[1];
    auth = args[2];
  }
  
  var requestOptions = {
    uri: uri,
    method: method,
    headers: headers || {}
  };
  
  if (auth) {
    requestOptions['headers']['authorization'] = 'Basic ' + new Buffer(auth.username + ':' + auth.password).toString('base64');
  }
  
  if (requestBody) requestOptions.body = requestBody;
  
  try {
    request(requestOptions, function (err, res, body) {
      if (err) {
        if (callback) {
          callback(err);
        }
        return;
      }

      var statusCode = res.statusCode.toString();
      if (Object.keys(failCodes).indexOf(statusCode) !== -1) {
        if (callback) {
          callback(new Error('Loggly Error (' + statusCode + '): ' + failCodes[statusCode]));
        }
        return;
      }

      success(res, body);
    });
  }
  catch (ex) {
    if (callback) callback(ex);
  }
};

//
// function clone (obj)
//   Helper method for deep cloning pure JSON objects
//   i.e. JSON objects that are either literals or objects (no Arrays, etc)
//
interns.clone = function (obj) {
  var clone = {};
  for (var i in obj) {
    clone[i] = obj[i] instanceof Object ? interns.clone(obj[i]) : obj[i];
  }

  return clone;
};