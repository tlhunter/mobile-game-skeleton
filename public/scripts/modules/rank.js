'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Rank = (function() {
    var Rank = function(ranks) {
        this.ranks = {};

        this.default_rank = {};
        this.failure_rank = {};
        this.unplayed_rank = {};
        this.worst_rank = {};
        Object.keys(ranks).forEach(function(rank) {
            rank = ranks[rank];

            if (rank.type === Rank.TYPE.DEFAULT) {
                this.default_rank = rank;
            } else if (rank.type === Rank.TYPE.FAILURE) {
                this.failure_rank = rank;
            } else if (rank.type === Rank.TYPE.UNPLAYED) {
                this.unplayed_rank = rank;
            } else if (rank.type === Rank.TYPE.WORST) {
                this.worst_rank = rank;
            }
        }, this);

        this.ranks = ranks;
    };

    Rank.TYPE = {
        DEFAULT: 'default',
        FAILURE: 'failure',
        UNPLAYED: 'unplayed',
        WORST: 'worst'
    };

    Rank.prototype.getFailure = function() {
        return this.failure_rank;
    };

    Rank.prototype.getUnplayed = function() {
        return this.unplayed_rank;
    };

    Rank.prototype.get = function(level, gen, played) {
        var campaign = app.content.data.campaign[level];

        if (!campaign) {
            return null;
        }

        var rank_data = campaign.rank;

        if (!rank_data.length) {
            return this.default_rank;
        }

        var awarded_rank = this.worst_rank;

        for (var i = 0; i < rank_data.length; i++) {
            var rank = rank_data[i];

            if (rank.p && played > rank.p) {
                continue;
            } else if (rank.g && gen > rank.g) {
                continue;
            }

            awarded_rank = this.ranks[rank.r];
            break;
        }

        return awarded_rank;
    };

    /**
     * The user has earned a rank for a level
     *
     * @param Integer level
     * @param String rank
     * @return Boolean Is this a new record?
     */
    Rank.prototype.report = function(level, rank) {
        var rankings = app.storage.get('rankings', {});

        var old_ranking = rankings[level];
        var new_ranking = this.ranks[rank];
        var new_score = new_ranking.score;

        var rank_up = false;

        if (old_ranking) {
            var old_score = this.ranks[old_ranking].score;
            if (old_score < new_score) {
                rankings[level] = rank;
                rank_up = true;
            }
        } else {
            rank_up = true;
            rankings[level] = rank;
        }

        app.storage.set('rankings', rankings);

        return rank_up;
    };

    return Rank;
}());
