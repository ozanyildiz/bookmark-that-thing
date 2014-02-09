$(document).ready(function() {
  $('#newBookmarkForm').hide();

  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  $('#new').click(function() {
    $('#newBookmarkForm').slideToggle();
  });

  var getLocation = function(href) {
    var l = document.createElement("a");
    l.href = href;
    return l;
  };

  $('.title').each(function (index) {
    var url = $(this).attr('href');
    var hostname = getLocation(url).hostname.replace(/^www./, '');
    $(this).after(" - " + hostname);
  });

});