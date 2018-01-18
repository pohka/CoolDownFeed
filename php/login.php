<?php

define('__ROOT__', dirname(dirname(__FILE__)));
require_once(__ROOT__.'/php/generator.php');

  $con = mysqli_connect("cdf2","root","","cdf");
  if(mysqli_connect_errno()){
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $google_id = $_REQUEST["google_id"];
  $username = $_REQUEST["username"];
  $avatar = $_REQUEST["avatar"];
  $email = $_REQUEST["email"];


  $sql = "SELECT * FROM users WHERE google_id = '{$google_id}'";
  $result = mysqli_query($con, $sql);
  $rowcount = mysqli_num_rows($result);

  $newUser = false;
  $userID;
  $userType;

  if($rowcount == 1)
  {
    //update avatar and username
    $row = $result->fetch_assoc();
    $updateSQL =
    "UPDATE `users` SET `username` = '{$username}', `avatar` = '{$avatar}' ".
    "WHERE `users`.`google_id` = '{$google_id}';";
    mysqli_query($con, $updateSQL);

    $userID = $row["id"];
    $userType = $row["account_type"];
  }
  else{
    //insert new user
    $userID = genUID();
    $addSQL =
    "INSERT INTO `users` (`id`, `username`, `avatar`, `email`, `account_type`, `google_id`) ".
    "VALUES ('{$userID}', '{$username}', '{$avatar}', '{$email}', 'user', '{$google_id}');";
    mysqli_query($con, $addSQL);
    $newUser = true;
    $userType = "user";
  }

  //create session token
  $salt1 = "placeholder";
  $salt2 = "placeholder";
  $sid = md5($salt1.$userID.$salt2);

  $sessionSQL = "INSERT INTO `sessions` (`session_id`, `user_id`, `timestamp`) VALUES ('{$sid}', '{$userID}', CURRENT_TIMESTAMP);";
  mysqli_query($con, $sessionSQL);

  //return result
  $array = [
      "newUser" => $newUser,
      "session" => $sid,
      "type"    => $userType,
  ];

  echo json_encode($array);

  mysqli_close($con);
?>
