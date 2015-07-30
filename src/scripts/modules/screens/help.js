'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.HelpScreen = (function() {
  var drawn = false;

  var HelpScreen = function() {
    this.screen = document.getElementById('screen-help');
    this.content = this.screen.getElementsByClassName('content')[0];

    this.buttons = {
      back: this.screen.querySelector('.footer-buttons .back')
    };

    this.buttons.back.onclick = this.onBack.bind(this);
  };

  HelpScreen.prototype.display = function() {
    if (!drawn) {
      drawn = true;
      this.content.innerHTML = app.content.data.dictionary.how_to_play;
    }

    this.screen.style.display='block';

    app.analytics.track('SCREEN-HELP');
  };

  HelpScreen.prototype.hide = function() {
    this.screen.style.display = 'none';
  };

  HelpScreen.prototype.onBack = function() {
    app.audio.playSound('back');
    app.screen.display('menu');
  };

  return HelpScreen;
}());
