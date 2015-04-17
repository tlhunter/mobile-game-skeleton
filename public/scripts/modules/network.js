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

        return $.get(url, callback);
    };

    // Placeholder for Socket
    Network.prototype.on = function(event, callback) {
    };

    return Network;
}());
