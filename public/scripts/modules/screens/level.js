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
            stop: this.$footer.find('button.stop'),
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
            self.$buttons.play.hide();
            self.$buttons.stop.show();
        });

        this.$buttons.stop.on('click', function() {
            app.audio.playSound('stop');
            self.level.onStop();
            self.$buttons.play.show();
            self.$buttons.stop.hide();
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
            self.level.destroy();
            self.level = null;
            app.screens.campaign.display();
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

        var $gamefield = this.level.$gamefield;
        var interaction = new Hammer(
            $gamefield[0]
        );

        interaction.get('pinch').set({
            enable: true
        });

        interaction.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
        }));

        interaction.on('pinch', function(event) {
            self.level.setSize(event.scale);
        });

        /*
        interaction.on('pan', function(event) {
        });
        */

        $gamefield.on('click', function(event) {
            self.level.onTap(event);
        });

        // But hammer, I don't want you to stop my panning!
        $gamefield.attr('style', '');

        app.audio.playMusic('level');

        this.$screen.show();

        app.analytics.track('LEVEL-' + level_id);
    };

    return LevelScreen;
}());
