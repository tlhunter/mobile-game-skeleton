'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.HelpScreen = (function() {
    var HelpScreen = function() {
        this.$screen = $('#screen-help');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$buttons.back.on('click', function() {
            app.screens.menu.display();
        });
    };

    HelpScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-HELP');
    };

    return HelpScreen;
}());
