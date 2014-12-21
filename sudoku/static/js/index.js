$(function () {
  var $sudokuTable = $('#sudoku-table');
  $sudokuTable.on('ub.sudoku.success', function (evt) {
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