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
   * possible values of the board
   *
   * first data is from:
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714.svg
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714_solution.svg
   *
   * the rests are from: http://www.nikoli.com/en/puzzles/sudoku/
   */
  // TODO use a generator
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
    ],
    // --- easy
    [
      [2, 3, 9, 7, 1, 5, 4, 6, 8],
      [1, 4, 6, 2, 8, 3, 9, 5, 7],
      [8, 7, 5, 4, 9, 6, 2, 3, 1],
      [3, 9, 7, 6, 5, 8, 1, 4, 2],
      [5, 2, 8, 1, 4, 9, 6, 7, 3],
      [6, 1, 4, 3, 2, 7, 5, 8, 9],
      [4, 6, 2, 8, 7, 1, 3, 9, 5],
      [9, 8, 3, 5, 6, 2, 7, 1, 4],
      [7, 5, 1, 9, 3, 4, 8, 2, 6]
    ],
    [
      [2, 5, 3, 1, 4, 7, 6, 9, 8],
      [4, 9, 1, 3, 6, 8, 7, 5, 2],
      [7, 6, 8, 5, 2, 9, 4, 3, 1],
      [1, 3, 2, 9, 7, 6, 8, 4, 5],
      [8, 7, 6, 4, 5, 1, 9, 2, 3],
      [9, 4, 5, 8, 3, 2, 1, 7, 6],
      [5, 8, 7, 6, 9, 3, 2, 1, 4],
      [3, 1, 9, 2, 8, 4, 5, 6, 7],
      [6, 2, 4, 7, 1, 5, 3, 8, 9]
    ],
    // --- medium
    [
      [9, 7, 4, 3, 6, 8, 1, 5, 2],
      [3, 5, 8, 1, 2, 7, 6, 9, 4],
      [6, 1, 2, 5, 9, 4, 7, 8, 3],
      [5, 6, 7, 4, 8, 1, 3, 2, 9],
      [8, 2, 1, 7, 3, 9, 4, 6, 5],
      [4, 9, 3, 2, 5, 6, 8, 7, 1],
      [1, 8, 9, 6, 4, 5, 2, 3, 7],
      [2, 4, 6, 9, 7, 3, 5, 1, 8],
      [7, 3, 5, 8, 1, 2, 9, 4, 6]
    ],
    [
      [4, 8, 9, 6, 5, 3, 2, 1, 7],
      [1, 2, 3, 4, 7, 9, 5, 8, 6],
      [5, 6, 7, 8, 2, 1, 9, 4, 3],
      [9, 1, 2, 3, 6, 8, 4, 7, 5],
      [8, 5, 6, 2, 4, 7, 3, 9, 1],
      [7, 3, 4, 9, 1, 5, 6, 2, 8],
      [6, 7, 1, 5, 9, 2, 8, 3, 4],
      [2, 4, 8, 1, 3, 6, 7, 5, 9],
      [3, 9, 5, 7, 8, 4, 1, 6, 2]
    ],
    // --- hard
    [
      [6, 4, 1, 7, 3, 9, 8, 2, 5],
      [7, 5, 2, 8, 1, 6, 9, 4, 3],
      [8, 3, 9, 2, 5, 4, 6, 1, 7],
      [1, 6, 7, 3, 9, 5, 4, 8, 2],
      [4, 8, 5, 1, 6, 2, 7, 3, 9],
      [9, 2, 3, 4, 7, 8, 5, 6, 1],
      [3, 1, 6, 9, 4, 7, 2, 5, 8],
      [5, 7, 8, 6, 2, 1, 3, 9, 4],
      [2, 9, 4, 5, 8, 3, 1, 7, 6]
    ],
    [
      [4, 3, 8, 1, 7, 2, 6, 9, 5],
      [6, 1, 7, 9, 5, 4, 3, 8, 2],
      [2, 9, 5, 8, 3, 6, 4, 7, 1],
      [1, 7, 3, 6, 4, 9, 2, 5, 8],
      [5, 6, 9, 7, 2, 8, 1, 3, 4],
      [8, 2, 4, 5, 1, 3, 9, 6, 7],
      [9, 8, 2, 4, 6, 5, 7, 1, 3],
      [3, 5, 1, 2, 9, 7, 8, 4, 6],
      [7, 4, 6, 3, 8, 1, 5, 2, 9]
    ]
    // feel free to add more board here, and don't forget to add the visibility at the same index
    // into `BOARD_SHOW`
  ];

  /**
   * 0 is hidden, 1 is shown
   * The index matches with `BOARD_VALUE`
   */
  // TODO use a generator
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
    ],
    [
      [1, 1, 0, 0, 0, 0, 0, 1, 1],
      [1, 0, 0, 0, 0, 0, 0, 1, 1],
      [0, 0, 1, 1, 0, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 1, 1, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 0, 1, 1, 0, 0],
      [1, 1, 0, 0, 0, 0, 0, 0, 1],
      [1, 1, 0, 0, 0, 0, 0, 1, 1]
    ],
    [
      [0, 1, 1, 1, 0, 0, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 1, 1],
      [1, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 0],
      [0, 1, 1, 1, 0, 1, 1, 1, 0],
      [0, 0, 0, 0, 1, 0, 0, 0, 1],
      [0, 0, 0, 0, 1, 0, 0, 0, 0],
      [1, 1, 0, 0, 1, 0, 0, 0, 1],
      [0, 1, 0, 0, 0, 1, 1, 1, 0]
    ],
    [
      [1, 0, 0, 0, 0, 1, 1, 0, 0],
      [0, 0, 0, 1, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 1],
      [0, 0, 1, 0, 0, 1, 0, 0, 1],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [1, 0, 0, 1, 0, 0, 1, 0, 0],
      [1, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 1, 0, 0, 0],
      [0, 0, 1, 1, 0, 0, 0, 0, 1]
    ],
    [
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0, 0],
      [1, 1, 1, 1, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 0, 0, 0, 0],
      [0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 1, 1, 1, 1],
      [0, 0, 0, 0, 0, 0, 0, 0, 0]
    ],
    [
      [0, 0, 1, 0, 0, 0, 1, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 0, 1, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 1, 0, 1, 0],
      [1, 0, 0, 0, 1, 0, 0, 0, 1],
      [0, 1, 0, 1, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 1, 0, 0, 0],
      [0, 1, 0, 0, 1, 0, 0, 1, 0],
      [0, 0, 1, 0, 0, 0, 1, 0, 0]
    ],
    [
      [0, 0, 0, 0, 1, 0, 1, 0, 1],
      [0, 0, 0, 0, 0, 1, 0, 1, 0],
      [1, 0, 0, 0, 0, 1, 0, 1, 0],
      [0, 1, 1, 0, 0, 0, 1, 0, 0],
      [1, 0, 0, 0, 0, 0, 0, 0, 1],
      [0, 0, 1, 0, 0, 0, 1, 1, 0],
      [0, 1, 0, 1, 0, 0, 0, 0, 1],
      [0, 1, 0, 1, 0, 0, 0, 0, 0],
      [1, 0, 1, 0, 1, 0, 0, 0, 0]
    ]
  ];

  /**
   * We don't want to show the board that has been played in the past 3 games.
   * Just for more variation...
   * Again, TODO would be nice to have a board generator
   */
  var boardsPlayed = [];
  function randBoardIndex() {
    if (BOARD_VALUE.length !== BOARD_SHOW.length) {
      return -1;
    }
    var getRandomBoardIndex = function () {
      return Math.floor(Math.random() * BOARD_VALUE.length);
    };
    var index = getRandomBoardIndex();
    var tries = 0;
    while (boardsPlayed.indexOf(index) > -1) {
      index = getRandomBoardIndex();
      tries = tries + 1;
      if (tries >= 20) {
        // just try 20 times...
        break;
      }
    }
    if (boardsPlayed.length >= 3) {
      boardsPlayed.pop(); // remove the latest one
    }
    boardsPlayed.unshift(index); // prepend the value to the front
    return index;
  }

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

    // data to use
    this.BOARD_VALUE = null;
    this.BOARD_SHOW = null;

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

    // use timeout so that animation can play in different frame
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

    this.isGenerating = true;

    // TODO this will be our generator
    // unfortunately, because I'm lame, we will just use hard-coded value for now
    var index = randBoardIndex();
    this.BOARD_VALUE = BOARD_VALUE[index];
    this.BOARD_SHOW = BOARD_SHOW[index];

    var self = this;
    // put the values in
    this.$elem.find('input').each(function () {
      var $this = $(this);

      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));

      if (self.BOARD_SHOW[row][col] === 1) {
        $this.val(self.BOARD_VALUE[row][col]).addClass('in').attr('disabled', 'disabled');
      } else {
        $this.removeAttr('disabled');
      }

      // now, we need to limit the value inputted into numbers only
      var prevInput = '';
      $this.on('keyup', function (evt) {
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
   * If not, add the necessary error classes
   * @param rowIndex {number} row index
   * @param colIndex {number} column index
   */
  UBSudoku.prototype.checkCell = function (rowIndex, colIndex) {
    if (this.isRowError(rowIndex)) {
      this.errorRowIndexes.push(rowIndex);
      this.$elem.find('input[data-row=' + rowIndex + ']').each(function () {
        $(this).addClass('error');
      });
    }

    if (this.isColumnError(colIndex)) {
      this.errorColIndexes.push(colIndex);
      this.$elem.find('input[data-col=' + colIndex + ']').each(function () {
        $(this).addClass('error');
      });
    }

    var tableIndex = this._getTableSectionIndex(rowIndex, colIndex);
    if (this.isTableSectionError(tableIndex)) {
      this.errorTableIndexes.push(tableIndex);
      this.$elem.find('table[data-section=' + tableIndex + ']').addClass('error');
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
        this.checkCell(rowIndex, colIndex);
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

  /**
   * Method to fill all cells right away
   *
   * THIS IS NOT A SOLVER
   * This method just fetched the actual data from `BOARD_VALUE`
   */
  UBSudoku.prototype.cheatFill = function () {
    // just fill the answer in
    var self = this;
    this.$elem.find('input').each(function () {
      var $this = $(this);
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));
      $this.val(self.BOARD_VALUE[row][col]);
    });
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