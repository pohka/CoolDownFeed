$(document).ready(function() {
  $('.editor').on('change keyup paste', function() {
    genPreview();
  });

  $(".toolbar-mode").click(function(){
    toggleToolMode(this);
  });

  //clicks for toolbar item
  $(".toolbar-btn-sm").click(function(){
    if($(this).hasClass('active')){
      closeToolModals();
    }
    else{
      openToolOption(this);
      $(".toolbar-btn-sm").each(function(){
        $(this).removeClass('active');
      })
      $(this).addClass('active');
    }
  });

  //allows single input fields to be submitted with enter key
  $(".singleInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        $(this).next().focus();
        if($(this).val() == "Add"){
          $(this).click();
        }
      }
  });

  $(document).on("keyup", function(e){
    if(e.keyCode == 27){
      closeToolModals();
    }
  });
});

window.onbeforeunload = function(){
  if($("#post-editor").val().length > 0 && window.location.hostname !== "cdf2")
    return 'Any unsaved changes will not be saved?';
};

function genPreview(){
  var raw = "";
  var banner = $("#post-editor-banner").val().trim();
  if(banner!== ""){
    raw += "!b>" + banner;
  }
  else {
    raw += "!b>/temp/esl_ham.png\n";
  }

  var title = $("#post-editor-title").val().trim();
  if(title != ""){
    raw += "!1>" + title + "\n";
  }
  else{
    raw += "!1>Some Title\n";
  }
  raw += $("#post-editor").val();

  var html = genHtmlFromRaw(raw);
  $(".container").html(html);
}

//toggles the mod of the tools
function toggleToolMode(selector){
  $(".toolbar-mode").each(function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
    }
  });
  $(selector).addClass('active');

  var id = $(selector).attr("id");

  if(id === "mode-editor"){
    $(".post-preview").hide();
    $(".post-raw-edit").show();
  }
  else if(id === "mode-preview"){
    $(".post-preview").show();
    $(".post-raw-edit").hide();
    genPreview();
  }
}

//closes all the modals
function closeToolModals(){
  $(".post-tool-modal").each(function(){
    $(this).hide();
  });
  $(".toolbar-btn-sm").each(function(){
    $(this).removeClass('active');
  });
}

//opens the a tool option
function openToolOption(thisSel){
  var type = $(thisSel).attr("id").replace("post-add-", "");
  var selector = "#post-tool-" + type;
  if($(selector).length > 0){
    closeToolModals();
    $(selector).show();

    var focus = selector + "-focus";
    $(focus).focus();
  }
}
