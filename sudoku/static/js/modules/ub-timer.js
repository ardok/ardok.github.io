(function ($) {

  function UBTimer(elem, options) {
    this.$elem = $(elem);
    this.options = options;

    this.timerInterval = null;
    this.isRunning = false;
    this.hour = 0;
    this.minute = 0;
    this.second = 0;

    this.$hour = this.$elem.find('[data-ub-timer=hour]');
    this.$minute = this.$elem.find('[data-ub-timer=minute]');
    this.$second = this.$elem.find('[data-ub-timer=second]');

    this._init();
  }

  UBTimer.DEFAULTS = {};

  UBTimer.prototype._init = function () {
    if (this.$elem.data('inited')) {
      return;
    }

    this.$elem.data('inited', true);
    this.reset();
  };

  UBTimer.prototype.start = function () {
    if (this.isRunning) {
      return;
    }

    this.isRunning = true;
    var self = this;
    this.timerInterval = setInterval(function () {
      self.process();
    }, 1000);
  };

  UBTimer.prototype.stop = function () {
    if (!this.isRunning) {
      return;
    }

    this.isRunning = false;
    clearInterval(this.timerInterval);
    this.timerInterval = null;
  };

  UBTimer.prototype.reset = function () {
    this.stop();
    this.$hour.text('00');
    this.$minute.text('00');
    this.$second.text('00');
    this.hour = 0;
    this.minute = 0;
    this.second = 0;
  };

  UBTimer.prototype.process = function () {
    this.second = this.second + 1;

    this.processTime(this.second);

    if (this.hour === 0) {
      this.$hour.text('00');
    } else {
      this.$hour.text(('0' + this.hour).slice(-2));
    }

    if (this.minute === 0) {
      this.$minute.text('00');
    } else {
      this.$minute.text(('0' + this.minute).slice(-2));
    }

    if (this.second === 0) {
      this.$second.text('00');
    } else {
      this.$second.text(('0' + this.second).slice(-2));
    }

  };

  /**
   * Method to set the `hour`, `minute`, and `second` variables based on second
   */
  UBTimer.prototype.processTime = function (second) {
    var hour = this.hour;
    var min = this.minute;

    if (second >= 60) {
      this.second = Math.floor(second / 60) - 1;
      min = min + (second % 59);
    }

    this.minute = min;

    if (min >= 60) {
      this.minute = Math.floor(min / 60) - 1;
      hour = hour + (min % 59);
    }

    this.hour = hour;
  };

  var old = $.fn.ubTimer;

  $.fn.ubTimer = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('ub.timer');
      var options = $.extend({}, UBTimer.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data) {
        $this.data('ub.timer', (data = new UBTimer(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      } else {
        data._init();
      }
    });
  };

  $.fn.ubTimer.noConflict = function () {
    $.fn.ubTimer = old;
    return this;
  };

})(jQuery);