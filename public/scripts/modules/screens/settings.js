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

        this.$buttons.back.on('click', this.onBack.bind(this));
        this.$buttons.reset.on('click', this.onReset.bind(this));
        this.$buttons.refresh.on('click', this.onRefresh.bind(this));
        this.$buttons.audio.on('click', this.onAudio.bind(this));
    };

    SettingsScreen.prototype.display = function() {
        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');
    };

    SettingsScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    SettingsScreen.prototype.onReset = function() {
        app.modal.show(
            app.content.data.dictionary.confirm_reset,
            [{
                text: "Destroy",
                callback: function() {
                    app.storage.clear();
                    app.reload();
                }
            },
            {
                text: "Cancel"
            }], true
        );
    };

    SettingsScreen.prototype.onRefresh = function() {
        app.reload();
    };

    SettingsScreen.prototype.onAudio = function() {
        app.audio.toggleMute();
        app.audio.playMusic('background');
    };

    SettingsScreen.prototype.onBack = function() {
        app.audio.playSound('back');
        app.screen.display('menu');
    };

    return SettingsScreen;
}());
