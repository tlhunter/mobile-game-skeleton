'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Advertisement = (function() {
    var Advertisement = function(identifier) {
        this.identifier = identifier;
    };

    Advertisement.prototype.init = function(identifier) {
        this.identifier = identifier;
    };

    Advertisement.prototype.fullscreen = function() {
        console.log("TODO: Display full screen ad");
    };

    return Advertisement;
}());
