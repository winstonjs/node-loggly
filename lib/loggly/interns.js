/*
 * interns.js: Internal utility functions for requesting against Loggly APIs
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */


require.paths.unshift(require('path').join(__dirname, '..'));

var eyes = require('eyes'),
    request = require('request'),
    loggly = require('loggly');


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
//   1. interns.loggly('some-fully-qualified-url', callback, success)
//   2. interns.loggly('GET', 'some-fully-qualified-url', callback, success)
//   3. interns.loggly('DELETE', 'some-fully-qualified-url', callback, success)
//   4. interns.loggly({ method: 'POST', uri: 'some-url', body: { some: 'body'} }, callback, success)
//
interns.loggly = function () {
  var args = Array.prototype.slice.call(arguments),
      success = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      uri, method, requestBody, auth;
      
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
    }
  }
  else {
    method = args[0];
    uri = args[1];
  }
  
  // If we weren't passed auth or subdomain use config
  auth = auth || loggly.config.auth;

  var requestOptions = {
    uri: uri,
    method: method,
    headers: {
      'Authorization': 'Basic ' + new Buffer(auth.username + ':' + auth.password).toString('base64')
    }
  };
  
  if (typeof requestBody !== 'undefined') {
    requestOptions.headers['Content-Type'] = 'application/json';
    requestOptions.body = JSON.stringify(requestBody);
  }
  
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
    eyes.inspect(ex);
    callback(ex);
  }
};

//
// Helper method that concats the string params into a url
// to request against the authenticated node-loggly
// serverUrl. 
//
interns.logglyUrl = function () {
  var args = Array.prototype.slice.call(arguments);
  return [loggly.config.logglyUrl].concat(args).join('/');
};