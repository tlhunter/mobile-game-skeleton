'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
    var SplashScreen = function() {
        var self = this;
        this.$screen = $('#screen-splash');

        this.$actions = this.$screen.find('.actions');

        setTimeout(function() {
            // TODO: This will be based on network activity
            self.finish();
        }, 1000);
    };

    SplashScreen.prototype.finish = function() {
        var $button = $('<button class="full">Play</button>');

        $button.on('click', function() {
            app.screens.menu.display();
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
