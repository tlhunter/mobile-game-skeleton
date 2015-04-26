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
        this.$status = this.$header.find('.status');
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
        this.library = null;

        this.$buttons.play.on('click', function() {
            app.audio.playSound('play');
            self.$buttons.play.hide();
            self.$buttons.stop.show();

            app.analytics.track('LEVEL-START', {
                level: self.level_id
            });

            self.level.onPlay();
        });

        this.$buttons.stop.on('click', function() {
            app.audio.playSound('stop');
            self.$buttons.play.show();
            self.$buttons.stop.hide();

            app.analytics.track('LEVEL-STOP', {
                level: self.level_id,
                generation: self.level.generation
            });

            self.level.onStop();
        });

        this.$buttons.clear.on('click', function() {
            app.audio.playSound('clear');

            app.analytics.track('LEVEL-CLEAR', {
                level: self.level_id
            });

            self.level.onClear();
        });

        this.$buttons.help.on('click', function() {
            self.intro();

            app.analytics.track('LEVEL-HELP', {
                level: self.level_id
            });
        });

        this.$buttons.library.on('click', function() {
            app.modal.show(self.getLibrary(), [{
                text: 'Ok'
            }]);

            app.analytics.track('LEVEL-LIBRARY', {
                level: self.level_id
            });
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

        this.$buttons.play.show();
        this.$buttons.stop.hide();

        this.level_id = level_id;

        var raw_level = app.content.data.campaign[level_id];
        this.$title.html(raw_level.name);

        var constraints = {
            width: app.viewport.width,
            height: app.viewport.height - (this.$footer.outerHeight() + this.$header.outerHeight())
        };

        this.level = new MODULE.Level(raw_level, this.$level, constraints);

        this.level.onGeneration(function(generation) {
            self.$generation.text(generation);
        }).onPlayCount(function(played) {
            self.$played.text(played);
        }).onStatus(function(status) {
            if (status === MODULE.Level.STATUS.DONE) {
                self.complete();
            }
        }).onWin(function(old_level, new_level) {
            app.analytics.track('LEVEL-WIN', {
                level: old_level,
                new_level: new_level
            });
        });

        if (level_id > app.storage.get('level')) {
            this.incomplete();
            this.intro();
        } else {
            this.complete();
        }

        var $gamefield = this.level.$gamefield;
        var finger = new Hammer($gamefield[0]);
        finger.get('pinch').set({enable: true});

        finger.add(new Hammer.Pan({
            direction: Hammer.DIRECTION_ALL,
            threshold: 0
        }));

        finger.on('pinchstart', function() {
            self.level.scaleStart();
        });

        finger.on('pinch', function(event) {
            self.level.scale(event.scale);
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

        app.audio.playMusic('ch' + this.level.chapter);

        this.$screen.show();

        this.library = null;

        app.analytics.track('SCREEN-LEVEL');
    };

    LevelScreen.prototype.complete = function() {
        this.$status.text('Done');
        this.$header.addClass('done');
        this.$footer.addClass('done');
        this.$buttons.exit.addClass('cycle');
    };

    LevelScreen.prototype.incomplete = function() {
        this.$status.text('InProg');
        this.$header.removeClass('done');
        this.$footer.removeClass('done');
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

    return LevelScreen;
}());
