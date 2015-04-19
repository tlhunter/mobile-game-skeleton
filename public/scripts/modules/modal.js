'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Modal = (function() {
    var Modal = function() {
        this.$modal = $('#modal');
        this.$content = this.$modal.find('.content');
        this.$buttons = this.$modal.find('.buttons');
    };

    Modal.prototype.show = function(content, buttons) {
        var self = this;

        this.$content.html(content);
        this.$buttons.empty();

        buttons.forEach(function(button) {
            var $button = $('<button>' + button.text + '</button>');

            $button.on('click', function() {
                self.hide();

                if (button.callback) {
                    button.callback();
                }
            });

            self.$buttons.append($button);
        });

        this.$modal.fadeIn(250);
    };

    Modal.prototype.hide = function(event, callback) {
        var self = this;
        this.$modal.fadeOut(500);

        setTimeout(function() {
            self.$content.empty();
            self.$buttons.empty();
        }, 500);
    };

    return Modal;
}());
