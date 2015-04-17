'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Content = (function() {
    var Content = function() {
        this.data = null;
        this.ready = false;
    };

    Content.prototype.load = function(callback) {
        var self = this;

        app.network.get('data', function(data) {
            self.data = Object.freeze(data);
            self.ready = true;

            callback(self.data);
        });
    };

    Content.prototype.get = function(key) {
        if (!this.ready) {
            return null;
        }

        return this.data[key];
    };

    return Content;
}());
