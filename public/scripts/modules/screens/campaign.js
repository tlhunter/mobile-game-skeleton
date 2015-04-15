'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.CampaignScreen = (function() {
    var CampaignScreen = function() {
        this.$screen = $('#screen-campaign');
    };

    CampaignScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();

        app.analytics.track('SCREEN-CAMPAIGN');
    };

    return CampaignScreen;
}());
