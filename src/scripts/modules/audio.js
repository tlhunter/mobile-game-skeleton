'use strict';

if (!MODULE) { var MODULE = {}; }

/**
 * Performs audio management
 *
 * Handles muting, loading the appropriate audio player,
 * pausing and resuming when app focus changes
 */
MODULE.Audio = (function() {
  var Audio = function(data) {
    var platform = Audio.getPlatform();
    if (platform === Audio.PLATFORM.CORDOVA) {
      console.log("Using AudioCordova for playback");
      this.player = new MODULE.AudioCordova(data);
    } else if (platform === Audio.PLATFORM.WEB) {
      console.log("Using AudioWeb for playback");
      this.player = new MODULE.AudioWeb(data);
    } else {
      console.error("UNABLE TO FIND A SUITABLE AUDIO PLAYER", platform);
    }

    // TODO: Required for Cordova Audio?
    app.device.on('blur', function() {
      this.pauseMusic();
    }.bind(this));

    // TODO: Required for Cordova Audio?
    app.device.on('focus', function() {
      this.resumeMusic();
    }.bind(this));
  };

  Audio.MUSIC = 'music';
  Audio.SOUND = 'sound';

  Audio.MUTE = {
    MUSIC: 'mute-music',
    SOUND: 'mute-sound'
  };

  Audio.PLATFORM = {
    // Compatible with Web, FirefoxOS, and even Cordova Android
    WEB: 'web',
    // Compatible with Cordova * (Specifically iOS)
    CORDOVA: 'cordova'
  };

  Audio.getPlatform = function() {
    if (app.device.cordova && 'Media' in window) {
      return Audio.PLATFORM.CORDOVA;
    } else {
      return Audio.PLATFORM.WEB;
    }
  };

  Audio.prototype.playMusic = function(id) {
    if (app.storage.get(Audio.MUTE.MUSIC, false)) {
      return;
    }

    this.player.playMusic(id);
  };

  Audio.prototype.pauseMusic = function() {
    this.player.pauseMusic();
  };

  Audio.prototype.resumeMusic = function() {
    this.player.resumeMusic();
  };

  Audio.prototype.playSound = function(id) {
    if (app.storage.get(Audio.MUTE.SOUND, false)) {
      return;
    }

    this.player.playSound(id);
  };

  Audio.prototype.muteSound = function(mute) {
    mute = typeof mute === 'boolean' ? mute : !app.storage.get(Audio.MUTE.SOUND, false);
    app.storage.set(Audio.MUTE.SOUND, mute);
  };

  Audio.prototype.muteMusic = function(mute) {
    mute = typeof mute === 'boolean' ? mute : !app.storage.get(Audio.MUTE.MUSIC, false);
    app.storage.set(Audio.MUTE.MUSIC, mute);

    if (mute) {
      // Stops the currently playing song if applicable
      this.player.stopMusic();
    }
  };

  Audio.prototype.isMuteSound = function() {
    return app.storage.get(Audio.MUTE.SOUND, false);
  };

  Audio.prototype.isMuteMusic = function() {
    return app.storage.get(Audio.MUTE.MUSIC, false);
  };

  return Audio;
}());
