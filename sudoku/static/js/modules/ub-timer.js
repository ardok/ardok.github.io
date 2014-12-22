(function ($) {

  /**
   * Events:
   * `ub.timer.state.saved` -> When state successfully saved into local storage
   * `ub.timer.state.loaded` -> When state successfully loaded from local storage
   */

  function UBTimer(elem, options) {
    this.$elem = $(elem);
    this.options = options;

    this.timerInterval = null;
    this.isRunning = false;
    this.hour = parseInt(options.ubHour) || 0;
    this.minute = parseInt(options.ubMinute) || 0;
    this.second = parseInt(options.ubSecond) || 0;

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
    this._setTimerText();
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
    this._setTimerText();
  };

  UBTimer.prototype._setTimerText = function () {
    this.$hour.text(('0' + this.hour).slice(-2));
    this.$minute.text(('0' + this.minute).slice(-2));
    this.$second.text(('0' + this.second).slice(-2));
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

  UBTimer.prototype.saveState = function () {
    if (!window.localStorage) {
      return;
    }

    var timeData = {
      hour: this.hour,
      minute: this.minute,
      second: this.second
    };
    window.localStorage.setItem('ub.timer.' + this.$elem.attr('id'), JSON.stringify(timeData));
    this.$elem.trigger('ub.timer.state.saved');
  };

  UBTimer.prototype.loadState = function () {
    if (!window.localStorage) {
      return;
    }

    var timeData = window.localStorage.getItem('ub.timer.' + this.$elem.attr('id'));
    if (timeData) {
      try {
        var parsed = JSON.parse(timeData);
        this.hour = parseInt(parsed.hour);
        this.minute = parseInt(parsed.minute);
        this.second = parseInt(parsed.second);
        this._setTimerText();
        this.$elem.trigger('ub.timer.state.loaded');
      } catch (e) {
        // do nothing
      }
    }
  };

  UBTimer.prototype.clearState = function () {
    if (!window.localStorage) {
      return;
    }
    window.localStorage.removeItem('ub.timer.' + this.$elem.attr('id'));
  };

  var old = $.fn.ubTimer;

  $.fn.ubTimer = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('ub.timer');
      var options = $.extend({}, UBTimer.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data || (data && typeof opt === 'object')) {
        $this.data('ub.timer', (data = new UBTimer(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      }
    });
  };


  // NO CONFLICT
  // ===========

  $.fn.ubTimer.noConflict = function () {
    $.fn.ubTimer = old;
    return this;
  };


  // DATA-API EVENT LISTENERS
  // ========================

  $(document).on('click.ub.timer.trigger', '[data-ub-timer-trigger]', function () {
    var $this = $(this);
    $($this.attr('data-ub-timer-target')).ubTimer($this.attr('data-ub-timer-trigger'));
  });

})(jQuery);