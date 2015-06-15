'use strict';

if (!MODULE) { var MODULE = {}; }

(function() {
  var storage_prefix = "sgol-";
  var url_prefix = location.origin;

  var app = {
    analytics: null,
    audio: null,
    interstitial: null,
    rank: null,
    network: new MODULE.Network(url_prefix),
    storage: new MODULE.Storage(storage_prefix),
    content: new MODULE.Content(),
    modal: new MODULE.Modal(),
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

  app.content.load(function(data) {
    if (!data) {
      return alert("Unable to load data");
    }

    app.audio = new MODULE.Audio(data.audio);
    app.analytics = new MODULE.Analytics(data.dictionary.mixpanel);
    app.interstitial = new MODULE.Interstitial(data.dictionary.admob);
    app.rank = new MODULE.Rank(data.ranks);

    app.screen.get('splash').finish();
  });
})();
