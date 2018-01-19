<?php
  //creates a new post
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/generator.php");
  $con = connect();

  $id = genUID();
  $sid = $_REQUEST["sid"];

  //get user id from the session id
  $sql1 = "SELECT user_id FROM sessions WHERE session_id = '{$sid}'";
  $result = mysqli_query($con, $sql1);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) {
      $rows[] = $r;
  }
  if(count($rows) > 0){
     $userID = array_values($rows)[0]["user_id"];
     $sql2 =
      "INSERT INTO `posts` (`id`, `userid`, `published`) ".
      "VALUES ('{$id}', '{$userID}', '0');";
      $result = mysqli_query($con, $sql2);
      echo $id;
  }

  disconnect($con);
?>
