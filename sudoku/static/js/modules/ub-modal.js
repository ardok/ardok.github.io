(function ($) {
  'use strict';

  var idCounter = 0;

  var ESC_KEYCODE = 27;

  var UB_MODAL_OPEN_CLASS = 'ub-modal-open';

  // store all the opened modal here
  // we're not storing the modal element, we're storing the element that
  //   is used for `.ubModal` call
  // hence, we're storing `this.$el`
  var openModalMap = {};
  var openModalIds = []; // this is needed for document listener
  /**
   * This is how we are going to use `openModalMap` (map) and `openModalIds` (array)
   *
   * Showing a modal will do:
   * Pushing the `this._id` into array and also add an entry into map where `_id` will be the key and
   *   `$el` will be the value.
   *
   * There are 4 ways to close a modal:
   * 1) Using `data-ub-dismiss`, usually this is the close icon on top left of the modal (X icon)
   * 2) Using escape key
   * 3) Clicking anywhere outside the modal
   * 4) Calling `.ubModal('hide')` on the modal
   *
   * From 1-3:
   * Hiding the modal this way will `pop` the last element in the array (this is the map key),
   *   try to look whether the map has this key.
   *   If so, get it and call `.ubModal('hide')` on the value of that map with that key.
   *
   * 4:
   * When caling `ubModal('hide')`, it will delete the entry from the map and will also
   *   try to look whether the id of the modal is in the array. If so, remove it.
   */

  function UBModal(element, options) {
    this.$body = $('body');
    this._id = idCounter;
    idCounter++;

    this.$el = $(element);
    this.options = options;
    this.isShown = false;
  }

  UBModal.DEFAULTS = {
    backdropTemplate: '<div class="ub-modal-backdrop"></div>'
  };

  UBModal.prototype.show = function () {
    var self = this;
    if (!self.isShown) {
      // add entry to our modal open map and array
      openModalMap[self._id] = self.$el;
      openModalIds.push(self._id);

      self.$body.append(self.options.backdropTemplate);
      if (!self.$body.hasClass(UB_MODAL_OPEN_CLASS)) {
        self.$body.addClass(UB_MODAL_OPEN_CLASS);
      }
      self.$el.show();
      self.$el.trigger('shown.ub.modal');
      self.isShown = true;

      if (self.$el.hasClass('ub-modal-center')) {
        self.$el.css('padding-top',
          ($(window).height() / 2) - ($('.modal-content', self.$el).height() / 2) -
            (parseInt($('.modal-dialog', self.$el).css('margin-top')) || 0)
        );
      }
    }
  };

  UBModal.prototype.hide = function () {
    var self = this;
    if (self.isShown) {
      // always delete the entry from the map & array
      delete openModalMap[self._id];
      var arrayIndex = $.inArray(self._id, openModalIds);
      if (arrayIndex !== -1) {
        openModalIds.splice(arrayIndex, 1);
      }

      if (openModalIds.length === 0) {
        self.$body.removeClass(UB_MODAL_OPEN_CLASS);
      }
      $('.ub-modal-backdrop:last-of-type').remove();
      self.$el.hide();
      self.$el.trigger('hidden.ub.modal');
      self.isShown = false;
    }
  };

  UBModal.prototype.toggle = function () {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  };


  // PLUGIN DEFINITION
  // =================

  var old = $.fn.ubModal;

  $.fn.ubModal = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var options = $.extend({}, UBModal.DEFAULTS, $this.data(), typeof opt === 'object' && opt);
      var data = $this.data('ub.modal');
      if (!data) {
        $this.data('ub.modal', (data = new UBModal(this, options)));
      }
      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      } else {
        data.toggle();
      }
    });
  };

  // UBModal NO CONFLICT
  // ===================

  $.fn.ubModal.noConflict = function () {
    $.fn.ubModal = old;
    return this;
  };

  // DATA-API ACTIVATE
  // =================

  function hideMostTopModal() {
    var id = openModalIds.pop();
    if (id !== undefined && openModalMap.hasOwnProperty(id)) {
      openModalMap[id].ubModal('hide');

      // if all modal is gone already, remove all backdrop
      // there's a really rare case that the modal backdrop stays on the screen
      if (openModalIds.length === 0) {
        $('.ub-modal-backdrop').remove();
      }
    }
  }

  $(document).on('click.ub.modal', '[data-ub-toggle=modal]', function (evt) {
    var $this = $(this);
    $($this.attr('data-ub-modal-target')).ubModal('toggle');
    evt.preventDefault();
  });

  // modal close listeners
  $(document).on('click.ub.modal-close', '.ub-modal', function (evt) {
    // the target will be `ub-modal` itself when you click outside the modal dialog
    if ($(evt.target).hasClass('ub-modal')) {
      hideMostTopModal();
    }
  }).on('click.ub.modal-close', '[data-ub-dismiss=modal]', function () {
    hideMostTopModal();
  }).on('keyup.ub.modal-close', function (evt) {
    if ($('body').hasClass(UB_MODAL_OPEN_CLASS) &&
      (evt.keyCode || evt.which) === ESC_KEYCODE) {
      // only close on ESCAPE key
      evt.preventDefault();
      evt.stopPropagation();
      hideMostTopModal();
    }
  });

})(jQuery);