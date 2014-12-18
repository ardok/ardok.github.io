(function ($) {

  // TODO use templating engine
  var SINGLE_TABLE =
    '<table>' +
    '<tbody>' +
      '<tr>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
      '</tr>' +
      '<tr>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
        '<td>' +
          '<input type="text" maxlength="1">' +
        '</td>' +
      '</tr>' +
    '</tbody>' +
    '</table>';

  /**
   * possible values of the board
   *
   * data is from:
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714.svg
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714_solution.svg
   */
  var BOARD_VALUE = [
    [
      [5, 3, 4, 6, 7, 8, 9, 1, 2],
      [6, 7, 2, 1, 9, 5, 3, 4, 8],
      [1, 9, 8, 3, 4, 2, 5, 6, 7],
      [8, 5, 9, 7, 6, 1, 4, 2, 3],
      [4, 2, 6, 8, 5, 3, 7, 9, 1],
      [7, 1, 3, 9, 2, 4, 8, 5, 6],
      [9, 6, 1, 5, 3, 7, 2, 8, 4],
      [2, 8, 7, 4, 1, 9, 6, 3, 5],
      [3, 4, 5, 2, 8, 6, 1, 7, 9]
    ]
  ];

  /**
   * 0 is hidden, 1 is shown
   */
  var BOARD_SHOW = [
    [
      [1, 1, 0, 0, 1, 0, 0, 0, 0],
      [1, 0, 0, 1, 1, 1, 0, 0, 0],
      [0, 1, 1, 0, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [1, 0, 0, 1, 0, 1, 0, 0, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 0, 1, 1, 0],
      [0, 0, 0, 1, 1, 1, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 1, 1]
    ]
  ];



  /**
   * Return a random number from 1 - 9 (inclusive)
   */
  function rand9() {
    // the Math.floor(...) will generate 0 - 8
    // add `1` so that it will become 1 - 9
    return Math.floor(Math.random() * 9) + 1;
  }

  function UberSudoku(elem, options) {
    this.$elem = $(elem);
    this.options = options;

    // data to use
    var index = options.ubBoardIndex || 0;
    this.BOARD_VALUE = BOARD_VALUE[index];
    this.BOARD_SHOW = BOARD_SHOW[index];

    this.errorRowIndexes = [];
    this.errorColIndexes = [];
    this.errorTableIndexes = [];

    this._init();
  }

  UberSudoku.prototype._rowColTo81 = function (row, col) {
    return (row * 9) + col;
  };

  /**
   * Method to initialize the Uber sudoku game :)
   * @private
   */
  UberSudoku.prototype._init = function () {
    // don't need to initialize if element length is 0 or
    //   data `uber.sudoku` already exists
    if (this.$elem.length === 0 ||
        this.$elem.data('uber.sudoku')) {
      return;
    }

    var self = this;

    // create the tables
    // TODO this could use templating engine
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
        });
      });
    });

    // put the values in
    this.$elem.find('input').each(function () {
      var $this = $(this);
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));

      if (self.BOARD_SHOW[row][col] === 1) {
        $this.val(self.BOARD_VALUE[row][col]).attr('disabled', 'disabled');
      }
    });

  };

  UberSudoku.prototype.generateRandomData = function () {

  };

  UberSudoku.prototype.setCellValue = function (row, col, val) {
    var target = 'input[data-row=' + row + '][data-col=' + col + ']';
    this.$elem.find(target).val(val);
  };

  /**
   * Method to check whether there's an error with either row or column
   * @param isCheckingRow {boolean} `true` if you're checking for row, `false` if you're checking for column
   * @param index {number} the index to check, row index if `isCheckingRow` is `true`,
   *                       column index if `isCheckingRow` is `false`
   * @return {boolean} `true` if there's an error
   * @private
   */
  UberSudoku.prototype._isRowOrColumnError = function (isCheckingRow, index) {
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
  UberSudoku.prototype.isRowError = function (rowIndex) {
    return this._isRowOrColumnError(true, rowIndex);
  };

  /**
   * Method to check wheter there's an error in the column
   * @param colIndex {number} column index to check
   * @returns {boolean} `true` if there's an error in the column (duplicate number)
   */
  UberSudoku.prototype.isColumnError = function (colIndex) {
    return this._isRowOrColumnError(false, colIndex);
  };

  /**
   * Check whether the table group has an error (there's a duplicate number in the table group)
   * @param tableSectionIndex {number} the index of the table group (0 - 8)
   * @return {boolean} `true` if there's a duplicate number in the table group
   */
  UberSudoku.prototype.isTableSectionError = function (tableSectionIndex) {
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
  UberSudoku.prototype._getTableSectionIndex = function (rowIndex, colIndex) {
    return Math.floor(rowIndex / 3) + Math.floor(colIndex / 3);
  };

  /**
   * Return an object that contains keys:
   * `isRowError` -> `true` if row is error
   * `isColumnError` -> `true` if column is error
   * `isTableError` -> `true` if the table section is error
   */
  UberSudoku.prototype.isCellOk = function (rowIndex, colIndex) {
    return {
      rowError: this.isRowError(rowIndex),
      columnError: this.isColumnError(colIndex),
      tableError: this.isTableSectionError(this._getTableSectionIndex(rowIndex, colIndex))
    };
  };

  /**
   * Clear all errors related stuff
   */
  UberSudoku.prototype._clearErrors = function () {
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
  UberSudoku.prototype.validate = function () {
    // clear out all error classes first
    // this will also clear out the error indexes container
    this._clearErrors();

    // populate the error indexes
    var rowIndex = 0;
    var colIndex = 0;
    // hard code to 9 for now since we only have 9x9 table
    for (rowIndex = 0; rowIndex < 9; rowIndex++) {
      for (colIndex = 0; colIndex < 9; colIndex++) {
        var obj = this.isCellOk(rowIndex, colIndex);
        if (obj.rowError && this.errorRowIndexes.indexOf(rowIndex) === -1) {
          this.errorRowIndexes.push(rowIndex);
        }
        if (obj.columnError && this.errorColIndexes.indexOf(colIndex) === -1) {
          this.errorColIndexes.push(colIndex);
        }
        var tableIndex = this._getTableSectionIndex(rowIndex, colIndex);
        if (obj.tableError && this.errorTableIndexes.indexOf(tableIndex) === -1) {
          this.errorTableIndexes.push(tableIndex);
        }
      }
    }

    // now add error class to each input / table that has error
    var index = 0;
    for (index = 0; index < this.errorRowIndexes.length; index++) {
      this.$elem.find('input[data-row=' + this.errorRowIndexes[index] + ']').each(function () {
        $(this).addClass('error');
      });
    }
    for (index = 0; index < this.errorColIndexes.length; index++) {
      this.$elem.find('input[data-col=' + this.errorColIndexes[index] + ']').each(function () {
        $(this).addClass('error');
      });
    }
    for (index = 0; index < this.errorTableIndexes.length; index++) {
      this.$elem.find('table[data-section=' + this.errorTableIndexes[index] + ']').addClass('error');
    }

    // check whether there's any error exists
    // need to make sure that all inputs are filled
    var allInputsFilled = [];
    this.$elem.find('input').each(function () {
      allInputsFilled.push($(this).val() !== '');
    });

    if (allInputsFilled.indexOf(false) === -1 &&
        this.errorTableIndexes.length === 0 &&
        this.errorRowIndexes.length === 0 &&
        this.errorColIndexes.length === 0) {
      // hooray, no error
      this.$elem.find('input').each(function () {
        $(this).addClass('success');
      });
    }

  };

  /**
   * Method to fill all cells right away
   */
  UberSudoku.prototype.cheatFill = function () {
    // just fill the answer in
    var self = this;
    this.$elem.find('input').each(function () {
      var $this = $(this);
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));
      $this.val(self.BOARD_VALUE[row][col]);
    });
  };

  var old = $.fn.uberSudoku;

  $.fn.uberSudoku = function (opt) {
    return this.each(function () {
      var $this = $(this);
      var data = $this.data('uber.sudoku');
      var options = $.extend({}, UberSudoku.DEFAULTS, $this.data(), typeof opt === 'object' && opt);

      if (!data) {
        $this.data('uber.sudoku', (data = new UberSudoku(this, options)));
      }

      if (typeof opt === 'string' && typeof data[opt] === 'function') {
        data[opt]();
      }
    });
  };

  /**
   * call this if you want to use the previous `uberSudoku`
   */
  $.fn.uberSudoku.noConflict = function () {
    $.fn.uberSudoku = old;
    return this;
  };

  // DATA-API CALL
  // =============

  $(function () {
    $('[data-uber-sudoku]').uberSudoku();
  });


  // DATA-API EVENT LISTENERS
  // ========================

  $(document).on('click.ub.sudoku', '[data-ub-trigger=validate]', function () {
    var data = $($(this).data('ubTarget')).data('uber.sudoku');
    if (data) {
      data.validate();
    }
  }).on('click.ub.sudoku', '[data-ub-trigger=cheatFill]', function () {
    var data = $($(this).data('ubTarget')).data('uber.sudoku');
    if (data) {
      data.cheatFill();
    }
  });

})(jQuery);