'use strict';

if (!MODULE) { var MODULE = {}; }

/**
 * Note: Don't name this file advertisement.js and ship it to a browser; it'll get blocked
 */
MODULE.Interstitial = (function() {
  var Interstitial = function(data) {
    this.identifier = null;
    this.type = null;

    if (app.device.vendor === MODULE.Device.VENDORS.ANDROID && app.device.cordova) {
      this.identifier = data.android;
      this.grabAdMob();
    } else if (app.device.vendor === MODULE.Device.VENDORS.IOS && app.device.cordova) {
      this.identifier = data.ios;
      this.grabAdMob();
    } else {
      this.identifier = data.web;
      this.type = Interstitial.TYPE.ADSENSE;
    }
  };

  Interstitial.TYPE = {
    ADMOB: 'admob',
    ADSENSE: 'adsense'
  };

  Interstitial.prototype.grabAdMob = function() {
    this.type = Interstitial.TYPE.ADMOB;

    if (!window.AdMob) {
      console.error("AD TYPE = ADMOB BUT window.AdMob IS NOT PRESENT");

      this.admob = {
        prepareInterstitial: function() {},
        showInterstitial: function() {}
      };
    } else {
      this.admob = window.AdMob;
    }
  };

  Interstitial.prototype.prepare = function() {
    if (this.type !== Interstitial.TYPE.ADMOB) {
      return;
    }

    this.admob.prepareInterstitial({
      adId: this.identifier,
      autoShow: false
    });
  };

  Interstitial.prototype.display = function() {
    if (this.type === Interstitial.TYPE.ADMOB) {
      return this.admob.showInterstitial();
    }

    console.error("TODO: Display AdSense ad in large window");
  };

  Interstitial.prototype.prepareAdIfNeeded = function(level) {
    if (this.isAdLevel(level)) {
      this.prepare(level);
      return true;
    }

    return false;
  };

  Interstitial.prototype.displayAdIfNeeded = function(level) {
    if (this.isAdLevel(level)) {
      this.display(level);
      return true;
    }

    return false;
  };

  Interstitial.prototype.isAdLevel = function(level) {
    var min = app.content.data.dictionary.ad_min_level;
    var mod = app.content.data.dictionary.ad_mod_level;

    return level >= min && level % mod === 0;
  };

  return Interstitial;
}());
