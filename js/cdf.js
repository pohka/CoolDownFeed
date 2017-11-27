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

});

function loadPage(){
  var pageType = "";
  var path = window.location.pathname;
  if(path === "/" || path === "/index"){
    pageType = "cards-home";
  }

  $.post( "php/cdf.php", {
    type : pageType
    }).done(function( data ) {
      if(data != "") {
        var obj = JSON.parse(data);
        for(var i in obj){
          //console.log(obj[i]);

          var card = genCard({
            id : obj[i]["id"],
            img : "/temp/esl_ham.png",
            title : obj[i]["title"],
            desc : obj[i]["description"],
            author : obj[i]["author"],
            time : obj[i]["timestamp"],
            tags : obj[i]["tags"],
          });

          $(".card-con").append(card.get());
        }
      }
    });
}

function genCard(data){
  var card = new Obj({
    tag : "div",
    class : "card"
  });

  var cardThumb = new Obj({
    tag : "div",
    class : "card-thumb"
  });

  var thumnail  = new Obj({
    tag : "img",
    src : data["img"]
  });

  var info = new Obj({
    tag : "div",
    class : "card-info"
  });

  var wrapper = new Obj({
    tag : "div",
    class : "card-title-and-desc"
  });

  var cardTitle = new Obj({
    tag : "div",
    class : "card-title",
    content : data["title"]
  });

  var cardDesc = new Obj({
    tag : "div",
    class : "card-desc",
    content : data["desc"]
  });

  var cardAuthor = new Obj({
    tag : "div",
    class : "card-author",
    content : data["author"]
  });

  var timeString = timeSinceString(data["time"]);
  var cardTime = new Obj({
    tag : "div",
    class : "card-time",
    content : timeString
  });

  var cardTagCon = new Obj({
    tag : "div",
    class : "card-tag-con"
  });

  var els = data["tags"].split(",");
  for(var i in els){
    cardTagCon.add(
      new Obj({
        tag : "div",
        class : "tag card-tag",
        content : els[i]
      })
    );
  }

  cardThumb.add(thumnail);
  wrapper.add([cardTitle,cardDesc]);
  info.add([wrapper, cardAuthor, cardTime, cardTagCon]);
  card.add([cardThumb, info]);
  card.addData("url", data["id"]);
  return card;
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
    if(key.equals("class")){
      this.kv[key] += ", ";
    }
    this.kv[key] += val;
  }

  //sets a KV
  set(key, val){
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
      var key = Obj.identifiers[i]
      if(this.kv[key] != undefined)
        res += " " + key + "='" + this.kv[key] + "'";
    }

    if(this.data != undefined){
      for(var key in this.data){
        res += " data-" + key + "= '" + this.data[key] + "'";
      }
    }

    if(this.kv["tag"] === "img"){
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

    if(this.kv["tag"] !== "img"){
      res += "</"+this.kv["tag"]+">\n";
    }
    return res;
  }
}

Obj.identifiers = ["id", "class", "src"];

//post markdown converter
function genHtmlFromRaw(raw){
  var markdown = {
    banner : "!b>",
    heading1 : "!1#",
    heading2 : "!2#",
    quote : "> "
  }

  var lines = raw.split("\n");

  var index = lines[0].indexOf(markdown["banner"]) + markdown["banner"].length;
  var bannerSrc = lines[0].substr(index);

  var banner = new Obj({
    tag : "img",
    class : "banner",
    src : bannerSrc
  });

  $(".container").html(banner.get());

  var post = new Obj({
    tag : "div",
    class : "post-con"
  });
  for(var i=1; i<lines.length; i++){
    for(var key in markdown){
      var index = lines[i].indexOf(markdown[key]);
      if(index >= 0 ){
        var content = lines[i].substr(index + markdown[key].length);
        var data;
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


        post.add(new Obj(data));
      }
    }
  }

  $(".container").append(post.get());
}
