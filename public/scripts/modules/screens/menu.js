'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.MenuScreen = (function() {
    var MenuScreen = function() {
        this.$screen = $('#screen-menu');
    };

    MenuScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();
    };

    return MenuScreen;
}());
