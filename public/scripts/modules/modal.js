'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Modal = (function() {
    var MODAL_SHOW_TIME = 250;
    var MODAL_HIDE_TIME = 500;

    var Modal = function() {
        this.$background = $('#modal');
        this.$modal = this.$background.find('.modal');
        this.$content = this.$modal.find('.content');
        this.$buttons = this.$modal.find('.buttons');
    };

    Modal.prototype.show = function(content, buttons, small) {
        var self = this;

        buttons = buttons || [{
            text: 'Ok'
        }];

        this.empty();
        this.$content.html(content);

        buttons.forEach(function(button) {
            var $button = $('<button>' + button.text + '</button>');

            $button.on('click', function() {
                self.fadeOut(button.callback);
            });

            self.$buttons.append($button);
        });

        this.$modal.toggleClass('small', !!small);

        this.$background.fadeIn(MODAL_SHOW_TIME);
    };

    Modal.prototype.fadeOut = function(callback) {
        this.$background.fadeOut(MODAL_HIDE_TIME, function() {
            this.empty();

            if (callback) {
                callback();
            }
        }.bind(this));
    };

    Modal.prototype.hide = function() {
        this.$background.hide();
        this.empty();
    };

    Modal.prototype.empty = function() {
        this.$content.empty();
        this.$buttons.find('button').off(); // Memory Leak
        this.$buttons.empty();
    };

    return Modal;
}());
