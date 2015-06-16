'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Network = (function() {
  var URLS = {
    data: '/data'
  };

  var Network = function(url_prefix) {
    this.url_prefix = url_prefix;
  };

  Network.prototype.get = function(item, callback) {
    var url = URLS[item];

    if (!url) {
      return callback(null);
    }

    url = this.url_prefix + url;

    var request = new XMLHttpRequest();

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
