'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Audio = (function() {
    var Audio = function() {
        this.collection = {
            music: {},
            sound: {}
        };

        this.current = null;
    };

    Audio.prototype.init = function() {
        var data = app.content.data.audio;

        Object.keys(data).forEach(function(audio_id) {
            var audio = data[audio_id];

            var audio_tag = new window.Audio(audio.file);

            if (audio.type === 'music') {
                audio_tag.loop = 'loop';
            }

            this.collection[audio.type][audio.id] = audio_tag;
        }, this);
    };

    Audio.prototype.playMusic = function(id) {
        if (!this.collection.music[id]) {
            return console.error("Cannot find music with ID", id);
        }

        if (app.storage.get('mute', false)) {
            console.log('muted');
            return;
        }

        if (!this.current) {
            this.collection.music[id].play();
        } else if (this.current && this.current !== id) {
            this.collection.music[this.current].pause();
            this.collection.music[this.current].currentTime = 0;
            this.collection.music[id].play();
        }

        this.current = id;
    };

    Audio.prototype.playSound = function(id) {
        if (app.storage.get('mute', false)) {
            return;
        }

        this.collection.sound[id].play();
    };

    Audio.prototype.toggleMute = function() {
        var mute = !app.storage.get('mute', false);

        if (mute && this.current) {
            this.collection.music[this.current].pause();
            this.collection.music[this.current].currentTime = 0;
            this.current = null;
        }

        app.storage.set('mute', mute);
    };

    return Audio;
}());
