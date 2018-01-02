$(document).ready(function() {
   $("input:text:visible:first").focus();

  for(let i=0; i<emotes.length; i++){
    addRow(emotes[i]);
  }

  $(document).on("click", "tr", function(){
    let url = $(this).data("url");
    var copyText = document.getElementById("hidden-field");
    copyText.value = url;
    copyText.select();
    document.execCommand("Copy");
    showCopyNofication();
  });

  $(document).on("input", "#emote-search", function(){
    clearTable();
    let input = $(this).val().toLowerCase();

    //show all
    if(input == ""){
      for(let i=0; i<emotes.length; i++){
        addRow(emotes[i]);
      }
    }
    else{
      for(let i=0; i<emotes.length; i++){
        if(emotes[i]["name"].toLowerCase().indexOf(input) > -1){
          addRow(emotes[i]);
        }
      }
    }
  });
});

function clearTable(){
  $("#emotes-table").html('<tr><th>Name</th><th>Emote</th></tr>');
}

function addRow(data){
  bwe.append("#emotes-table", {
    tag : "tr",
    data :[{
      url : data["url"],
    }],
    children : [
      {
        tag : "td",
        con : data["name"],
      },
      {
        tag : "td",
        class : "emote-img",
        children : [{
          tag : "img",
          src : data["url"],
        }]
      }
    ]
  });
}

let copyCount = 0;
function showCopyNofication(){
  copyCount+=1;
  let noteID = 'note-'+copyCount;
  $(".notifications").prepend('<div id="'+noteID+'">Copied to Clipboard</div>');
  setTimeout(function(){
    $("#"+noteID).remove();
  }, 3000);
}

let emotes = [
  {
    name  : "MonkaGiga",
    url   : "https://i.imgur.com/q8ow19U.png",
  },
  {
    name  : "FeelsBadMan",
    url   : "https://i.imgur.com/1L082jB.png"
  },
  {
    name  : "haHaa",
    url   : "https://i.imgur.com/yZRAjss.png",
  },
  {
    name  : "Jebaited",
    url   : "https://i.imgur.com/IAwd1cE.png",
  },
  {
    name  : "Kappa",
    url   : "https://i.imgur.com/nE2HoaS.png",
  },
  {
    name  : "Reeee",
    url   : "https://i.imgur.com/2LlUKgS.png",
  },
  {
    name  : "Thonking",
    url   : "https://i.imgur.com/BxV7ofW.png",
  },
  {
    name  : "Valve",
    url   : "https://i.imgur.com/mx0BAxo.png",
  },
  {
    name  : "WutFace",
    url   : "https://i.imgur.com/2xY5jVy.png",
  },
];
