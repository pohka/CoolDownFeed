<?php
  function printResult($result){
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    if(count($rows) > 0){
      print json_encode($rows);
    }
  }

  function getUserID($cookie, $con) {
    $sql = "SELECT *  FROM sessions WHERE session_id = '".$cookie . "'";
    $result = mysqli_query($con, $sql);
    while($row = mysqli_fetch_assoc($result)) {
        return $row["user_id"];
    }
  }
?>
