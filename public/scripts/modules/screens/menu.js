'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.MenuScreen = (function() {
    var MenuScreen = function() {
        this.screen = document.getElementById('screen-menu');
        var buttons = this.screen.getElementsByClassName('buttons')[0];

        this.buttons = {
            campaign: buttons.getElementsByClassName('campaign')[0],
            online: buttons.getElementsByClassName('online')[0],
            settings: buttons.getElementsByClassName('settings')[0],
            help: buttons.getElementsByClassName('help')[0]
        };

        this.buttons.campaign.onclick = this.onCampaign.bind(this);
        this.buttons.online.onclick = this.onOnline.bind(this);
        this.buttons.settings.onclick = this.onSettings.bind(this);
        this.buttons.help.onclick = this.onHelp.bind(this);
    };

    MenuScreen.prototype.display = function() {
        app.audio.playMusic('background');

        this.screen.style.display = 'block';

        app.analytics.track('SCREEN-MENU');
    };

    MenuScreen.prototype.hide = function() {
        this.screen.style.display = 'none';
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
