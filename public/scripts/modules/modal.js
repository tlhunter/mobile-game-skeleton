'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Modal = (function() {
    var FADE_IN_TIME = 250;
    var FADE_OUT_TIME = 500;

    var Modal = function() {
        this.$modal = $('#modal');
        this.$content = this.$modal.find('.content');
        this.$buttons = this.$modal.find('.buttons');
    };

    Modal.prototype.show = function(content, buttons) {
        var self = this;

        buttons = buttons || [{
            text: 'Ok'
        }];

        this.empty();
        this.$content.html(content);

        buttons.forEach(function(button) {
            var $button = $('<button>' + button.text + '</button>');

            $button.on('click', function() {
                self.fadeOut();

                if (button.callback) {
                    button.callback();
                }
            });

            self.$buttons.append($button);
        });

        this.$modal.fadeIn(FADE_IN_TIME);
    };

    Modal.prototype.fadeOut = function() {
        this.$modal.fadeOut(FADE_OUT_TIME, function() {
            this.empty();
        }.bind(this));
    };

    Modal.prototype.hide = function() {
        this.$modal.hide();
        this.empty();
    };

    Modal.prototype.empty = function() {
        this.$content.empty();
        this.$buttons.empty();
    };

    return Modal;
}());
