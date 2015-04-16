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
            app.screens.campaign.display();
        });

        this.$buttons.online.on('click', function() {
            app.audio.playSound('select');
            app.screens.online.display();
        });

        this.$buttons.settings.on('click', function() {
            app.audio.playSound('select');
            app.screens.settings.display();
        });

        this.$buttons.help.on('click', function() {
            app.audio.playSound('select');
            app.screens.help.display();
        });
    };

    MenuScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-MENU');
    };

    return MenuScreen;
}());
