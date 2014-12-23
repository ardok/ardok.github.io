(function ($) {

  // TODO use templating engine
  var MAIN_TABLE_LAYOUT =
    '<tbody>' +
      '<tr>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
      '</tr>' +
      '<tr>' +
        '<td></td>' +
        '<td></td>' +
        '<td></td>' +
      '</tr>' +
    '</tbody>';
  var SINGLE_TABLE =
    '<table>' +
    '<tbody>' +
      '<tr>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="number" maxlength="1">' +
        '</td>' +
      '</tr>' +
    '</tbody>' +
    '</table>';

  /**
   * UBSudoku event triggers on the element:
   * `ub.sudoku.reset` -> When the game resets.
   * `ub.sudoku.start` -> When the game is done generating data into the table.
   * `ub.sudoku.done` -> When the validate method finally figures that the table is done!
   *                     Filled with the correct numbers.
   * `ub.sudoku.state.saved` -> When state successfully saved into local storage
   * `ub.sudoku.state.loaded` -> When state successfully loaded from local storage
   */

  function UBSudoku(elem, options) {
    this.$elem = $(elem);
    this.options = options;

    // hard code the total cell num to be 9x9
    this.rowTotalNum = 9;
    this.colTotalNum = 9;

    this.errorRowIndexes = [];
    this.errorColIndexes = [];
    this.errorTableIndexes = [];

    this.isGenerating = false;
    this.isValidatingOnType = false;

    // automatically initialize the sudoku board
    this._init();
  }

  /**
   * Method to initialize the Uber sudoku game :)
   * @private
   */
  UBSudoku.prototype._init = function () {
    // don't need to initialize if element length is 0 or
    //   data `uber.sudoku` already exists
    if (this.$elem.length === 0 ||
        this.$elem.data('ub.sudoku')) {
      return;
    }

    // create the tables
    // TODO this could use templating engine
    this.$elem.append(MAIN_TABLE_LAYOUT);
    this.$elem.find('tr').each(function (ir) {
      // ir = index row
      var $thisRow = $(this);

      $thisRow.find('td').each(function (ic) {
        // ic = index col
        var $singleTable = $(SINGLE_TABLE);
        $(this).append($singleTable);

        $singleTable.attr('data-section', (ir * 3) + ic);

        $singleTable.find('input').each(function (ip) {
          // ip = index input

          var $this = $(this);
          var row = Math.floor(ip / 3) + (ir * 3);
          var col = (ip % 3) + (ic * 3);
          $this.attr('data-row', row);
          $this.attr('data-col', col);
          $this.attr('disabled', 'disabled'); // disable everything first

          // disable our input[type=number] number scrolling
          $this.on('focus', function () {
            $(this).on('mousewheel.disableScroll', function (e) {
              e.preventDefault()
            });
          }).on('blur', function () {
            $(this).off('mousewheel.disableScroll');
          });

          var prevInput = '';
          $this.on('keyup.ub.sudoku.limit', function (evt) {
            // we set the input type to be number, hence it pretty sucks since
            //   when there's a non-number input, `.val()` will return empty string
            var inputValue = $this.val();

            // TODO there should be an easier way to do this
            if (inputValue.length > 1) {
              $this.val(inputValue.charAt(0));
            } else if (inputValue === '0') {
              $this.val('');
            } else if (this.checkValidity && this.checkValidity()) {
              prevInput = inputValue;
            } else {
              $this.val(prevInput);
            }
          });

        });
      });
    });
  };

  /**
   * Method to toggle the validation method, as you type or not
   */
  UBSudoku.prototype.toggleValidationMethod = function () {
    this.isValidatingOnType = !this.isValidatingOnType;
    this._setInputsValidationMethod();
  };

  UBSudoku.prototype._setInputsValidationMethod = function () {
    if (this.isValidatingOnType) {

      var self = this;
      self.validate();
      self.$elem.find('input').on('keyup.ub.sudoku.validating', function () {
        var $this = $(this);
        var row = parseInt($this.attr('data-row'));
        var col = parseInt($this.attr('data-col'));
        self.validate();
      });

    } else {

      this.$elem.find('input').off('keyup.ub.sudoku.validating')

    }
  };

  /**
   * Reset the state of the table
   */
  UBSudoku.prototype.reset = function () {
    this._clearErrors();

    this.$elem.find('input').removeClass('in').removeClass('success');

    // use setTimeout so that animation can play in different frame
    var self = this;
    setTimeout(function () {
      self.generateData();
    }, 0);
    this.$elem.trigger('ub.sudoku.reset');
  };

  /**
   * Save the state of the sudoku table into local storage, if available
   */
  UBSudoku.prototype.saveState = function () {
    if (!Modernizr.localstorage) {
      return;
    }

    // store table data
    // format: either string of a number or (string of a number & string)
    // [
    //   [1, 2, 3, 4, 5, 6f, 7f, 8, 9],
    //   [...], ...
    // ]
    //
    // the ones with `f` are the "fixed" ones, i.e. already shown on the table (pre-filled)
    // the ones without `f` are the ones that user filled in
    var tableMetadata = {
      row: this.rowTotalNum,
      col: this.colTotalNum,
      isValidatingOnType: this.isValidatingOnType,
      data: []
    };
    var tableValues = [];
    for (var i = 0; i < this.rowTotalNum; i++) {
      tableValues[i] = new Array(this.colTotalNum);
    }
    this.$elem.find('input').each(function () {
      var $this = $(this);
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));
      if ($this.attr('disabled')) {
        // remember that `val()` will return string
        tableValues[row][col] = $this.val() + 'f';
      } else {
        tableValues[row][col] = $this.val();
      }
    });
    tableMetadata['data'] = tableValues;
    window.localStorage.setItem('ub.sudoku.' + this.$elem.attr('id'), JSON.stringify(tableMetadata));
    this.$elem.trigger('ub.sudoku.state.saved');
  };

  /**
   * Method to load table state from local storage
   */
  UBSudoku.prototype.loadState = function () {
    if (!Modernizr.localstorage) {
      return;
    }

    var parsed = null;
    var i = 0;
    var j = 0;

    var tableData = window.localStorage.getItem('ub.sudoku.' + this.$elem.attr('id'));
    if (tableData) {
      try {
        parsed = JSON.parse(tableData);
        var tableValues = parsed.data;
        for (i = 0; i < parsed.row; i++) {
          for (j = 0; j < parsed.col; j++) {
            var value = tableValues[i][j];
            var $targetInput = $('input[data-row=' + i + '][data-col=' + j + ']');
            $targetInput.removeAttr('disabled');
            if (value !== '') {
              $targetInput.val(parseInt(value));
              if (value.length === 2 && value.indexOf('f') === 1) {
                // contains `f`
                $targetInput.attr('disabled', 'disabled');
              }
            }
          }
        }

        // set validation method
        this.isValidatingOnType = parsed.isValidatingOnType;
        this._setInputsValidationMethod();
        $('[data-ub-sudoku-trigger=toggleValidationMethod]').prop('checked', this.isValidatingOnType);

        this.validate();
        this.$elem.trigger('ub.sudoku.state.loaded');
      } catch (e) {
        // do nothing
      }
    }
  };

  UBSudoku.prototype.clearState = function () {
    if (!Modernizr.localstorage) {
      return;
    }
    window.localStorage.removeItem('ub.sudoku.' + this.$elem.attr('id'));
  };

  /**
   * Method to generate data onto the sudoku table
   */
  UBSudoku.prototype.generateData = function () {
    if (this.isGenerating) {
      return;
    }
    var self = this;
    self.isGenerating = true;
    self.$elem.find('input').val('').removeAttr('disabled');

    // how many numbers should be shown?
    // 17 is hard, 22 is medium, 27 is easy
    var gameSettingsShown = [17, 21, 25];
    var gameSettingsShownIndex = Math.floor(Math.random() * 3);

    var totalShown = gameSettingsShown[gameSettingsShownIndex];
    var shownSoFar = 0;
    var rowIndex = -1;
    var colIndex = -1;
    var inputValue = -1;
    var $input = null;
    var checks = {};

    var doFillAndCheck = function () {
      inputValue = Math.floor(Math.random() * 9) + 1;
      $input.val(inputValue);
      checks = self.checkCell(rowIndex, colIndex);
    };

    while (shownSoFar < totalShown) {
      rowIndex = Math.floor(Math.random() * this.rowTotalNum);
      colIndex = Math.floor(Math.random() * this.colTotalNum);
      $input = this.$elem.find('input[data-row=' + rowIndex + '][data-col=' + colIndex + ']');
      if ($input.val() !== '') {
        continue;
      }
      do {
        doFillAndCheck();
      } while (checks.rowError || checks.colError || checks.sectionError);
      $input.attr('disabled', 'disabled').addClass('in');
      shownSoFar = shownSoFar + 1;
    }

    this.isGenerating = false;
    this.$elem.trigger('ub.sudoku.start');
  };

  /**
   * Method to check whether there's an error with either row or column
   * @param isCheckingRow {boolean} `true` if you're checking for row, `false` if you're checking for column
   * @param index {number} the index to check, row index if `isCheckingRow` is `true`,
   *                       column index if `isCheckingRow` is `false`
   * @return {boolean} `true` if there's an error
   * @private
   */
  UBSudoku.prototype._isRowOrColumnError = function (isCheckingRow, index) {
    if ((isCheckingRow && this.errorRowIndexes.indexOf(index) > -1) ||
        (!isCheckingRow && this.errorColIndexes.indexOf(index) > -1)) {
      return true;
    }

    var isError = false;
    var inputs = [];
    var target = null;
    if (isCheckingRow) {
      target = 'input[data-row=' + index + ']';
    } else {
      target = 'input[data-col=' + index + ']';
    }
    this.$elem.find(target).each(function () {
      var value = $(this).val();
      if (value !== '' && inputs.indexOf(value) > -1) {
        isError = true;
        return false;
      } else {
        inputs.push(value);
      }
    });
    return isError;
  };

  /**
   * Method to check whether there's an error in the row
   * @param rowIndex {number} row index to check
   * @returns {boolean} `true` if there's an error in the row (duplicate number)
   */
  UBSudoku.prototype.isRowError = function (rowIndex) {
    return this._isRowOrColumnError(true, rowIndex);
  };

  /**
   * Method to check wheter there's an error in the column
   * @param colIndex {number} column index to check
   * @returns {boolean} `true` if there's an error in the column (duplicate number)
   */
  UBSudoku.prototype.isColumnError = function (colIndex) {
    return this._isRowOrColumnError(false, colIndex);
  };

  /**
   * Check whether the table group has an error (there's a duplicate number in the table group)
   * @param tableSectionIndex {number} the index of the table group (0 - 8)
   * @return {boolean} `true` if there's a duplicate number in the table group
   */
  UBSudoku.prototype.isTableSectionError = function (tableSectionIndex) {
    if (this.errorTableIndexes.indexOf(tableSectionIndex) > -1) {
      return true;
    }

    var hasTableSectionError = false;

    this.$elem.find('table[data-section=' + tableSectionIndex + ']').each(function () {

      var $thisTable = $(this);
      var inputs = [];

      $thisTable.find('input').each(function () {

        var value = $(this).val();
        if (value !== '' && inputs.indexOf(value) > -1) {
          hasTableSectionError = true;
          return false; // this is how we break jQuery `each`
        }
        inputs.push(value);

      });

    });

    return hasTableSectionError;
  };

  /**
   * Use the row index and column index to get the table group index
   * @param rowIndex {number} row index
   * @param colIndex {number} column index
   * @returns {number} the table group index (0 - 8)
   * @private
   */
  UBSudoku.prototype._getTableSectionIndex = function (rowIndex, colIndex) {
    return (Math.floor(rowIndex / 3) * 3) + Math.floor(colIndex / 3);
  };

  /**
   * Method to check whether a particular cell is good
   * @param rowIndex {number} row index
   * @param colIndex {number} column index
   * @return object
   * {
   * rowError -> boolean, true if row has error
   * colError -> boolean, true if column has error
   * sectionIndex -> number, the table section index
   * sectionError -> boolean, true if table section has error
   * }
   */
  UBSudoku.prototype.checkCell = function (rowIndex, colIndex) {
    var sectionIndex = this._getTableSectionIndex(rowIndex, colIndex);
    return {
      rowError: this.isRowError(rowIndex),
      colError: this.isColumnError(colIndex),
      sectionIndex: sectionIndex,
      sectionError: this.isTableSectionError(sectionIndex)
    };
  };

  /**
   * Method to check whether a particular cell is good
   * If not, add the necessary error classes
   * @param rowIndex {number} row index
   * @param colIndex {number} column index
   */
  UBSudoku.prototype.checkCellAndMark = function (rowIndex, colIndex) {
    var checks = this.checkCell(rowIndex, colIndex);
    if (checks.rowError) {
      this.errorRowIndexes.push(rowIndex);
      this.$elem.find('input[data-row=' + rowIndex + ']').each(function () {
        $(this).addClass('error');
      });
    }

    if (checks.colError) {
      this.errorColIndexes.push(colIndex);
      this.$elem.find('input[data-col=' + colIndex + ']').each(function () {
        $(this).addClass('error');
      });
    }

    if (checks.sectionError) {
      this.errorTableIndexes.push(checks.sectionIndex);
      this.$elem.find('table[data-section=' + checks.sectionIndex + ']').addClass('error');
    }
  };

  /**
   * Clear all errors related stuff
   */
  UBSudoku.prototype._clearErrors = function () {
    this.errorColIndexes = [];
    this.errorRowIndexes = [];
    this.errorTableIndexes = [];
    this.$elem.find('table').removeClass('error');
    this.$elem.find('input').removeClass('error');
  };

  /**
   * Each table section cannot have duplicate number
   * Each row and each column cannot have any duplicate number
   */
  UBSudoku.prototype.validate = function () {
    // clear out all error classes first
    // this will also clear out the error indexes container
    this._clearErrors();

    // populate the error indexes
    var rowIndex = 0;
    var colIndex = 0;
    for (rowIndex = 0; rowIndex < this.rowTotalNum; rowIndex++) {
      for (colIndex = 0; colIndex < this.colTotalNum; colIndex++) {
        this.checkCellAndMark(rowIndex, colIndex);
      }
    }

    // check whether there's any error exists
    // also need to make sure that all inputs are filled
    var areAllInputsFilled = true;
    this.$elem.find('input').each(function () {
      var $this = $(this);
      if ($this.val() === '') {
        areAllInputsFilled = false;
      }
    });

    var hasNoError = this.errorColIndexes.length === 0 &&
      this.errorRowIndexes.length === 0 &&
      this.errorTableIndexes.length === 0;

    if (areAllInputsFilled && hasNoError) {
      // hooray, no error
      this.$elem.find('input').each(function () {
        $(this).addClass('success');
      });
      // trigger success event, we could pass in some extra params here `.trigger('...', [..., ..., ...])`
      this.$elem.trigger('ub.sudoku.done');
    }
  };

  var old = $.fn.ubSudoku;

  $.fn.ubSudoku = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('ub.sudoku');
      var options = $.extend({}, UBSudoku.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data) {
        $this.data('ub.sudoku', (data = new UBSudoku(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      }
    });
  };

  /**
   * call this if you want to use the previous `ubSudoku`
   * i.e. if there's previouse `ubSudoku` defined
   */
  $.fn.ubSudoku.noConflict = function () {
    $.fn.ubSudoku = old;
    return this;
  };

  // DATA-API CALL
  // =============

  $(function () {
    $('[data-ub-sudoku]').ubSudoku();
  });


  // DATA-API EVENT LISTENERS
  // ========================

  $(document).on('click.ub.sudoku', '[data-ub-sudoku-trigger]', function () {
    var $this = $(this);
    if ($this.attr('disabled')) {
      return;
    }
    $($this.data('ubSudokuTarget')).ubSudoku($this.attr('data-ub-sudoku-trigger'));
  });

})(jQuery);