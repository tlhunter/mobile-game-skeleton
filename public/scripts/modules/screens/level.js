'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
    var LevelScreen = function() {
        this.$screen = $('#screen-level');
        this.$level = this.$screen.find('.level');
        this.$footer = this.$screen.find('footer');

        this.$buttons = {
            play: this.$footer.find('button.play'),
            clear: this.$footer.find('button.clear'),
            help: this.$footer.find('button.help'),
            library: this.$footer.find('button.library'),
            exit: this.$footer.find('button.exit')
        };

        this.$buttons.play.on('click', function() {
            app.audio.playSound('play');
        });

        this.$buttons.clear.on('click', function() {
            app.audio.playSound('clear');
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

        this.level = null;
        this.level_id = null;
    };

    LevelScreen.prototype.display = function(level_id) {
        $('#screens > .screen').hide();

        this.level_id = level_id;

        this.level = new MODULE.Level(level_id);
        app.audio.playMusic('level');

        this.$screen.show();

        app.analytics.track('LEVEL-' + level_id);
    };

    return LevelScreen;
}());
