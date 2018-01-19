<?php
//reurns the cards for the home page
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();

  $sid = $_REQUEST['sid'];
  $page = $_REQUEST['page'];
  $itemsPerPage = 25;
  $offset = $itemsPerPage * $page;
  $sql =
    "SELECT * FROM `posts` join sessions on posts.userid = sessions.user_id ".
    "WHERE sessions.session_id = '{$sid}' " .
    "ORDER BY `posts`.`publish_time` DESC LIMIT {$offset},{$itemsPerPage}";

  $result = mysqli_query($con, $sql);
  printResult($result);

  disconnect($con);
?>
