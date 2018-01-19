<?php
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();

  $id = $_REQUEST['id'];
  $path = $_REQUEST['path'];
  $sql =
    "SELECT posts.title, users.username, users.avatar, posts.publish_time, posts.text, posts.banner " .
    "FROM `posts` INNER JOIN users ON posts.userid = users.id ".
    "WHERE posts.id = '{$id}' AND posts.path = '{$path}'";

  $article = mysqli_query($con, $sql);

  $suggestedCount = 3;
  $sqlSuggested =
  "SELECT posts.title, users.username, posts.publish_time, posts.banner, posts.path, posts.id ".
  "FROM posts INNER JOIN users ON posts.userid = users.id ".
  "WHERE posts.id != '{$id}' AND posts.published = 1 ".
  "ORDER BY posts.publish_time DESC ".
  "LIMIT {$suggestedCount}";

  $suggested = mysqli_query($con, $sqlSuggested);

  print '{"article":';
  printResult($article);
  print ',"suggested":';
  printResult($suggested);
  print "}";

  disconnect($con);
?>
