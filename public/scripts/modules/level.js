'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Level = (function() {
    var Level = function(level_id) {
		this.level_id = level_id;
    };

    Level.prototype.render = function() {
    };

    return Level;
}());
