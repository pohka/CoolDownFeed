<?php
  //returns the user images
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();
  $sql = "SELECT * FROM `images` WHERE `userid`= '" .
          getUserID($_REQUEST['userid'], $con) . "' ORDER BY timestamp DESC";

  $result = mysqli_query($con, $sql);
  printResult($result);

  disconnect($con);
?>
