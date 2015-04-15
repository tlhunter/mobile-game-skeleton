'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.OnlineScreen = (function() {
    var OnlineScreen = function() {
        this.$screen = $('#screen-online');
    };

    OnlineScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-ONLINE');
    };

    return OnlineScreen;
}());
