<?php
$con = mysqli_connect("cdf2","root","","cdf");
if(mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

$sql = "";
switch($_POST["type"]){
  case "cards-home" :
    $sql =
      "SELECT cards.id, cards.title, cards.description, " .
      "users.username as author, cards.publish_time, cards.tags " .
      "FROM cards JOIN users ON users.id = cards.userid " .
      "WHERE cards.published = 1";
      break;
   case "image-upload" :
      $userID = $_POST['userid'];
      $name = $_POST['name'];
      $ext = $_POST['ext'];
      $uid = $_POST['uid'];
      $sql =
        "INSERT INTO `images` (`id`, `userid`, `name`, `extension`, `file`, `tag`) " .
        "VALUES (NULL, '" . $userID ."', '" . $name . "', '" . $ext . "', '" . $uid . "', '')";
      echo $sql;
      break;
    case "user-images" :
      $sql = "SELECT * FROM `images` WHERE `userid`= " . $_POST['userid'];
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
  if(count($rows) > 0)
    print json_encode($rows);
}

mysqli_close($con);
?>
