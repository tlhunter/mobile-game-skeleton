'use strict';

if (!MODULE) { var MODULE = {}; }

(function() {
	var mixpanel_id = "f598ce903232263c47ca516bff05c18b";
	var storage_prefix = "sgol-";
	var url_prefix = location.origin;

	var app = {
		network: new MODULE.Network(url_prefix),
		storage: new MODULE.Storage(storage_prefix),
		analytics: new MODULE.Analytics(mixpanel_id),
		audio: new MODULE.Audio(),
		content: new MODULE.Content(),
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

	app.content.load(function() {
		app.screens.splash.finish();
	});
})();
