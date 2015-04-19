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
            app.audio.playSound('select');
            app.screens.menu.display();
        });
    };

    SplashScreen.prototype.finish = function() {
        var self = this;

        setTimeout(function() {
            self.$loading.fadeOut(250);

            setTimeout(function() {
                self.$buttons.play.fadeIn(500);
            }, 250);
        }, 250);
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
