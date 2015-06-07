'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SettingsScreen = (function() {
    var SettingsScreen = function() {
        this.$screen = $('#screen-settings');
        var $buttons = this.$screen.find('.footer-buttons');

        this.$buttons = {
            back: $buttons.find('.back'),
            reset: $buttons.find('.reset'),
            sound: $buttons.find('.toggle-sfx'),
            music: $buttons.find('.toggle-bgm'),
            refresh: $buttons.find('.refresh')
        };

        this.$sound_mute = this.$buttons.sound.find('span');
        this.$music_mute = this.$buttons.music.find('span');

        this.$version = this.$screen.find('.version');

        this.$buttons.back.on('click', this.onBack.bind(this));
        this.$buttons.reset.on('click', this.onReset.bind(this));
        this.$buttons.refresh.on('click', this.onRefresh.bind(this));
        this.$buttons.sound.on('click', this.onSound.bind(this));
        this.$buttons.music.on('click', this.onMusic.bind(this));
    };

    SettingsScreen.prototype.display = function() {
        this.$version.text(app.content.data.version);

        this.$screen.show();

        app.analytics.track('SCREEN-SETTINGS');

        this.renderMuteButtons();
    };

    SettingsScreen.prototype.renderMuteButtons = function() {
        this.$sound_mute.text(app.audio.isMuteSound() ? "Enable" : "Disable");
        this.$music_mute.text(app.audio.isMuteMusic() ? "Enable" : "Disable");
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

    SettingsScreen.prototype.onSound = function() {
        app.audio.muteSound();

        this.renderMuteButtons();
    };

    SettingsScreen.prototype.onMusic = function() {
        app.audio.muteMusic();
        app.audio.playMusic('background');

        this.renderMuteButtons();
    };

    SettingsScreen.prototype.onBack = function() {
        app.audio.playSound('back');
        app.screen.display('menu');
    };

    return SettingsScreen;
}());
