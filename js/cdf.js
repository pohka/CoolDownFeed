class Navbar extends Comp{
  constructor(){
    super({
      tag : "div",
      class : "cdf-nav-con",
      children : [
        {
          tag : "div",
          class : "cdf-nav-logo skew-con noselect",
          children : [
            {
              tag : "img",
              class : "skew",
              src : "/img/logo_sm.png"
            }
          ]
        },
        {
          tag : "div",
          class : "cdf-nav-filters",
        },
        {
          tag : "div",
          class : "cdf-nav-info",
          children :[
            {
              tag : "a",
              class : "fa fa-twitter btn",
              href : "https://twitter.com/PohkaDota",
              id : "twitter",
              target : "_blank"
            },
            {
              tag : "a",
              class : "fa fa-youtube-play btn",
              href : "https://www.youtube.com/c/pohka",
              id : "twitter",
              target : "_blank"
            },
            {
              tag : "div",
              class : "btn",
              id : "login",
              txt : "Login",
              on : {
                click : function(){
                  let el = Quas.getEl(".login-modal");
                  if(el === undefined){
                    new LoginModal().render("body");
                  }
                  else{
                    Quas.getEl(".login-modal").visible(true);
                  }
                }
              }
            }
          ]
        },
      ]
    });
  }

  render(sel){
    super.render(sel);
    Quas.makeCompsAndRender(NavItem, ".cdf-nav-filters", [
      {
        text : "Home",
        link : "/",
        active : (Quas.path === "" || Quas.path === "index"),
      },
      {
        text : "Discover",
        link : "/post-example",
        active : (Quas.path == "post-example"),
      },
      {
        text : "New Post",
        link : "/new-post",
        active : (Quas.path == "new-post"),
      }
    ]);
  }
}

class NavItem extends Comp{
  constructor(fields){
    let data = {
      tag : "a",
      txt : fields.text,
      href : fields.link,
      class : "btn"
    };
    if(fields.active){
      data["class"] += " active";
    }
    super(data);
  }
}

class Card extends Comp{
  constructor(fields){
    super({
      tag : "div",
      class : "card link",
      data : {
        url : fields.url,
      },
      on : {
        click : function(){
          location.pathname = "/p/"+fields.url;
        }
      },
      children : [
        {
          tag : "div",
          class : "card-thumb",
          children : [{
            tag : "img",
            src : fields.img
          }]
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
                  txt : fields.title,
                }
              ]
            },
            {
              tag : "div",
              class : "card-author",
              txt : fields.author,
            },
            {
              tag : "div",
              class : "card-time",
              txt : fields.time,
            }
          ]
        }
      ]
    });
  }
}

class Footer extends Comp{
  constructor(fields){
    super({
      tag : "div",
      class : "footer-con",
      children : [
        {
          tag : "div",
          class : "footer-logo btn",
          children : [
            {
              tag : "img",
              src : "/img/logo_sm.png",
            },
            {
              tag : "div",
              class : "footer-logo-text",
              txt : "CoolDownFeed.com",
            },
          ]
        },
        {
          tag : "div",
          class : "footer-filter-con",
          children : [
            {
              tag : "div",
              class : "footer-filter btn",
              id : "footer-about",
              children : [
                {
                  tag : "div",
                  txt : "About",
                }
              ]
            }
          ]
        },
        {
          tag : "div",
          class : "footer-contact",
          children : [
            {
              tag : "div",
              class : "fa fa-youtube-play footer-social btn",
            },
            {
              tag : "div",
              class : "fa fa-twitter footer-social btn",
            },
            {
              tag : "div",
              class :"footer-email",
              children : [
                {
                  tag : "span",
                  class : "email",
                  txt : "moc.liamg@01akhop",
                }
              ]
            }
          ]
        }
      ]
    });
  }
}

class LoginModal extends Comp{
  constructor(){
    super({
      tag : "div",
      class : "login-modal",
      children : [
        {
          tag : "div",
          class : "login-con",
          children : [
            {
              tag : "div",
              class : "login-menu",
              children : [
                {
                  tag : "div",
                  class : "btn active",
                  id : "login-existing",
                  txt : "Login",
                },
                {
                  tag : "div",
                  class : "btn",
                  id : "login-new-user",
                  txt : "Register",
                },
              ]
            },
            {
              tag : "input",
              id : "login-user",
              placeholder : "Username",
              type : "text",
            },
            {
              tag : "br"
            },
            {
              tag : "input",
              id : "login-pass",
              placeholder : "Password",
              type : "password",
            },
            {
              tag :"br"
            },
            {
              tag : "input",
              id : "submit-login",
              type : "button",
              value : "Submit"
            },
            {
              tag : "input",
              id : "hide-login",
              type : "button",
              value : "Cancel",
              on : {
                click : function(){
                  Quas.getEl(".login-modal").visible(false);
                }
              }
            }
          ]
        }
      ]
    });
  }
}

class Post extends Comp{
  constructor(fields){
    super({
      tag : "div",
      class : "post-con",
      children : [{
          tag : "h1",
          txt : fields.title,
      }]
    });

    this.bannerSrc = "/temp/esl_ham.png";

    let sample =
    "i am some text [link](http://www.google.com) and some more\n" +
    " and even this was wrriten on a new line\n\n" +
    "this is a new paragraph [link2](www.test.com) wow\n"+
    "#my heading\n"+
    "the next paragraph \n\n\n\nIm trying to it\n\n\n\n#another heading\nbefore imgh\n"+
    "i#[/temp/ff.png](description)\nafter this image\n"+
    "> this is the quoote\nafter the quote\n"+
    "* item 1\n*  item 2 \n*  item 3\n* item 4\n* item 5\n*  item 6\n* item 7\nmore text" +
    "\n\n* another list\n*  child\n* not child\n";
    //let els = parseMarkdown(fields.text);.
    "";
    let els = parseMarkdown(sample); //for testing markdown
    console.log(els);
    for(let i in els){
      this.addChild(els[i]);
    }
  }

  render(){
    super.render(".container");
    let banner = new Comp({
      tag : "div",
      class : "banner",
      children : [{
        tag : "img",
        src : "/temp/esl_ham.png"
      }]
    });
    banner.render(".container", "prepend");
  }
}



Quas.start = function(){
  let nav = new Navbar();
  nav.render(".cdf-nav");
  quasLoadPage();
  new Footer().render("footer");
}

function quasLoadPage(){
  if(Quas.path === "" || Quas.path === "index"){
    Quas.ajax({
      url : "/php/cdf.php",
      type : "POST",
      data : {
        type : "cards-home"
      },
      success : function(res){
        let data = JSON.parse(res);
        for(let i in data){
          let img = data[i].thumbnail;
          if(img === ""){
            img = "/temp/esl_ham.png";
          }
          new Card({
            url : data[i].id,
            img : img,
            title : data[i].title,
            author : data[i].author,
            time : timeSinceString(data[i].publish_time),
          }).render(".card-con");
        }
      }
    });
  }
  else if(Quas.path.indexOf("p/") == 0){
    Quas.ajax({
      url : "/php/cdf.php",
      type : "POST",
      data : {
        type : "post-view",
        id : Quas.path.substr(2),
      },
      success : function(res){
        let data = JSON.parse(res);
        console.log(data[0]);
        new Post(data[0]).render();
      }
    });
  }
}

/**
  convert text markdown to component data
  @param {String} text - raw string
  @return {JSON[]}

  makrdown:
  - #heading              - heading
  - [text](link)          - link with text
  - \n\n is               - new paragraph
  - i#[src](desc)         - image
  - > my quote            - quote
  - * item 1              - list item
  - m#youtube             - media embded (youtube/cooldownfeed/gyfcat)
  - ```LANG\n my code```  - code
*/
function parseMarkdown(text){
  let els = [];
  let lines = text.split("\n");

  let paragraph = ""; //raw text for the current paragraph
  let ignore = false; //should ignore
  let temp;
  let list = [];
  for(let i=0; i<lines.length; i++){
    let stub = lines[i].substr(0,2);

    //ignore banner
    if(lines[i].substr(0,2) === "#b"){
      i++;
    }

    //list item
    if(stub === "* "){
      //nested list
      if(lines[i].charAt(2) === " "){
        //add child list
        if(list.length > 0 && list[list.length-1].constructor === String){
          list.push([lines[i].substr(3)]);
        }
        //append to child list
        else if(list.length > 0){
          list[list.length-1].push(lines[i].substr(3));
        }
      }
      //append to root list
      else
        list.push(lines[i].substr(2));
    }

    //new line or a markdown which ends a paragraph or last line
    if((lines[i].charAt(0) === "#" || stub === "i#" || stub === "> " || stub === "* ") ||
        lines[i] === "" || i == lines.length - 1 || (list.length > 0 && stub !== "* ")){
      if(!(lines[i].charAt(0) === "#"  || stub === "i#" || stub === "> " || stub === "* ")){
        paragraph += lines[i];
      }
      //list
      if(list.length > 0 && stub !== "* "){
        els.push({
          tag : "ul",
          children : Quas.genList(list)
        });
        list = [];
      }

      //links and paragraphs
      let pEl = parseStrForLinks(paragraph);
      if(pEl.children.length > 0){
        els.push(pEl);
      }

      paragraph="";
    }
    else{
      paragraph += lines[i];
    }

    //heading
    if(lines[i].charAt(0) === "#"){
      els.push({
        tag : "h2",
        txt : lines[i].substr(1)
      });
    }

    //image
    else if(lines[i].substr(0,2) === "i#"){
      let reg  = new RegExp("i#\\[.*?\\]\\(.*?\\)","g");
      let res = lines[i].match(reg)
      if(res !== null){
        let kv = lines[i].substr(3, lines[i].length-4).split("](");
        els.push({
          tag : "div",
          class : "post-img",
          children : [{
            tag : "img",
            src : kv[0],
            alt : kv[1]
          }]
        });
      }
    }

    //quote
    else if(stub === "> "){
      els.push({
        tag : "div",
        class : "quote",
        txt : lines[i].substr(2)
      });
    }
  }
  return els;
}

//parses the link markdown out of string and returns a json object
function parseStrForLinks(paragraph){
  let reg  = new RegExp("\\[.*?\\]\\(.*?\\)","g");
  let links = paragraph.match(reg);
  let pEl = {
    tag : "p",
    children : []
  }
  for(let a in links){
    let linkIndex = paragraph.indexOf(links[a]);
    pEl.children.push({txt : paragraph.substr(0, linkIndex)});
    paragraph = paragraph.substr(linkIndex+links[a].length);
    let linkKV = links[a].substr(1,links[a].length-2).split("](");
    pEl.children.push({
      tag : "a",
      txt : linkKV[0],
      href : linkKV[1]
    });
  }
  if(paragraph !== ""){
    pEl.children.push({txt : paragraph});
  }
  return pEl;
}

$(document).ready(function() {
  return;
  loadPage();
  loadSession();
  checkPrivilages(deniedCallback);

  $(".footer-filter").click(function(){
      switch($(this).attr("id"))
      {
        case "footer-about" :     window.open("/", "_self"); break;
        case "footer-discover":   window.open("/", "_self"); break;
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

  $(document).on("click", ".cdf-nav-logo", function(){
    window.open("/", "_self");
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

  //clicking on cards
  $(document).on("mousedown", ".link", function(e){
    var id = $(this).data("url");
    switch(e.which){
      case 1 : window.open("/p/"+id, "_self"); break;
      case 2 : window.open("/p/"+id, "_blank"); break;
    }
  });
});

//generates the content for each page
function loadPage(){
  genNavbar();
  return;
  var pageType = "";
  var path = window.location.pathname;
  var allowed = true;
  if(allowed){
    if(path === "/" || path === "/index" || path === "/index.html"){
      pageType = "cards-home";
    }
    else if(path.startsWith("/p/")){
      pageType = "post-view";
    }
    else{
      pageType = path.substr(1, path.length-1);
    }

    switch(pageType){
      case "cards-home" : genHome(pageType); break;
      case "post-view"  : genPost(pageType, path); break;
      case "my-posts"   : genMyPosts(); break;
    }
  }
  genFooter();
}

//conceals the page, displats privilage msg and redirects to the home page
function deniedCallback(){
  bwe.append("body",{
    tag : "div",
    class : "conceal",
    children :[
      {
        tag : "div",
        class : "conceal-msg",
        con : "Permission Denied"
      }
    ]
  });
  disableScroll();
  setTimeout(function(){
    window.open("/", "_self");
  }, 2000);
}

//calls the callback function if the user doesn't have privilage to view the current page
function checkPrivilages(callbackIfDenied){
  var privilagePages = [
    "/new-post"
  ];
  var path = window.location.pathname;
  if($.inArray(path, privilagePages) == -1){
    return;
  }
  var cookie = getCookie("session");
  if(cookie === ""){
    callbackIfDenied();
  }
  else
  {
    $.ajax(
      {
        url: "/php/privilages.php",
        type: "POST",
        data: {
          session_id : cookie,
          page: path
        },
        success : function(data){
          if(data!=="true"){
            callbackIfDenied();
          }
        }
      });
  }
}

//generates content for home
function genHome(pageType){
  $.post( "php/cdf.php", {
    type : pageType
    }).done(function( data ) {
      if(data !== "") {
        var obj = JSON.parse(data);
        for(var i in obj){
          let img = obj[i]["thumbnail"];
          if(img === ""){
            img = "/temp/esl_ham.png";
          }
          var card = genCard({
            id : obj[i]["id"],
            img : img,
            title : obj[i]["title"],
            desc : obj[i]["description"],
            author : obj[i]["author"],
            time : obj[i]["publish_time"],
            tags : obj[i]["tags"],
          });
        }
      }
  });
}

//generates content for posts
function genPost(pageType, path){
  var postID = path.replace("/p/", "");
  $.ajax(
    {
    url: "/php/cdf.php",
    type: "POST",
    data: {
      type : pageType,
      id : postID
    },
    success: function(data){
        if(data !== ""){
        var post = JSON.parse(data)[0];
        var html = genHtmlFromRaw(post["text"]);
        var time = timeSinceString(post["publish_time"]);
        bwe.append(".container", html);

        //add creator div
        $("h1").after(bwe.build({
          tag : "div",
          class : "creator",
          children : [
            {
              tag : "div",
              class : "creator-avatar",
              children : [
                {
                  tag : "img",
                  src : post["avatar"]
                }
              ]
            },
            {
              tag : "div",
              class : "creator-name",
              con: post["username"]
            },
            {
              tag : "div",
              class : "creator-date",
              con : time
            }
          ]
        }));
      }
      //post link doesn't exist
      else{
        bwe.append(".container", {
          tag : "h1",
          con : "Zoinks! That link doesn't exist"
        });
      }
    }
  });
}

//generate navbar
function genNavbar(){
  $("nav").html("");
  bwe.pages = [
    {
      name : "Home",
      page : "/"
    },
    {
      name : "Trending",
      page : "/post-example"
    },
    {
      name : "Discover",
      page : "/new-post"
    }
  ];

  bwe.append("nav",{
    tag : "div",
    class : "cdf-nav-filters",
    children : [
      {
        tag : "div",
        class : "cdf-nav-logo skew-con noselect",
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
        class : "nav-item btn"
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
        class : "fa fa-twitter btn"
      },
      {
        tag : "a",
        href : "https://www.youtube.com/c/pohka",
        target : "_blank",
        id : "youtube",
        class : "fa fa-youtube-play btn"
      },
      {
        tag : "div",
        class : "btn",
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
}

//generate footer
function genFooter(){
  bwe.append("footer", {
    tag:"div",
    class:"footer-con",
    children:[
      {
        tag:"div",
        class:"footer-logo btn",
        children:[
          {
            tag:"img",
            src:"/img/logo_sm.png",
          },
          {
            tag:"div",
            class:"footer-logo-text",
            con:"CoolDownFeed.com"
          }
        ]
      },
      {
        tag:"div",
        class:"footer-filter-con",
        children:[
          {
            tag:"div",
            class:"footer-filter noselect btn",
            id:"footer-about",
            children:[
              {
                tag:"div",
                con:"About"
              }
            ]
          }
        ]
      },
      {
        tag:"div",
        class:"footer-contact",
        children:[
          {
            tag:"div",
            class:"fa fa-youtube-play footer-social btn"
          },
          {
            tag:"div",
            class:"fa fa-twitter footer-social btn"
          },
          {
            tag:"div",
            class:"footer-email",
            children:[
              {
                tag:"span",
                children:[
                  {
                    tag: "span",
                    class: "email",
                    con:"moc.liamg@01akhop"
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
}

//generates a card from data with bwe
//id, img, title, desc, author, time, tags
function genCard(data){
  var json = {
    tag : "div",
    class : "card link",
    data : [{ url : data["id"] }],
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
    var diffMonths = Math.floor(timeDiff / (1000 * 3600 * 24 * 30));
    var diffYears = Math.floor(timeDiff / (1000 * 3600 * 24 * 30 * 365));

    if(diffMonths==0){
      str = diffDays+" days ago";
    }
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
  $.ajax({
    url: "/php/login.php",
    type: "POST",
    data: {
      username: $("#login-user").val(),
      password: $("#login-pass").val()
    }
    }).done(function( data ) {
      if( data !== ""){
        var json = jQuery.parseJSON(data);
        //create session
        clearNotifications();
        notification("Logged In", "success", 4);
        toggleLoginModal();
        $("#login-user").val("");
        $("#login-pass").val("");
        for(let key in json){
          document.cookie = key + "=" + json[key] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        }
        loadSession();
      }
      else{
        notification("Login details were incorrect", "error", 28);
      }
    }).fail(function() {
      //console.log( "connection failed" );
  });
}

//sets the session info at the top right
function loadSession(){
  var session = getCookie("session");
  if(session !== ""){
    let avatar = getCookie("user_avatar");
    let userName = getCookie("user_name");

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
              src : avatar
            }
          ]
        },
        {
          tag : "span",
          id  : "session-username",
          con : userName
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
    clearCookie("session");
    clearCookie("user_avatar");
    clearCookie("user_name");

    $(".session-con").remove();
    $("#login").show();
    $(".user-menu").hide();
    setTimeout(function(){
      location.reload();
    }, 2000);
    notification("Logged Out", "", 3);
  }
}

//clears a cookie by its key name
function clearCookie(cname){
  document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;";
}

//gets the cookie by they key value
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
  if($(sel).length == 0){
    genLoginModal();
  }
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

//generate the login modal
function genLoginModal(){
  bwe.append("body", {
    tag:"div",
    class:"login-modal",
    children:[
      {
        tag:"div",
        class:"login-con",
        children:[
          {
            tag:"div",
            class:"login-menu",
            children:[
              {
                tag:"div",
                id:"login-existing",
                class:"btn active",
                con: "Login",
              },
              {
                tag:"div",
                id:"login-newuser",
                class:"btn",
                con :"Register"
              }
            ]
          },
          {
            tag:"input",
            type:"text",
            id:"login-user",
            placeholder:"Username",
            children:[
              {
                tag:"br",
                children:[
                  {
                    tag:"input",
                    type:"password",
                    id:"login-pass",
                    placeholder:"Password",
                    children:[
                      {
                        tag:"br"
                      },
                      {
                        tag:"input",
                        type:"button",
                        id:"submit-login",
                        value:"Submit",
                        children:[
                          {
                            tag:"input",
                            type:"button",
                            id:"hide-login",
                            value:"Cancel"
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  });
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
    tag:"div",
    class:"banner",
    children:[{
      tag : "img",
      src : bannerSrc
    }]
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

  return post;
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

//shows a notification at the top right
function notification(text, type, duration){
  var cls = "fa ";
  switch(type){
    case "success" : cls += "fa-check"; break;
    case "warning" : cls += "fa-exclamation"; break;
    case "error" : cls += "fa-exclamation-triangle"; break;
  }

  if(type==""){
    type="default";
  }

  var id = "note-"+genUID();

  if($(".notification-con").length == 0){
    bwe.append("body", {
      tag : "div",
      class : "notification-con"
    });
  }
  $(".notification-con").prepend(bwe.build({
    tag : "div",
    id : id,
    class : "notification notification-"+type,
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

function clearNotifications(filter){
  if(filter !== undefined){
    $(".notification").each(function(){
      if($(this).hasClass('notification-' + filter)){
        $(this).hide();
      }
    });
  }
  else{
    $(".notification").each(function(){ $(this).hide(); });
  }
}

function toggleUserMenu(){
  var sel = ".user-menu"
  if($(sel).length == 0){
    genUserMenu();
  }
  if($(sel).is(":hidden")){
    $(sel).show();
  }
  else{
    $(sel).hide();
  }
}

function genUserMenu(){
  bwe.append("body",{
    "tag":"div",
    "class":"user-menu",
    "children":[
      {
        tag:"div",
        data:[{action : "my-posts"}],
        con:"My Posts"
      },
      {
        tag:"div",
        data:[{action : "log-out"}],
        con:"Log Out"
      }
    ]
  });
}

function userMenuAction(action){
  switch(action){
    case "log-out" : endSession(); break;
    case "my-posts" : window.open("/my-posts","_self"); break;
  }
}

//returns the data from the url in a json object
function getUrlValues(){
  let str = window.location.search;
  if(str.charAt(0)=="?"){
    str = str.substr(1, str.length-1);
  }
  let variables = str.split("&");
  let data = {};
  for(let i = 0; i<variables.length; i++){
    if(variables[i]!==""){
      let item = variables[i].split("=");
      data[item[0]] = item[1];
    }
  }

  return data;
}

//set or change a value in the url variables
function setUrlValue(key, val){
  let data = getUrlValues();
  data[key] = val;
  let str = "?";
  for(let key in data){
    str += key + "=" + data[key] + "&";
  }
  str = str.substr(0,str.length-1);
  window.location = window.origin + window.location.pathname + str;
}

//changes sql date string to d-mmm-yyyy-hh-mm format
function dateToString(datestr){
  let els = datestr.split(" ");
  let date = els[0].split("-");
  let time = els[1].split(":");

  let hr = Number(time[0]);
  let mode = "AM";
  if(hr >= 12){
    mode = "PM";
  }
  hr = hr%12;
  if(hr==0){
    hr = 12;
  }
  let min = Number(time[1]);
  if(min < 10){
    min = "0" + min;
  }

  let monthStrs = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  let day = Number(date[2]);
  switch(day%10){
    case 1 : day+="st"; break;
    case 2 : day+="nd"; break;
    case 3 : day+="rd"; break;
    default: day+="th"; break;
  }
  let month = monthStrs[Number(date[1])-1];

  let str = day + " " + month + ", " + date[0] + " " + hr + ":" + min + " " + mode;
  return str;
}

//generate my-posts page
function genMyPosts(){
  let urlData = getUrlValues();
  let page = urlData["page"];
  if(page==undefined){
    page = 0;
  }
  if(page == 0){
    $("#my-posts-prev").hide();
  }
  let sid = getCookie("session");
  $(".post-list").html("");
  if(sid === ""){
    return;
  }
  $.ajax(
    {
    url: "/php/cdf.php",
    type: "POST",
    data: {
      type : "my-posts",
      page : page,
      sid : sid,
    },
    success: function(data){
      if(data !== ""){
        let json = JSON.parse(data);

        for(let i=0; i<json.length; i++){
          let img = json[i]["thumbnail"];
          if(img === ""){
            img = "/temp/esl_ham.png";
          }
          if(json[i]["title"] === ""){
            json[i]["title"] = "Untitled";
          }
          bwe.append(".post-list", {
            tag : "div",
            class : "post-list-item",
            data : [{
              url : json[i]["id"]
            }],
            children : [
              {
                tag : "img",
                src : img,
              },
              {
                tag : "div",
                class : "post-item-info",
                children :[
                  {
                    tag : "h3",
                    class : "post-item-title",
                    con : json[i]["title"],
                  },
                  {
                    tag : "div",
                    class : "post-item-date",
                    con : dateToString(json[i]["publish_time"])
                  }
                ]
              },
              {
                tag : "div",
                class : "post-item-stats",
                children : [
                  {
                    tag : "div",
                    con : "Views: 0",
                  },
                  {
                    tag : "div",
                    class : "fa fa-comment",
                    con : " 0",
                  }
                ]
              }
            ]
          });
        }
      }
    }
  });
}

$(document).on("click", "#my-posts-next", function(){
  let page = getUrlValues()["page"];
  if(page === undefined){
    page = 0;
  }
  setUrlValue("page", Number(page)+1);
});

$(document).on("click", "#my-posts-prev", function(){
  let page = getUrlValues()["page"];
  if(page !== undefined && page > 0){
    setUrlValue("page", Number(page)-1);
  }
});
