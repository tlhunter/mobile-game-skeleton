'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.HelpScreen = (function() {
    var drawn = false;

    var HelpScreen = function() {
        this.$screen = $('#screen-help');
        this.$content = this.$screen.find('.content');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$buttons.back.on('click', this.onBack.bind(this));
    };

    HelpScreen.prototype.display = function() {
        if (!drawn) {
            drawn = true;
            this.$content.html(app.content.data.dictionary.how_to_play);
        }

        this.$screen.show();

        app.analytics.track('SCREEN-HELP');
    };

    HelpScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    HelpScreen.prototype.onBack = function() {
        app.audio.playSound('back');
        app.screen.display('menu');
    };

    return HelpScreen;
}());
