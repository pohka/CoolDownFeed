<?php
  //removes a post
  //todo: change this quuery from delete to a remove boolean
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  $con = connect();

  $postID = $_REQUEST["postID"];
  $sid = $_REQUEST["sid"];
  $sql =
  "DELETE `posts` FROM `posts` JOIN sessions on posts.userid = sessions.user_id ".
  "WHERE sessions.session_id = '{$sid}' AND posts.id = '{$postID}'";
  mysqli_query($con, $sql);

  disconnect($con);
?>
