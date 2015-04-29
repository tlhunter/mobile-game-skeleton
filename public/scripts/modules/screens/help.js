'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.HelpScreen = (function() {
    var HelpScreen = function() {
        this.$screen = $('#screen-help');
        this.$content = this.$screen.find('.content');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$buttons.back.on('click', function() {
            app.audio.playSound('back');
            app.screen.display('menu');
        });

        this.content_loaded = false;
    };

    HelpScreen.prototype.display = function() {
        if (!this.content_loaded) {
            this.content_loaded = true;
            this.$content.html(app.content.data.dictionary.how_to_play);
        }
        this.$screen.show();

        app.analytics.track('SCREEN-HELP');
    };

    HelpScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    return HelpScreen;
}());
