'use strict';

var MODULE = window.MODULE || {};

(function() {
	var mixpanel_id = "f598ce903232263c47ca516bff05c18b";

	var app = {
		network: null,
		storage: null,
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
