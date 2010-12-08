var config = {
  "subdomain": "test-subdomain",
  "auth": {
    "username": "test-username",
    "password": "test-password"
  }
};


var loggly = require('./lib/loggly').createClient(config),
    eyes   = require('eyes');


//eyes.inspect(loggly);

loggly.log('this is a test logging message from fooooo');