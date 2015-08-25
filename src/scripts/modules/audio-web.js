'use strict';

if (!MODULE) { var MODULE = {}; }

/**
 * This module handles music playback using the HTML5 Audio API
 */
MODULE.AudioWeb = (function() {
  var AudioWeb = function(data) {
    this.collection = {
      music: {},
      sound: {}
    };

    this.current = null;

    Object.keys(data).forEach(function(audio_id) {
      var audio = data[audio_id];

      var audio_tag = new Audio(audio.file);

      if (audio.type === MODULE.Audio.MUSIC) {
        audio_tag.loop = 'loop';
      }

      this.collection[audio.type][audio.id] = audio_tag;
    }, this);
  };

  AudioWeb.prototype.playMusic = function(id) {
    if (!this.collection.music[id]) {
      return console.error("Cannot find music with ID", id);
    }

    if (this.current && this.current !== id) {
      this.stopMusic();
    }

    this.current = id;

    this.collection.music[id].play();
  };

  AudioWeb.prototype.stopMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].pause();
    this.collection.music[this.current].currentTime = 0;

    this.current = null;
  };

  AudioWeb.prototype.pauseMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].pause();
  };

  AudioWeb.prototype.resumeMusic = function() {
    if (!this.current) {
      return;
    }

    this.collection.music[this.current].play();
  };

  AudioWeb.prototype.playSound = function(id) {
    this.collection.sound[id].play();
  };

  return AudioWeb;
}());
