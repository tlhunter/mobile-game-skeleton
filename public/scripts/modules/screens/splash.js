'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
    var LOADING_HIDE_TIME = 250;
    var BUTTONS_SHOW_TIME = 500;

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
        this.$loading.fadeOut(LOADING_HIDE_TIME, function() {
            this.$buttons.play.fadeIn(BUTTONS_SHOW_TIME);
        }.bind(this));
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
