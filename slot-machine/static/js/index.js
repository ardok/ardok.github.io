$(function () {
  var $slotMachine = $('[data-slot-machine]');
  $slotMachine.slotMachine();

  var $resultModal = $('#result-modal');

  $slotMachine.on('slotMachine.win', function (evt, wonIndex) {
    var data = $slotMachine.data('slotMachine');
    var prize = {};
    if (data) {
      prize = data.options.PRIZES[wonIndex];
    } else {
      prize = {
        text: 'unknown'
      };
    }

    $resultModal.find('.modal-title').text('Congratulations!');
    $resultModal.find('.modal-body .text').text('You have won ' + prize.text + '!');
    $resultModal.find('.modal-body .success-gif').show();
    $resultModal.ksModal('open');
  }).on('slotMachine.lose', function () {
    $resultModal.find('.modal-title').text('Sorry!');
    $resultModal.find('.modal-body .text').text('You did not win anything :(');
    $resultModal.find('.modal-body .success-gif').hide();
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