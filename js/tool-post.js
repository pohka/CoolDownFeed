$(document).ready(function() {
  $('#editor').on('change keyup paste', function() {
      var raw = $(this).val();
      var html = genHtmlFromRaw(raw);
      $(".container").html(html);
  });
});
