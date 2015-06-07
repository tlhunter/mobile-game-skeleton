'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Analytics = (function() {
    var Analytics = function() {
    };

    Analytics.prototype.init = function() {
        this.identifier = app.content.data.dictionary.mixpanel;

        window.mixpanel.init(this.identifier);
    };

    Analytics.prototype.track = function(event, data) {
        data = data || {};

        window.mixpanel.track(event, data);

        console.log("ANALYTIC", event, data);
    };

    return Analytics;
}());
