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
            select: document.getElementById('sound-select')
        };

        this.current = null;
    };

    Audio.prototype.playMusic = function(id) {
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
        this.sound[id].play();
    };

    return Audio;
}());
