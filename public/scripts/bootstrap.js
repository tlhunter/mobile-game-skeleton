'use strict';

var MODULE = window.MODULE || {};

(function() {
	var mixpanel_id = "f598ce903232263c47ca516bff05c18b";
	var storage_prefix = "sgol-";
	var url_prefix = "";

	var app = {
		network: new MODULE.Network(url_prefix),
		storage: new MODULE.Storage(storage_prefix),
		analytics: new MODULE.Analytics(mixpanel_id),
		audio: new MODULE.Audio(),
		data: null,
		screens: {
			campaign: new MODULE.CampaignScreen(),
			help: new MODULE.HelpScreen(),
			level: new MODULE.LevelScreen(),
			menu: new MODULE.MenuScreen(),
			online: new MODULE.OnlineScreen(),
			settings: new MODULE.SettingsScreen(),
			splash: new MODULE.SplashScreen()
		}
	};

	window.app = app;
})();
