(function ($) {

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

    this.matrixCache = [];
    // initialize the array to be 9x9
    var i = 0;
    var j = 0;
    for (i = 0; i < 9; i++) {
      this.matrixCache.push([]);
      for (j = 0; j < 9; j++) {
        this.matrixCache[i].push(0);
      }
    }
    // now matrixCache is [[], [], []...] 9 arrays with 9 values in each

    this._init();
  }

  UberSudoku.prototype._rowColTo81 = function (row, col) {
    return (row * 9) + col;
  };

  UberSudoku.prototype._init = function () {
    // don't need to initialize if element length is 0 or
    //   data `uber.sudoku` already exists
    if (this.$elem.length === 0 ||
        this.$elem.data('uber.sudoku')) {
      return;
    }

    var self = this;

    // create the tables
    this.$elem.find('tr').each(function (ir) {
      // ir = index row
      var $thisRow = $(this);

      $thisRow.find('td').each(function (ic) {
        // ic = index col
        var $singleTable = $(SINGLE_TABLE);
        $(this).append($singleTable);

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


  UberSudoku.prototype.checkRow = function (rowIndex) {
  };

  UberSudoku.prototype.checkColumn = function (colIndex) {

  };

  UberSudoku.prototype.checkCell = function (rowIndex, colIndex) {

  };

  UberSudoku.prototype._getErrorIndexes = function (isRowCheck) {
    var i = 0;
    var j = 0;
    var target = null;
    var $target = null;
    var value = 0;
    var inputs = [];
    var errorIndexes = [];

    // this is our main validation loop check
    for (i = 0; i < 9; i++) {
      for (j = 0; j < 9; j++) {
        if (isRowCheck) {
          target = 'input[data-row=' + i + '][data-col=' + j + ']';
        } else {
          target = 'input[data-col=' + i + '][data-row=' + j + ']';
        }
        $target = this.$elem.find(target);
        value = $target.val();

        if (value !== '' && inputs.indexOf(value) > -1) {
          // input already exists, push the error index and break this loop
          errorIndexes.push(i);
          break;
        } else {
          // input does not exist yet, push it in
          inputs.push(value);
        }
      }

      // for each iteration, reset `inputs`
      inputs = [];
    }

    return errorIndexes;
  };

  /**
   * Clear all error classes
   */
  UberSudoku.prototype._clearErrors = function () {
    this.$elem.find('table').removeClass('error');
    this.$elem.find('input').removeClass('error');
  };

  /**
   * Each table section cannot have duplicate number
   * Each row and each column cannot have any duplicate number
   */
  UberSudoku.prototype.validate = function () {
    // clear out all error classes first
    this._clearErrors();

    // check each table section first
    var hasTableSectionError = false;

    this.$elem.find('table').each(function () {

      var $thisTable = $(this);
      var inputs = [];

      // we want to check that each table has unique input
      $thisTable.find('input').each(function () {

        var value = $(this).val();
        if (value !== '' && inputs.indexOf(value) > -1) {
          hasTableSectionError = true;
          return false; // this is how we break jQuery `each`
        }
        inputs.push(value);

      });

      if (hasTableSectionError) {
        $thisTable.addClass('error');
      }

    });

    // get the error indexes for row and column
    var errorRowIndexes = this._getErrorIndexes(true);
    var errorColIndexes = this._getErrorIndexes(false);

    // now add error class to each input that has error
    var index = 0;
    for (index = 0; index < errorRowIndexes.length; index++) {
      this.$elem.find('input[data-row=' + errorRowIndexes[index] + ']').each(function () {
        $(this).addClass('error');
      });
    }
    for (index = 0; index < errorColIndexes.length; index++) {
      this.$elem.find('input[data-col=' + errorColIndexes[index] + ']').each(function () {
        $(this).addClass('error');
      });
    }

    // check whether there's any error exists
    if (!hasTableSectionError && errorRowIndexes.length === 0 && errorColIndexes.length === 0) {
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