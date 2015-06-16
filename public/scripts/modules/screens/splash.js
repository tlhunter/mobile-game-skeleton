'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SplashScreen = (function() {
  var LOADING_HIDE_TIME = 250;
  var BUTTONS_SHOW_TIME = 500;

  var SplashScreen = function() {
    this.screen = document.getElementById('screen-splash');
    this.actions = this.screen.getElementsByClassName('actions')[0];
    this.loading = this.actions.getElementsByClassName('loading')[0];

    this.buttons = {
      play: this.actions.getElementsByClassName('play')[0]
    };

    this.buttons.play.onclick = this.onPlay.bind(this);
  };

  SplashScreen.prototype.finish = function() {
    var self = this;

    setTimeout(function() {
      self.loading.classList.add('hide');

      setTimeout(function() {
        self.buttons.play.classList.add('show');
      }, BUTTONS_SHOW_TIME);
    }, LOADING_HIDE_TIME);
  };

  SplashScreen.prototype.display = function() {
    this.screen.style.display = 'block';

    //app.analytics.track('SCREEN-SPLASH');
  };

  SplashScreen.prototype.hide = function() {
    this.screen.style.display = 'none';
  };

  SplashScreen.prototype.onPlay = function() {
    app.audio.playSound('select');
    app.screen.display('menu');
  };

  return SplashScreen;
}());
