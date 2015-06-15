'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Audio = (function() {
    var Audio = function(data) {
        this.collection = {
            music: {},
            sound: {}
        };

        this.current = null;
        Object.keys(data).forEach(function(audio_id) {
            var audio = data[audio_id];

            var audio_tag = new window.Audio(audio.file);

            if (audio.type === Audio.MUSIC) {
                audio_tag.loop = 'loop';
            }

            this.collection[audio.type][audio.id] = audio_tag;
        }, this);

        app.device.on('blur', function() {
            this.pauseMusic();
        }.bind(this));

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

    Audio.prototype.playMusic = function(id) {
        if (!this.collection.music[id]) {
            return console.error("Cannot find music with ID", id);
        }

        if (app.storage.get(Audio.MUTE.MUSIC, false)) {
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

    Audio.prototype.pauseMusic = function() {
        if (this.current) {
            this.collection.music[this.current].pause();
        }
    };

    Audio.prototype.resumeMusic = function() {
        if (this.current) {
            this.collection.music[this.current].play();
        }
    };

    Audio.prototype.playSound = function(id) {
        if (app.storage.get(Audio.MUTE.SOUND, false)) {
            return;
        }

        this.collection.sound[id].play();
    };

    Audio.prototype.muteSound = function(mute) {
        mute = typeof mute === 'boolean' ? mute : !app.storage.get(Audio.MUTE.SOUND, false);
        app.storage.set(Audio.MUTE.SOUND, mute);
    };

    Audio.prototype.muteMusic = function(mute) {
        mute = typeof mute === 'boolean' ? mute : !app.storage.get(Audio.MUTE.MUSIC, false);
        app.storage.set(Audio.MUTE.MUSIC, mute);

        if (mute && this.current) {
            this.collection.music[this.current].pause();
            this.collection.music[this.current].currentTime = 0;
            this.current = null;
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
