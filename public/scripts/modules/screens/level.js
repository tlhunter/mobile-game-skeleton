'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
    var LevelScreen = function() {
        var self = this;

        this.$screen = $('#screen-level');
        this.$level = this.$screen.find('.level');
        this.$footer = this.$screen.find('footer');
        this.$header = this.$screen.find('header');
        this.$generation = this.$header.find('.generation');
        this.$played = this.$header.find('.played');
        this.$title = this.$header.find('.title');

        this.$buttons = {
            play: this.$footer.find('button.play'),
            clear: this.$footer.find('button.clear'),
            help: this.$footer.find('button.help'),
            library: this.$footer.find('button.library'),
            exit: this.$footer.find('button.exit')
        };

        this.level = null;
        this.level_id = null;

        this.$buttons.play.on('click', function() {
            app.audio.playSound('play');
            self.level.onPlay();
        });

        this.$buttons.clear.on('click', function() {
            app.audio.playSound('clear');
            self.level.onClear();
        });

        this.$buttons.help.on('click', function() {
            console.log('help');
        });

        this.$buttons.library.on('click', function() {
            console.log('library');
        });

        this.$buttons.exit.on('click', function() {
            app.audio.playSound('back');
            if (window.confirm("Are you sure you want to leave? Any progress will be lost.")) {
                app.screens.campaign.display();
            }
        });
    };

    LevelScreen.prototype.display = function(level_id) {
        var self = this;
        $('#screens > .screen').hide();

        this.level_id = level_id;

        var raw_level = app.content.data.campaign[level_id];
        this.$title.html(raw_level.name);

        this.level = new MODULE.Level(raw_level, this.$level);

        this.level.onGeneration(function(generation) {
            self.$generation.text(generation);
        }).onPlayCount(function(played) {
            self.$played.text(played);
        });

        app.audio.playMusic('level');

        this.$screen.show();

        app.analytics.track('LEVEL-' + level_id);
    };

    return LevelScreen;
}());
