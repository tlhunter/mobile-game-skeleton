'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Interstitial = (function() {
  var Interstitial = function(identifier) {
    this.identifier = identifier;
  };

  Interstitial.prototype.show = function() {
    console.log("TODO: Display full screen ad");
  };

  Interstitial.prototype.displayAdIfNeeded = function(level) {
    var min = app.content.data.dictionary.ad_min_level;
    var mod = app.content.data.dictionary.ad_mod_level;

    if (level >= min && level % mod === 0) {
      this.show();
    }
  };

  return Interstitial;
}());
