$(function () {
  var $sudokuTable = $('#sudoku-table');
  $sudokuTable.on('ub.sudoku.success', function (evt) {
    var $gif = $sudokuTable.parents('.table-wrapper').find('.success-gif');
    $gif.on('load', function () {
      $gif.addClass('show');
    });
    $gif.ubLazySrc();
  });
});