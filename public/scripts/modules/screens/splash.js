'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
    var SplashScreen = function() {
        var self = this;
        this.$screen = $('#screen-splash');

        this.$actions = this.$screen.find('.actions');
    };

    SplashScreen.prototype.finish = function() {
        var $button = $('<button class="full">Play</button>');

        $button.on('click', function() {
            app.screens.menu.display();
            app.audio.playSound('select');
            app.audio.playMusic('background');
        });

        this.$actions.html($button);
    };

    /*
    SplashScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-SPLASH');
    };
    */

    return SplashScreen;
}());
