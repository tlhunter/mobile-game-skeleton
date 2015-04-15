'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SettingsScreen = (function() {
    var SettingsScreen = function() {
        this.$screen = $('#screen-settings');
    };

    SettingsScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');
    };

    return SettingsScreen;
}());
