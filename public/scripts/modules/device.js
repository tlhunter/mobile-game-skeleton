'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Device = (function() {
    var Device = function() {
        this.viewport = {
            width: screen.availWidth,
            height: Math.min(screen.availHeight, $(window).height())
        };

        this.vendor = Device.getVendor();
    };

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
