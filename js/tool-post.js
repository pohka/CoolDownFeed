var cursorPosition=0;

$(document).ready(function() {
  //track cursor postion
  $("#post-editor").on("click keyup paste change", function(){
    cursorPosition = $('#post-editor').prop("selectionStart");
  });

  //toggles between edit and preview mode
  $(".toolbar-mode").click(function(){
    toggleToolMode(this);
  });

  //clicks for toolbar item
  $(".toolbar-btn-sm").click(function(){
    if($(this).hasClass('active')){
      closeToolModals();
    }
    else{
      openToolOption(this);
      $(".toolbar-btn-sm").each(function(){
        $(this).removeClass('active');
      });
      $(this).addClass('active');
    }
  });

  //allows single input fields to be submitted with enter key
  $(".singleInput").on('keyup', function (e) {
    if (e.keyCode == 13) {
        $(this).next().focus();
        if($(this).val() == "Add"){
          $(this).click();
        }
      }
  });

  //closes all modals when the escape button is pressed
  $(document).on("keyup", function(e){
    if(e.keyCode == 27){
      closeToolModals();
    }
  });

  //button for sumbitting toolbar modal
  $(".post-tool-submit").click(function(){
    var type = $(this).data("type");
    addMarkdownToEditor(type);
    closeToolModals();
    $("#post-editor").focus();
  });

  //validate file from directory (max is 2MB)
  $(':file').on('change', function(event) {
    var file = this.files[0];
    if (file.size > 1024 * 1024 * 2) {
        alert('max upload size is 2MB')
        $(this).val("");
    }
    else{
      var files = event.target.files;
      upload(files);
    }
  });
});

//alerts the user before the close the window if they haven't saved their draft
window.onbeforeunload = function(){
  if($("#post-editor").val().length > 0 && window.location.hostname !== "cdf2")
    return 'Any unsaved changes will not be saved?';
};

//generate the preview
function genPreview(){
  var raw = "";
  var banner = $("#post-editor-banner").val().trim();

  if(banner!== "" && imageExists(banner)){
    raw += "!b>" + banner + "\n";
  }
  else {
    raw += "!b>/img/placeholder_banner.png\n";
  }

  var title = $("#post-editor-title").val().trim();
  if(title != ""){
    raw += "!1#" + title + "\n";
  }
  else{
    raw += "!1#Some Title\n";
  }
  raw += $("#post-editor").val();

  var html = genHtmlFromRaw(raw);
  $(".container").html(html);
}

//toggles the mod of the tools
function toggleToolMode(selector){
  $(".toolbar-mode").each(function(){
    if($(this).hasClass('active')){
      $(this).removeClass('active');
    }
  });
  $(selector).addClass('active');

  var id = $(selector).attr("id");

  if(id === "mode-editor"){
    $(".post-preview").hide();
    $(".post-raw-edit").show();
  }
  else if(id === "mode-preview"){
    $(".post-preview").show();
    $(".post-raw-edit").hide();
    genPreview();
  }
}

//closes all the modals
function closeToolModals(){
  $(".post-tool-modal").each(function(){
    $(this).hide();
  });
  $(".toolbar-btn-sm").each(function(){
    $(this).removeClass('active');
  });
}

//opens the a tool option
function openToolOption(thisSel){
  var type = $(thisSel).attr("id").replace("post-add-", "");
  var selector = "#post-tool-" + type;
  if($(selector).length > 0){
    closeToolModals();
    $(selector).show();

    var focus = selector + "-focus";
    $(focus).focus();
  }
}

//returns true if the image exists
function imageExists(url)
{
   var img = new Image();
   img.src = url;
   return img.height != 0;
}

//adds markdown to editor textarea from the fields in the toolbar modal
function addMarkdownToEditor(type){
  var fields = getFieldsForModalType(type);
  var res = "";
  if(type === "link"){
    res = " [" + fields["text"] + "](" + fields["link"] + ") ";
  }
  else if(type === "heading"){
    res = "!2#" + fields["text"] + "\n";
  }
  else if(type === "list"){
    var items = fields["text"].split("\n");
    for(var i in items)
      res += "* " + items[i] + "\n";
  }
  else if(type === "media"){
    var url = fields["url"].trim();
    if(url !== ""){
      res = "!m>" + url + "\n";
    }
    else {
      //console.log("file:" + fields["file"]);
      //upload();
    }
  }

  var curText = $("#post-editor").val();
  var newText = curText.substr(0,cursorPosition) + res + curText.substr(cursorPosition+1);
  $("#post-editor").val(newText);
}

//returns a KV array with each of the fields and also clears the fields for this type
function getFieldsForModalType(type){
  var fields = {};
  $(".add-" + type).each(function(){
    var field = $(this).data("field");
    var val = $(this).val();
    fields[field] = val;
    $(this).val("");
  });
  return fields;
}

function upload(files){
  // var data = new FormData();
  //   $.each(files, function(key, value)
  //   {
  //       data.append(key, value);
  //   });
  //
  //   $.ajax({
  //       url: '/php/upload.php?files',
  //       type: 'POST',
  //       data: data,
  //       cache: false,
  //       dataType: 'json',
  //       processData: false, // Don't process the files
  //       contentType: false, // Set content type to false as jQuery will tell the server its a query string request
  //       success: function(data, textStatus, jqXHR)
  //       {
  //           if(typeof data.error === 'undefined')
  //           {
  //               // Success so call function to process the form
  //               submitForm(event, data);
  //           }
  //           else
  //           {
  //               // Handle errors here
  //               console.log('ERRORS: ' + data.error);
  //           }
  //       },
  //       error: function(jqXHR, textStatus, errorThrown)
  //       {
  //           // Handle errors here
  //           console.log('ERRORS: ' + textStatus);
  //           // STOP LOADING SPINNER
  //       }
  //   });

  // var file_data = $('#add-media-file').prop('files')[0];
  // var form_data = new FormData();
  // form_data.append('file', file_data);
  // alert(form_data);
  // $.ajax({
  //             url: '/php/upload.php', // point to server-side PHP script
  //             dataType: 'text',  // what to expect back from the PHP script, if anything
  //             cache: false,
  //             contentType: false,
  //             processData: false,
  //             data: form_data,
  //             type: 'post',
  //             success: function(php_script_response){
  //                 alert(php_script_response); // display response from the PHP script, if any
  //             }
  //  });

  // $.ajax({
  //       // Your server script to process the upload
  //       url: '/php/upload.php',
  //       type: 'POST',
  //
  //       // Form data
  //       data: new FormData($('#add-media-file')),
  //
  //       // Tell jQuery not to process data or worry about content-type
  //       // You *must* include these options!
  //       cache: false,
  //       contentType: false,
  //       processData: false,
  //
  //       // Custom XMLHttpRequest
  //       xhr: function() {
  //           var myXhr = $.ajaxSettings.xhr();
  //           if (myXhr.upload) {
  //               // For handling the progress of the upload
  //               myXhr.upload.addEventListener('progress', function(e) {
  //                   if (e.lengthComputable) {
  //                       $("#media-progress").width(e.loaded + "%")
  //                       $('progress').attr({
  //                           value: e.loaded,
  //                           max: e.total,
  //                       });
  //                   }
  //               } , false);
  //           }
  //         //  $("#media-progress").hide();
  //
  //           return myXhr;
  //       },
  //   }).done(function( data ) {
  //     console.log(data);
  //     console.log("--end--")
  //   });
}
