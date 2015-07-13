'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.LevelScreen = (function() {
  var LevelScreen = function() {
    var self = this;

    this.screen = document.getElementById('screen-level');

    this.level_el = this.screen.getElementsByClassName('level-container')[0];
    this.grid_el = this.screen.getElementsByClassName('grid-container')[0];

    this.footer = this.screen.getElementsByTagName('footer')[0];
    this.header = this.screen.getElementsByTagName('header')[0];

    this.playcontrols = this.footer.getElementsByClassName('play-controls')[0];
    this.stopcontrols = this.footer.getElementsByClassName('stop-controls')[0];

    this.generation = this.header.getElementsByClassName('generation')[0];
    this.played = this.header.getElementsByClassName('played')[0];

    this.title = this.header.getElementsByClassName('title')[0];

    this.autowin = this.header.getElementsByClassName('autowin')[0];
    this.autowin_goal = this.autowin.getElementsByClassName('autowin-gen')[0];

    this.maxplay = this.header.getElementsByClassName('maxplay')[0];
    this.maxplayval = this.maxplay.getElementsByClassName('maxplay-val')[0];

    this.segment_generation = this.header.getElementsByClassName('segment-gen')[0];
    this.segment_played = this.header.getElementsByClassName('segment-played')[0];
    this.segment_red = this.header.getElementsByClassName('segment-red')[0];
    this.segment_green = this.header.getElementsByClassName('segment-green')[0];

    this.maxred_current = this.segment_red.getElementsByClassName('current')[0];
    this.maxred_limit = this.segment_red.getElementsByClassName('limit')[0];

    this.mingreen_current = this.segment_green.getElementsByClassName('current')[0];
    this.mingreen_limit = this.segment_green.getElementsByClassName('limit')[0];

    this.buttons = {
      play: this.footer.getElementsByClassName('play')[0],
      stop: this.footer.getElementsByClassName('stop')[0],
      clear: this.footer.getElementsByClassName('clear')[0],
      help: this.footer.getElementsByClassName('help')[0],
      library: this.footer.getElementsByClassName('library')[0],
      exit: this.footer.getElementsByClassName('exit')[0]
    };

    this.level = null;
    this.grid = null;
    this.level_id = null;
    this.library = null;

    this.buttons.play.onclick = this.onPlay.bind(this);
    this.buttons.stop.onclick = this.onStop.bind(this);
    this.buttons.clear.onclick = this.onClear.bind(this);
    this.buttons.help.onclick = this.onHelp.bind(this);
    this.buttons.library.onclick = this.onLibrary.bind(this);
    this.buttons.exit.onclick = this.onExit.bind(this);
  };

  LevelScreen.HEADER_HEIGHT = 50;
  LevelScreen.FOOTER_HEIGHT = 50;

  LevelScreen.prototype.display = function(level_id) {
    var self = this;

    this.playcontrols.classList.add('hide');
    this.stopcontrols.classList.remove('hide');
    this.header.className = '';
    this.footer.className = '';

    this.level_id = level_id;

    var campaign = app.content.data.campaign[level_id];
    this.title.innerHTML = campaign.name;

    var constraints = {
      width: app.device.viewport.width,
      height: app.device.viewport.height - (LevelScreen.HEADER_HEIGHT + LevelScreen.FOOTER_HEIGHT)
    };

    console.log('constraints', constraints);

    this.level = new MODULE.Level(campaign, this.level_el, constraints);

    this.grid = new MODULE.Grid(
      this.level.dimensions.width,
      this.level.dimensions.height,
      this.level.size,
      this.grid_el
    );

    this.level
    .on('generation', function(generation) {
      self.generation.textContent = generation;
    })
    .on('play-count', function(played) {
      self.played.textContent = played;
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
      var end_game = false;

      if (data.level === max_level) {
        // TODO: Congratulate user on winning
        end_game = true;
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

      var buttons = [{
        text: "Watch"
      }];

      if (!end_game) {
        buttons.push({
          text: "Next Level",
          highlight: true,
          callback: function() {
            app.screen.display('level', self.level_id + 1);
          }
        });
      }

      if (levelup || rank_up) {
        app.modal.show(content, buttons, true);
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
          text: "Watch"
        },{
          text: "Try Again",
          highlight: true,
          callback: function() {
            self.onStop();
          }
        }], true
      );
    })
    .on('green-count', function(count) {
      self.mingreen_current.textContent = count;
    })
    .on('red-count', function(count) {
      self.maxred_current.textContent = count;
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

    app.audio.playMusic('chapter-' + this.level.chapter);

    this.screen.style.display = 'block';

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
    this.screen.style.display = 'none';
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
    this.autowin_goal.textContent = generation;

    this.autowin.classList.toggle('hide', !generation);
  };

  LevelScreen.prototype.setMaxPlay = function(maxplay) {
    this.maxplayval.textContent = maxplay;

    this.maxplay.classList.toggle('hide', !maxplay);
  };

  LevelScreen.prototype.togglePlayedSegment = function(count) {
    this.segment_played.classList.toggle('hide', !count);
    this.buttons.clear.classList.toggle('hide', !count);
    this.buttons.play.classList.toggle('cycle', !count);
  };

  LevelScreen.prototype.toggleRedSegment = function(count) {
    this.maxred_limit.textContent = count;
    this.segment_red.classList.toggle('hide', !count);
  };

  LevelScreen.prototype.toggleGreenSegment = function(count) {
    this.mingreen_limit.textContent = count;
    this.segment_green.classList.toggle('hide', !count);
  };

  LevelScreen.prototype.complete = function() {
    this.header.classList.add('done');
    this.footer.classList.add('done');
    this.buttons.exit.classList.add('cycle');
    this.buttons.play.classList.remove('cycle');
  };

  LevelScreen.prototype.win = function() {
    this.header.classList.add('win');
    this.footer.classList.add('win');
    this.buttons.exit.classList.add('cycle');
    this.buttons.play.classList.remove('cycle');
  };

  LevelScreen.prototype.lose = function() {
    this.header.classList.add('lose');
    this.footer.classList.add('lose');
  };

  LevelScreen.prototype.incomplete = function() {
    this.header.classList.remove('done');
    this.footer.classList.remove('done');
    this.buttons.exit.classList.remove('cycle');
  };

  LevelScreen.prototype.intro = function() {
    app.modal.show("<h3 class='cycle'>" + this.level.name + "</h3>" + this.level.description, [{
      text: "Play Level",
      highlight: true
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
    this.playcontrols.classList.remove('hide');
    this.stopcontrols.classList.add('hide');

    this.header.classList.add('playing');
    this.footer.classList.add('playing');

    app.analytics.track('LEVEL-START', {
      level: this.level_id
    });

    this.level.onPlay();
  };

  LevelScreen.prototype.onStop = function() {
    app.audio.playSound('stop');
    this.playcontrols.classList.add('hide');
    this.stopcontrols.classList.remove('hide');

    this.header.classList.remove('playing');
    this.footer.classList.remove('playing');
    //this.header.classList.add('win');
    //this.footer.classList.add('win');

    app.analytics.track('LEVEL-STOP', {
      level: this.level_id,
      generation: this.level.generation
    });

    this.unLose();
    this.level.onStop();
  };

  LevelScreen.prototype.unLose = function() {
    this.header.classList.remove('lose');
    this.footer.classList.remove('lose');
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
      text: 'Dismiss',
      highlight: true
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
