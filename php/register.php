<?php

$r_response = $_REQUEST["response"];
if(validCaptcha($r_response)){
  addUser($_REQUEST["username"], $_REQUEST["email"], $_REQUEST["pass"]);
}
else{
  echo "failed";
}

//validate the reCaptcha with a post request
function validCaptcha($r_response){
  $post_data = http_build_query(
    array(
        'secret' => '', //use .htaccess
        'response' => $r_response,
        )
    );
    $opts = array('http' =>
        array(
            'method'  => 'POST',
            'header'  => 'Content-type: application/x-www-form-urlencoded',
            'content' => $post_data
        )
    );
    $context  = stream_context_create($opts);
    $response = file_get_contents('https://www.google.com/recaptcha/api/siteverify', false, $context);
    $result = json_decode($response);
    return $result->success;
}

function addUser($username, $email, $pass){
  //add user to database
  //create session id
  //echo json_decode(kv array) with username and session_id
}



//generate unique identifier
function genUID(){
$seed = str_split('abcdefghijklmnopqrstuvwxyz'
                   .'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                   .'0123456789');
  shuffle($seed); // probably optional since array_is randomized; this may be redundant
  $rand = '';
  foreach (array_rand($seed, 5) as $k) $rand .= $seed[$k];
  return $rand;
}
?>
