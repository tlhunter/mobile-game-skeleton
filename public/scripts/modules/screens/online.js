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
            app.screens.menu.display();
        });
    };

    OnlineScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-ONLINE');
    };

    return OnlineScreen;
}());
