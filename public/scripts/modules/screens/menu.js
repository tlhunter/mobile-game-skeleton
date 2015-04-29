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

        this.$buttons.campaign.on('click', function() {
            app.audio.playSound('select');
            app.screen.display('campaign');
        });

        this.$buttons.online.on('click', function() {
            app.audio.playSound('select');
            app.screen.display('online');
        });

        this.$buttons.settings.on('click', function() {
            app.audio.playSound('select');
            app.screen.display('settings');
        });

        this.$buttons.help.on('click', function() {
            app.audio.playSound('select');
            app.screen.display('help');
        });
    };

    MenuScreen.prototype.display = function() {
        app.audio.playMusic('background');
        this.$screen.show();

        app.analytics.track('SCREEN-MENU');
    };

    MenuScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    return MenuScreen;
}());
