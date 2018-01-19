<?php
  //reurns the cards for the home page
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();
  $sql =
    "SELECT posts.id as id, posts.path, title, ".
    "users.username as author, posts.publish_time, posts.tags, posts.banner ".
    "FROM posts INNER JOIN users on posts.userid = users.id ".
    "WHERE posts.published = 1 AND posts.publish_time < CURRENT_TIMESTAMP ".
    "ORDER BY posts.publish_time DESC";

  $result = mysqli_query($con, $sql);
  printResult($result);

  disconnect($con);
?>
