'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
    var LevelScreen = function() {
        this.$screen = $('#screen-level');
        this.$level = this.$screen.find('.level');
    };

    LevelScreen.prototype.display = function(level_id) {
        $('#screens > .screen').hide();

        var level = new MODULE.Level(level_id);

        this.$level.text(level_id);

        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');
    };

    return LevelScreen;
}());
