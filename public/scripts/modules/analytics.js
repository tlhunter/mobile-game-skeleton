'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Analytics = (function() {
    var Analytics = function(identifier) {
        this.identifier = identifier;

        window.mixpanel.init(this.identifier);
    };

    Analytics.prototype.track = function(event, data) {
        data = data || {};

        window.mixpanel.track(event, data);

        console.log("ANALYTIC", event, data);
    };

    return Analytics;
}());
