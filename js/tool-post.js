
//alerts the user before the close the window if they haven't saved their draft
window.onbeforeunload = function(){
  if(Quas.getEl("#post-editor").val().length > 0 && Toolbar.contentChanged)
    return 'Any unsaved changes will not be saved?';
};

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

//toggles between editor modes
function switchMode(mode){
  if(mode === "preview"){
    //generate preview
    Quas.getEl(".post-raw-edit").visible(false);
    let preview = Quas.getEl(".post-preview");

    let title = Quas.getEl("#post-editor-title").val();
    let banner = Toolbar.banner;

    //placeholder
    if(banner === ""){
      banner = Post.placeholderImg;
    }

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
        "data-src" : banner
      }]
    }).render(preview);
    new Comp({
      tag : "div",
      class : "post-con",
      children : data
    }).render(preview);
    lazyLoader();
    preview.visible(true);

    //toggle toolbar buttons
    Quas.each(".toolbar-modal-btn", function(el){
      el.visible(false);
    });

    Quas.each(".preview-type-btn", function(el){
      el.el.style = "display: inline-block;";
    });
  }
  else if(mode === "editor"){
    //show editor and hide the preview
    Quas.getEl(".post-raw-edit").visible(true);
    Quas.getEl(".post-preview").visible(false);

    //toggle toolbar buttons
    Quas.each(".toolbar-modal-btn", function(el){
      el.el.style = "";
    });

    Quas.each(".preview-type-btn", function(el){
      el.visible(false);
    });
  }

  //set toolbar active
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

    //track cursor position in editor
    Quas.on("click keyup paste change", "#post-editor", function(e){
      Toolbar.cursorPosition = this.selectionStart;
      Toolbar.contentChanged = true;
    });

    //close modals on escape btn
    Quas.on("keyup", document.documentElement, function(e){
      if(e.keyCode == 27){
        closeToolModals();
      }
    });

    Quas.on("click", "#open-user-images", function(e){
      closeToolModals();
      Quas.getEl("#post-tool-cloud").visible(true);
      loadModal("cloud");
    });

    Toolbar.dragEvents();

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

    let previewTypes = ["Tablet", "Mobile"]
    for(let i in previewTypes){
      super.addChild({
        tag : "div",
        class : "toolbar-btn preview-type-btn",
        txt : previewTypes[i],
        on : {
          click : function(){
            let type = previewTypes[i].toLowerCase();
            let size;
            if(type === "mobile"){
              size = {
                w : 375,
                h : 667
              }
            }
            else if(type === "tablet"){
              size = {
                w : 768,
                h : 1024
              }
            }
            if(size !== undefined){
              savePreview();
              let top = 30;
              var left = window.innerHeight-size.w/2;
              window.open("/preview", true, 'width=' + size.w + ',height=' + size.h+',top=' + top + ',left=' + left);
            }
          }
        }
      });
    }

    //btns for saving and publishing
    let savebtns = {
      "Publish" : function(){
          save("publish");
      },
      "Save Draft" : function(){
        save("save");
      },
      "Update" : function(){
        save("update");
      }
    };

    for(let i in savebtns){
      super.addChild({
        tag : "div",
        class : "toolbar-btn toolbar-btn-right",
        id : "save-" + i.toLowerCase().replace(" ", "-"),
        txt : i,
        on : {
          click : savebtns[i]
        }
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

  //manages events for drag and drop
  static dragEvents(){
    //enter drag
    Quas.on("dragenter dragstart", ".drop", function(e){
      e.preventDefault();
      new Element(this).addCls("dragenter");
    });

    //exit drag
    Quas.on("dragend dragleave", ".drop", function(e){
      e.preventDefault();
      new Element(this).delCls('dragenter');
    });

    //prevent default on other drag events
    Quas.on("drag dragover", ".drop", function(e){
      e.preventDefault();
    });

    //dropping the file
    Quas.on("drop", ".drop", function(e){
      e.preventDefault();
      new Element(this).delCls('dragenter');
      upload(e.dataTransfer.files, function(data){
        //todo progress bar
        closeToolModals();
        Quas.getEl("#post-tool-cloud").visible(true);
        loadModal("cloud");
      });
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

  //changes the buttons at the right side of the toolbar
  static alreadyPublished(){
    Quas.each(".toolbar-btn-right", function(el){
      el.visible(false);
    });
    Quas.getEl("#save-update").visible(true);
    Toolbar.published = true;
  }
}
Toolbar.cursorPosition = 0;
Toolbar.contentChanged = false;
Toolbar.published = false;
Toolbar.postID = null;
Toolbar.banner = "";
Toolbar.publishNow = true;

function genPostTool(){
  if(getCookie("session") === undefined) {
    lazyLoader();
    return;
  }

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
  let newPost = !loadPostIfEdit();
  if(newPost){
    createNewPost();
  }
  Quas.on("click", "#post-editor-banner", function(){
    Quas.getEl("#post-tool-cloud").visible(true);
    loadModal("cloud", true);
  });
  finishedLoadingPage();
}

function setBanner(){
  let el = document.querySelector(".img-viewer-thumb.active img");
  if(el == null){
    new Notification("No Image Selected", 4).render();
    return;
  }
  Toolbar.banner = el.getAttribute("data-osrc");
  new Notification("Banner Set", 4).render();
  closeToolModals();
}

//creates a post on the server and returns the post id
function createNewPost(){
  Quas.ajax({
    url : "/php/post-create.php",
    type : "POST",
    data : {
      sid : getCookie("session")
    },
    success : function(res){
      Toolbar.postID = res;
      Quas.setUrlValues({p:Toolbar.postID});
      new Notification("Created Post", 3).render();
    }
  });
}

//loads the input field if the ediotr is editing an existing post
//returns true if its in edit mode
function loadPostIfEdit(){
  let id = Quas.getUrlValues()["p"];
  if(id === undefined) return false;
  Quas.ajax({
    url : "/php/post-edit-open.php",
    type : "POST",
    data : {
      id : id,
      sid : getCookie("session"),
    },
    return : "json",
    success : function(res){
      if(res.constructor == String) return;
      let data = res[0];
      Toolbar.postID = id
      Quas.getEl("#post-editor-title").val(Quas.decodeHtmlSpecialChars(data.title));
      Quas.getEl("#post-editor").val(Quas.decodeHtmlSpecialChars(data.text));
      if(data.published > 0){
        let pt = new Date(data.publish_time);
        //already published
        if(Date.now() > pt.getTime()){
          Quas.getEl(".publish-time-btn").visible(false);
        }
        //published but scheduled for the future
        else{
          Toolbar.curTime = pt;
          setTimeString();
        }
        Toolbar.alreadyPublished();
      }
      lazyLoader();
    }
  });
  return true;
}

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

//returns true if the image exists
function imageExists(url)
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}

function addMarkdown(type){
  let fields = getFieldsForModalType(type)
  let errorMsg = "Empty field(s)"
  let res;
  switch(type){
    //i#[src](desc)
    case "img" :
      let q = document.querySelector(".img-viewer-thumb.active");
      if(q != null){
        let src = q.childNodes[0].getAttribute("data-osrc");
        let val = "/i/" + src.split("/i/")[1];
        res = "i#["+val+"](description)\n";
      }
      else{
        errorMsg = "No image selected";
      }
      break;
    //m#https://www.youtube.com/watch?v=d2daee3
    case "media" :
      var url = fields["url"].trim();
      if(url !== ""){
        let shortUrl = url.replace("http://", "").replace("https://", "").replace("www.", "");
        let domain = shortUrl.split("/")[0];
        let allowedDomains = [
          "youtube.com",
          "youtu.be",
          "clips.twitch.tv",
          "gfycat.com",
        ];
        if(domain !== undefined && allowedDomains.indexOf(domain) > -1){
          res = "m#" + url;
        }
        else{
          errorMsg = "Invalid domain: " + domain;
        }
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
    new Notification(errorMsg, 3).render().render();
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
//var modalsLoaded = [];
function loadModal(type, mode){
  if(type==="cloud"){

    //true if in banner selection mode
    if(mode){
      Quas.getEl("#editor-add-img").el.style.display = "none";
      Quas.getEl("#editor-add-banner").el.style.display="";
    }
    else{
      Quas.getEl("#editor-add-img").el.style.display = "";
      Quas.getEl("#editor-add-banner").el.style.display="none";
    }

    Quas.getEl("#cloud-spinner").visible(true);

    let sid = getCookie("session");
    if(sid === "") return;
    Quas.ajax({
      url : "php/user-images.php",
      data : {
        userid : sid,
      },
      return : "json",
      success: function(obj) {
        if(obj.constructor == String) {
          console.log(obj);
        }
        else{
          let el = Quas.getEl(".image-viewer");
          el.clearChildren();

          for(var i in obj){
            let pathEls = obj[i]["path"].split(".");
            pathEls[pathEls.length-2] += "-thumb";
            let thumbPath = pathEls.join(".");
            el.addChild({
              tag : "div",
              class : "img-viewer-thumb",
              on : {
                //set selected image as active
                click : function(){
                  let el = new Element(this);
                  let q = document.querySelector(".img-viewer-thumb.active");
                  if(q !== null){
                    let qEl = new Element(q);

                    if(qEl.el != el.el){
                      qEl.active(false);
                    }
                  }
                  el.active();
                }
              },
              children : [{
                tag : "img",
                "data-src" : thumbPath,
                "data-osrc" : obj[i]["path"]
              }]
            });
          }
          lazyLoader();
          Quas.getEl("#cloud-spinner").visible(false);
        }
      }
    });
  }
}

//todo validate user input before submitting
function validate(){
  return true;
}

function genPath(){
  let title = Quas.getEl("#post-editor-title").val().toLowerCase();
  title = title.split(" ").join("-");
  if(title.length > 50){
    title = title.substr(0, 50);
  }
  console.log("title:" + title);
  return title;
}

//save/publish/update a post
function save(btn){
  var cookieID = getCookie("session");
  if(cookieID == undefined){
    new Notification("Not Logged In", 6, "error").render();
    return;
  }
  var text = Quas.getEl("#post-editor").val();
  var title = Quas.getEl("#post-editor-title").val();
  var desc = Quas.getEl("#post-editor").val().substr(0, 65).trim();
  var time = Math.floor(Date.now() / 1000);
  if(Toolbar.publishNow == false){
    time = Math.floor(Toolbar.curTime.getTime() / 1000);
  }

  var publish = 1;
  if(btn === "save"){
    publish = 0;
  }
  else{
    Toolbar.alreadyPublished();
  }

  //schedule post -> now/predate
  if(btn === "update" && (Toolbar.publishNow || Toolbar.curTime.getTime() < Date.now())){
    Quas.getEl(".publish-time-btn").visible(false);
  }

  let banner = Toolbar.banner;
  if(banner === ""){
    banner = Post.placeholderImg;
  }

  let pageData = {
    id : Toolbar.postID,
    path : genPath(),
    text : text,
    title : title,
    cookieid : cookieID,
    tags : Quas.getEl("#post-editor-tags").val().trim(),
    published : publish,
    publish_time : time,
    game : Quas.getEl("#post-editor-game").val(),
    banner : banner,
  };

  Quas.ajax({
    url : "php/post-update.php",
    type : "POST",
    data : pageData,
    success : function(data){
      console.log(data);
      if(data.length > 0){
        new Notification(data, 3, "success").render();
      }
      else{
        console.log(data);
        new Notification("Server Error", 6, "error").render();
      }
    }
  });
}

//uploads files, if success it calls the callback function
function upload(files, callback){
  let allowedFormats= ["jpg", "jpeg", "png"];
  let maxSize = (1024 * 1024) * 2; //2MB
  for(let i=0; i<files.length; i++){
    let format = files[i]["name"].split(".").pop();
    if(allowedFormats.indexOf(format) > -1 ){
      let name = files[i]["name"];
      let size = files[i]["size"];

      //img too big
      if(size >= maxSize){
        new Notification("Image must be smaller than 2MB", 8, "error").render();
      }
      else{
        new Notification("Uploading...", 15).render();
        var formImage = new FormData();
        formImage.append('image', files[i]);
        var session = getCookie("session");
        if(session !== ""){
          formImage.append('sid', session);
          Quas.ajax({
            url: "/php/upload.php",
            type: "POST",
            data: formImage,
            //contentType:false,
            //cache: false,
            //processData: false,
            success: function(data){
              clearNotifications("default");

              if(data.substr(0,3) === "/i/"){
                new Notification("Uploaded: " + name, 4, "success").render();
                callback(data);
              }
              else{
                new Notification("Upload Error", 8, "error").render();
                console.log("Upload Error:"+data);
              }
          }});
        }
      }
    }
    //invalid format
    else{
      new Notification("File format must be png or jpeg", 8, "error").render();
    }
  }
}

//converts epoch to sql date string (yyyy-mm-dd hh:mm:ss)
function epochTimeToSQLDateString(time){
  let now = new Date(time);
  let month = checkDateLen(now.getMonth()+1);
  let day = checkDateLen(now.getDate());
  let hrs = checkDateLen(now.getHours());
  let mins = checkDateLen( now.getMinutes());
  let secs = checkDateLen(now.getSeconds());

  return now.getFullYear()+"-" + month +"-"+ day +" "
  + hrs + ":" + mins + ":" + secs;
}

//helper for converting date string
function checkDateLen(val){
  if(val < 10)
    val = "0" + val;
  return val;
}

//load post from local storage
function genDevicePreview(){
  let data = JSON.parse(localStorage.preview);
  if(data.title.trim() === "")
    data.title = "Untitled";
  new Post(data).render();
  lazyLoader();
}

//save preview in local storage
function savePreview(){
  localStorage.preview = JSON.stringify({
    title : Quas.getEl("#post-editor-title").val(),
    text : Quas.getEl("#post-editor").val(),
    username : getCookie("user_name"),
    avatar : getCookie("user_avatar"),
    publish_time : epochTimeToSQLDateString(Date.now())
  });
}

//loads the date picker
function loadTimePicker(){
  Quas.getEl("#publish-time-picker").visible(true);
  let picker = Quas.getEl(".date-picker");
  Toolbar.curTime = new Date(Date.now());
  genDateTable();


  //clicking table data
  let td = document.querySelectorAll("#date-table td");
  for(let i=0; i<td.length; i++){
    td[i].addEventListener('click', function(e) {
      if(this.className === "allowed"){
        let curActive = document.querySelector("#date-table td.active");
        if(curActive){
          curActive.className = "allowed";
        }
        this.className += " active";
        Toolbar.curTime.setDate(Number(this.textContent));
      }
    });
  }

  //month buton event listener
  let monthBtns = document.querySelectorAll(".picker-month");
  for(let i=0; i<monthBtns.length; i++){
    monthBtns[i].addEventListener("click", function(){
      monthChange(monthBtns[i]);
    });
  }
}

//change month in the date picker
function monthChange(btn){
  let newMonth = Toolbar.curTime.getMonth() + Number(btn.getAttribute("data-dir"));
  let newYear = Toolbar.curTime.getFullYear();
  if(newMonth<0){
    newMonth = 11;
    newYear--;
  }
  else if(newMonth > 11){
    newMonth = 0;
    newYear++;
  }
  Toolbar.curTime.setMonth(newMonth);
  Toolbar.curTime.setFullYear(newYear);
  genDateTable();
}

//sets the current time in the toolbar
function setTime(){
  let hr = Quas.getEl("#time-picker-hr").val();
  let min = Quas.getEl("#time-picker-min").val();

  //validate time
  if(   isNaN(hr) || isNaN(min) ||
        min < 0 || min > 59 || hr < 0 || hr > 23 ||
        hr=== "" || min === ""){
    new Notification("Invalid Time", 4).render();
  }
  else{
    Toolbar.curTime.setHours(Number(hr), Number(min), 0);
    setTimeString();
    Toolbar.publishNow = false;
    closeToolModals();
  }
}

function clearTime(){
  Toolbar.publishNow = true;
  Quas.getEl(".post-publish-time-text").text("Now");
  closeToolModals();
}

//sets the current time string in the publish time button
function setTimeString(){
  let strEls = Toolbar.curTime.toUTCString().split(":");
  strEls.pop();
  Quas.getEl(".post-publish-time-text").text(strEls.join(":"));
}

//generate the date when changing month in the date picker
function genDateTable(){
  let day = Toolbar.curTime.getDate();
  let month = Toolbar.curTime.getMonth();
  let year = Toolbar.curTime.getFullYear();
  let monthData = {
    0 : ["January", 31],
    1 : ["February", 28],
    2 : ["March", 31],
    3 : ["April", 30],
    4 : ["May", 31],
    5 : ["June", 30],
    6 : ["July", 31],
    7 : ["August", 31],
    8 : ["September", 30],
    9 : ["October", 31],
    10 : ["November", 30],
    11 : ["December", 31],
  };
  //0=mon, 6=sun
  let dayofWeekNum = dayofweek(day,month+1,year).toFixed(0)-2;
  let count = 1;
  Quas.getEl("#date-picker-title").text(monthData[month][0] + " " + year);
  for(let a=1; a<=6; a++){
    let week = document.querySelectorAll("#week-"+a+" td");
    for(let i=0; i<week.length; i++){
      if(((a==1 && dayofWeekNum <= i) || a>1) && count <= monthData[month][1]){
        week[i].textContent = count;
        week[i].className = "allowed";
        count++;
      }
      else{
        week[i].className = "";
        week[i].textContent = "";
      }
    }
  }
}

//returns 0-6 value for the day of the week
//m(1-12)
function dayofweek(d,m,y){
    let t = [ 0, 3, 2, 5, 0, 3, 5, 1, 4, 6, 2, 4 ];
    y -= m < 3;
    return ( y + y/4 - y/100 + y/400 + t[m-1] + d) % 7;
}
