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
});


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
