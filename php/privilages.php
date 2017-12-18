<?php
  $con = mysqli_connect("cdf2","root","","cdf");
  if(mysqli_connect_errno())
  {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $page = htmlspecialchars($_POST["page"]);
  $sessionID = htmlspecialchars($_POST["session_id"]);

  $sql =
    "SELECT users.account_type FROM sessions ".
    "INNER JOIN users on sessions.user_id = users.id ".
    "WHERE session_id = '". $sessionID . "'";

  $result = mysqli_query($con, $sql);
  if(mysqli_num_rows($result) == 1)
  {
    $row = mysqli_fetch_row($result);
    $account_type = $row[0];
    $checkSql = "SELECT ".$account_type." FROM privilages WHERE page = '".$page."'";

    $accResult = mysqli_query($con, $checkSql);
    if(mysqli_num_rows($accResult) == 1){
      $accRow = mysqli_fetch_row($accResult);
      if($accRow[0] == 1){
        echo "true";
      }
      else{
        echo "false";
      }
    }
    else{
      echo "account type not found";
    }
  }
  else{
    echo "login session not found";
  }

  mysqli_close($con);
 ?>
