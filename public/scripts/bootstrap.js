'use strict';

var MODULE = window.MODULE || {};

var app = {
	network: null,
	storage: null,
	analytics: null,
	audio: null,
	data: null,
	screens: {
		//campaign: new MODULE.CampaignScreen(),
		//help: new MODULE.HelpScreen(),
		//level: new MODULE.LevelScreen(),
		menu: new MODULE.MenuScreen(),
		//online: new MODULE.OnlineScreen(),
		//settings: new MODULE.SettingsScreen(),
		splash: new MODULE.SplashScreen()
	}
};

