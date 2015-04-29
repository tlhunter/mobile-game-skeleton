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
            app.screen.display('menu');
        });

        this.$buttons.reset.on('click', function() {
            app.modal.show(
                app.content.data.dictionary.confirm_reset,
                [{
                    text: "Destroy",
                    callback: function() {
                        app.storage.clear();
                        location.reload();
                    }
                },
                {
                    text: "Cancel"
                }]
            );
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
        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');
    };

    SettingsScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    return SettingsScreen;
}());
