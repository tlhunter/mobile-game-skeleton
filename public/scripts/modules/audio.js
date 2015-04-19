'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Audio = (function() {
    var Audio = function() {
        this.music = {
            background: document.getElementById('music-background'),
            level: document.getElementById('music-level')
        };

        this.sound = {
            back: document.getElementById('sound-back'),
            select: document.getElementById('sound-select'),
            clear: document.getElementById('sound-clear'),
            play: document.getElementById('sound-play'),
            stop: document.getElementById('sound-stop')
        };

        this.current = null;
    };

    Audio.prototype.playMusic = function(id) {
        if (app.storage.get('mute', false)) {
            console.log('muted');
            return;
        }

        if (!this.current) {
            this.music[id].play();
        } else if (this.current && this.current !== id) {
            this.music[this.current].pause();
            this.music[this.current].currentTime = 0;
            this.music[id].play();
        }

        this.current = id;
    };

    Audio.prototype.playSound = function(id) {
        if (app.storage.get('mute', false)) {
            return;
        }

        this.sound[id].play();
    };

    Audio.prototype.toggleMute = function() {
        var mute = !app.storage.get('mute', false);

        if (mute && this.current) {
            this.music[this.current].pause();
            this.music[this.current].currentTime = 0;
            this.current = null;
        }

        app.storage.set('mute', mute);
    };

    return Audio;
}());
