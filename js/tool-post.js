var cursorPosition=0;
var postID = genUID()

$(document).ready(function() {
  //track cursor postion
  $("#post-editor").on("click keyup paste change", function(){
    cursorPosition = $('#post-editor').prop("selectionStart");
  });

  //toggles between edit and preview mode
  $(".toolbar-mode").click(function(){
    toggleToolMode(this);
  });

  //clicks for toolbar item
  $(".toolbar-modal-btn").click(function(){
    if($(this).hasClass('active')){
      closeToolModals();
    }
    else{
      openToolOption(this);
      $(".toolbar-modal-btn").each(function(){
        $(this).removeClass('active');
      });
      $(this).addClass('active');
    }
  });

  $(".open-modal").click(function(){
    var type = $(this).data("type");
    closeToolModals();
    $("#post-tool-" + type).show();
    loadModal(type);
  });

  //allows single input fields to be submitted with enter key
  $(".singleInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        $(this).next().click();
      }
  });

  //closes all modals when the escape button is pressed
  $(document).on("keyup", function(e){
    if(e.keyCode == 27){
      closeToolModals();
    }
  });

  //button for sumbitting toolbar modal
  $(".post-tool-submit").click(function(){
    var type = $(this).data("type");
    addMarkdownToEditor(type);
    closeToolModals();
    $("#post-editor").focus();
  });

  //validate file from directory (max is 2MB)
  $(':file').on('change', function(event) {
    var file = this.files[0];
    if (file.size > 1024 * 1024 * 2) {
        alert('max upload size is 2MB')
        $(this).val("");
    }
    else{
      var files = event.target.files;
      upload(files);
    }
  });

  //sets an image being viewed to active
  $(document).on("click", ".img-viewer-thumb", function(){
    $(".img-viewer-thumb").each(function(){
      $(this).removeClass('active');
    });
    $(this).addClass('active');
  });

  //save draft or publish button
  $("#publish").click(function() {
    if(validate()){
      save(true);
    }
  });
  $("#draft").click(function() {
    if(validate()){
      save(false);
    }
  });
});

//alerts the user before the close the window if they haven't saved their draft
window.onbeforeunload = function(){
  if($("#post-editor").val().length > 0 && window.location.hostname !== "cdf2")
    return 'Any unsaved changes will not be saved?';
};

//generate the preview
function genPreview(){
  var html = genHtmlFromRaw(getRaw());
  $(".container").html(html);
}

function getRaw(){
  var raw = "";
  var banner = $("#post-editor-banner").val().trim();

  if(banner!== "" && imageExists(banner)){
    raw += "b#" + banner + "\n";
  }
  else {
    raw += "b#/img/placeholder_banner.png\n";
  }

  var title = $("#post-editor-title").val().trim();
  if(title != ""){
    raw += "t#" + title + "\n";
  }
  else{
    raw += "t#Some Title\n";
  }
  raw += $("#post-editor").val();
  return raw;
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
  $(".toolbar-modal-btn").each(function(){
    $(this).removeClass('active');
  });

  $(".img-viewer-thumb.active").removeClass('active');
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

//returns true if the image exists
function imageExists(url)
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}

//adds markdown to editor textarea from the fields in the toolbar modal
function addMarkdownToEditor(type){
  var fields = getFieldsForModalType(type);
  var res = "";
  if(type === "link"){
    res = " [" + fields["text"] + "](" + fields["link"] + ") ";
  }
  else if(type === "heading"){
    res = "\n#" + fields["text"] + "\n";
  }
  else if(type === "list"){
    var items = fields["text"].split("\n");
    res += "\n";
    for(var i in items)
      res += "* " + items[i] + "\n";
  }
  else if(type === "media"){
    var url = fields["url"].trim();
    if(url !== ""){
      res = "\nm#" + url + "\n";
    }
  }
  else if(type === "img"){
    if($(".img-viewer-thumb.active").length >= 0){
      var src = $(".img-viewer-thumb.active img").attr("src");
      var alt = $(".img-viewer-thumb.active img").attr("alt");
      res += "\nm#" + src + "\n";
    }
  }
  else if(type === "quote"){
    res += "\n>" + fields["text"] + "\n";
  }

  var curText = $("#post-editor").val();
  var newText = curText.substr(0,cursorPosition) + res + curText.substr(cursorPosition);
  $("#post-editor").val(newText);
}

//returns a KV array with each of the fields and also clears the fields for this type
function getFieldsForModalType(type){
  var fields = {};
  $(".add-" + type).each(function(){
    var field = $(this).data("field");
    var val = $(this).val();
    fields[field] = val;
    $(this).val("");
  });
  return fields;
}

//loads a modal which requires a database request
var modalsLoaded = [];
function loadModal(type){
  if(type==="cloud"){
    //dont request this modal if there has been no changes
    if(jQuery.inArray(type, modalsLoaded) !== -1) return;

    modalsLoaded.push(type);

    $.post( "php/cdf.php", {
      type : "user-images",
      userid : getUserCookieID()
      }).done(function( data ) {
        if(data != "") {
          var obj = JSON.parse(data);

          for(var i in obj){
            var div = {
              tag : "div",
              class : "img-viewer-thumb",
              children : []
            };
            var imgSrc = "/i/" + obj[i]["name"] + "." + obj[i]["extension"];
            //var imgSrc = data["file"] + data["extension"]; //change to this when file name is uid
            var img = {
              tag : "img",
              src : imgSrc,
              alt : obj[i]["tag"]
            };
            div["children"].push(img);

            bwe.append(".image-viewer", div);
          }
        }
      });
  }
}

//todo validate user input
function validate(){
  return true;
}

function save(forNow){
  var cookieID = getUserCookieID();
  if(cookieID == undefined){
    notification("Not Logged In", "error", 6);
    return;
  }
  var text = getRaw();
  var title = $("#post-editor-title").val();
  var desc = $("#post-editor").val().substr(0, 65).trim();
  var banner = $("#post-editor-banner").val();
  var time = Math.floor(Date.now() / 1000);
  var publish = 1;
  if(!forNow) publish = 0;
  var publishTime = time;

  $.post( "php/cdf.php", {
    type : "add-post",
    id : postID,
    text : text,
    title : title,
    desc : desc,
    cookieid : cookieID,
    timestamp : time,
    tags : $("#post-editor-tags").val().trim(),
    published : publish,
    publish_time : publishTime,
    game : $("#post-editor-game").val()
    }).done(function( data ) {
      if(data==="success"){
        if(publish == 1){
          notification("Published", "success", 6);
        }
        else {
          notification("Saved", "success", 6);
        }
      }
      else{
        console.log(data);
        notification("Server Error", "error", 6);
      }
    });
}
