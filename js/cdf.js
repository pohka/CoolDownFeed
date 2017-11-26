$(document).ready(function() {

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

  var card = genCard({
    id : "1",
    img : "/temp/esl_ham.png",
    title : "Frostivus Update",
    desc :"I was working on a couple projects in the past few weeks",
    author : "Pohka",
    time : "25 Nov",
    tags : "Esl hamberg,infographic,stats"
  });
  $(".card-con").append(card.get());
});

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

  var cardTime = new Obj({
    tag : "div",
    class : "card-time",
    content : data["time"]
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
    res += ">";
    if(this.kv["tag"] !== "img"){
      res += "\n";
    }

    if(this.kv["content"] != undefined){
      res += this.kv["content"];
    }
    for(var i in this.children){
      res+=this.children[i].get();
    }

    res += "</"+this.kv["tag"]+">\n";
    return res;
  }
}

Obj.identifiers = ["id", "class", "src"];
