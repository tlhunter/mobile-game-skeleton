'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Modal = (function() {
    var MODAL_SHOW_TIME = 250;
    var MODAL_HIDE_TIME = 500;

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

        this.$modal.fadeIn(MODAL_SHOW_TIME);
    };

    Modal.prototype.fadeOut = function() {
        this.$modal.fadeOut(MODAL_HIDE_TIME, function() {
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
