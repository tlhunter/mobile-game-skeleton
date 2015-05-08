'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.CampaignScreen = (function() {
    var CampaignScreen = function() {
        this.$screen = $('#screen-campaign');
        this.$levels = this.$screen.find('.levels');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$buttons.back.on('click', this.onBack.bind(this));
        this.$levels.delegate('.available', 'click', this.onLevel);
    };

    CampaignScreen.prototype.display = function() {
        this.drawLevels();

        // By not playing music, we keep the same song playing between levels within a chapter
        //app.audio.playMusic('background');

        this.$screen.show();

        app.analytics.track('SCREEN-CAMPAIGN');
    };

    CampaignScreen.prototype.hide = function() {
        this.$screen.hide();
    };

    CampaignScreen.prototype.drawLevels = function() {
        var levels = "";
        var current_level = app.storage.get('level', 0) + 1;
        var c;

        var level_count = Object.keys(app.content.data.campaign).length;

        for (var i = 1; i <= level_count; i++) {
            if (i < current_level) {
                c = "available";
            } else if (i === current_level) {
                c = "available current";
            } else {
                c = "unavailable";
            }

            levels += "<div class='level " + c + "'>" + i + "</div>";
        }

        this.$levels.html(levels);
    };

    CampaignScreen.prototype.onBack = function() {
        app.audio.playSound('back');
        app.screen.display('menu');
    };

    CampaignScreen.prototype.onLevel = function() {
        var level = Math.floor($(this).text());

        app.audio.playSound('select');
        app.screen.display('level', level);
    };

    return CampaignScreen;
}());
