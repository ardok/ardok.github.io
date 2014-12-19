(function ($) {

  function UBLazySrc(elem, options) {
    this.$elem = $(elem);
    this.options = options;
  }

  UBLazySrc.DEFAULTS = {};

  UBLazySrc.prototype.load = function () {
    this.$elem.attr('src', this.options.ubLazySrc);
  };

  var old = $.fn.ubLazySrc;

  $.fn.ubLazySrc = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('ub.lazy-src');
      var options = $.extend({}, UBLazySrc.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data) {
        $this.data('ub.lazy-src', (data = new UBLazySrc(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      } else {
        data.load();
      }
    });
  };

  $.fn.ubLazySrc.noConflict = function () {
    $.fn.ubLazySrc = old;
    return this;
  };

})(jQuery);