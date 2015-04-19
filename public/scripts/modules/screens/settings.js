'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SettingsScreen = (function() {
    var SettingsScreen = function() {
        this.$screen = $('#screen-settings');
        this.$footer = this.$screen.find('.footer-buttons');

        this.$buttons = {
            back: this.$footer.find('.back'),
            reset: this.$footer.find('.reset'),
            audio: this.$footer.find('.audio'),
            refresh: this.$footer.find('.refresh')
        };

        this.$buttons.back.on('click', function() {
            app.audio.playSound('back');
            app.screens.menu.display();
        });

        this.$buttons.reset.on('click', function() {
            app.storage.clear();
            location.reload();
        });

        this.$buttons.refresh.on('click', function() {
            location.reload();
        });

        this.$buttons.audio.on('click', function() {
            app.audio.toggleMute();
            app.audio.playMusic('background');
        });
    };

    SettingsScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');
    };

    return SettingsScreen;
}());
