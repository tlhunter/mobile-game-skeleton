'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.MenuScreen = (function() {
    var MenuScreen = function() {
        this.$screen = $('#screen-menu');

        this.$buttons = {
            campaign: this.$screen.find('button.campaign'),
            online: this.$screen.find('button.online'),
            settings: this.$screen.find('button.settings'),
            help: this.$screen.find('button.help'),
        };

        this.$buttons.campaign.on('click', this.onCampaign.bind(this));
        this.$buttons.online.on('click', this.onOnline.bind(this));
        this.$buttons.settings.on('click', this.onSettings.bind(this));
        this.$buttons.help.on('click', this.onHelp.bind(this));
    };

    MenuScreen.prototype.display = function() {
        app.audio.playMusic('background');

        this.$screen.show();

        app.analytics.track('SCREEN-MENU');
    };

    MenuScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    MenuScreen.prototype.onCampaign = function() {
        app.audio.playSound('select');
        app.screen.display('campaign');
    };

    MenuScreen.prototype.onOnline = function() {
        app.audio.playSound('select');
        app.screen.display('online');
    };

    MenuScreen.prototype.onSettings = function() {
        app.audio.playSound('select');
        app.screen.display('settings');
    };

    MenuScreen.prototype.onHelp = function() {
        app.audio.playSound('select');
        app.screen.display('help');
    };

    return MenuScreen;
}());
