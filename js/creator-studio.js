//list item for posts in my-post page
class MyPostsItem extends Comp{
  constructor(data){
    let url = data.path+"-"+data.id;
    let uid = genUID();
    super({
      tag : "div",
      class : "post-list-item",
      id : "item-" + uid,
      children : [
        {
          tag : "img",
          "data-src" : data.img,
          data : {
            url : url
          },
          on : {
            mousedown : function(e){
              MyPostsItem.openPost(e.which, this.getAttribute("data-url"));
            }
          },
        },
        {
          tag : "div",
          class : "post-item-info",
          children :[
            {
              tag : "h3",
              class : "post-item-title",
              txt : data.title,
              data : {
                url : url
              },
              on : {
                mousedown : function(e){
                  MyPostsItem.openPost(e.which, this.getAttribute("data-url"));
                }
              },
            },
            {
              tag : "div",
              class : "post-item-date",
              txt : dateToString(data.publish_time)
            },
            {
              tag : "a",
              href : "/editor?p="+data.id,
              class : "post-item-edit",
              txt : "Edit",
            },
            {
              tag : "div",
              class : "post-item-more ico ico-caret-down noselect",
              on : {
                click : function(){
                  let el = new Element(this);
                  el.active();
                  Quas.getEl("#menu-" + uid).visible(el.hasCls("active"));
                }
              }
            },
            {
              tag : "div",
              class : "post-item-more-menu noselect",
              id : "menu-" + uid,
              children : [
                {
                  tag : "div",
                  txt : "- temp -"
                },
                {
                  tag : "div",
                  txt : "Delete",
                  on : {
                    click : function(){
                      MyPostsItem.deletePost(data.id, uid);
                    }
                  }
                }
              ]
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
              data : {
                url : url
              },
              on : {
                mousedown : function(e){
                  Quas.preventDefault(e);
                  console.log(this.getAttribute("data-url"));
                }
              }
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
              data : {
                url : url
              },
              on : {
                mousedown : function(e){
                  Quas.preventDefault(e);
                  console.log(this.getAttribute("data-url"));
                }
              }
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

  static openPost(btn, url){
    let path = "/p/"+ url;
    let type = "_self";
    if(btn == 1){
      window.open(path, "_self");
    }
    else if(btn == 2){
      window.open(path);
    }
  }

  //deletes a post
  static deletePost(id, itemUID){
    Quas.ajax({
      url : "/php/cdf.php",
      type : "POST",
      data : {
        type : "post-remove",
        postID : id,
        sid : getCookie("session")
      },
      success : function(res){
        Quas.getEl("#item-" + itemUID).del();
        new Notification("Deleted Post", 3).render();
      }
    })
  }
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
          let img = json[i]["banner"];
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
      finishedLoadingPage();
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
