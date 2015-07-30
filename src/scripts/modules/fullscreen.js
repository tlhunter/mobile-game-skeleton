'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Fullscreen = (function() {
  var body = document.documentElement;

  var Fullscreen = function() {
  };

  Fullscreen.prototype.isFullscreen = function() {
    return !!(document.fullscreenElement || document.mozFullScreenElement || document.webkitFullscreenElement || document.msFullscreenElement);
  };

  Fullscreen.prototype.request = function() {
    if (body.requestFullscreen) {
      return body.requestFullscreen();
    } else if (body.msRequestFullscreen) {
      return body.msRequestFullscreen();
    } else if (body.mozRequestFullScreen) {
      return body.mozRequestFullScreen();
    } else if (body.webkitRequestFullscreen) {
      return body.webkitRequestFullscreen(Element.ALLOW_KEYBOARD_INPUT);
    }
  };

  Fullscreen.prototype.exit = function() {
    if (document.exitFullscreen) {
      return document.exitFullscreen();
    } else if (document.msExitFullscreen) {
      return document.msExitFullscreen();
    } else if (document.mozCancelFullScreen) {
      return document.mozCancelFullScreen();
    } else if (document.webkitExitFullscreen) {
      return document.webkitExitFullscreen();
    }
  };

  Fullscreen.prototype.toggle = function() {
    if (this.isFullscreen()) {
      this.exit();
    } else {
      this.request();
    }
  };

  return Fullscreen;
}());

