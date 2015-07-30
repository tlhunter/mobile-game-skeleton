'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Device = (function() {
  var Device = function() {
    EventEmitter.apply(this);
    var self = this;

    this.viewport = {
      get width() {
        return screen.availWidth;
      },
      get height() {
        return Math.min(screen.availHeight, window.innerHeight);
      }
    };

    this.vendor = Device.getVendor();

    this.cordova = "cordova" in window;

    if (this.cordova) {
      document.addEventListener('pause', function() {
        console.log("VISIBILITY CHANGE, hidden:", true);
        self.emit('blur');
      });
      document.addEventListener('resume', function() {
        console.log("VISIBILITY CHANGE, hidden:", false);
        self.emit('focus');
      });
    } else {
      document.addEventListener('visibilitychange', function() {
        console.log("VISIBILITY CHANGE, hidden:", document.hidden);
        if (document.hidden) {
          self.emit('blur');
        } else {
          self.emit('focus');
        }
      });
    }

    this.fullscreen = new MODULE.Fullscreen();
  };

  Device.prototype = Object.create(EventEmitter.prototype);

  Device.VENDORS = {
    ANDROID: 'android',
    IOS: 'ios',
    BB: 'blackberry',
    OPERA: 'opera',
    WINDOWS: 'windows',
    FIREFOXOS: 'firefoxos'
  };

  Device.getVendor = function() {
    if (navigator.userAgent.match(/Android/i)) {
      return Device.VENDORS.ANDROID;
    } else if (navigator.userAgent.match(/BlackBerry/i)) {
      return Device.VENDORS.BB;
    } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
      return Device.VENDORS.IOS;
    } else if (navigator.userAgent.match(/Opera Mini/i)) {
      return Device.VENDORS.OPERA;
    } else if (navigator.userAgent.match(/IEMobile/i)) {
      return Device.VENDORS.WINDOWS;
    } else if (navigator.userAgent.match(/Mozilla.*Mobile/)) {
      return Device.VENDORS.FIREFOXOS;
    }
  };

  Device.prototype.reload = function() {
    location.reload();
  };

  return Device;
}());
