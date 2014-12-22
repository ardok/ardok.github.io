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

    UBNotification.prototype._showNextMessage = function () {
      if (this.messages.length === 0) {
        this.isRunning = false;
        return;
      }
      var message = this.messages.shift();
      this.$notifier.find('.message').html(message);
      this.$notifier.addClass('show');
      this._delayClose();
    };

    UBNotification.prototype._run = function () {
      if (!this.isRunning) {
        this.isRunning = true;
        this._showNextMessage();
      }
    };

    UBNotification.prototype._delayClose = function () {
      // Notifier automatically closes after 5 seconds.
      var self = this;
      self.idleTimeout = setTimeout(function () {
        self.hide();
      }, 5000);
    };

    UBNotification.prototype.refresh = function ($notifierElement) {
      var self = this;
      clearTimeout(self.idleTimeout);
      self.$notifier.removeAttr('style');
      self.$notifier.removeClass('show');
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

    /**
     * Put message in front of the queue and show it right away
     */
    UBNotification.prototype.show = function (message) {
      this.messages.unshift(message);
      this.isRunning = true;
      clearTimeout(this.idleTimeout);
      this.hide();
    };

    /**
     * Put message into the end of queue and show according to order
     */
    UBNotification.prototype.showQueue = function (message) {
      this.messages.push(message);
      this._run();
    };

    UBNotification.prototype.hide = function () {
      this.$notifier.removeClass('show');
      var self = this;
      clearTimeout(self.idleTimeout);
      setTimeout(function () {
        self._showNextMessage();
      }, 200);
    };

    return new UBNotification();
  })();
})(jQuery);