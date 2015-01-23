$(function () {
  $('.show-toast-btn').on('click.showToast', function () {
    window.KS.Toast.show('Sample Toast');
  });
});