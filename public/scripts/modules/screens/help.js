'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.HelpScreen = (function() {
    var HelpScreen = function() {
        this.$screen = $('#screen-help');
    };

    HelpScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-HELP');
    };

    return HelpScreen;
}());
