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

  $('.editBookmarkForm').hide();

  // THE DOM ANNIHILATION
  $('.edit').click(function () {
    $('.editBookmarkForm').hide(); // close other forms for editing bookmark

    $('.list-group-item').show(); // if there are open forms, their list-item will be hidden. So, show them.
    $('.buttons').show(); // show the buttons as well.

    $(this).parent().hide();
    $(this).parents(".bookmark-container").find('.list-group-item').hide(); // REALLY?
    $(this).parents(".bookmark-container").find('.editBookmarkForm').show(); // REALLY REALLY?
  });

  $('.editCancel').click(function () {
    $(this).parent().hide();
    $(this).parents(".bookmark-container").find('.buttons').show();
    $(this).parents(".bookmark-container").find('.list-group-item').show();
    $(this).parents(".bookmark-container").find('.editBookmarkForm').hide();
  });

  $.each($(".date"), function (i, val) {
    $(this).text($.format.date($(this).text(), "MMMM d, yyyy"));
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