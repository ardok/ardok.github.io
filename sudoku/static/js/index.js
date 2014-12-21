$(function () {
  var $cheatFillBtn = $('.cheat-fill-btn');
  var $startBtn = $('.start-btn');
  var $validateBtn = $('.validate-btn');

  var $sudokuTable = $('#sudoku-table');
  var $sudokuTimer = $('#sudoku-timer');
  var $tableWrapper = $sudokuTable.parents('.table-wrapper');
  var $gifContainer = $tableWrapper.find('.success-gif-container');
  var $gif = $gifContainer.find('.success-gif');
  var $spinner = $gifContainer.find('.spinner');

  if (window.location.search.indexOf('mode=god') > -1) {
    // TODO this can be done with templating engine
    $cheatFillBtn.show();
  }

  $sudokuTimer.ubTimer();
  var sudokuStartFunc = function (evt) {
    // start timer, show / hide buttons
    $sudokuTimer.ubTimer('start');
    $startBtn.text('New Game');
    
    $validateBtn.show().removeAttr('disabled');
    $cheatFillBtn.removeAttr('disabled');

    // hide the success gif
    $gifContainer.removeClass('show');
    $gif.removeClass('show');
  };

  var sudokuDoneFunc = function (evt) {
    // stop timer
    $sudokuTimer.ubTimer('stop');

    // deal with buttons
    $validateBtn.attr('disabled', 'disabled');
    $cheatFillBtn.attr('disabled', 'disabled');

    // We would like to show our success gif when sudoku game is over with a success!
    // The thing with loading a gif is that it might take some time if your internet is slow.
    // So, we will show a spinner and hide it after the gif loads
    $gifContainer.addClass('show');
    if ($gif.data('loaded')) {
      // don't need to deal with lazy src anymore
      $gif.addClass('show');
    } else {
      $gif.on('load', function () {
        $gif.addClass('show');
        $gif.data('loaded', true);
        $spinner.hide();
      });
      $gif.ubLazySrc();
    }
  };

  var sudokuResetFunc = function (evt) {
    // reset timer
    $sudokuTimer.ubTimer('reset');
  };

  $sudokuTable.on('ub.sudoku.start', sudokuStartFunc)
    .on('ub.sudoku.done', sudokuDoneFunc)
    .on('ub.sudoku.reset', sudokuResetFunc);

});