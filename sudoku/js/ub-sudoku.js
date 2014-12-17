(function ($) {

  var NUMBERS = [1, 2, 3, 4, 5, 6, 7, 8, 9];

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
   * [0..26][0..2]
   *
   * data is from:
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714.svg
   * http://en.wikipedia.org/wiki/File:Sudoku-by-L2G-20050714_solution.svg
   */
  var BOARD_VALUE = [
    [
      [5, 3, 4], [6, 7, 8], [9, 1, 2],
      [6, 7, 2], [1, 9, 5], [3, 4, 8],
      [1, 9, 8], [3, 4, 2], [5, 6, 7],

      [8, 5, 9], [7, 6, 1], [4, 2, 3],
      [4, 2, 6], [8, 5, 3], [7, 9, 1],
      [7, 1, 3], [9, 2, 4], [8, 5, 6],

      [9, 6, 1], [5, 3, 7], [2, 8, 4],
      [2, 8, 7], [4, 1, 9], [6, 3, 5],
      [3, 4, 5], [2, 8, 6], [1, 7, 9]
    ]
  ];

  /**
   * 0 is hidden, 1 is shown
   */
  var BOARD_SHOW = [
    [
      // 0 1 2
      // 3 4 5
      // 6 7 8
      // 9 10 11
      // 12 13 14
      // 15 16 17
      // 18 19 20
      // 21 22 23
      // 24 25 26
      [1, 1, 0], [0, 1, 0], [0, 0, 0],
      [1, 0, 0], [1, 1, 1], [0, 0, 0],
      [0, 1, 1], [0, 0, 0], [0, 1, 0],

      [1, 0, 0], [0, 1, 0], [0, 0, 1],
      [1, 0, 0], [1, 0, 1], [0, 0, 1],
      [1, 0, 0], [0, 1, 0], [0, 0, 1],

      [0, 1, 0], [0, 0, 0], [1, 1, 0],
      [0, 0, 0], [1, 1, 1], [0, 0, 1],
      [0, 0, 0], [0, 1, 0], [0, 1, 1]
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

    this.init();
  }

  UberSudoku.prototype.init = function () {
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

        // get the data for this single table
//        console.log((ir * 3) + (ir * 6) + ic);
//        console.log(((ir + 1) * 3) + (ir * 6) + ic);
//        console.log(((ir + 2) * 3) + (ir * 6) + ic);
        var firstRow = (ir * 3) + (ir * 6) + ic;
        var secondRow = (ir + 1) * 3 + (ir * 6) + ic;
        var thirdRow = (ir + 2) * 3 + (ir * 6) + ic;

        var singleTableData = [
          self.BOARD_VALUE[firstRow],
          self.BOARD_VALUE[secondRow],
          self.BOARD_VALUE[thirdRow]
        ];
        var mergedData = [];
        mergedData = mergedData.concat.apply(mergedData, singleTableData);

        var singleTableShow = [
          self.BOARD_SHOW[firstRow],
          self.BOARD_SHOW[secondRow],
          self.BOARD_SHOW[thirdRow]
        ];
        var mergedShow = [];
        mergedShow = mergedShow.concat.apply(mergedShow, singleTableShow);

        $singleTable.find('input').each(function (ip) {
          // ip = index input

          var $this = $(this);
          $this.attr('data-row', Math.floor(ip / 3) + (ir * 3));
          $this.attr('data-col', ip % 3 + (ic * 3));

          // only show number that needs to be shown
          if (mergedShow[ip] === 1) {
            $this.val(mergedData[ip]).attr('disabled', 'disabled');
          }
        });
      });
    });

  };

  /**
   * Each row and each column cannot have any duplicate number
   */
  UberSudoku.prototype.validate = function () {
    // TODO HACK uber ugly check, just use the array....

    var self = this;
    var isError = false;

    this.$elem.find('input').each(function () {
      var $this = $(this);
      $this.removeClass('success');
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));

      var obj = self._translateToBoardValIndex(row, col);
      if (parseInt($this.val()) !==
        self.BOARD_VALUE[obj.row][obj.col]) {
        $this.addClass('error');
        isError = true;
      } else {
        $this.removeClass('error');
      }
    });

    if (!isError) {
      // hooray, no error
      this.$elem.find('input').each(function () {
        $(this).addClass('success');
      });
    }
  };

  UberSudoku.prototype._translateToBoardValIndex = function (row, col) {
    return {
      row: (row * 3) + Math.floor(col / 3),
      col: Math.floor(col % 3)
    };
  };

  UberSudoku.prototype.cheatFill = function () {
    // just fill the answer in
    var self = this;
    this.$elem.find('input').each(function () {
      var $this = $(this);
      var row = parseInt($this.attr('data-row'));
      var col = parseInt($this.attr('data-col'));

      var obj = self._translateToBoardValIndex(row, col);
      $this.val(self.BOARD_VALUE[obj.row][obj.col]);
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

  $.fn.uberSudoku.noConflict = function () {
    $.fn.uberSudoku = old;
    return this;
  };

  $(document).on('click.ub.sudoku', '[data-ub-trigger=validate]', function () {
    var data = $($(this).data('ubTarget')).data('uber.sudoku');
    if (data) {
      data.validate();
    }
  });

})(jQuery);