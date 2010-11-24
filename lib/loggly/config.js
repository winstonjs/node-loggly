/*
 * config.js: Configuration information for your Loggly account.
 *            This information is only used for require('loggly')./\.+/ methods
 *
 * (C) 2010 Charlie Robbins
 * MIT LICENSE
 *
 */
 
var Config = function () {
  // Remark: Nothing to see here
};
 
Config.prototype = {
  get subdomain () {
   return this._subdomain; 
  },
  
  set subdomain (value) {
    this._subdomain = value;
  },
  
  get logglyUrl () {
    return 'https://' + [this._subdomain, 'loggly', 'com'].join('.') + '/api';
  },
  
  auth: { 
     username: 'your-loggly-username', 
     password: 'your-loggly-password'
  },
};

exports.config = new (Config);
