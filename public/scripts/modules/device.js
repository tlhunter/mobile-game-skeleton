'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Device = (function() {
    var Device = function() {
        EventEmitter.apply(this);

        this.viewport = {
            width: screen.availWidth,
            height: Math.min(screen.availHeight, window.innerHeight)
        };

        this.vendor = Device.getVendor();

        var self = this;
        document.addEventListener('visibilitychange', function() {
            console.log("VISIBILITY CHANGE, hidden:", document.hidden);
            if (document.hidden) {
                self.emit('blur');
            } else {
                self.emit('focus');
            }
        });
    };

    Device.prototype = Object.create(EventEmitter.prototype);

    Device.VENDORS = {
        ANDROID: 'android',
        IOS: 'ios',
        BB: 'blackberry',
        OPERA: 'opera',
        WINDOWS: 'windows'
    };

    Device.getVendor = function() {
        if (navigator.userAgent.match(/Android/i)) {
            return Device.VENDORS.ANDROID;
        } else if (navigator.userAgent.match(/BlackBerry/i)) {
            return Device.VENDORS.BB;
        } else if (navigator.userAgent.match(/iPhone|iPad|iPod/i)) {
            return Device.VENDORS.IOS;
        } else if (navigator.userAgent.match(/Opera Mini/i)) {
            return Device.VENDORS.opera;
        } else if (navigator.userAgent.match(/IEMobile/i)) {
            return Device.VENDORS.windows;
        }
    };

    return Device;
}());
