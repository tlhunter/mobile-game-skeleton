'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Interstitial = (function() {
    var Interstitial = function(identifier) {
        this.identifier = identifier;
    };

    Interstitial.prototype.init = function(identifier) {
        this.identifier = identifier;
    };

    Interstitial.prototype.show = function() {
        console.log("TODO: Display full screen ad");
    };

    return Interstitial;
}());
