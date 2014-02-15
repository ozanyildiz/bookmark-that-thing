$(document).ready(function() {
  $('#newBookmarkForm').hide();

  $('[data-toggle=offcanvas]').click(function() {
    $('.row-offcanvas').toggleClass('active');
  });

  $('#new').click(function() {
    $('#newBookmarkForm').slideToggle();
  });

  $('#newCancel').click(function() {
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
/*
  $('.edit').click(function() {
    $(this).hide();
    var bookmarkId = $(this).attr('name');
    $(this).parent().after('<form id="editBookmarkForm"></form>');
    $('#editBookmarkForm') 
        .attr('action','/bookmarks/' + bookmarkId) .attr('method', 'post')
        .append('<input name="_method" type="hidden" value="put">')
        .append('<input type="text" class="form-control" name="inputTitle">')
        .append('<input type="text" class="form-control" name="inputTags">')
        .append('<textarea class="form-control" name="inputNotes" rows="3"></textarea>')
        .append('<button type="submit" class="btn btn-primary">Edit</button>')
        .append('<button type="button" class="btn btn-default" id="editCancel">Cancel</button>')
  });

  $("body").on( "click", "#editCancel", function() {
    $('.edit').show();
    $('#editBookmarkForm').hide();
  });*/

});