'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.CampaignScreen = (function() {
    var CampaignScreen = function() {
        this.$screen = $('#screen-campaign');

        this.$buttons = {
            back: this.$screen.find('.footer-buttons .back')
        };

        this.$levels = this.$screen.find('.levels');

        this.$buttons.back.on('click', function() {
            app.audio.playSound('back');
            app.screens.menu.display();
        });

        this.$levels.delegate('.available', 'click', function() {
            var level = Math.floor($(this).text());

            app.audio.playSound('select');
            app.screens.level.display(level);
        });
    };

    CampaignScreen.prototype.display = function() {
        $('#screens > .screen').hide();

        this.drawLevels();
        app.audio.playMusic('background');

        this.$screen.show();

        app.analytics.track('SCREEN-CAMPAIGN');
    };

    CampaignScreen.prototype.drawLevels = function() {
        var levels = "";
        var my_level = 25;
        var c;

        for (var i = 1; i <= 48; i++) {
            if (i < my_level) {
                c = "available";
            } else if (i > my_level) {
                c = "unavailable";
            } else {
                c = "available current";
            }

            levels += "<div class='level " + c + "'>" + i + "</div>";
        }

        this.$levels.html(levels);
    };

    return CampaignScreen;
}());
