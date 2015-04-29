'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
    var AFTER_FINISH_TIME = 100;
    var FADE_OUT_TIME = 250;
    var FADE_IN_TIME = 500;

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
            app.screen.display('menu');
        });
    };

    SplashScreen.prototype.finish = function() {
        var self = this;

        setTimeout(function() {
            self.$loading.fadeOut(FADE_OUT_TIME);

            setTimeout(function() {
                self.$buttons.play.fadeIn(FADE_IN_TIME);
            }, FADE_OUT_TIME);
        }, AFTER_FINISH_TIME);
    };

    SplashScreen.prototype.display = function() {
        this.$screen.show();

        //app.analytics.track('SCREEN-SPLASH');
    };

    SplashScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    return SplashScreen;
}());
