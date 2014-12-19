$(function () {
  $(document).on('ub.sudoku.success', function (evt, tableId) {
    $('#' + tableId).parents('.table-wrapper').find('.success-gif').ubLazySrc();
  });
});