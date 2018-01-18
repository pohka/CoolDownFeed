
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
