'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.CampaignScreen = (function() {
  var CampaignScreen = function() {
    this.screen = document.getElementById('screen-campaign');
    this.levels = this.screen.getElementsByClassName('levels')[0];

    this.buttons = {
      back: this.screen.querySelector('.footer-buttons .back')
    };

    this.buttons.back.onclick = this.onBack.bind(this);
    this.levels.onclick = this.onLevel.bind(this);

    this.rank_css = false;
  };

  CampaignScreen.prototype.display = function() {
    this.drawRankCss();
    this.drawLevels();

    // By not playing music, we keep the same song playing between levels within a chapter
    //app.audio.playMusic('background');

    this.screen.style.display = 'block';

    app.analytics.track('SCREEN-CAMPAIGN');
  };

  CampaignScreen.prototype.hide = function() {
    this.screen.style.display = 'none';
  };

  /**
   * Normally we'd want to load color from static CSS documents
   * However in this case we want to dynamically color from CMS
   */
  CampaignScreen.prototype.drawRankCss = function() {
    if (this.rank_css) {
      return;
    }

    var css = "<style>\n";

    Object.keys(app.content.data.ranks).forEach(function(rank) {
      rank = app.content.data.ranks[rank];

      css += "#screen-campaign .levels .level.rank-" + rank.id + " {\n";
        css += "color: " + rank.color + ";\n";
        css += "outline-color: " + rank.color + ";\n";
      css += "}\n";
    });

    css += "</style>\n";

    this.screen.insertAdjacentHTML('beforeend', css);

    this.rank_css = true;
  };

  CampaignScreen.prototype.drawLevels = function() {
    var levels = "";
    var current_level = app.storage.get('level', 0) + 1;
    var rankings = app.storage.get('rankings', {});
    var unplayed_rank = app.rank.getUnplayed().id;
    var c, d;

    var level_count = Object.keys(app.content.data.campaign).length;

    for (var i = 1; i <= level_count; i++) {
      c = "";
      d = "";
      if (i < current_level) {
        c = "available";
      } else if (i === current_level) {
        c = "available current";
      } else {
        d = "disabled='disabled'";
      }

      c += ' rank-';

      c += rankings[i] ? rankings[i] : unplayed_rank;

      levels += "<button " + d + " class='" + c + "'>" + i + "</button>";
    }

    this.levels.innerHTML = levels;
  };

  CampaignScreen.prototype.onBack = function() {
    app.audio.playSound('back');
    app.screen.display('menu');
  };

  CampaignScreen.prototype.onLevel = function(event) {
    if (event.target.classList.contains('available')) {
      var level = Math.floor(event.target.textContent);
      app.audio.playSound('select');
      app.screen.display('level', level);
    }
  };

  return CampaignScreen;
}());
