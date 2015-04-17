'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Storage = (function() {
    var Storage = function(prefix) {
		this.PREFIX = prefix || '';
    };

	Storage.prototype.set = function(key, value) {
		var json = JSON.stringify(value);

		key = this.PREFIX + key;

		localStorage.setItem(key, json);
	};

	Storage.prototype.get = function(key, fallback) {
		key = this.PREFIX + key;

		var json = localStorage.getItem(key);

		if (json === null) {
			return fallback || null;
		}

		var data = JSON.parse(json);

		return data;
	};

	Storage.prototype.remove = function(key) {
		key = this.PREFIX + key;

		localStorage.removeItem(key);
	};

	Storage.prototype.clear = function() {
		var self = this;
		var removed = 0;

		Object.keys(localStorage).forEach(function(key) {
			if (key.indexOf(self.PREFIX) === 0) {
				localStorage.removeItem(key);
				removed++;
			}
		});

		return removed;
	};

    return Storage;
}());
