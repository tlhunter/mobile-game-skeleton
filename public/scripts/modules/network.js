'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Network = (function() {
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

    var request = new XMLHttpRequest(ajax_settings);

    request.open('GET', url, true);

    request.onload = function() {
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

    request.onerror = function() {
      callback(null);
    };

    request.send();
  };

  // Placeholder for Socket
  Network.prototype.on = function(event, callback) {
    throw new Error("Not Yet Implemented");
  };

  return Network;
}());
