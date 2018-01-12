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

function switchMode(mode){
  if(mode === "preview"){
    Quas.getEl(".post-raw-edit").visible(false);
    let preview = Quas.getEl(".post-preview");

    let title = Quas.getEl("#post-editor-title").val();

    let data = parseMarkdown(Quas.getEl("#post-editor").val());
    data.unshift({
      tag : "h1",
      txt : title
    });
    preview.clearChildren();
    new Comp({
      tag : "div",
      class : "banner",
      children : [{
        tag : "img",
        src : "/temp/esl_ham.png"
      }]
    }).render(preview);
    new Comp({
      tag : "div",
      class : "post-con",
      children : data
    }).render(preview);
    preview.visible(true);
  }
  else if(mode === "editor"){
    Quas.getEl(".post-raw-edit").visible(true);
    Quas.getEl(".post-preview").visible(false);
  }

  Quas.each(".toolbar-mode", function(el){
    if(el.attr("id") === "mode-"+mode){
      el.active(true);
    }
    else{
      el.active(false);
    }
  });
}


class Toolbar extends Comp{
  constructor(){
    super({
      tag :"div",
      class : "post-toolbar-inner"
    });

    //listen to the cursor position in the editor
    let editor = Quas.getEl("#post-editor").el;
    let events = ["click", "keyup", "paste", "change"];
    for(let i in events){
      editor.addEventListener(events[i], function(e){
        Toolbar.cursorPosition = Quas.getEl('#post-editor').el.selectionStart;
      });
    }

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
        txt : modes[i],
        on : {
          click : function(){
            switchMode(modes[i].toLowerCase());
          }
        }
      });
    }

    //add new icons
    let toolIcons = {
      image : {
        box : "0 0 512 512",
        width : "1.4em",
        d : "M464 64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48zm-6 336H54a6 6 0 0 1-6-6V118a6 6 0 0 1 6-6h404a6 6 0 0 1 6 6v276a6 6 0 0 1-6 6zM128 152c-22.091 0-40 17.909-40 40s17.909 40 40 40 40-17.909 40-40-17.909-40-40-40zM96 352h320v-80l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L192 304l-39.515-39.515c-4.686-4.686-12.284-4.686-16.971 0L96 304v48z"
      },
      video : {
        box : "0 0 576 512",
        width : "1.2em",
        d : "M528 64h-12.118a48 48 0 0 0-33.941 14.059L384 176v-64c0-26.51-21.49-48-48-48H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h288c26.51 0 48-21.49 48-48v-64l97.941 97.941A48 48 0 0 0 515.882 448H528c26.51 0 48-21.49 48-48V112c0-26.51-21.49-48-48-48z"
      },
      link : {
        box : "0 0 512 512",
        width : "1em",
        d : "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037"+
            " 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0"+
            " 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
      },
      heading : {
        box : "0 0 512 512",
        width : "1em",
        d : "M496 80V48c0-8.837-7.163-16-16-16H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.621v128H154.379V96H192c8.837 0 16-7.163 16-16V48c0-8.837-7.163-16-16-16H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h37.275v320H32c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.621V288H357.62v128H320c-8.837 0-16 7.163-16 16v32c0 8.837 7.163 16 16 16h160c8.837 0 16-7.163 16-16v-32c0-8.837-7.163-16-16-16h-37.275V96H480c8.837 0 16-7.163 16-16z"
      },
      code : {
        box : "0 0 640 512",
        width : "1.2em",
        d : "M278.9 511.5l-61-17.7c-6.4-1.8-10-8.5-8.2-14.9L346.2 8.7c1.8-6.4 8.5-10 14.9-8.2l61 17.7c6.4 1.8 10 8.5 8.2 14.9L293.8 503.3c-1.9 6.4-8.5 10.1-14.9 8.2zm-114-112.2l43.5-46.4c4.6-4.9 4.3-12.7-.8-17.2L117 256l90.6-79.7c5.1-4.5 5.5-12.3.8-17.2l-43.5-46.4c-4.5-4.8-12.1-5.1-17-.5L3.8 247.2c-5.1 4.7-5.1 12.8 0 17.5l144.1 135.1c4.9 4.6 12.5 4.4 17-.5zm327.2.6l144.1-135.1c5.1-4.7 5.1-12.8 0-17.5L492.1 112.1c-4.8-4.5-12.4-4.3-17 .5L431.6 159c-4.6 4.9-4.3 12.7.8 17.2L523 256l-90.6 79.7c-5.1 4.5-5.5 12.3-.8 17.2l43.5 46.4c4.5 4.9 12.1 5.1 17 .6z"
      },
      "list-ul" : {
        box : "0 0 512 512",
        width : "1.1em",
        d : "M96 96c0 26.51-21.49 48-48 48S0 122.51 0 96s21.49-48 48-48 48 21.49 48 48zM48 208c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm0 160c-26.51 0-48 21.49-48 48s21.49 48 48 48 48-21.49 48-48-21.49-48-48-48zm96-236h352c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h352c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H144c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"
      },
      "quote-right" : {
        box : "0 0 512 512",
        width : "1em",
        d : "M512 80v128c0 137.018-63.772 236.324-193.827 271.172-15.225 4.08-30.173-7.437-30.173-23.199v-33.895c0-10.057 6.228-19.133 15.687-22.55C369.684 375.688 408 330.054 408 256h-72c-26.51 0-48-21.49-48-48V80c0-26.51 21.49-48 48-48h128c26.51 0 48 21.49 48 48zM176 32H48C21.49 32 0 53.49 0 80v128c0 26.51 21.49 48 48 48h72c0 74.054-38.316 119.688-104.313 143.528C6.228 402.945 0 412.021 0 422.078v33.895c0 15.762 14.948 27.279 30.173 23.199C160.228 444.324 224 345.018 224 208V80c0-26.51-21.49-48-48-48z"
      },
      "chevron-down" : {
        box : "0 0 448 512",
        width : "1em",
        d : "M207.029 381.476L12.686 187.132c-9.373-9.373-9.373-24.569 0-33.941l22.667-22.667c9.357-9.357 24.522-9.375 33.901-.04L224 284.505l154.745-154.021c9.379-9.335 24.544-9.317 33.901.04l22.667 22.667c9.373 9.373 9.373 24.569 0 33.941L240.971 381.476c-9.373 9.372-24.569 9.372-33.942 0z"
      }
    }

    for(let i in toolIcons){
      icons[i] = toolIcons[i];
    }

    //small buttons for the markdown
    let btns = {
      file : "image",
      media : "video",
      link : "link",
      heading : "heading",
      code : "code",
      list : "list-ul",
      quote : "quote-right",
      more : "chevron-down",
    };

    for(let i in btns){
      let id = "post-add-" + i;
      super.addChild({
        tag : "div",
        class : "toolbar-btn toolbar-btn-sm toolbar-modal-btn ico ico-" + btns[i],
        id : "post-add-" + i,
        on : {
          click : function(){
            Toolbar.toggleToolbarModal(i);
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
      class : "toolbar-btn toolbar-btn-sm toolbar-modal-btn",
      id : "post-add-help",
      txt : "Help",
      on : {
        click : function(){
          Toolbar.toggleToolbarModal("help");
        }
      }
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
    //toggle visibility and scrollable
    let modal = Quas.getEl("#post-tool-"+btn);
    modal.toggleVisible();
    Quas.scrollable(!modal.visible());

    //set focus for first input field
    if(modal.visible()){
      let sel = modal.el.querySelector("input[type=text]");
      if(sel === null){
        sel = modal.el.getElementsByTagName("textarea")[0];
      }
      if(sel !== undefined)
        sel.focus();
    }

    //set active btn
    Quas.each(".toolbar-btn-sm",function(el){
      if(el.attr("id") !== id)
        el.active(false);
      else
        el.active();
    });
  }
}
Toolbar.cursorPosition = 0;

function genPostTool(){
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
  loadAllIcons();
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

// //toggles the mod of the tools
// function toggleToolMode(selector){
//   $(".toolbar-mode").each(function(){
//     if($(this).hasClass('active')){
//       $(this).removeClass('active');
//     }
//     if($(selector).attr("id") === "mode-preview"){
//       genPreview();
//     }
//   });
//   $(selector).addClass('active');
//
//   var id = $(selector).attr("id");
//
//   if(id === "mode-editor"){
//     $(".post-preview").hide();
//     $(".post-raw-edit").show();
//   }
//   else if(id === "mode-preview"){
//     $(".post-preview").show();
//     $(".post-raw-edit").hide();
//     genPreview();
//   }
// }

//closes all the modals
function closeToolModals(){
  Quas.each(".post-tool-modal", function(el){
    el.visible(false);
  });

  Quas.each(".toolbar-modal-btn", function(el){
    el.active(false);
  });

  Quas.scrollable(true);
}

// //opens the a tool option
// function openToolOption(thisSel){
//   var type = $(thisSel).attr("id").replace("post-add-", "");
//   var selector = "#post-tool-" + type;
//   if($(selector).length > 0){
//     closeToolModals();
//     $(selector).show();
//
//     var focus = selector + "-focus";
//     $(focus).focus();
//   }
// }

//returns true if the image exists
function imageExists(url)
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}

function addMarkdown(type){
  let fields = getFieldsForModalType(type)
  let res;
  switch(type){
    //i#[src](desc)
    case "img" :

      break;
    //m#https://www.youtube.com/watch?v=d2daee3
    case "media" :
      var url = fields["url"].trim();
      if(url !== ""){
        res = "m#" + url;
      }
      break;
    //[text](link)
    case "link" :
      res = " [" + fields["text"] + "](" + fields["link"] + ") "; break;
    //#heading
    case "heading" :
      res = "#" + fields["text"] + "\n"; break;
    //```LANG\n my code```
    case "code" : break;
    //* item 1
    case "list" :
      res = "* " + fields["text"].split("\n").join("\n* ") + "\n";
      break;
    //> quote
    case "quote" :
      res = "> " + fields["text"] + "\n";
    break;
  }

  if(res !== undefined){
    let editor = Quas.getEl("#post-editor");
    let curText = editor.val();
    var newText =
      curText.substr(0,Toolbar.cursorPosition) +
      res + curText.substr(Toolbar.cursorPosition);
    editor.val(newText);
    editor.el.focus();
    closeToolModals();
  }
  else{
    new Notification("Empty fields", 3).render();
  }
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
  Quas.each(".add-" + type, function(el){
    var field = el.data("field");
    var val = el.val();
    fields[field] = val;
    el.val("");
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
