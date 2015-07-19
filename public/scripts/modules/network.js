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
      // url: 'http://static.zyu.me/games/strategic-game-of-life/data.json',
      url: 'http://zyu.me:1337/data',
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
      if (this.status >= 200 && this.status < 400) {
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

  return Network;
}());
