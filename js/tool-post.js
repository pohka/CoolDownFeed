var cursorPosition=0;
var postID = genUID()

/*
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
      disableScroll();
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

  //drag and drop
  $(document).on("dragenter dragstart", ".drop", function (e) {
    e.preventDefault();
    $(this).addClass('dragenter');
  });

  $(document).on("dragend dragleave", ".drop", function (e) {
    e.preventDefault();
    $(this).removeClass('dragenter');
  });

  $(document).on("drag dragover", ".drop", function(e){
    e.preventDefault();
  });

  $(document).on("drop", ".drop", function (e) {
    e.preventDefault();
    $(this).removeClass('dragenter');
    upload(e.originalEvent.dataTransfer.files, function(data){
      //todo progress bar
      closeToolModals();
      $("#post-tool-cloud").show();
      loadModal("cloud");

    });
  });
});
*/

//alerts the user before the close the window if they haven't saved their draft
// window.onbeforeunload = function(){
//   if($("#post-editor").val().length > 0 && window.location.hostname !== "cdf2")
//     return 'Any unsaved changes will not be saved?';
// };

function toggleToolbarModal(btn){
  let id = "post-add-"+btn;
  //if opening a new modal, then clear the existing modals
  if(Quas.getEl("#"+id).hasCls("active") == false){
    Quas.each(".post-tool-modal", function(el){
      el.visible(false);
    });
  }
  //toggle visibility
  Quas.getEl("#post-tool-"+btn).toggleVisible();

  //set active btn
  Quas.each(".toolbar-btn-sm",function(el){
    if(el.attr("id") !== id)
      el.active(false);
    else
      el.active();
  });
}

class Toolbar extends Comp{
  constructor(){
    super({
      tag :"div",
      class : "post-toolbar-inner"
    });

    //btns for the mode of the post tool
    let modes = ["Editor", "Preview"];
    for(let i in modes){
      let active = "";
      if(i == 0){
        active = " active";
      }
      super.addChild({
        tag : "div",
        class : "toolbar-mode toolbar-btn" + active,
        id : "mode-" + modes[i].toLowerCase().replace(" ", "-"),
        txt : modes[i]
      });
    }


    //small buttons for the markdow
    let btns = [
      "file",
      "media",
      "link",
      "heading",
      "code",
      "list",
      "quote",
      "more",
    ];

    for(let i in btns){
      let id = "post-add-" + btns[i];
      super.addChild({
        tag : "div",
        class : "toolbar-btn toolbar-btn-sm toolbar-modal-btn",
        id : "post-add-" + btns[i],
        txt : "a",
        on : {
          click : function(){
            Toolbar.toggleToolbarModal(btns[i]);
          }
        }
      });
    }

    //btns for saving and publishing
    let savebtns = [
      "Publish",
      "Save Draft",
    ];

    for(let i in savebtns){
      super.addChild({
        tag : "div",
        class : "toolbar-btn toolbar-btn-right",
        id : savebtns[i].toLowerCase().replace(" ", "-"),
        txt : savebtns[i]
      });
    }

    //help btn
    super.addChild({
      tag : "div",
      class : "toolbar-btn toolbar-btn-right toolbar-modal-btn",
      id : "post-add-help",
      txt : "Help",
    });
  }

  //toggles the modals with the small btns
  static toggleToolbarModal(btn){
    let id = "post-add-"+btn;
    //if opening a new modal, then clear the existing modals
    if(Quas.getEl("#"+id).hasCls("active") == false){
      Quas.each(".post-tool-modal", function(el){
        el.visible(false);
      });
    }
    //toggle visibility
    Quas.getEl("#post-tool-"+btn).toggleVisible();

    //set active btn
    Quas.each(".toolbar-btn-sm",function(el){
      if(el.attr("id") !== id)
        el.active(false);
      else
        el.active();
    });
  }
}

function genPostTool(){
  Quas.each(".post-tool-modal", function(el){
    el.visible(false);
  });

  //catagories or game options for this post
  let gameEl = Quas.getEl("#post-editor-game");
  let games = ["Dota 2", "IRL"];
  for(let i in games){
    gameEl.addChild({
      tag : "option",
      value : games[i].toLowerCase().replace(" ", "-"),
      txt : games[i]
    });
  }

  new Toolbar().render(".post-toolbar");
}

//generate the preview
function genPreview(){
  //var html = genHtmlFromRaw(getRaw());
  Quas.getEl(".post-preview").clearChildren();
  //bwe.append(".post-preview", html);
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
    if($(selector).attr("id") === "mode-preview"){
      genPreview();
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
  enableScroll();
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
    disableScroll();
    modalsLoaded.push(type);
    $("#cloud-spinner").show();
    let sid = getCookie("session");
    if(sid === "") return;
    $.post( "php/cdf.php", {
      type : "user-images",
      userid : sid
      }).done(function( data ) {
        if(data != "") {
          var obj = JSON.parse(data);
          $(".image-viewer").html("");

          for(var i in obj){
            var div = {
              tag : "div",
              class : "img-viewer-thumb",
              children : []
            };

            var img = {
              tag : "img",
              src : obj[i]["path"],
              alt : obj[i]["tag"]
            };
            div["children"].push(img);

            $(".image-viewer").append(bwe.build(div));
            $("#cloud-spinner").hide();
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
  var cookieID = getCookie("session");
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

//uploads files, if success it calls the callback function
function upload(files, callback){
  let allowedFormats= ["jpg", "jpeg", "png"];
  let maxSize = (1024 * 1024) * 2; //2MB
  for(let i=0; i<files.length; i++){
    let format = files[i]["name"].split(".").pop();
    if($.inArray(format, allowedFormats) > -1 ){
      let name = files[i]["name"];
      let size = files[i]["size"];

      //img too big
      if(size >= maxSize){
        notification("Image must be smaller than 2MB", "error", 8);
      }
      else{
        notification("Uploading...", "default", 10);
        var formImage = new FormData();
        formImage.append('image', files[i]);
        var session = getCookie("session");
        if(session !== ""){
          formImage.append('sid', session);
          $.ajax({
            url: "/php/upload.php",
            type: "POST",
            data: formImage,
            contentType:false,
            cache: false,
            processData: false,
            success: function(data){
              clearNotifications("default");

              if(data.substr(0,3) === "/i/"){
                notification("Uploaded: " + name, "success", 4);
                callback(data);
              }
              else{
                notification("Upload Error", "error", 8);
                console.log("Upload Error:"+data);
              }
          }});
        }
      }
    }
    //invalid format
    else{
      notification("File format must be png or jpeg", "error", 8);
    }
  }
}
