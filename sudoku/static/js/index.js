$(function () {
  if (window.location.search.indexOf('mode=god') > -1) {
    // TODO this can be done with templating engine
    $('.cheat-fill-btn ').show();
  }

  var $sudokuTable = $('#sudoku-table');
  $sudokuTable.on('ub.sudoku.success', function (evt) {
    // We would like to show our success gif when sudoku game is over with a success!
    // The thing with loading a gif is that it might take some time if your internet is slow.
    // So, we will show a spinner and hide it after the gif loads
    var $tableWrapper = $sudokuTable.parents('.table-wrapper');
    var $gifContainer = $tableWrapper.find('.success-gif-container');
    var $spinner = $gifContainer.find('.spinner');
    $gifContainer.addClass('show');
    var $gif = $gifContainer.find('.success-gif');
    $gif.on('load', function () {
      $gif.addClass('show');
      $spinner.hide();
    });
    $gif.ubLazySrc();
  });
});