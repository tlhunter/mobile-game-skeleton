'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
    var SplashScreen = function() {
        var self = this;
        this.$screen = $('#screen-splash');

        this.$actions = this.$screen.find('.actions');
        this.$loading = this.$actions.find('.loading');

        this.$buttons = {
            play: this.$actions.find('.play')
        };

        this.$buttons.play.on('click', function() {
            app.screens.menu.display();
            app.audio.playSound('select');
            app.audio.playMusic('background');
        });
    };

    SplashScreen.prototype.finish = function() {
        this.$loading.hide();
        this.$buttons.play.show();
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
