'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Analytics = (function() {
  var Analytics = function(mixpanel_id) {
    var user_id = app.storage.get('user_id');

    if (!user_id) {
      user_id = Analytics.generateUUID();

      console.log("Creating a UUID...");

      app.storage.set('user_id', user_id);
    }

    console.log("Identifying user as", user_id);

    window.mixpanel.init(mixpanel_id, {
      persistence: 'localStorage'
    });

    this.mixpanel_id = mixpanel_id;
    this.user_id = user_id;

    window.mixpanel.identify(user_id);

    this.set({
      name: user_id,
      cordova: app.device.cordova,
      vendor: app.device.vendor
    });
  };

  /**
   * Tracks an analytic event
   */
  Analytics.prototype.track = function(event, data) {
    data = data || {};

    data.vendor = app.device.vendor;
    data.cordova = app.device.cordova;

    console.log("ANALYTIC", event, data);

    window.mixpanel.track(event, data);
  };

  /**
   * Sets key/value properties on the user in analytics
   *
   * This is required by Mixpanel to differentiate users
   */
  Analytics.prototype.set = function(data) {
    console.log("ANALYTIC SET", data);
    window.mixpanel.people.set(data);
  };

  /**
   * Generates a random UUID
   */
  Analytics.generateUUID = function() {
    function seg() {
      return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
    }

    return seg() + seg() + '-' + seg() + '-' + seg() + '-' + seg() + '-' + seg() + seg() + seg();
  };

  return Analytics;
}());
