'use strict';

if (!MODULE) { var MODULE = {}; }

(function() {
  if ("cordova" in window) {
    console.log("Cordova App");
    document.addEventListener("deviceready", initialize, false);
  } else {
    console.log("Web App");
    initialize();
  }

  function initialize() {
    var storage_prefix = "sgol-";

    var app = {
      analytics: null,
      audio: null,
      interstitial: null,
      rank: null,
      device: new MODULE.Device(),
      network: new MODULE.Network(),
      storage: new MODULE.Storage(storage_prefix),
      content: new MODULE.Content(),
      modal: new MODULE.Modal(),
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

      if (app.device.vendor === 'ios') {
        console.log("Loading FastClick library for iOS user");
        FastClick.attach(document.body);

        console.log("Preventing overscrolling of body element");
        document.ontouchmove = function(event) {
          event.preventDefault();
        };

        console.log("Preventing .scrollable elements from bubbling to body");
        var scrollables = document.getElementsByClassName('scrollable');
        for (var i = 0; i < scrollables.length; i++) {
          scrollables[i].ontouchmove = function(event) {
            event.stopPropagation();
          };
        }
      }

      app.screen.get('splash').finish();
    });
  }
})();
