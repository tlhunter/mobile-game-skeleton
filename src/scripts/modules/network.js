'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Network = (function() {
  var TIMEOUT = 8 * 1000;

  var URLS = {
    'local-data': {
      url: './dist/data.json',
      local: true
    },
    'remote-data-production': {
      url: 'http://sgol.phobosrising.co/dist/data.json',
      local: false
    },
    'remote-data-development': {
      url: location.origin + '/data',
      local: false
    }
  };

  var Network = function() {};

  Network.prototype.get = function(name, callback) {
    var item = URLS[name];
    var url = item.url;

    if (!url) {
      return callback(null);
    }

    var ajax_settings;

    if (app.device.vendor === 'firefoxos' && item.remote) {
      ajax_settings = {
        mozSystem: true
      };
    }

    var xhr = new XMLHttpRequest(ajax_settings);

    xhr.timeout = TIMEOUT;

    xhr.open('GET', url, true);

    xhr.onload = function() {
      if (Network.isRequestSuccessful(this.status)) {
        try {
          var data = JSON.parse(this.response);
          return callback(data);
        } catch(e) {
          return callback(null);
        }
      }

      callback(null);
    };

    xhr.onerror = function() {
      callback(null);
    };

    xhr.ontimeout = function() {
      callback(null);
    };

    xhr.send();
  };

  // Placeholder for Socket
  Network.prototype.on = function(event, callback) {
    throw new Error("Not Yet Implemented");
  };

  Network.isRequestSuccessful = function(status) {
    // In Cordova for iOS local XHR requests have an HTTP status of 0
    if (status === 0 && app.device.vendor === 'ios' && app.device.cordova) {
      return true;
    }

    if (status >= 200 && status < 400) {
      return true;
    }

    return false;
  };

  return Network;
}());
