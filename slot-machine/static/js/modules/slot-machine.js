(function ($) {

  //
  // =========== SLOT =============
  //

  function Slot(elem, options) {
    this.$elem = $(elem);
    this.options = $.extend({}, Slot.DEFAULTS, this.$elem.data(), typeof options === 'object' && options);
    this.speed = 0;
    this.interval = null;
    this.pos = 0;
    this.isSpinning = false;
  }

  Slot.SPRITE_POS = [-131, -65, 0]; // from CSS sprite, each icon MUST be 64px x 64px

  Slot.DEFAULTS = {
    maxSpeed: 40,
    minSpeed: 10,
    step: 1
  };

  Slot.prototype._animatePos = function () {
    this.$elem.animate({
      'background-position-y': this.pos + 'px'
    }, 1, 'linear');
  };

  Slot.prototype._adjustPosOnSpeed = function () {
    this.pos -= this.speed;
    if (this.pos < Slot.SPRITE_POS[0]) {
      this.pos = 0;
    }
  };

  Slot.prototype.getSlotIndex = function () {
    return Slot.SPRITE_POS.indexOf(this.pos);
  };

  Slot.prototype.startSpin = function () {
    if (this.isSpinning) {
      return;
    }

    this.isSpinning = true;
    var self = this;
    self.speed = 0; // always reset the speed to 0
    self.interval = setInterval(function () {
      if (self.speed < self.options.maxSpeed) {
        self.speed += self.options.step;
      }
      self._adjustPosOnSpeed();
      self._animatePos();
    }, 100);
  };

  /**
   *
   * @param options object
   * {
   *  callback -> method to call after interval is cleared
   *  stepDown -> the step to go down
   * }
   */
  Slot.prototype.stopSpin = function (options) {
    if (!this.isSpinning) {
      return;
    }

    var self = this;
    options = options || {};
    clearInterval(self.interval);
    var stepDown = options.stepDown || (self.options.step + 1);
    self.interval = window.setInterval(function () {
      if (self.speed > self.options.minSpeed) {
        self.speed -= stepDown;
      }

      self._adjustPosOnSpeed();
      self._animatePos();

      if (self.speed <= self.options.minSpeed) {
        self.pos = self.getFinalPosition();
        self.$elem.animate({
          'background-position-y': self.pos + 'px'
        }, 500, 'linear', function () {
          if (typeof options.callback === 'function') {
            options.callback();
          }
        });

        // stop spinning
        clearInterval(self.interval);
        self.isSpinning = false;
      }
    }, 100);
  };

  Slot.prototype.getFinalPosition = function () {
    var self = this;
    var i = 0;

    // Remember that our slot machine has movement going up due to negative background position on y
    if (self.pos <= Slot.SPRITE_POS[0]) {
      // less than the lowest position
      return Slot.SPRITE_POS[Slot.SPRITE_POS.length - 1];
    } else if (self.pos >= Slot.SPRITE_POS[Slot.SPRITE_POS.length - 1]) {
      // bigger than the highest position
      return Slot.SPRITE_POS[0];
    }

    for (i = 1; i < Slot.SPRITE_POS.length; i++) {
      var prevIndex = i - 1;

      if (self.pos >= Slot.SPRITE_POS[prevIndex] &&
        self.pos <= Slot.SPRITE_POS[i]) {
        return Slot.SPRITE_POS[prevIndex];
      }

    }

    return Slot.SPRITE_POS[0];
  };

  //
  // =========== SLOT MACHINE =============
  //

  /**
   * Events triggered:
   * slotMachine.win
   * slotMachine.lose
   * slotMachine.cheat.process
   * slotMachine.cheat.done
   *
   * Events listener:
   * slotMachine.start
   * slotMachine.stop
   * slotMachine.cheatEnd
   */


  function SlotMachine(elem, options) {
    this.$elem = $(elem);
    this.options = options;
    this.slots = [];
    this.isSpinning = false;
    this.isProcessingCheat = false;
    this._init();

    var start = $.proxy(this.start, this);
    this.$elem.on('slotMachine.start', start);
    var stop = $.proxy(this.stop, this);
    this.$elem.on('slotMachine.stop', stop);
    var cheatEnd = $.proxy(this.cheatEnd, this);
    this.$elem.on('slotMachine.cheatEnd', cheatEnd);
  }

  SlotMachine.DEFAULTS = {};

  SlotMachine.prototype._init = function () {
    var self = this;
    self.$elem.find('[data-slot]').each(function () {
      self.slots.push(new Slot(this));
    });

    $(self.options.slotMachineWheel).on('click.startSpin', function () {
      var $this = $(this);
      if ($this.hasClass('clicked') || self.isSpinning) {
        return;
      }

      $this.addClass('clicked');
      setTimeout(function () {
        self.start();

        // after a few seconds (adjustable), stop spin
        setTimeout(function () {
          self.stop();
        }, 4000);

      }, 300); // when the ball reaches bot, start spin
      setTimeout(function () {
        $this.removeClass('clicked');
      }, 600); // animation time from CSS, ball reaches top again
    });
  };

  SlotMachine.prototype.start = function () {
    if (this.isSpinning) {
      return;
    }
    this.isSpinning = true;

    var self = this;
    var i = 0;
    for (i = 0; i < self.slots.length; i++) {
      (function (idx) {
        setTimeout(function () {
          self.slots[idx].startSpin();
        }, idx * 150);
      })(i);
    }
  };

  SlotMachine.prototype.stop = function () {
    if (!this.isSpinning) {
      return;
    }
    var self = this;
    var i = 0;
    for (i = 0; i < self.slots.length; i++) {
      (function (idx) {
        self.slots[idx].stopSpin({
          stepDown: 1 - (0.3 * idx),
          callback: function () {
            if (idx !== self.slots.length - 1) {
              return;
            }

            // get the results after the last slot is done spinning
            self.isSpinning = false;
            self.triggerResultsDone(self.getResults());
          }
        });
      })(i);
    }
  };

  SlotMachine.prototype.getResults = function () {
    var resultIndexes = [];
    var i = 0;
    for (i = 0; i < this.slots.length; i++) {
      var slot = this.slots[i];
      resultIndexes.push(slot.getSlotIndex());
    }
    return resultIndexes;
  };

  SlotMachine.prototype.triggerResultsDone = function (results) {
    results = results || [];
    var won = true;
    var i = 0;
    var prevValue = results[0];
    for (i = 1; i < results.length; i++) {
      if (results[i] !== prevValue) {
        won = false;
        break;
      }
    }

    if (won) {
      this.$elem.trigger('slotMachine.win', [prevValue]);
    } else {
      this.$elem.trigger('slotMachine.lose');
    }
  };

  SlotMachine.prototype.cheatEnd = function () {
    if (this.isProcessingCheat) {
      return;
    }
    var self = this;
    self.$elem.trigger('slotMachine.cheat.process');
    self.isProcessingCheat = true;
    self.isSpinning = false;
    var indexToFinish = Math.floor(Math.random() * self.slots.length);
    var finalPos = Slot.SPRITE_POS[indexToFinish];
    var i = 0;

    // stop all the slots instantaneously
    for (i = 0; i < self.slots.length; i++) {
      (function (idx) {
        self.slots[idx].stopSpin({
          stepDown: 100000
        });
      })(i);
    }

    for (i = 0; i < self.slots.length; i++) {
      var slot = self.slots[i];
      slot.pos = finalPos;
      slot._animatePos();
    }
    setTimeout(function () {
      self.triggerResultsDone(self.getResults());
      self.isProcessingCheat = false;
      self.$elem.trigger('slotMachine.cheat.done');
    }, 2000);
  };

  var old = $.fn.slotMachine;

  $.fn.slotMachine = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('slotMachine');
      var options = $.extend({}, SlotMachine.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data) {
        $this.data('slotMachine', (data = new SlotMachine(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      }
    });
  };

  $.fn.slotMachine.noConflict = function () {
    $.fn.slotMachine = old;
    return this;
  };

  $(document).on('click.slotMachine.start', '[data-slot-machine-trigger]', function (evt) {
    var $this = $(this);
    $($this.attr('data-slot-machine-target')).trigger(
      'slotMachine.' + $this.attr('data-slot-machine-trigger'));
  });

})(jQuery);