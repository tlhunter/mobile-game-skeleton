'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Content = (function() {
  var Content = function() {
    this.data = null;
    this.ready = false;
  };

  Content.prototype.load = function(callback) {
    var self = this;

    var cached_data = this.loadCachedData();

    if (!cached_data) {
      console.log("First time running application, get distributed data");

      return this.loadDistData(function(dist_data) {
        if (!dist_data) {
          console.error("UNABLE TO GET DIST DATA");
          return callback(null);
        }

        self.saveData(dist_data);

        self.loadLiveData(function(live_data) {
          if (!live_data) {
            return callback(dist_data);
          }

          self.saveData(live_data);
          callback(live_data);
        });
      });
    }

    this.saveData(cached_data);

    // We've run this before, just get data from live
    this.loadLiveData(function(live_data) {
      if (!live_data) {
        return callback(cached_data);
      }

      self.saveData(live_data);
      callback(live_data);
    });
  };

  /**
   * Attaches data to app.content.data, sets ready to true
   */
  Content.prototype.saveData = function(data) {
    app.storage.set('data', data);
    this.data = Object.freeze(data);
    this.ready = true;
  };

  /**
   * This loads data distributed with the application (oldest)
   */
  Content.prototype.loadDistData = function(callback) {
    app.network.get('local-data', function(data) {
      if (!data) {
        console.error("Unable to get local data!");

        return callback(null);
      }

      if (data) {
        console.log("Loaded data from dist", data.version);
      }

      callback(data);
    });
  };

  /**
   * This loads data from a local cache (e.g. localStorage) (middle)
   */
  Content.prototype.loadCachedData = function() {
    var data = app.storage.get('data');

    if (data) {
      console.log("Loaded data from cache", data.version);
    }

    return data;
  };

  /**
   * Loads data from the Content Management System (newest)
   *
   * TODO: Code looks ugly. Switch to promises?
   */
  Content.prototype.loadLiveData = function(callback) {
    var item = 'remote-data-production';

    if (app.storage.get('dev')) {
      item = 'remote-data-development';
    }

    console.log("Attempting to download latest content...");

    // Download Data
    app.network.get(item, function(data) {
      if (!data) {
        console.warn("Unable to get remote data.");

        return callback(null);
      }

      console.log("Received latest data!", data.version);

      callback(data);
    });
  };

  return Content;
}());
