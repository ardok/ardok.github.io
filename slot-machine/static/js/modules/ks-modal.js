(function ($) {
  'use strict';

  var idCounter = 0;

  var ESC_KEYCODE = 27;

  var KS_MODAL_OPEN_CLASS = 'ks-modal-open';

  // store all the opened modal here
  // we're not storing the modal element, we're storing the element that
  //   is used for `.ksModal` call
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
   * 1) Using `data-ks-dismiss`, usually this is the close icon on top left of the modal (X icon)
   * 2) Using escape key
   * 3) Clicking anywhere outside the modal
   * 4) Calling `.ksModal('hide')` on the modal
   *
   * From 1-3:
   * Hiding the modal this way will `pop` the last element in the array (this is the map key),
   *   try to look whether the map has this key.
   *   If so, get it and call `.ksModal('hide')` on the value of that map with that key.
   *
   * 4:
   * When caling `ksModal('hide')`, it will delete the entry from the map and will also
   *   try to look whether the id of the modal is in the array. If so, remove it.
   *
   *
   * Events on the modal element (data is put into the modal element (target)):
   * `ks.modal.shown` -> called when modal gets shown
   * `ks.modal.hidden` -> called when modal gets hidden
   */

  function KSModal(element, options) {
    this.$body = $('body');
    this._id = idCounter;
    idCounter++;

    this.$el = $(element);
    this.options = options;
    this.isShown = false;
  }

  KSModal.DEFAULTS = {
    backdropTemplate: '<div class="ks-modal-backdrop"></div>'
  };

  KSModal.prototype.show = function () {
    var self = this;
    if (!self.isShown) {
      // add entry to our modal open map and array
      openModalMap[self._id] = self.$el;
      openModalIds.push(self._id);

      self.$body.append(self.options.backdropTemplate);
      if (!self.$body.hasClass(KS_MODAL_OPEN_CLASS)) {
        self.$body.addClass(KS_MODAL_OPEN_CLASS);
      }
      self.$el.show();
      self.$el.trigger('ks.modal.shown');
      self.isShown = true;

      if (self.$el.hasClass('ks-modal-center')) {
        self.$el.css('padding-top',
          ($(window).height() / 2) - ($('.modal-content', self.$el).height() / 2) -
            (parseInt($('.modal-dialog', self.$el).css('margin-top')) || 0)
        );
      }
    }
  };

  KSModal.prototype.hide = function () {
    var self = this;
    if (self.isShown) {
      // always delete the entry from the map & array
      delete openModalMap[self._id];
      var arrayIndex = $.inArray(self._id, openModalIds);
      if (arrayIndex !== -1) {
        openModalIds.splice(arrayIndex, 1);
      }

      if (openModalIds.length === 0) {
        self.$body.removeClass(KS_MODAL_OPEN_CLASS);
      }
      $('.ks-modal-backdrop:last-of-type').remove();
      self.$el.hide();
      self.$el.trigger('ks.modal.hidden');
      self.isShown = false;
    }
  };

  KSModal.prototype.toggle = function () {
    if (this.isShown) {
      this.hide();
    } else {
      this.show();
    }
  };


  // PLUGIN DEFINITION
  // =================

  var old = $.fn.ksModal;

  $.fn.ksModal = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var options = $.extend({}, KSModal.DEFAULTS, $this.data(), typeof opt === 'object' && opt);
      var data = $this.data('ks.modal');
      if (!data) {
        $this.data('ks.modal', (data = new KSModal(this, options)));
      }
      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      } else {
        data.toggle();
      }
    });
  };

  // KSModal NO CONFLICT
  // ===================

  $.fn.ksModal.noConflict = function () {
    $.fn.ksModal = old;
    return this;
  };

  // DATA-API ACTIVATE
  // =================

  function hideMostTopModal() {
    var id = openModalIds.pop();
    if (id !== undefined && openModalMap.hasOwnProperty(id)) {
      openModalMap[id].ksModal('hide');

      // if all modal is gone already, remove all backdrop
      // there's a really rare case that the modal backdrop stays on the screen
      if (openModalIds.length === 0) {
        $('.ks-modal-backdrop').remove();
      }
    }
  }

  $(document).on('click.ks.modal', '[data-ks-toggle=modal]', function (evt) {
    var $this = $(this);
    $($this.attr('data-ks-modal-target')).ksModal('toggle');
    evt.preventDefault();
  });

  // modal close listeners
  $(document).on('click.ks.modal-close', '.ks-modal', function (evt) {
    // the target will be `ks-modal` itself when you click outside the modal dialog
    var $target = $(evt.target);
    if ($target.hasClass('ks-modal') && $target.attr('disabled') !== 'disabled') {
      hideMostTopModal();
    }
  }).on('click.ks.modal-close', '[data-ks-dismiss=modal]', function () {
    hideMostTopModal();
  }).on('keyup.ks.modal-close', function (evt) {
    if ($('body').hasClass(KS_MODAL_OPEN_CLASS) &&
      (evt.keyCode || evt.which) === ESC_KEYCODE) {
      // only close on ESCAPE key
      evt.preventDefault();
      evt.stopPropagation();
      hideMostTopModal();
    }
  });

})(jQuery);