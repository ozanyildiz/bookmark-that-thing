$(document).ready(function() {
  $('#newBookmarkForm').hide();

  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  $('#new').click(function() {
    $('#newBookmarkForm').slideToggle();
  });
});