'use strict';

if (!MODULE) { var MODULE = {}; }

(function() {
	var storage_prefix = "sgol-";
	var url_prefix = location.origin;

	var app = {
		network: new MODULE.Network(url_prefix),
		storage: new MODULE.Storage(storage_prefix),
		analytics: new MODULE.Analytics(),
		advertisement: new MODULE.Advertisement(),
		audio: new MODULE.Audio(),
		content: new MODULE.Content(),
		modal: new MODULE.Modal(),
		rank: new MODULE.Rank(),
		device: new MODULE.Device(),
		reload: location.reload.bind(location),
		screen: new MODULE.Screen({
			campaign: new MODULE.CampaignScreen(),
			help: new MODULE.HelpScreen(),
			level: new MODULE.LevelScreen(),
			menu: new MODULE.MenuScreen(),
			online: new MODULE.OnlineScreen(),
			settings: new MODULE.SettingsScreen(),
			splash: new MODULE.SplashScreen()
		})
	};

	window.app = app;

	app.screen.display('splash');

	app.content.load(function() {
		app.audio.init(app.content.data.audio);
		// TODO? app.audio = new MODULE.Audio(app.content.data.audio);
		app.analytics.init(app.content.data.dictionary.mixpanel);
		app.advertisement.init(app.content.data.dictionary.admob);
		app.rank.init(app.content.data.ranks);
		app.screen.get('splash').finish();
	});
})();
