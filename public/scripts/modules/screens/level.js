'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
    var LevelScreen = function() {
        var self = this;

        this.$screen = $('#screen-level');

        this.$level = this.$screen.find('.level-container');
        this.$grid = this.$screen.find('.grid-container');

        this.$footer = this.$screen.find('footer');
        this.$header = this.$screen.find('header');
        this.$headerfooter = this.$screen.find('header, footer');

        this.$generation = this.$header.find('.generation');
        this.$played = this.$header.find('.played');

        this.$title = this.$header.find('.title');

        this.$antigoal = this.$header.find('.antigoal');
        this.$gengoal = this.$antigoal.find('.antigoal-gen');

        this.$maxplay = this.$header.find('.maxplay');
        this.$maxplayval = this.$maxplay.find('.maxplay-val');

        this.$segment_generation = this.$header.find('.segment-gen');
        this.$segment_played = this.$header.find('.segment-played');
        this.$segment_red = this.$header.find('.segment-red');
        this.$segment_green = this.$header.find('.segment-green');

        this.$maxred_current = this.$segment_red.find('.current');
        this.$maxred_limit = this.$segment_red.find('.limit');

        this.$mingreen_current = this.$segment_green.find('.current');
        this.$mingreen_limit = this.$segment_green.find('.limit');

        this.$buttons = {
            play: this.$footer.find('button.play'),
            stop: this.$footer.find('button.stop'),
            clear: this.$footer.find('button.clear'),
            help: this.$footer.find('button.help'),
            library: this.$footer.find('button.library'),
            exit: this.$footer.find('button.exit')
        };

        this.level = null;
        this.grid = null;
        this.level_id = null;
        this.library = null;

        this.$buttons.play.on('click', this.onPlay.bind(this));
        this.$buttons.stop.on('click', this.onStop.bind(this));
        this.$buttons.clear.on('click', this.onClear.bind(this));
        this.$buttons.help.on('click', this.onHelp.bind(this));
        this.$buttons.library.on('click', this.onLibrary.bind(this));
        this.$buttons.exit.on('click', this.onExit.bind(this));
    };

    LevelScreen.prototype.display = function(level_id) {
        var self = this;

        this.$buttons.play.show();
        this.$buttons.stop.hide();

        this.level_id = level_id;

        var raw_level = app.content.data.campaign[level_id];
        this.$title.html(raw_level.name);

        var constraints = {
            width: app.device.viewport.width,
            height: app.device.viewport.height - (this.$footer.outerHeight() + this.$header.outerHeight())
        };

        this.level = new MODULE.Level(raw_level, this.$level, constraints);

        this.grid = new MODULE.Grid(
            this.level.dimensions.width,
            this.level.dimensions.height,
            this.level.size,
            this.$grid
        );

        this.level
        .on('generation', function(generation) {
            self.$generation.text(generation);
        })
        .on('play-count', function(played) {
            self.$played.text(played);
        })
        .on('status', function(status) {
            if (status === MODULE.Level.STATUS.DONE) {
                self.complete();
            } else if (status === MODULE.Level.STATUS.LOSE) {
                self.lose();
            }
        })
        .on('win', function(old_level, new_level) {
            app.analytics.track('LEVEL-WIN', {
                level: old_level,
                new_level: new_level
            });

            app.modal.show(
                app.content.data.campaign[self.level_id].win, [{
                    text: "Stay"
                },{
                    text: "Next Level",
                    callback: function() {
                        app.screen.display('level', self.level_id + 1);
                    }
                }], true
            );
        })
        .on('lose', function() {
            app.modal.show(
                app.content.data.campaign[self.level_id].lose, [{
                    text: "Ok"
                }], true
            );
        })
        .on('green-count', function(count) {
            self.$mingreen_current.text(count);
        })
        .on('red-count', function(count) {
            self.$maxred_current.text(count);
        });

        this.level.start();

        if (level_id > app.storage.get('level')) {
            this.incomplete();
            this.intro();
        } else {
            this.complete();
        }

        this.setGenerationGoal(this.level.getGenerationGoal());
        this.setMaxPlay(this.level.maxplay);
        this.togglePlayedSegment(!!this.level.playables.length);
        this.toggleRedSegment(this.level.maxred);
        this.toggleGreenSegment(this.level.mingreen);

        var $gamefield = this.level.$gamefield;
        var finger = new Hammer($gamefield[0]);
        finger.get('pinch').set({enable: true});

        /*
        finger.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
        }));
        */

        finger.on('pinchstart', function() {
            self.level.scaleStart();
        });

        finger.on('pinch', function(event) {
            self.level.scale(event.scale);
            self.grid.scale(self.level.size);
        });

        finger.on('pinchend', function() {
            self.level.scaleEnd();
        });

        // finger.on('pan', function(event) {});

        $gamefield.on('click', function(event) {
            self.level.onTap(event);
        });

        // But hammer, I don't want you to stop my panning!
        $gamefield.attr('style', '');

        app.audio.playMusic('chapter-' + this.level.chapter);

        this.$screen.show();

        this.library = null;

        app.analytics.track('SCREEN-LEVEL', {
            level: level_id
        });

        // TODO: Debug purposes only
        window.level_handle = this.level;
    };

    LevelScreen.prototype.hide = function() {
        this.level.onStop();
        this.level = null;
        this.setGenerationGoal(0);
        this.setMaxPlay(0);
        this.$screen.hide();
    };

    LevelScreen.prototype.setGenerationGoal = function(generation) {
        this.$gengoal.text(generation);

        if (generation) {
            return this.$antigoal.show();
        }

        return this.$antigoal.hide();
    };

    LevelScreen.prototype.setMaxPlay = function(maxplay) {
        this.$maxplayval.text(maxplay);

        if (maxplay) {
            return this.$maxplay.show();
        }

        return this.$maxplay.hide();
    };

    LevelScreen.prototype.togglePlayedSegment = function(count) {
        this.$segment_played.toggle(!!count);
    };

    LevelScreen.prototype.toggleRedSegment = function(count) {
        this.$maxred_limit.text(count);
        this.$segment_red.toggle(!!count);
    };

    LevelScreen.prototype.toggleGreenSegment = function(count) {
        this.$mingreen_limit.text(count);
        this.$segment_green.toggle(!!count);
    };

    LevelScreen.prototype.complete = function() {
        this.$headerfooter.addClass('done');
        this.$buttons.exit.addClass('cycle');
    };

    LevelScreen.prototype.lose = function() {
        this.$headerfooter.addClass('lose');
    };

    LevelScreen.prototype.incomplete = function() {
        this.$headerfooter.removeClass('done');
        this.$buttons.exit.removeClass('cycle');
    };

    LevelScreen.prototype.intro = function() {
        app.modal.show("<h3 class='cycle'>" + this.level.name + "</h3>" + this.level.description, [{
            text: "Ok"
        }]);
    };

    LevelScreen.prototype.getLibrary = function() {
        if (this.library) {
            return this.library;
        }

        var self = this;

        var library = '<div class="library">';

        Object.keys(app.content.data.library).forEach(function(lib) {
            var item = app.content.data.library[lib];

            if (item.id > self.level.library) {
                return;
            }

            library +=
                '<div class="lib">' +
                    '<strong>' + item.name + '</strong><br />' +
                    '<img src="' + item.image + '" />' +
                '</div>';
        });

        library += '</div>';

        this.library = library;

        return this.library;
    };

    LevelScreen.prototype.onPlay = function() {
        app.audio.playSound('play');
        this.$buttons.play.hide();
        this.$buttons.stop.show();

        app.analytics.track('LEVEL-START', {
            level: this.level_id
        });

        this.level.onPlay();
    };

    LevelScreen.prototype.onStop = function() {
        app.audio.playSound('stop');
        this.$buttons.play.show();
        this.$buttons.stop.hide();

        app.analytics.track('LEVEL-STOP', {
            level: this.level_id,
            generation: this.level.generation
        });

        this.unLose();
        this.level.onStop();
    };

    LevelScreen.prototype.unLose = function() {
        this.$headerfooter.removeClass('lose');
    };

    LevelScreen.prototype.onClear = function() {
        app.audio.playSound('clear');

        app.analytics.track('LEVEL-CLEAR', {
            level: this.level_id
        });

        this.level.onClear();
    };

    LevelScreen.prototype.onHelp = function() {
        this.intro();

        app.analytics.track('LEVEL-HELP', {
            level: this.level_id
        });
    };

    LevelScreen.prototype.onLibrary = function() {
        app.modal.show(this.getLibrary(), [{
            text: 'Ok'
        }]);

        app.analytics.track('LEVEL-LIBRARY', {
            level: this.level_id
        });
    };

    LevelScreen.prototype.onExit = function() {
        app.audio.playSound('back');
        app.screen.display('campaign');
    };

    return LevelScreen;
}());
