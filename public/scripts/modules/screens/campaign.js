'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.CampaignScreen = (function() {
    var CampaignScreen = function() {
        this.$screen = $('#screen-campaign');
    };

    CampaignScreen.prototype.display = function() {
        $('#screens > .screen').hide();
        this.$screen.show();
    };

    return CampaignScreen;
}());
