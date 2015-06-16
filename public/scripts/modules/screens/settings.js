'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.SettingsScreen = (function() {
  var SettingsScreen = function() {
    this.screen = document.getElementById('screen-settings');
    var buttons = this.screen.getElementsByClassName('footer-buttons')[0];

    this.buttons = {
      back: buttons.getElementsByClassName('back')[0],
      reset: buttons.getElementsByClassName('reset')[0],
      sound: buttons.getElementsByClassName('toggle-sfx')[0],
      music: buttons.getElementsByClassName('toggle-bgm')[0],
      refresh: buttons.getElementsByClassName('refresh')[0]
    };

    this.sound_mute = this.buttons.sound.getElementsByTagName('span')[0];
    this.music_mute = this.buttons.music.getElementsByTagName('span')[0];

    this.version = this.screen.getElementsByClassName('version')[0];

    this.buttons.back.onclick = this.onBack.bind(this);
    this.buttons.reset.onclick = this.onReset.bind(this);
    this.buttons.refresh.onclick = this.onRefresh.bind(this);
    this.buttons.sound.onclick = this.onSound.bind(this);
    this.buttons.music.onclick = this.onMusic.bind(this);
  };

  SettingsScreen.prototype.display = function() {
    this.version.textContent = app.content.data.version;

    this.screen.style.display = 'block';

    app.analytics.track('SCREEN-SETTINGS');

    this.renderMuteButtons();
  };

  SettingsScreen.prototype.renderMuteButtons = function() {
    this.sound_mute.textContent = app.audio.isMuteSound() ? "Enable" : "Disable";
    this.music_mute.textContent = app.audio.isMuteMusic() ? "Enable" : "Disable";
  };

  SettingsScreen.prototype.hide = function() {
    this.screen.style.display = 'none';
  };

  SettingsScreen.prototype.onReset = function() {
    app.modal.show(
      app.content.data.dictionary.confirm_reset,
      [{
        text: "Destroy",
        callback: function() {
          app.storage.clear();
          app.reload();
        }
      },
      {
        text: "Cancel"
      }], true
    );
  };

  SettingsScreen.prototype.onRefresh = function() {
    app.reload();
  };

  SettingsScreen.prototype.onSound = function() {
    app.audio.muteSound();

    this.renderMuteButtons();
  };

  SettingsScreen.prototype.onMusic = function() {
    app.audio.muteMusic();
    app.audio.playMusic('background');

    this.renderMuteButtons();
  };

  SettingsScreen.prototype.onBack = function() {
    app.audio.playSound('back');
    app.screen.display('menu');
  };

  return SettingsScreen;
}());
