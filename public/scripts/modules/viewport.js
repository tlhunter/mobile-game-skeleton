'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Viewport = (function() {
    var Viewport = function() {
        this.width = screen.availWidth;
        this.height = Math.min(screen.availHeight, $(window).height());
    };

    return Viewport;
}());
