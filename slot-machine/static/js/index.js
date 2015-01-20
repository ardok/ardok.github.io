$(function () {
  var $slotMachine = $('[data-slot-machine]');
  $slotMachine.slotMachine();

  var $resultModal = $('#result-modal');

  $slotMachine.on('slotMachine.win', function (evt, wonIndex) {
    var wonGoods = '';
    if (wonIndex === 0) {
      wonGoods = 'a cup of coffee';
    } else if (wonIndex === 1) {
      wonGoods = 'a cup of tea';
    } else if (wonIndex === 2) {
      wonGoods = 'a cup of espresso';
    }

    $resultModal.find('.modal-title').text('Congratulations!');
    $resultModal.find('.modal-body').text('You have won ' + wonGoods + '!');
    $resultModal.ksModal('open');
  }).on('slotMachine.lose', function () {
    $resultModal.find('.modal-title').text('Sorry!');
    $resultModal.find('.modal-body').text('You did not win anything :(');
    $resultModal.ksModal('open');
  });


  if (window.location.search.indexOf('mode=god') > -1) {
    // TODO this can be done with templating engine
    var $cheatBtn = $('.cheat-btn');
    $cheatBtn.css('display', 'block');
    $slotMachine.on('slotMachine.cheat.process', function () {
      $cheatBtn.attr('disabled', 'disabled');
    }).on('slotMachine.cheat.done', function () {
      $cheatBtn.removeAttr('disabled');
    });
  }

});