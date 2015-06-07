'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Advertisement = (function() {
    var Advertisement = function(identifier) {
        this.identifier = identifier;
    };

    Advertisement.prototype.init = function() {
        this.identifier = app.content.data.dictionary.admob;
    };

    Advertisement.prototype.fullscreen = function() {
        console.log("TODO: Display full screen ad");
    };

    return Advertisement;
}());
