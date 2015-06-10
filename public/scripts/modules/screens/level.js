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

        this.$playcontrols = this.$footer.find('.play-controls');
        this.$stopcontrols = this.$footer.find('.stop-controls');

        this.$generation = this.$header.find('.generation');
        this.$played = this.$header.find('.played');

        this.$title = this.$header.find('.title');

        this.$autowin = this.$header.find('.autowin');
        this.$autowin_goal = this.$autowin.find('.autowin-gen');

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

        this.$playcontrols.hide();
        this.$stopcontrols.show();
        this.$headerfooter.removeClass();

        this.level_id = level_id;

        var campaign = app.content.data.campaign[level_id];
        this.$title.html(campaign.name);

        var constraints = {
            width: app.device.viewport.width,
            height: app.device.viewport.height - (this.$footer.outerHeight() + this.$header.outerHeight())
        };

        this.level = new MODULE.Level(campaign, this.$level, constraints);

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
                self.win();
            } else if (status === MODULE.Level.STATUS.LOSE) {
                self.lose();
            }
        })
        .on('win', function(data) {
            var my_level = app.storage.get('level', 0);
            var max_level = Object.keys(app.content.data.campaign).length;
            var levelup = false;

            if (data.level === max_level) {
                // TODO: Congratulate user on winning
                console.log("Beat the final level... Now what?");
            }

            if (data.level === my_level + 1) {
                levelup = true;
                app.storage.set('level', data.level);
                self.displayAdIfNeeded(data.level);
            }

            var rank = app.rank.get(data.level, data.generation, data.played);

            var rank_up = app.rank.report(data.level, rank.id);

            console.log('Rank up?', rank_up, rank);

            var content = LevelScreen.resultModal(rank, campaign.win, data.generation, data.played);

            if (levelup || rank_up) {
                app.modal.show(
                    content, [{
                        text: "Stay"
                    },{
                        text: "Next Level",
                        callback: function() {
                            app.screen.display('level', self.level_id + 1);
                        }
                    }], true
                );
            }

            app.analytics.track('LEVEL-WIN', {
                level: data.level,
                generation: data.generation,
                played: data.played,
                levelup: levelup
            });
        })
        .on('lose', function(data) {
            var rank = app.rank.getFailure();

            var content = LevelScreen.resultModal(rank, campaign.lose, data.generation, data.played);

            app.modal.show(
                content, [{
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

        this.level.initialize();

        if (level_id > app.storage.get('level')) {
            this.incomplete();
            this.intro();
        } else {
            this.complete();
        }

        this.setGenerationGoal(this.level.autowin);
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
    };

    LevelScreen.prototype.hide = function() {
        this.level.onStop();
        this.level = null;
        this.setGenerationGoal(0);
        this.setMaxPlay(0);
        this.$screen.hide();
    };

    LevelScreen.prototype.displayAdIfNeeded = function(level) {
        var min = app.content.data.dictionary.ad_min_level;
        var mod = app.content.data.dictionary.ad_mod_level;

        if (level >= min && level % mod === 0) {
            app.interstitial.show();
        }
    };

    LevelScreen.resultModal = function(rank, flavor, gen, played) {
        var html = "<div class='summary'>\n";
            html += "<div class='ranking' style='background-image: url(\"" + rank.image + "\");'></div>\n";
            html += "<div class='group'>\n";
                html += "<div class='name' style='color: " + rank.color + "'>" + rank.name + "</div>\n";
                html += "<div class='stats'>Gen: <span class='cycle'>" + gen + "</span> Played: <span class='cycle'>" + played + "</span></div>\n";
            html += "</div>\n";
        html += "</div>\n";
        html += "<div class='flavor'>\n" + flavor + "</div>\n";

        return html;
    };

    LevelScreen.prototype.setGenerationGoal = function(generation) {
        this.$autowin_goal.text(generation);

        if (generation) {
            return this.$autowin.show();
        }

        return this.$autowin.hide();
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
        this.$buttons.clear.toggle(!!count);
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

    LevelScreen.prototype.win = function() {
        this.$headerfooter.addClass('win');
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
        this.$playcontrols.show();
        this.$stopcontrols.hide();

        this.$headerfooter.addClass('playing');

        app.analytics.track('LEVEL-START', {
            level: this.level_id
        });

        this.level.onPlay();
    };

    LevelScreen.prototype.onStop = function() {
        app.audio.playSound('stop');
        this.$playcontrols.hide();
        this.$stopcontrols.show();

        this.$headerfooter.removeClass('playing');
        this.$headerfooter.removeClass('win');

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
