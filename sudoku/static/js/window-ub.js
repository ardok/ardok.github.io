(function ($) {
  window.UB = {};

  window.UB.Notification = (function () {
    function UBNotification() {
      this.isRunning = false;
      this.messages = [];
      this.$notifier = $('#toast-flash');
      this.idleTimeout = 0;
      this.refresh();
    }

    function _showNextMessage() {
      if (this.messages.length === 0) {
        this.isRunning = false;
        return;
      }
      var message = this.messages.shift();
      this.$notifier.find('.message').html(message);
      this.$notifier.addClass('show');
      _delayClose.call(this);
    }

    function _run() {
      if (!this.isRunning) {
        this.isRunning = true;
        _showNextMessage.call(this);
      }
    }

    function _delayClose() {
      // Notifier automatically closes after 5 seconds.
      var self = this;
      self.idleTimeout = setTimeout(function () {
        self.hide();
      }, 5000);
    }

    UBNotification.prototype.refresh = function ($notifierElement) {
      var self = this;
      clearTimeout(self.idleTimeout);
      self.$notifier.removeAttr('style');
      self.$notifier.find('.message').html('');
      self.idleTimeout = null;
      self.$notifier = $notifierElement || self.$notifier;
      self.messages = [];
      self.isRunning = false;

      // Notifier closes when close icon is clicked, timeout above is cancelled.
      self.$notifier.off('click.closeNotifier');
      self.$notifier.on('click.closeNotifier', '.close', function () {
        self.hide();
        clearTimeout(self.idleTimeout);
      });
    };

    UBNotification.prototype.show = function (message) {
      this.messages.push(message);
      _run.call(this);
    };

    UBNotification.prototype.hide = function () {
      this.$notifier.removeClass('show');
      var self = this;
      clearTimeout(self.idleTimeout);
      setTimeout(function () {
        _showNextMessage.call(self);
      }, 150); // 150 is from CSS transition in `base.css`
    };

    return new UBNotification();
  })();
})(jQuery);