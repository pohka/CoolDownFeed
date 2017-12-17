$(document).ready(function() {
  loadPage();
  startSession();

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

  $(document).on("click", ".login-menu div", function(){
    if($(this).hasClass('active') == false){
      $(".login-menu div.active").removeClass('active');
      $(this).addClass('active');
    }
  })

  $(document).on("click", "#submit-login", login);
  $(document).on("click", "#login, #hide-login", toggleLoginModal);
  $(document).on("click", ".session-con", toggleUserMenu);

  $(document).on("click", ".user-menu div", function(){
    userMenuAction($(this).data("action"));
  })
});

//loads the card for each page
function loadPage(){
  genNavbar();
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

function genNavbar(){
  $("nav").html("");
  bwe.pages = [
    {
      name : "Home",
      page : "index"
    },
    {
      name : "Trending",
      page : "post"
    },
    {
      name : "Discover",
      page : "new-post"
    }
  ];

  bwe.append("nav",{
    tag : "div",
    class : "cdf-nav-filters",
    children : [
      {
        tag : "div",
        class : "cdf-nav-logo skew-con",
        children : [
          {
            tag : "img",
            class : "skew",
            src : "/img/logo_sm.png"
          }
        ]
      }
    ]
  });

  bwe.append("nav",{
    tag : "div",
    class : "cdf-nav-filters",
    children : bwe.genNavItems(
      {
        class : "nav-item skew-con"
      },
      {
        tag : "div",
        class : "skew"
      }
    )
  });

  bwe.append("nav",{
    tag : "div",
    class : "cdf-nav-info",
    children : [
      {
        tag : "a",
        href : "https://twitter.com/PohkaDota",
        target : "_blank",
        id : "twitter",
        class : "fa fa-twitter"
      },
      {
        tag : "a",
        href : "https://www.youtube.com/c/pohka",
        target : "_blank",
        id : "youtube",
        class : "fa fa-youtube-play"
      },
      {
        tag : "div",
        id : "login",
        con : "Login"
      },
      {
        tag : "div",
        id : "start",
        con : "Get Started"
      }
    ]
  });

  /*
    {"tag":"nav","class":"cdf-nav","children":[{"tag":"div","class":"cdf-nav-logo skew-con","children":[{"tag":"img","class":"skew","src":"/img/logo_sm.png"}]},{"tag":"ul","class":"cdf-nav-filters","children":[{"tag":"li","class":"nav-item skew-con active","id":"filter-home","children":[{"tag":"div","class":"skew"}]},{"tag":"li","class":"nav-item skew-con","id":"filter-popular","children":[{"tag":"div","class":"skew"}]},{"tag":"li","class":"nav-item skew-con","id":"filter-discover","children":[{"tag":"div","class":"skew"}]}]},{"tag":"div","class":"cdf-nav-info","children":[{"tag":"button","id":"twitter","class":"fa fa-twitter"},{"tag":"button","id":"youtube","class":"fa fa-youtube-play"},{"tag":"button","id":"login"},{"tag":"button","id":"start"}]}]}
  */
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

  var diffDays = Math.floor(timeDiff / (1000 * 3600 * 24));

  var str;
  if(diffDays == 0){
    var diffMins = Math.floor(timeDiff / (1000 * 60));
    var diffHours = Math.floor(timeDiff / (1000 * 3600));

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

//request login user
function login(){
  $.post( "php/login.php", {
    username: $("#login-user").val(),
    password: $("#login-pass").val()
    }).done(function( data ) {
      if( data !== ""){
        var json = jQuery.parseJSON(data);
          //create session
          clearNotifications();
          notification("Logged In", "success", 4);
          toggleLoginModal();
          $("#login-user").val("");
          $("#login-pass").val("");
          document.cookie = "session=" + data + "; expires=Fri, 31 Dec 9999 23:59:59 GMT";
          startSession();
      }
      else{
        notification("Login details were incorrect", "error", 8);
      }
    }).fail(function() {
      //console.log( "connection failed" );
  });
}

//sets the session info at the top right
function startSession(){
  var session = getCookie("session");
  if(session !== ""){
    var data = jQuery.parseJSON(session);
    $("#login").hide();
    bwe.append(".cdf-nav-info", {
      tag : "div",
      class : "session-con",
      children : [
        {
          tag : "div",
          class : "session-avatar-con",
          children : [
            {
              tag : "img",
              id  : "session-avatar",
              src : data["user_avatar"]
            }
          ]
        },
        {
          tag : "span",
          id  : "session-username",
          con : data["user_name"]
        },
        {
          tag : "div",
          id : "session-down-icon",
          class : "fa fa-caret-down"
        }
      ]
    });
  }
}

//logs the user out of their current session
function endSession(){
  var session = getCookie("session");
  if(session !== ""){
    var cookie = "session=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
    document.cookie = cookie;
    $(".session-con").remove();
    $("#login").show();
    $(".user-menu").hide();
    notification("Logged Out", "", 3);
  }
}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function toggleLoginModal(){
  var sel = ".login-modal"
  if($(sel).is(":hidden")){
    $(".login-modal").show();
    $("#login-user").focus();
    disableScroll();
  }
  else{
    $(".login-modal").fadeOut("fast");
    enableScroll();
  }
}

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

  var banner = {
    tag : "img",
    class : "banner",
    src : bannerSrc
  };

  //$(".post-preview").html(banner.get());

  var post = {
    tag : "div",
    class : "post-con",
    children : [
      banner
    ]
  };

  var curParagraph = "";
  var lists = getListsFromLines(lines);

  for(var i=1; i<lines.length; i++){
    //parses lists
     for(var a in lists){
       if(lists[a][0] == i){
         lists[a].splice(0, 1)
         var listObj = bwe.genList({}, lists[a]);
         i += lists[a].length;
         post["children"].push(listObj);
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
              con : content
            };
          }
          else if(key == "heading2"){
            data = {
              tag : "h2",
              con : content
            };
          }
          else if(key == "quote"){
            data = {
              tag : "div",
              class : "quote",
              con : content
            };
          }
          else if(key == "media"){
            var mediaObj = genMediaEmbed(content);
            if(mediaObj != null){
              post["children"].push(mediaObj);
            }
          }

          //paragraph from markdown
          if(curParagraph !== ""){
            post["children"].push({
              tag : "p",
              con : curParagraph
            });
            curParagraph = "";
          }

          if(data != null){
            post["children"].push(data);
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
        post["children"].push({
          tag : "p",
          con : curParagraph
        });
        curParagraph = "";
      }
    }
  }

  $(".post-preview").html("");
  bwe.append(".post-preview", post);
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
        var newLink = {
          tag : "a",
          href : link,
          con : text
        };

        link = "";
        text = "";
        result += bwe.build(newLink);//newLink.get();
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
    mediaObj = {
      tag : "iframe",
      class : "video",
      src : mediaSrc,
      frameborder : "0",
      allowfullscreen : "true"
    };
  }
  else if(type=="gfycat"){
    var mediaSrc = "https://giant.gfycat.com/" + mediaID + ".webm";
    mediaObj = {
      tag : "video",
      class : "video",
      autoplay : "true",
      loop : "true",
      children : [
        {
          tag : "source",
          src : mediaSrc,
          type : "video/webm"
        }
      ]
    };
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

    mediaObj = {
      tag : "div",
      class : "post-img",
      children : [
        {
          tag : "img",
          src : mediaSrc
        }
      ]
    };
  }
  else if(type == "imgur gifv"){
    mediaObj = {
      tag : "video",
      class : "video",
      autoplay : "true",
      loop : "true",
      children : [
        {
          tag : "source",
          src : "https://i.imgur.com/" + mediaID,
          type : "video/mp4"
        }
      ]
    };
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
function getUserCookieID(){
  var session = getCookie("session");
  if(session !== ""){
    var data = jQuery.parseJSON(session);
    return data["cookie_id"];
  }
}

//shows a notification at the top right
function notification(text, type, duration){
  var cls = "fa ";
  switch(type){
    case "success" : cls += "fa-check"; break;
    case "warning" : cls += "fa-exclamation"; break;
    case "error" : cls += "fa-exclamation-triangle"; break;
  }

  var id = "note-"+genUID();

  $(".notification-con").prepend(bwe.build({
    tag : "div",
    id : id,
    class : "notification",
    children : [
      {
        tag : "div",
        class : "notification-text",
        con : text
      },
      {
        tag : "div",
        class : "notification-icon " + cls
      }
    ]
  }));

  setTimeout(function(){
      $("#"+id).fadeOut('fast', function() {
        $("#"+id).remove();
      });
    },
    duration*1000);
}

function clearNotifications(){
  $(".notification").each(function(){ $(this).hide(); });
}

function toggleUserMenu(){
  var sel = ".user-menu"
  if($(sel).is(":hidden")){
    $(sel).show();
  }
  else{
    $(sel).hide();
  }
}

function userMenuAction(action){
  switch(action){
    case "log-out" : endSession(); break;
  }
}

//Enable/Disable scolling
//--------------------------------------------------
var keys = {37: 1, 38: 1, 39: 1, 40: 1};

function preventDefault(e) {
 e = e || window.event;
 if (e.preventDefault)
     e.preventDefault();
 e.returnValue = false;
}

function preventDefaultForScrollKeys(e) {
   if (keys[e.keyCode]) {
       preventDefault(e);
       return false;
   }
}

function disableScroll() {
 if (window.addEventListener) // older FF
     window.addEventListener('DOMMouseScroll', preventDefault, false);
 window.onwheel = preventDefault; // modern standard
 window.onmousewheel = document.onmousewheel = preventDefault; // older browsers, IE
 window.ontouchmove  = preventDefault; // mobile
 document.onkeydown  = preventDefaultForScrollKeys;
}

function enableScroll() {
   if (window.removeEventListener)
       window.removeEventListener('DOMMouseScroll', preventDefault, false);
   window.onmousewheel = document.onmousewheel = null;
   window.onwheel = null;
   window.ontouchmove = null;
   document.onkeydown = null;
}
//------------------------------------------------
