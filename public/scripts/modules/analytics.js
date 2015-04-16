'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Analytics = (function() {
    var Analytics = function(mixpanel_id) {
        this.mixpanel_id = mixpanel_id;

        window.mixpanel.init(mixpanel_id);
    };

    Analytics.prototype.track = function(event, data) {
        data = data || {};

        window.mixpanel.track(event, data);

        console.log("ANALYTIC", event, data);
    };

    return Analytics;
}());
