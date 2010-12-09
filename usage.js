var config = {
  "subdomain": "test-subdomain",
  "auth": {
    "username": "test-username",
    "password": "test-password"
  }
};


var loggly = require('./lib/loggly').createClient(config),
    eyes   = require('eyes');

// basic logging without callback (method will "fire and forget")
loggly.log('this is a test logging message without a callback');

// basic logging with callback
loggly.log('this is a test logging message with a callback', function(err, rsp){
  eyes.inspect(err);
  eyes.inspect(rsp);
});
