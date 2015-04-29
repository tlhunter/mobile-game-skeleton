'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.OnlineScreen = (function() {
    var OnlineScreen = function() {
        this.$screen = $('#screen-online');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$buttons.back.on('click', function() {
            app.audio.playSound('back');
            app.screen.display('menu');
        });
    };

    OnlineScreen.prototype.display = function() {
        this.$screen.show();

        app.analytics.track('SCREEN-ONLINE');
    };

    OnlineScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    return OnlineScreen;
}());
