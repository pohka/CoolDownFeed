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
  {
    name  : "ForsenLul",
    url   : "https://i.imgur.com/87Lgrva.png"
  },
  {
    name  : "SwiftRage",
    url   : "https://i.imgur.com/d4qiZcn.png"
  },
  {
    name  : "BaffledCena",
    url   : "https://i.imgur.com/1OvkbU0.png"
  },
  {
    name  : "VRKnuckles",
    url   : "https://i.imgur.com/HcZcD5t.png"
  },
  {
    name  : "ThomasTheTank",
    url   : "https://i.imgur.com/aouzuIA.png"
  },
  {
    name  : "PogChamp",
    url   : "https://i.imgur.com/MMhwJvn.png"
  },
  {
    name  : "4Head",
    url   : "https://i.imgur.com/imBjRje.png"
  },
  {
    name  : "SeemsGood",
    url   : "https://i.imgur.com/0j5EVKJ.png"
  },
  {
    name  : "JohnCena",
    url   : "https://i.imgur.com/M0ZWGiF.png"
  },
  {
    name  : "BibleThump",
    url   : "https://i.imgur.com/dfUAsMS.png"
  },
  {
    name  : "VoHiYo",
    url   : "https://i.imgur.com/F1E2j4x.png"
  },
  {
    name  : "HeyGuys",
    url   : "https://i.imgur.com/T9MEvZR.png"
  },
  {
    name  : "TaiLolPez",
    url   : "https://i.imgur.com/j2ilxrj.png"
  },
];
