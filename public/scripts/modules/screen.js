'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Screen = (function() {
    var screens;

    var Screen = function(new_screens) {
        screens = new_screens;

        this.current = null;
    };

    Screen.prototype.display = function(screen, params) {
        if (!screens[screen]) {
            return console.error("Invalid Screen", screen);
        }

        app.modal.hide();

        if (this.current) {
            screens[this.current].hide();
        }

        this.current = screen;

        screens[screen].display(params);
    };

    Screen.prototype.hideAll = function() {
        app.modal.hide();

        Object.keys(screens).forEach(function(screen) {
            screens[screen].hide();
        }.bind(this));
    };

    Screen.prototype.get = function(screen) {
        return screens[screen];
    };

    Screen.prototype.list = function() {
        return Object.keys(screens);
    };

    return Screen;
}());
