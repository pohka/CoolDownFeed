$(document).ready(function() {
  loadPage();

  $(".nav-item").click(function(){
      switch($(this).attr("id"))
      {
        case "filter-discover":   window.open("/post.html", "_self"); break;
        case "filter-popular":    window.open("/index.html", "_self"); break;
        case "filter-home" :      window.open("/index.html", "_self"); break;
      }
  });

  $(".footer-filter").click(function(){
      switch($(this).attr("id"))
      {
        case "footer-about" :     window.open("/index.html", "_self"); break;
        case "footer-discover":   window.open("/index.html", "_self"); break;
      }
  });

  $(document).on("mouseover", ".card", function(){
    var id = "#tags-" + $(this).data("url");
    $(id).slideDown('fast')
  });

  $(document).on("mouseleave", ".card", function(){
    var id = "#tags-" + $(this).data("url");
    $(id).hide();
  });
});

function loadPage(){
  var pageType = "";
  var path = window.location.pathname;
  if(path === "/" || path === "/index" || path === "/index.html"){
    pageType = "cards-home";
  }

  $.post( "php/cdf.php", {
    type : pageType
    }).done(function( data ) {
      if(data != "") {
        var obj = JSON.parse(data);
        for(var i in obj){

          var card = genCard({
            id : obj[i]["id"],
            img : "/temp/esl_ham.png",
            title : obj[i]["title"],
            desc : obj[i]["description"],
            author : obj[i]["author"],
            time : obj[i]["publish_time"],
            tags : obj[i]["tags"],
          });

          //$(".card-con").append(card.get());
        }
      }
    });
}

//generates a card from data with bwe
//id, img, title, desc, author, time, tags
function genCard(data){
  var json = {
    tag : "div",
    class : "card",
    data : [{ url : "1" }],
    children : [
      {
        tag : "div",
        class : "card-thumb",
        children : [
          {
            tag : "img",
            src : data["img"]
          }
        ]
      },
      {
        tag : "div",
        class : "card-info",
        children : [
          {
            tag : "div",
            class : "card-title-and-desc",
            children : [
              {
                tag : "div",
                class : "card-title",
                con : data["title"]
              },
              {
                tag : "div",
                class : "card-desc",
                con : data["desc"]
              }
            ]
          },
          {
            tag : "div",
            class : "card-author",
            con : data["author"]
          },
          {
            tag : "div",
            class : "card-time",
            con : timeSinceString(data["time"])
          }
        ]
      }
    ]
  };
  bwe.append(".card-con", json);
}

//generates string for time since posted e.g. 2 days ago
function timeSinceString(time){
  var t = time.split(/[- :]/);
  var date = new Date(Date.UTC(t[0], t[1]-1, t[2], t[3], t[4], t[5]));
  var now = new Date();
  var timeDiff = Math.abs(now.getTime() - date.getTime());

  var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

  var str;
  if(diffDays == 0){
    var diffMins = Math.ceil(timeDiff / (1000 * 60));
    var diffHours = Math.ceil(timeDiff / (1000 * 3600));

    if(diffHours == 0){
      str = diffMins + " mins ago";
    }
    else{
      str = diffHours + " hours ago";
    }
  }
  else if(diffDays == 1){
    str = "1 day ago";
  }
  else {
    var diffMonths = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30));
    var diffYears = Math.ceil(timeDiff / (1000 * 3600 * 24 * 30 * 365));

    if(diffMonths==1){
      str = "1 month ago";
    }
    else if(diffMonths < 12){

    }
    else if(diffYears==1){
      str = "1 year ago";
    }
    else if(diffYears>1){
      str = diffYears + " years ago";
    }
  }

  return str;
}


function login(){
  console.log("loggin");

  $.post( "php/login.php", {
    username: $("#login-user").val(),
    password: $("#login-pass").val()
    }).done(function( data ) {
      console.log( data );
      if(data=="success"){
        //create session
      }
      else{
        //give error msg
      }
    }).fail(function() {
      console.log( "post failed" );
  });
}

//a html element
class Obj{
  constructor(kv) {
    this.kv = kv
    this.children = [];
  }

  //adds a child Obj or an array of children Objs
  add(obj){
    if(obj instanceof Array){
      for(var i in obj){
        this.children.push(obj[i]);
      }
    }
    else if(obj instanceof Obj){
      this.children.push(obj);
    }
    else{
      console.log("addChild() not an instance Obj");
    }
  }

  //adds data to this element
  addData(key, val){
    if(this.data == undefined)
      this.data = {}

    this.data[key] = val;
  }

  //adds a KV to this Obj
  addKV(key, val){
    if(this.kv[key] == undefined){
      this.kv[key] = "";
    }
    if(this.kv[key] === "class"){
      this.kv[key] += ", ";
    }
    this.kv[key] += val;
  }

  //sets a KV
  setKV(key, val){
    this.kv[key] += val;
  }

  //returns this Obj as a html string
  get(){
    if(this.kv["tag"] == undefined){
      console.log("tag undefined");
      return;
    }
    var res = "<" + this.kv["tag"];

    for(var i in Obj.identifiers){
      var key = Obj.identifiers[i];
      if(this.kv[key] != undefined)
        res += " " + key + "='" + this.kv[key] + "'";
    }

    for(var i in Obj.idendifiersNoVal){
      var key = Obj.idendifiersNoVal[i];
      if(this.kv[key] != undefined)
        res += " " + key;
    }

    if(this.data != undefined){
      for(var key in this.data){
        res += " data-" + key + "= '" + this.data[key] + "'";
      }
    }

    var requiresClosingTag = $.inArray(this.kv["tag"], Obj.noClosingTag);

    if(requiresClosingTag != -1){
      res += "/>";
    }
    else{
      res += ">";
    }

    if(this.kv["content"] != undefined){
      res += this.kv["content"];
    }
    for(var i in this.children){
      res+=this.children[i].get();
    }

    if(requiresClosingTag == -1){
      res += "</"+this.kv["tag"]+">\n";
    }
    return res;
  }
}

Obj.identifiers = ["id", "class", "src", "href", "frameborder", "type", "alt"];
Obj.idendifiersNoVal = ["autoplay", "loop", "controls", "allowfullscreen"];
Obj.noClosingTag = ["img", "source"];

//post markdown converter
function genHtmlFromRaw(raw){
  var markdown = {
    banner : "b#",
    heading1 : "t#",
    heading2 : "#",
    quote : ">",
    media : "m#"
  }

  var lines = raw.split("\n");

  var index = lines[0].indexOf(markdown["banner"]) + markdown["banner"].length;
  var bannerSrc = lines[0].substr(index);

  var banner = new Obj({
    tag : "img",
    class : "banner",
    src : bannerSrc
  });

  $(".post-preview").html(banner.get());

  var post = new Obj({
    tag : "div",
    class : "post-con"
  });

  var curParagraph = "";
  var lists = getListsFromLines(lines);

  for(var i=1; i<lines.length; i++){
    //parses lists
    for(var a in lists){
      console.log("here");
      if(lists[a][0] == i){
        var listObj = new Obj({
          tag : "ul"
        });
        for(var b = 1; b<lists[a].length; b++){
          listObj.add(new Obj({
            tag : "li",
            content : lists[a][b]
          }));
          i++;
        }
        post.add(listObj);
      }
    }

    lines[i] = lines[i].trim();
    if(lines[i] !== ""){
      var foundKey = false;
      for(var key in markdown){
        var index = lines[i].indexOf(markdown[key]);
        if(index == 0){
          foundKey = true;
          var content = lines[i].substr(index + markdown[key].length);
          var data = null;
          if(key == "heading1"){
            data = {
              tag : "h1",
              content : content
            };
          }
          else if(key == "heading2"){
            data = {
              tag : "h2",
              content : content
            };
          }
          else if(key == "quote"){
            data = {
              tag : "div",
              class : "quote",
              content : content
            };
          }
          else if(key == "media"){
            var mediaObj = genMediaEmbed(content);
            if(mediaObj != null){
              post.add(mediaObj);
            }
          }

          //paragraph from markdown
          if(curParagraph !== ""){
            post.add(new Obj({
              tag : "p",
              content : curParagraph
            }));
            curParagraph = "";
          }

          if(data != null){
            post.add(new Obj(data));
          }
        }
      }
      if(!foundKey){
        //end of paragraph from new markdown
        var html = parseLinks(lines[i]);
        curParagraph += html;
      }
    }

    //end of paragraph
    if(lines[i] === "" || i == lines.length -1){
      if(curParagraph !== ""){
        post.add(new Obj({
          tag : "p",
          content : curParagraph
        }));
        curParagraph = "";
      }
    }
  }

  $(".post-preview").append(post.get());
}

//returns 2 array with index 0 of each array containing the line number
function getListsFromLines(lines){
  var lists = [];
  var curList = [];
  for(var i=0; i<lines.length; i++){
    if(lines[i].charAt(0) === "*" && lines[i].charAt(1) === " "){
      if(curList.length == 0){
        curList.push(i);
      }
      curList.push(lines[i].substr(2));
    }
    else if(curList.length > 0){
      lists.push(curList);
      curList = [];
    }
  }
  return lists;
}

//parse the markdown for links in a paragraph into html
function parseLinks(line){
  if(line.indexOf("[") >= 0){
    var state = 0;
    var text = "";
    var link = "";
    var startIndex = -1;
    var result = "";
    for(var j=0; j<line.length; j++) {

      var switchedState = true;
      switch(line[j]){
        case "[" : state = 1; startIndex=j; break;
        case "]" : state = 2; break;
        case "(" : state = 3; break;
        case ")" : state = 4; break;
        default : switchedState = false;
      }

      if(!switchedState){
        switch(state){
          case 0 : result += line[j]; break;
          case 1 : text += line[j]; break;
          case 3 : link += line[j]; break;
        }
      }
      else if(switchedState && state == 4){
        var newLink = new Obj({
          tag : "a",
          href : link,
          content : text
        });

        result += newLink.get();
        state = 0;
      }
    }
  }
  //no links
  else{
    result = line;
  }
  return result;
}

//generates media links into html
function genMediaEmbed(content){
  var mediaObj = null;
  var url = content.replace("http://", "");
  url = url.replace("https://", "");
  url = url.replace("www.", "");

  var els = url.split("/");
  var domain = els[0];
  var type = "";
  var mediaID = "";
  if(domain == "youtube.com"){
    type = "youtube";
    mediaID = els[1].replace("watch?v=", "");
  }
  else if(domain == "youtu.be"){
    type = "youtube";
    mediaID = els[1];
  }
  else if(domain == "gfycat.com"){
    type = "gfycat";
    mediaID = els[els.length-1];
  }
  else if(domain == "i.imgur.com"){
    var info = els[1].split(".");
    var fileType = info[1];
    if(fileType === "gif" || fileType === "gifv"){
      mediaID = info[0] + ".mp4";
      type = "imgur gifv";
    }
    else {
      mediaID = els[1];
      type = "imgur img";
    }
  }
  else if(domain == ""){
    var fileName = els[els.length-1];
    var fileEls = fileName.split(".");
    var fileType = fileEls[1];

    mediaID = els.join("/");

    if(fileType == "png" || fileType == "jpeg" || fileType == "jpg"){
      type = "img"
    }
  }

  if(type=="youtube"){
    var mediaSrc = "https://www.youtube.com/embed/" + mediaID + "?color=white&vq=hd720";
    mediaObj = new Obj({
      tag : "iframe",
      class : "video",
      src : mediaSrc,
      frameborder : "0",
      allowfullscreen : "true"
    });
  }
  else if(type=="gfycat"){
    var mediaSrc = "https://giant.gfycat.com/" + mediaID + ".webm";
    mediaObj = new Obj({
      tag : "video",
      class : "video",
      autoplay : "true",
      loop : "true"
    });

    mediaObj.add(new Obj({
      tag : "source",
      src : mediaSrc,
      type : "video/webm"
    }));
  }
  else if(type == "imgur img" || type == "img"){

    var mediaSrc;
    if(type == "imgur img"){
      mediaSrc = "https://i.imgur.com/" + mediaID;
    }
    else{
      var site = window.location.protocol + '//' + window.location.hostname;
      mediaSrc = site + mediaID;
    }

    mediaObj = new Obj({
      tag : "div",
      class : "post-img"
    });

    mediaObj.add(new Obj({
      tag : "img",
      src : mediaSrc
    }));
  }
  else if(type == "imgur gifv"){
    console.log("found gifv");
    mediaObj = new Obj({
      tag : "video",
      class : "video",
      autoplay : "true",
      loop : "true"
    });

    mediaObj.add(new Obj({
      tag : "source",
      src : "https://i.imgur.com/" + mediaID,
      type : "video/mp4"
    }));
  }

  return mediaObj;
}

//generate a unique id
function genUID() {
    var firstPart = (Math.random() * 46656) | 0;
    var secondPart = (Math.random() * 46656) | 0;
    firstPart = ("000" + firstPart.toString(36)).slice(-3);
    secondPart = ("000" + secondPart.toString(36)).slice(-3);
    return firstPart + secondPart;
}

//gets the current user id
function getUser(){
  return 1;
}
