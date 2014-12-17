$(function () {

  var $sudokuTable = $('table#sudoku-table');
  $sudokuTable.uberSudoku();

  $('.cheat-fill-btn').on('click', function () {
    $sudokuTable.uberSudoku('cheatFill');
  });

});