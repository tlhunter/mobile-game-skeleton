'use strict';

if (!MODULE) { var MODULE = {}; }

MODULE.Modal = (function() {
  var MODAL_HIDE_TIME = 300;

  var Modal = function() {
    this.background = document.getElementById('modal');
    this.modal = this.background.getElementsByClassName('modal')[0];
    this.content = this.modal.getElementsByClassName('content')[0];
    this.buttons = this.modal.getElementsByClassName('buttons')[0];
  };

  Modal.prototype.show = function(content, buttons, small) {
    var self = this;

    buttons = buttons || [{
      text: 'Ok',
      highlight: true
    }];

    this.empty();
    this.content.innerHTML = content;

    buttons.forEach(function(data) {
      var button = document.createElement('button');
      var text = document.createTextNode(data.text);
      button.appendChild(text);

      if (data.highlight) {
          button.classList.add('cycle');
      }

      button.onclick = function() {
        self.fadeOut(data.callback);
      };

      self.buttons.appendChild(button);
    });

    this.modal.classList.toggle('small', !!small);

    this.background.classList.add('visible');
  };

  Modal.prototype.fadeOut = function(callback) {
    this.background.classList.remove('visible');
    setTimeout(function() {
      this.empty();
      if (callback) callback();
    }.bind(this), MODAL_HIDE_TIME);
  };

  Modal.prototype.hide = function() {
    this.background.classList.remove('visible');
    this.empty();
  };

  Modal.prototype.empty = function() {
    this.content.innerHTML = '';
    this.buttons.innerHTML = '';
  };

  return Modal;
}());
