//navbar
class Navbar extends Comp{
  constructor(){
    super({
      tag : "div",
      class : "cdf-nav-con",
      children : [
        {
          tag : "a",
          href : "javascript:void(0);",
          class : "cdf-nav-logo skew-con noselect",
          children : [
            {
              tag : "img",
              class : "skew",
              alt : "logo",
              "data-src" : "/img/logo_nav.png"
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
                  location.href = "/login";
                }
              }
            },
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
        link : "/p/markdown-example-vx2o1x",
        active : (Quas.path == "post-example"),
      },
      {
        text : "About",
        link : "/about",
        active : (Quas.path == "about"),
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
      class : "card link " +fields.size,
      data : {
        url : fields.url,
      },
      children : [
        {
          tag : "div",
          class : "card-thumb",
          children : [{
            tag : "img",
            "data-src" : fields.img,
            "data-osrc" : Post.placeholderImg,
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
      txt : "Copyright 2017-"+new Date().getFullYear()+". Dota 2 is a registered trademark of Valve Corporation."
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

    this.bannerSrc = fields.banner;
    if(fields.banner === ""){
      this.bannerSrc = Post.placeholderImg;
    }
    let credit = new PostAuthor(fields.username, fields.avatar, fields.publish_time);
    this.addChild(credit.data);
    let els = parseMarkdown(fields.text);
    for(let i in els){
      this.addChild(els[i]);
    }
  }

  static getPathAndID(fullPath){
    let pathEl = fullPath.split("-");
    let id = pathEl.pop();
    let path = pathEl.join("-");
    return { id : id, path : path };
  }

  render(){
    super.render(".container");

    let banner = new Comp({
      tag : "div",
      class : "banner",
      children : [{
        tag : "img",
        "data-src" : this.bannerSrc
      }]
    });
    banner.render(".container", "prepend");
  }
}
Post.placeholderImg = "/temp/esl_ham.png";

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
            "data-src" : avatar
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
        },
        {
          tag : "div",
          class : "creator-underline",
          children : [{
            tag : "div",
            class : "creator-underline-color"
          }]
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
  facebook :{
    box : "0 0 448 512",
    width: "1em",
    d : "M448 56.7v398.5c0 13.7-11.1 24.7-24.7 24.7H309.1V306.5h58.2l8.7-67.6h-67v-43.2c0-19.6 5.4-32.9 33.5-32.9h35.8v-60.5c-6.2-.8-27.4-2.7-52.2-2.7-51.6 0-87 31.5-87 89.4v49.9h-58.4v67.6h58.4V480H24.7C11.1 480 0 468.9 0 455.3V56.7C0 43.1 11.1 32 24.7 32h398.5c13.7 0 24.8 11.1 24.8 24.7z"
  },
  reddit : {
    box : "0 0 512 512",
    width : "1em",
    d : "M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z"
  },
  youtube :{
    box : "0 0 576 512",
    width : "1.2em",
    d : 'M549.655 124.083c-6.281-23.65-24.787-42.276-48.284-48.597C458.781 64 288 64 288 64S117.22 64 74.629 75.486c-23.497 6.322-42.003 24.947-48.284 48.597-11.412 42.867-11.412 132.305-11.412 132.305s0 89.438 11.412 132.305c6.281 23.65 24.787 41.5 48.284 47.821C117.22 448 288 448 288 448s170.78 0 213.371-11.486c23.497-6.321 42.003-24.171 48.284-47.821 11.412-42.867 11.412-132.305 11.412-132.305s0-89.438-11.412-132.305zm-317.51 213.508V175.185l142.739 81.205-142.739 81.201z'
  },
  link : {
    box : "0 0 512 512",
    width : "1em",
    d : "M326.612 185.391c59.747 59.809 58.927 155.698.36 214.59-.11.12-.24.25-.36.37l-67.2 67.2c-59.27 59.27-155.699 59.262-214.96 0-59.27-59.26-59.27-155.7 0-214.96l37.106-37.106c9.84-9.84 26.786-3.3 27.294 10.606.648 17.722 3.826 35.527 9.69 52.721 1.986 5.822.567 12.262-3.783 16.612l-13.087 13.087c-28.026 28.026-28.905 73.66-1.155 101.96 28.024 28.579 74.086 28.749 102.325.51l67.2-67.19c28.191-28.191 28.073-73.757 0-101.83-3.701-3.694-7.429-6.564-10.341-8.569a16.037"+
        " 16.037 0 0 1-6.947-12.606c-.396-10.567 3.348-21.456 11.698-29.806l21.054-21.055c5.521-5.521 14.182-6.199 20.584-1.731a152.482 152.482 0 0 1 20.522 17.197zM467.547 44.449c-59.261-59.262-155.69-59.27-214.96 0l-67.2 67.2c-.12.12-.25.25-.36.37-58.566 58.892-59.387 154.781.36 214.59a152.454 152.454 0 0 0 20.521 17.196c6.402 4.468 15.064 3.789 20.584-1.731l21.054-21.055c8.35-8.35 12.094-19.239 11.698-29.806a16.037 16.037 0 0"+
        " 0-6.947-12.606c-2.912-2.005-6.64-4.875-10.341-8.569-28.073-28.073-28.191-73.639 0-101.83l67.2-67.19c28.239-28.239 74.3-28.069 102.325.51 27.75 28.3 26.872 73.934-1.155 101.96l-13.087 13.087c-4.35 4.35-5.769 10.79-3.783 16.612 5.864 17.194 9.042 34.999 9.69 52.721.509 13.906 17.454 20.446 27.294 10.606l37.106-37.106c59.271-59.259 59.271-155.699.001-214.959z"
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
    let avatar = getCookie("avatar");
    let userName = getCookie("username");
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
          if(isResponsiveMobile){
            Quas.getEl(".cdf-nav-filters").visible(false);
          }
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
              alt : "avatar",
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
    let uid= "note-"+genUID();
    super({
      tag : "div",
      id : uid,
      class : "notification notification-"+type,
      on : {
        //close notification by clicking it
        click : function(){
          new Element(this).visible(false);
        }
      },
      children : [
        {
          tag : "div",
          class : "notification-text",
          txt : text
        },
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

class Error404 extends Comp{
  constructor(){
    super({
      tag : "div",
      class : "error-404",
      children : [
        {
          tag : "h1",
          txt : "404"
        },
        {
          tag : "p",
          txt : "Seems like you got lost!"
        },
      ]
    });
    this.render(".container");
    Quas.getEl(".container").addCls("error-con");
  }
}

class Sharebar extends Comp{
  constructor(){
    Sharebar.created = true;
    super({
      tag : "div",
      class : "sharebar-con",
      children : [
        {
          tag : "div",
          class : "sharebar",
          children : [
            {
              tag : "a",
              class : "ico ico-facebook",
              href : "https://www.facebook.com/sharer/sharer.php?u="+window.location
            },
            {
              tag : "a",
              class : "ico ico-twitter",
              href : "https://twitter.com/home?status=Some%20good%20stuff%20"+window.location
            },
            {
              tag : "a",
              class : "ico ico-reddit",
              href : "https://www.reddit.com/submit?url="+window.location
            },
          ]
        }
      ]
    });
  }

  //handles scrolling breakpoints for sharebar
  static onscroll(viewport){
    if(!Sharebar.created) return;

    let postcon = Quas.getEl(".post-con").el;
    let h = Number(window.getComputedStyle(postcon,null).getPropertyValue("height").replace("px", ""));
    let postBottom = h + window.innerHeight;
    let postTop = 400;
    let appearH = 1000;

    if(h<1200){
      appearH = 500;
    }

    let inBanner = viewport.top < postTop;
    let afterBanner = viewport.top > postTop;
    let afterAppear = viewport.top > appearH;
    let afterBottom = viewport.bottom > postBottom+200;

    //show if after appear break point and before the bottom of the post
    //once shown the appear break point is set after the banner
    if(!Sharebar.active &&
      ((afterAppear && !Sharebar.shownOnce) || (afterBanner && Sharebar.shownOnce)) &&
      !afterBottom){
      Sharebar.active = true;
      Quas.getEl(".sharebar").active(true);
      Sharebar.shownOnce = true;
    }
    //hide if after bottom of the post or in banner
    else if(Sharebar.active && (afterBottom || inBanner)){
      Sharebar.active = false;
      Quas.getEl(".sharebar").active(false);
    }
  }

  render(){
    super.render("body");
  }
}
Sharebar.created = false;
Sharebar.active = false;
Sharebar.shownOnce = false;

let isResponsiveMobile;

//start
Quas.start = function(){
  let nav = new Navbar();
  nav.render(".cdf-nav");
  new Footer().render("footer");
  loadSession();
  quasLoadPage();


  loadAllIcons();
  checkPrivilages(concealDefault);
  window.addEventListener("resize", responsiveLayoutCheck);
  Quas.enableScrollTracker(handleScrolling);
}

//todo pause video gifs when losing focus
// document.addEventListener("visibilitychange", function() {
//     if (document.hidden){
//         console.log("Browser tab is hidden")
//     } else {
//         console.log("Browser tab is visible")
//     }
// });

function finishedLoadingPage(){
  responsiveLayoutCheck();
  lazyLoader();
}

//loads images aync
function lazyLoader(){
  [].forEach.call(document.querySelectorAll('img[data-src]'), function(img) {
    img.setAttribute('src', img.getAttribute('data-src'));
    img.onload = function() {
      img.removeAttribute('data-src');
    };
    img.onerror = function(){
      //check to see if the image was a thumbnail, if so try the original src
      if(img.getAttribute("data-osrc") !== null && img.getAttribute("data-osrc-loaded") === null){
        img.setAttribute('src', img.getAttribute('data-osrc'));
        img.setAttribute('osrc-loaded', "true");
      }
    }
  });
}

function handleScrolling(viewport){
  Sharebar.onscroll(viewport);
  lazyLoadScroll(viewport);
}

function lazyLoadScroll(viewport){
  //only play video gifs if they visible in the viewport
  let navH = 50;
  let offset = 50;
  Quas.each(".vgif", function(el){
    let top = el.prop("offsetTop");
    let h = el.prop("offsetHeight");
    let bot = top+h;
    Quas.each(".vgif", function(el){
      if(viewport.bottom-offset > top && viewport.top+navH+offset < bot){
        el.el.play();
      }
      else{
        el.el.pause();
      }
    });
  });
}

function responsiveLayoutCheck(){
  let mobileW = 900;
  let w = window.innerWidth;

  //true if changed state
  let changed = isResponsiveMobile === undefined || isResponsiveMobile != (w <= mobileW);
  isResponsiveMobile = w <= mobileW;

  //mobile
  if(isResponsiveMobile){
    //keep 16:9 ratio on videos
    Quas.each(".video", function(el){
      el.el.style = "height:"+(w*0.55)+"px;";
    });

    //cards thumbnail image keep 16:9 ratio
    Quas.each(".card-thumb", function(el){
      let curW = window.getComputedStyle(el.el).width.replace("px", "");
      el.el.style = "height:"+(Number(curW)*0.667)+"px;";
    });

    //changed state
    if(changed){
      let navLogo = Quas.getEl(".cdf-nav-logo");
      navLogo.attr("href", "javascript:void(0);toggleMobileMenu()");
    }
  }
  //PC
  else{
    if(changed){
      let navLogo = Quas.getEl(".cdf-nav-logo");
      navLogo.attr("href", "/");
      Quas.getEl(".cdf-nav-filters").el.style = "";
      Quas.each(".video", function(el){
        el.el.style = "";
      });

      Quas.each(".card-thumb", function(el){
        el.el.style = "";
      });
    }
  }
}

function toggleMobileMenu(){
  let menu = Quas.getEl(".cdf-nav-filters");
  menu.toggleVisible();
  let navLogo = Quas.getEl(".cdf-nav-logo");
  Quas.getEl(".user-menu").visible(false);
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
      url : "/php/cards-home.php",
      type : "POST",
      return : "json",
      success : function(data){
        let count = 0;
        for(let i in data){

          let img = data[i].banner;
          if(img === ""){
            img = Post.placeholderImg;
          }
          else{
            img = img.split(".").join("-thumb.");
          }

          //card sizes
          let size = "";
          if(window.innerWidth > 900){
            switch(count){
              case 0 : size = "card-lg"; break;
              case 4: size = "card-md"; break;
              case 7 : size = "card-md"; break;
              case 13: count = 0; break;
            }
            count++;
          }

          new Card({
            url : data[i].path + "-" + data[i].id,
            img : img,
            title : data[i].title,
            author : data[i].author,
            time : timeSinceString(data[i].publish_time),
            size : size,
          }).render(".card-con");
        }
        finishedLoadingPage();
      }
    });
  }
  else if(Quas.path.indexOf("p/") == 0){
    let fullPath = Quas.path.substr(2);
    let p = Post.getPathAndID(fullPath);
    Quas.ajax({
      url : "/php/post-view.php",
      type : "POST",
      data : {
        id : p.id,
        path : p.path,
      },
      return : "json",
      success : function(res){
        console.log(res);
        if(res.constructor == String){
          new Error404();
        }
        else{
          new Post(res["article"][0]).render();
          Quas.getEl(".container").addChild({
            tag : "div",
            class : "suggested-con",
            children : [
              {
                tag : "h3",
                txt : "Suggested"
              },
              {
                tag : "hr"
              }
            ]
          });
          //suggested cards
          let suggested = res["suggested"];
          for(let i in suggested){
            new Card({
              size : "",
              url : suggested[i].path + "-" + suggested[i].id,
              img : suggested[i].banner,
              title : suggested[i].title,
              author : suggested[i].username,
              time : timeSinceString(suggested[i].publish_time),
            }).render(".suggested-con");
          }
        }

        new Sharebar().render();
        loadAllIcons();
        finishedLoadingPage();
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
  else if(Quas.path === "editor"){
    genPostTool();
  }
  else if(Quas.path === "preview"){
    genDevicePreview();
  }
  else{
    finishedLoadingPage();
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
  - m#youtube             - media embded (youtube/cooldownfeed/gfycat/twitch)
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
            "data-src" : kv[0],
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
    "/editor"
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
    var diffYears = Math.floor(timeDiff / (1000 * 3600 * 24 * 30 * 12));

    if(diffMonths==0){
      str = diffDays+" days ago";
    }
    if(diffMonths==1){
      str = "1 month ago";
    }
    else if(diffMonths < 12 && diffMonths > 1){
      str = diffMonths + " months ago";
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
function login(user){
  let profile = user.getBasicProfile();
  let data = {
    google_id : profile.getId(),
    username : profile.getName(),
    avatar : profile.getImageUrl(),
    email : profile.getEmail(),
  };

  Quas.ajax({
    url: "/php/login.php",
    type: "POST",
    data: data,
    return : "json",
    success : function(res){
      document.cookie = "session=" + res["session"] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      document.cookie = "username=" + data["username"] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      document.cookie = "avatar=" + data["avatar"] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      document.cookie = "userType=" + res["type"] + "; expires=Fri, 31 Dec 9999 23:59:59 GMT; path=/";
      window.history.back();
    }
  });
}

//sets the session info at the top right
function loadSession(){
  let session = getCookie("session");
  let userType = getCookie("userType");
  if(session !== undefined){
    Quas.getEl("#login").visible(false);
    new NavSession().render(".cdf-nav-info");

    //choose the user menu items to display based on the account type
    let listItems = {};
    if(userType === "admin"){
      listItems["New Post"] =
        function(){
          window.open("/editor","_self");
        };

      listItems["My Posts"] =
        function(){
            window.open("/my-posts","_self");
        };
    }

    listItems["Log Out"] =
      function(){
          endSession();
      };

    let userMenu = new UserMenu(listItems);
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
    clearCookie("avatar");
    clearCookie("username");
    clearCookie("userType");
    location.reload();
  }
}

//clears a cookie by its key name
function clearCookie(cname){
  document.cookie = cname + "=;expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/";
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
    let poster  = "https://thumbs.gfycat.com/" + mediaID + "-mobile.jpg";
    mediaObj = {
      tag : "video",
      class : "video vgif",
      preload : "metadata",
    //  autoplay : "false",
      loop : "true",
      poster : poster,
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

//clears all notifications, filter allows to clear a cetain type of notification
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

//changes sql date string to dd-mmm-yyyy-hh-mm format
//if includeYear is true then thre year wont be included
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
  let thisYear = new Date(Date.now()).getFullYear();
  if(includeYear !== undefined && !includeYear && year == thisYear){
    year = "";
  }

  let str = day + " " + month + ", " + year + " " + hr + ":" + min + " " + mode;
  return str;
}
