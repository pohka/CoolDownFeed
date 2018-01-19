<?php
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();

  $id = $_REQUEST['id'];
  $sid = $_REQUEST['sid'];
  $sql = "SELECT posts.title, users.username, users.avatar, posts.publish_time, posts.text, posts.published " .
  "FROM `posts` INNER JOIN users ON posts.userid = users.id ".
  "INNER JOIN sessions on posts.userid = sessions.user_id ".
  "WHERE posts.id = '{$id}' AND sessions.session_id = '{$sid}'";

  $result = mysqli_query($con, $sql);
  printResult($result);

  disconnect($con);
?>
