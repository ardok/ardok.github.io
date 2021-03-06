$(function () {
  var $cheatFillBtn = $('.cheat-fill-btn');
  var $startBtn = $('.start-btn');
  var $validateBtn = $('.validate-btn');
  var $saveBtn = $('.save-btn');

  var $sudokuTable = $('#sudoku-table-1');
  var $sudokuTimer = $('#sudoku-timer-1');
  var $tableWrapper = $sudokuTable.parents('.table-wrapper');
  var $gifContainer = $tableWrapper.find('.success-gif-container');
  var $gif = $gifContainer.find('.success-gif');
  var $spinner = $gifContainer.find('.spinner');

  if (window.location.search.indexOf('mode=god') > -1) {
    // TODO this can be done with templating engine
    $cheatFillBtn.show();
  }

  var saveTipTimeout = null;

  var sudokuStartFunc = function (evt) {
    // start timer, show / hide buttons
    $sudokuTimer.ubTimer('start');
    $startBtn.text('New Game');
    
    $validateBtn.show().removeAttr('disabled');
    $cheatFillBtn.removeAttr('disabled');
    $saveBtn.removeAttr('disabled');

    if (Modernizr.localstorage) {
      $saveBtn.show();
    }

    // hide the success gif
    $gifContainer.removeClass('show');
    $gif.removeClass('show');

    if (Modernizr.localstorage) {
      // show some helpful tip on saving state after 30s
      // if user hasn't seen it in the last 24 hours (1 day)
      if ($.cookie('ub.sudoku.shown.saveTip') !== 'true' && saveTipTimeout === null) {
        saveTipTimeout = setTimeout(function () {
          // set the cookie to expire in 1 day
          $.cookie('ub.sudoku.shown.saveTip', 'true', { expires: 1 });
          window.UB.Notification.show('Click "Save" button to save your current table state');
        }, 30000);
      }
    }
  };

  var sudokuDoneFunc = function (evt) {
    // stop timer
    $sudokuTimer.ubTimer('stop');

    // deal with buttons
    $validateBtn.attr('disabled', 'disabled');
    $cheatFillBtn.attr('disabled', 'disabled');
    $saveBtn.attr('disabled', 'disabled');

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

  // check whether there is data that we want in local storage
  // if there is, ask user whether user wants to load the last state
  // after loading, delete the state from local storage
  // we will also delete the state from local storage if user click no
  if (Modernizr.localstorage) {
    var $loadStateModal = $('#load-state-modal');

    var tableData = window.localStorage.getItem('ub.sudoku.sudoku-table-1');
    var timerData = window.localStorage.getItem('ub.timer.sudoku-timer-1');
    if (tableData) {
      // open modal
      $loadStateModal.ubModal('open');

      $loadStateModal.find('.load-state-ok-btn').on('click', function () {
        $loadStateModal.ubModal('close');
        $sudokuTable.ubSudoku('loadState').trigger('ub.sudoku.start');
        if (timerData) {
          $sudokuTimer.ubTimer('loadState');
        }
      });

      $loadStateModal.on('ub.modal.hidden').on('click', function () {
        $sudokuTable.ubSudoku('clearState');
        $sudokuTimer.ubTimer('clearState');
      });

    }

    var stateSavedTimes = 0;
    var stateSavedTimesResetTimeout = null;
    var $abuseModal = $('#abuse-modal');
    $sudokuTable.on('ub.sudoku.state.saved', function () {
      window.UB.Notification.show('State saved');

      // show a warning if user abuses the save state button :(
      // abuse = clicking the save state button more than 5 times within 3 seconds
      // (this timer will reset every time user clicks the save button)
      stateSavedTimes = stateSavedTimes + 1;
      clearTimeout(stateSavedTimesResetTimeout);
      stateSavedTimesResetTimeout = setTimeout(function () {
        stateSavedTimes = 0;
      }, 3000);
      if (stateSavedTimes >= 5) {
        $abuseModal.find('img').ubLazySrc();
        $abuseModal.attr('disabled', 'disabled');
        $abuseModal.ubModal('show');
        setTimeout(function () {
          $abuseModal.removeAttr('disabled');
        }, 2000);
      }
    }).on('ub.sudoku.state.loaded', function () {
      window.UB.Notification.show('State loaded');
    });
  } else {
    $sudokuTimer.ubTimer();
  }
});