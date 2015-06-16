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

  return Content;
}());
