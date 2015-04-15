'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
    var LevelScreen = function() {
        this.$screen = $('#screen-level');
    };

    LevelScreen.prototype.display = function(level_id) {
        $('#screens > .screen').hide();
        this.$screen.show();

        var level = new MODULE.Level(level_id);

        app.analytics.track('SCREEN-SETTINGS');
    };

    return LevelScreen;
}());
