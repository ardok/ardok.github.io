$(function () {
  $(document).on('ub.sudoku.success', function (evt, tableId) {
    var $gif = $('#' + tableId).parents('.table-wrapper').find('.success-gif');
    $gif.on('load', function () {
      $gif.addClass('show');
    });
    $gif.ubLazySrc();
  });
});