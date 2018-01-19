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
?>
