# node-loggly

A client implementation for Loggly in node.js

## Installation

### Installing npm (node package manager)
<pre>
  curl http://npmjs.org/install.sh | sh
</pre>

### Installing winston
<pre>
  [sudo] npm install loggly
</pre>

## Usage

The node-loggly library is compliant with the [Loggly API][0]. Using node-loggly is easy for a variety of scenarios: logging, working with devices and inputs, searching, and facet searching.

### Getting Started
Before we can do anything with loggly, we have to create a client with valid credentials. We will authenticate for you automatically: 
<pre>
  var loggly = require('loggly');
  var config = {
    subdomain: "your-subdomain",
    auth: {
      username: "your-username",
      password: "your-password"
    }
  };
  var client = loggly.createClient(config);
</pre>

### Logging
There are two ways to send log information to loggly via node-loggly. The first is to simply call client.log with an appropriate input token:

<pre>
  client.log('your-really-long-input-token', '127.0.0.1 - Theres no place like home', function (err, result) {
    // Do something once you've logged
  });
</pre>

Note that the callback in the above example is optional, if you prefer the 'fire and forget' method of logging:
<pre>
  client.log('your-really-long-input-token', '127.0.0.1 - Theres no place like home');
</pre>

The second way to send log information to loggly is to do so once you've retrieved an input directly from loggly:
<pre>
  client.getInput('your-input-name', function (err, input) {
    input.log('127.0.0.1 - Theres no place like home');
  });
</pre> 

Again the callback in the above example is optional and you can pass it if you'd like to.

### Logging Shallow JSON Object Literals
In addition to logging pure strings it is also possible to pass shallow JSON object literals (i.e. no nested objects) to client.log(..) or input.log(..) methods, which will get converted into the [Loggly recommended string representation][1]. So

<pre>
  var source = {
    foo: 1,
    bar: 2,
    buzz: 3
  };
  
  input.log(source);
</pre>

will be logged as: 

<pre>
  foo=1,bar=2,buzz=3
</pre>

### Searching
[Searching][3] with node-loggly is easy. All you have to do is use the search() method defined on each loggly client:
<pre>
  var util = require('util');
  
  client.search('404', function (err, results) {
    // Inspect the result set
    util.inspect(results.data);
  });
</pre>

The search() exposes a chainable interface that allows you to set additional search parameters such as: ip, input name, rows, start, end, etc. 
<pre>
  var util = require('util');
  
  client.search('404')
        .meta({ ip: '127.0.0.1', inputname: test })
        .context({ rows: 10 })
        .run(function (err, results) {
          // Inspect the result set
          util.inspect(results.data);
        });
</pre>

The context of the search (set using the `.context()` method) represents additional parameters in the Loggly API besides the search query itself. See the [Search API documentation][9] for a list of all options.

Metadata set using the `.meta()` method is data that is set in the query parameter of your Loggly search, but `:` delimited. For more information about search queries in Loggly, check out the [Search Language Guide][4] on the [Loggly Wiki][5].

### Facet Searching
Loggly also exposes searches that can return counts of events over a time range. These are called [facets][6]. The valid facets are 'ip', 'date', and 'input'. Performing a facet search is very similar to a normal search: 
<pre>
  var util = require('util');
  
  client.facet('ip', '404')
        .context({ buckets: 10 })
        .run(function (err, results) {
          // Inspect the result set
          util.inspect(results.data);
        });
</pre>

The chaining and options for the facet method(s) are the same as the search method above. 

### Working with Devices and Inputs
Loggly exposes several entities that are available through node-loggly: inputs and devices. For more information about these terms, checkout the [Loggly Jargon][7] on the wiki. There are several methods available in node-loggly to work with these entities: 

<pre>
  //
  // Returns all inputs associated with your account
  //
  client.getInputs(function (err, inputs) { /* ... */ });
  
  //
  // Returns an input with the specified name
  //
  client.getInput('input-name', function (err, input) { /* ... */ });
  
  //
  // Returns all devices associated with your account
  //
  client.getDevices(function (err, devices) { /* ... */ });
</pre>

## Run Tests
All of the node-loggly tests are written in [vows][8], and cover all of the use cases described above. You will need to add your Loggly username, password, subdomain, and a test input to test/data/test-config.json before running tests:
<pre>
  {
    "subdomain": "your-subdomain",
    "auth": {
      "username": "your-username",
      "password": "your-password"
    },
    "inputs": [{
      "token": "your-really-long-token-you-got-when-you-created-an-http-input",
      "id": 000 // ID of this input
    }]
  }
</pre>

Once you have valid Rackspace credentials you can run tests with [vows][8]:
<pre>
  vows test/*-test.js --spec
</pre>

#### Author: [Charlie Robbins](http://www.github.com/indexzero)
#### Contributors: [Marak Squires](http://github.com/marak), [hij1nx](http://github.com/hij1nx)

[0]: http://wiki.loggly.com/apidocumentation
[1]: http://wiki.loggly.com/loggingfromcode
[3]: http://wiki.loggly.com/retrieve_events#search_uri
[4]: http://wiki.loggly.com/searchguide
[5]: http://wiki.loggly.com/
[6]: http://wiki.loggly.com/retrieve_events#facet_uris
[7]: http://wiki.loggly.com/loggingjargon
[8]: http://vowsjs.org
[9]: http://wiki.loggly.com/retrieve_events#optional