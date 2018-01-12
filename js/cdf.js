//navbar
class Navbar extends Comp{
  constructor(){
    super({
      tag : "div",
      class : "cdf-nav-con",
      children : [
        {
          tag : "a",
          href : "/",
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
              class : "ico ico-twitter btn",
              href : "https://twitter.com/PohkaDota",
              id : "nav-ico-twitter",
              target : "_blank",
            },
            {
              tag : "a",
              class : "ico ico-youtube btn",
              href : "https://www.youtube.com/c/pohka",
              id : "nav-ico-youtube",
              target : "_blank",
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
    ]);
  }
}

//main navigation item in the navbar
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

//card on the home page
class Card extends Comp{
  constructor(fields){
    super({
      tag : "a",
      href : "/p/"+fields.url,
      class : "card link",
      data : {
        url : fields.url,
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

//footer
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
              class : "ico ico-youtube footer-social btn",
            },
            {
              tag : "div",
              class : "ico ico-twitter footer-social btn",
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

//Login modal
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
              value : "Submit",
              on : {
                click : login
              }
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

//post
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
    let credit = new PostAuthor(fields.username, fields.avatar, fields.publish_time);
    this.addChild(credit.data);
    let els = parseMarkdown(fields.text);
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

class PostAuthor extends Comp{
  constructor(author, avatar, time){
    super({
      tag : "div",
      class : "creator",
      children : [
        {
          tag : "div",
          class : "creator-avatar",
          children : [{
            tag : "img",
            src : avatar
          }]
        },
        {
          tag : "div",
          class : "creator-name",
          txt : author
        },
        {
          tag : "div",
          class : "creator-date",
          txt : dateToString(time, false)
        }
      ]
    });
  }
}

//an icon
class Icon extends Comp{
  constructor(name){
    let icon = icons[name];
    super({
      tag : "i",
      class : "ico-con ico-con-"+name,
      children : [{
        tag : "svg",
        class : "ico-icon",
        xmlns : "http://www.w3.org/2000/svg",
        viewBox : icon.box,
        width : icon.width,
        children : [
          {
            tag : "path",
            d : icon.d,
          }
        ]
      }]
    });
  }

  render(el, type){
    super.render(el, type);
    el.innerHTML+="";
  }
}

let icons = {
  twitter :{
    box : "0 0 512 512",
    width : "1em",
    d : 'M459.37 151.716c.325 4.548.325 9.097.325 13.645 0 138.72-105.583 298.558-298.558 298.558-59.452 0-114.68-17.219-161.137-47.106 8.447.974 16.568 1.299 25.34 1.299 49.055 0 94.213-16.568 130.274-44.832-46.132-.975-84.792-31.188-98.112-72.772 6.498.974 12.995 1.624 19.818 1.624 9.421 0 18.843-1.3 27.614-3.573-48.081-9.747-84.143-51.98-84.143-102.985v-1.299c13.969 7.797 30.214 12.67 47.431 13.319-28.264-18.843-46.781-51.005-46.781-87.391 0-19.492 5.197-37.36 14.294-52.954 51.655 63.675 129.3 105.258 216.365 109.807-1.624-7.797-2.599-15.918-2.599-24.04 0-57.828 46.782-104.934 104.934-104.934 30.213 0 57.502 12.67 76.67 33.137 23.715-4.548 46.456-13.32 66.599-25.34-7.798 24.366-24.366 44.833-46.132 57.827 21.117-2.273 41.584-8.122 60.426-16.243-14.292 20.791-32.161 39.308-52.628 54.253z'
  },
  youtube :{
    box : "0 0 576 512",
    width : "1.2em",
    d : 'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
  },
  "caret-down" :{
    box: "0 0 320 512",
    width : "0.8em",
    d : "M31.3 192h257.3c17.8 0 26.7 21.5 14.1 34.1L174.1 354.8c-7.8 7.8-20.5 7.8-28.3 0L17.2 226.1C4.6 213.5 13.5 192 31.3 192z"
  },
  comment : {
    box : "0 0 576 512",
    width : "1em",
    d : "M288 32C129 32 0 125.1 0 240c0 49.3 23.7 94.5 63.3 130.2-8.7 23.3-22.1 32.7-37.1 43.1C15.1 421-6 433 1.6 456.5c5.1 15.4 20.9 24.7 38.1 23.3 57.7-4.6 111.2-19.2 157-42.5 28.7 6.9 59.4 10.7 91.2 10.7 159.1 0 288-93 288-208C576 125.1 447.1 32 288 32zm0 368c-32.5 0-65.4-4.4-97.3-14-32.3 19-78.7 46-134.7 54 32-24 56.8-61.6 61.2-88.4C79.1 325.6 48 286.7 48 240c0-70.9 86.3-160 240-160s240 89.1 240 160c0 71-86.3 160-240 160z"
  },
  "chart-bar" : {
    box : "0 0 512 512",
    width : "1em",
    d : "M500 400c6.6 0 12 5.4 12 12v24c0 6.6-5.4 12-12 12H12c-6.6 0-12-5.4-12-12V76c0-6.6 5.4-12 12-12h24c6.6 0 12 5.4 12 12v324h452zm-356-60v-72c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v72c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12zm96 0V140c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v200c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12zm96 0V204c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v136c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12zm96 0V108c0-6.6-5.4-12-12-12h-24c-6.6 0-12 5.4-12 12v232c0 6.6 5.4 12 12 12h24c6.6 0 12-5.4 12-12z"
  }
};

//permission denied overlap
class ConcealOverlay extends Comp{
  constructor(msg){
    super({
      tag : "div",
      class : "conceal",
      children :[
        {
          tag : "div",
          class : "conceal-msg",
          txt : "Permission Denied",
          children : [
            {
              tag : "div",
              class : "conceal-reason",
              txt : msg
            }
          ]
        }
      ]
    });
  }
}

//user session in the navbar
class NavSession extends Comp{
  constructor(){
    let avatar = getCookie("user_avatar");
    let userName = getCookie("user_name");
    super({
      tag : "div",
      class : "session-con",
      on : {
        mouseenter : function(){
          Quas.getEl("#session-down-icon").active(true);
        },
        mouseleave : function(){
          Quas.getEl("#session-down-icon").active(false);
        },
        click : function(){
          Quas.getEl(".user-menu").toggleVisible();
        }
      },
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
          txt : userName
        },
        {
          tag : "div",
          id : "session-down-icon",
          class : "ico ico-caret-down"
        }
      ]
    });
  }
}

//notification in the bottom left
class Notification extends Comp{
  constructor(text, duration, type){
    if(type === undefined || type === ""){
      type="default";
    }
    super({
      tag : "div",
      id : "note-"+genUID(),
      class : "notification notification-"+type,
      children : [
        {
          tag : "div",
          class : "notification-text",
          txt : text
        },
        {
          tag : "div",
          class : "notification-icon"
        }
      ]
    });
    this.duration = duration;

    if(Quas.getEl(".notification-con") === undefined){
      Quas.getEl("body").addChild({
        tag : "div",
        class : "notification-con"
      });
    }
  }

  render(){
    super.render(".notification-con");
    let id = this.data.id;
    setTimeout(
      function(){
        Quas.getEl("#"+id).del();
      },
      this.duration*1000);
  }
}

//list item for posts in my-post page
class MyPostsItem extends Comp{
  constructor(data){
    super({
      tag : "div",
      class : "post-list-item",
      data : {
        url : data.id
      },
      children : [
        {
          tag : "img",
          src : data.img,
        },
        {
          tag : "div",
          class : "post-item-info",
          children :[
            {
              tag : "h3",
              class : "post-item-title",
              txt : data.title,
            },
            {
              tag : "div",
              class : "post-item-date",
              txt : dateToString(data.publish_time)
            }
          ]
        },
        {
          tag : "div",
          class : "post-item-stats",
          children : [
            {
              tag : "div",
              txt : "",
              class : "ico-post-item ico ico-chart-bar",
            },
            {
              tag : "div",
              class : "ico-post-item-val",
              txt : "0"
            },
            {
              tag : "br",
            },
            {
              tag : "div",
              id : "",
              class : "ico-post-item ico ico-comment",
            },
            {
              tag : "div",
              class : "ico-post-item-val",
              txt : "0"
            }
          ]
        }
      ]
    });
  }
}

//user menu in the top right
class UserMenu extends Comp{
  constructor(items){
    let data = {
      tag :"div",
      class : "user-menu",
      children : []
    }
    for(let key in items){
      data.children.push({
        tag : "div",
        on : {
          click : items[key]
        },
        txt : key
      });
    }
    super(data);
  }
}

//start
Quas.start = function(){
  let nav = new Navbar();
  nav.render(".cdf-nav");
  quasLoadPage();
  new Footer().render("footer");
  loadSession();
  loadAllIcons();
  checkPrivilages(concealDefault);
  window.addEventListener("resize", responsiveLayoutCheck);
}

function finishedLoadingPost(){
  responsiveLayoutCheck();
}

function responsiveLayoutCheck(){
  let mobileW = 900;
  let w = window.innerWidth;
  if(w <= 900){

    //keep 16:9 ratio on videos
    Quas.each(".video", function(el){
      el.el.style = "height:"+(w*0.5625)+"px;";
    });
  }
  else{

  }
}

//refreshes all of the icons
function loadAllIcons(){
  Quas.each(".ico", function(el){
    loadIcon(el);
  });
}

//default conceal msg
function concealDefault(){
  new ConcealOverlay("You don't have access to this page").render("body");
  setTimeout(function(){
    location.href = "/";
  }, 2000);
}

//loads the icon onto the page
function loadIcon(sel){
  let el
  if(sel.constructor == String){
    el = Quas.getEl(sel);
  }
  else{
    el = sel;
  }

  let clss = el.attr("class").split(" ");
  for(let i=0; i<clss.length; i++){
    if(clss[i].substr(0,4) === "ico-"){
      let name = clss[i].substr(4);
      let icon = icons[name];
      if(icon !== undefined){
        let iconEl = new Icon(name);
        iconEl.render(el.el, "set");
        break;
      }
    }
  }
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
      return : "json",
      success : function(res){
        new Post(res[0]).render();
        finishedLoadingPost();
      }
    });
  }
  else if(Quas.path === "my-posts"){
    let nav = Quas.getEl(".my-posts-page-nav");
    nav.addChild({
      tag : "button",
      id : "my-posts-prev",
      txt : "Prev Page",
      on : {
        click : function(){
          setPageNumber("prev");
        }
      }
    });
    nav.addChild({
      tag : "button",
      id : "my-posts-next",
      txt : "Next Page",
      on : {
        click : function(){
          setPageNumber("next");
        }
      }
    });
    genMyPosts();
  }
  else if(Quas.path === "new-post"){
    genPostTool();
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
  - m#youtube             - media embded (youtube/cooldownfeed/gyfcat/twitch)
  - ```LANG\n my code```  - code
*/
function parseMarkdown(text){
  let els = [];
  let lines = Quas.decodeHtmlSpecialChars(text).split("\n");

  let paragraph = ""; //raw text for the current paragraph
  let ignore = false; //should ignore
  let temp;
  let list = [];
  let media;
  let breakParagraph = false;
  for(let i=0; i<lines.length; i++){
    let stub = lines[i].substr(0,2);

    //temp : ignore banner
    if(lines[i].substr(0,2) === "#b"){
      i++;
    }

    //list item
    if(stub === "* "){
      breakParagraph = true;
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

    //check if makrdown on this link breaks the paragraph
    if(lines[i].charAt(0) === "#" || stub === "i#" || stub === "> " || stub === "m#"){
      //check if media embed is valid
      if(stub === "m#"){
        media = genMediaEmbed(lines[i].substr(2));
        breakParagraph = media !== undefined;
      }
      else{
        breakParagraph = true;
      }
    }

    //end of paragraph
    if(
      breakParagraph ||                             //markdown breaks the paragraph
      lines[i] === "" || i == lines.length - 1 ||   //new paragraph or last line
      (list.length > 0 && stub !== "* ")            //end of list
    ){
      if(!breakParagraph){
        paragraph += lines[i];
      }
      breakParagraph=false;

      //list
      if(list.length > 0 && stub !== "* "){
        //genList
        let listEl = {
          tag : "ul",
          children : Quas.genList(list)
        };

        //parse the links out of each list item
        for(let c in listEl.children){
          let item = listEl.children[c];
          if(item.tag === "li"){
            let itemEl = parseStrForLinks(item.txt);
            itemEl.tag = "li";
            listEl.children[c] = itemEl;
          }
          else if(item.tag === "ul"){
            let nestedItems = item.children;
            for(let cc in nestedItems){
              let itemEl = parseStrForLinks(nestedItems[cc].txt);
              itemEl.tag = "li";
              listEl.children[c].children[cc] = itemEl;
            }
          }
        }
        els.push(listEl);
        list = [];
      }

      //links and paragraphs
      let pEl = parseStrForLinks(paragraph);
      pEl.tag = "p";
      if(pEl.children.length > 0){
        els.push(pEl);
      }

      paragraph="";
    }

    //normal line
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
    else if(stub === "i#"){
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

    //media embed
    else if(stub === "m#" && media !== undefined){
        els.push(media);
    }
  }
  return els;
}

//parses the link markdown out of string and returns a json object
function parseStrForLinks(paragraph){
  let reg  = new RegExp("\\[.*?\\]\\(.*?\\)","g");
  let links = paragraph.match(reg);
  let pEl = {
    //tag : "p",
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


function checkPrivilages(callbackIfDenied){
  var privilagePages = [
    "/new-post"
  ];
  var path = window.location.pathname;
  if(privilagePages.indexOf(path) == -1){
    return;
  }
  var cookie = getCookie("session");
  if(cookie === ""){
    callbackIfDenied();
  }
  else
  {
    Quas.ajax({
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
      if(diffMins <= 1){
        str  = "1 min ago";
      }
      else{
        str = diffMins + " mins ago";
      }
    }
    else{
      if(diffHours == 1){
        str = "1 hour ago";
      }
      else{
        str = diffHours + " hours ago";
      }
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
  //console.log("val:" + Quas.getEl("#login-user").val());
  let userEl = Quas.getEl("#login-user");
  let passEl = Quas.getEl("#login-pass");
  Quas.ajax({
    url: "/php/login.php",
    type: "POST",
    data: {
      username: userEl.val(),
      password: passEl.val()
    },
    return : "json",
    success : function(data){
      if(data.constructor != String){
        //create session
        clearNotifications();
        new Notification("Logged In", 4, "success").render();
        userEl.val("");
        passEl.val("");
        Quas.getEl(".login-modal").visible(false);
        for(let key in data){
          document.cookie = key + "=" + data[key] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
        }
        loadSession();
      }
      else{
        new Notification("Login details were incorrect", 28, "error").render();
      }
    }
  });
}

//sets the session info at the top right
function loadSession(){
  var session = getCookie("session");
  if(session !== undefined){
    Quas.getEl("#login").visible(false);
    new NavSession().render(".cdf-nav-info");
    let userMenu = new UserMenu({
      "New Post" : function(){
        window.open("/new-post","_self");
      },
      "My Posts" : function(){
        window.open("/my-posts","_self");
      },
      "Log Out" : endSession,
    });
    userMenu.render("body");
    Quas.getEl(".user-menu").visible(false);
    loadIcon("#session-down-icon");
  }
}



//logs the user out of their current session
function endSession(){
  var session = getCookie("session");
  if(session !== ""){
    clearCookie("session");
    clearCookie("user_avatar");
    clearCookie("user_name");

    Quas.getEl(".session-con").del();
    Quas.getEl("#login").visible(true);
    Quas.getEl(".user-menu").visible(false);
    setTimeout(function(){
      location.reload();
    }, 1000);
    new Notification("Logged Out", 3).render();
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
  var mediaObj;
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
  else if(domain == "clips.twitch.tv"){
    let mediaSrc = "https://clips.twitch.tv/embed?clip=" + url.replace("clips.twitch.tv/","") + "&autoplay=false&tt_medium=clips_embed";
    mediaObj = {
      tag : "iframe",
      class : "video",
      src : mediaSrc,
      frameborder : "0",
      scrolling : "no",
      allowfullscreen : "true"
    }
  }
  else if(domain == "twitter.com"){
    //todo twiter embed
    return undefined;
    mediaObj = {
      tag : "div",
      class : "tweet-con",
    }

    let tweetURL = "https://publish.twitter.com/oembed?url=https://" + url;
    Quas.ajax({
      url : "/php/tweet.php",
      type : "GET",
      data :{
        tweet : tweetURL
      },
      return : "json",
      success : function(res){
        console.log(res);
        let author = res.author_name;
        let authorUrl = res.author_url;
        let tweetUrl = res.url;
        let html = res.html;
        Quas.getEl(".tweet-con").el.innerHTML = html;
      }
    });
  }
  else if(domain == ""){
    //self domain for future
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
    return undefined;
    //disabled img hosting from imgur
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

function clearNotifications(filter){
  if(filter !== undefined){
    Quas.each(".notification", function(el){
      if(el.hasCls('notification-' + filter)){
        el.visible(false);
      }
    });
  }
  else{
    Quas.each(".notification", function(el){
      el.visible(false);
    });
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
function dateToString(datestr, includeYear){
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

  let year = date[0];
  if(includeYear !== undefined && !includeYear){
    year = "";
  }

  let str = day + " " + month + ", " + year + " " + hr + ":" + min + " " + mode;
  return str;
}

//generate my-posts page
function genMyPosts(){
  let urlData = Quas.getUrlValues();
  let page = urlData["page"];
  if(page==undefined){
    page = 0;
  }
  if(page == 0){
    Quas.getEl("#my-posts-prev").visible(false);
  }
  let sid = getCookie("session");
  if(sid === ""){
    return;
  }
  Quas.ajax(
    {
    url: "/php/cdf.php",
    type: "POST",
    data: {
      type : "my-posts",
      page : page,
      sid : sid,
    },
    return : "json",
    success: function(json){
      if(json.constructor != String){
        let postList = Quas.getEl(".post-list");
        postList.clearChildren();
        for(let i=0; i<json.length; i++){
          let img = json[i]["thumbnail"];
          if(img === ""){
            img = "/temp/esl_ham.png";
          }
          if(json[i]["title"] === ""){
            json[i]["title"] = "Untitled";
          }

          json[i].img = img;
          new MyPostsItem(json[i]).render(postList);
        }
      }
      loadAllIcons();
    }
  });
}

//set page or use "prev" or "next" to increment and decrement
function setPageNumber(pageNum){
  let curPage = Quas.getUrlValues()["page"];
  if(curPage === undefined)
    curPage = 0;

  if(pageNum === "next"){
    pageNum = Number(curPage)+1;
  }
  else if(pageNum === "prev"){
    pageNum = Number(curPage)-1;
  }

  Quas.setUrlValues({"page" : pageNum});
}
