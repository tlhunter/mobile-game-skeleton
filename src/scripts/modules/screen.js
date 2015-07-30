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

  // Universal Back handler
  Screen.prototype.onBack = function() {
    // If the Modal window is open, close it and return
    if (app.modal.visible) {
      return app.modal.fadeOut();
    }

    var current_screen = screens[this.current];

    // If the currently displayed screen has an .onBack(), run that
    if (this.current && "onBack" in current_screen) {
      current_screen.onBack();
    }
  };

  return Screen;
}());
