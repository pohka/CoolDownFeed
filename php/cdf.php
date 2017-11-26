<?php
$con = mysqli_connect("cdf2","root","","cdf");
if(mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql = "";
switch($_POST["type"]){
  case "cards-home" :
    $sql =  "SELECT cards.id, cards.title, cards.description, " .
            "users.username as author, cards.timestamp, cards.tags" .
            " FROM cards JOIN users ON users.id = cards.userid";
          break;
}

//echo $sql;

if($sql != "")
{
  $result = mysqli_query($con, $sql);
  $rows = array();
  while($r = mysqli_fetch_assoc($result)) {
      $rows[] = $r;
  }
  print json_encode($rows);
}

mysqli_close($con);
?>
