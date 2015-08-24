'use strict';

if (!MODULE) { var MODULE = {}; }

/**
 * This module handles music playback using the Cordova Media API
 */
MODULE.AudioCordova = (function() {
  // Are you fucking kidding me Cordova?
  var ANDROID_PREFIX = '/android_asset/www/';

  var AudioCordova = function(data) {
    var Media = window.Media; // JSLint ;)
    var self = this;
    var prefix = app.device.vendor === MODULE.Device.VENDORS.ANDROID ? ANDROID_PREFIX : '';

    this.collection = {
      music: {},
      sound: {}
    };

    this.current = null;

    Object.keys(data).forEach(function(audio_id) {
      var audio = data[audio_id];

      var filename = prefix + audio.file;

      var audio_obj;
      if (audio.type === MODULE.Audio.MUSIC) {
        audio_obj = new Media(filename, null, null, function(status) {
          console.log("LOOP CALLBACK FOR " + audio.file + " WITH STATUS " + status);

          if (self.current === audio_id && status === Media.MEDIA_STOPPED) {
            audio_obj.play();
          }
        });
      } else {
        audio_obj = new Media(filename);
      }

      this.collection[audio.type][audio.id] = audio_obj;
    }, this);
  };

  AudioCordova.prototype.playMusic = function(id) {
    if (!this.collection.music[id]) {
      return console.error("Cannot find music with ID", id);
    }

    if (this.current && this.current !== id) {
      this.stopMusic();
    }

    this.current = id;

    this.collection.music[id].play();
  };

  AudioCordova.prototype.stopMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].stop();
    this.current = null;
  };

  AudioCordova.prototype.pauseMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].pause();
  };

  AudioCordova.prototype.resumeMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].play();
  };

  AudioCordova.prototype.playSound = function(id) {
    this.collection.sound[id].play();
  };

  return AudioCordova;
}());
