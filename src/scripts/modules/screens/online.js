'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.OnlineScreen = (function() {
  var OnlineScreen = function() {
    this.screen = document.getElementById('screen-online');

    this.buttons = {
      back: this.screen.querySelector('.footer-buttons .back')
    };

    this.buttons.back.onclick = this.onBack.bind(this);
  };

  OnlineScreen.prototype.display = function() {
    this.screen.style.display = 'block';

    app.analytics.track('SCREEN-ONLINE');
  };

  OnlineScreen.prototype.hide = function() {
    this.screen.style.display = 'none';
  };

  OnlineScreen.prototype.onBack = function() {
    app.audio.playSound('back');
    app.screen.display('menu');
  };

  return OnlineScreen;
}());
