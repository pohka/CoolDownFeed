<?php

$con = mysqli_connect("cdf2","root","","cdf");
if(mysqli_connect_errno())
{
  echo "Failed to connect to MySQL: " . mysqli_connect_error();
}

function getUserID($cookie, $con) {
  $sql = "SELECT *  FROM sessions WHERE session_id = '".$cookie . "'";
  $result = mysqli_query($con, $sql);
  while($row = mysqli_fetch_assoc($result)) {
      return $row["user_id"];
  }
}


date_default_timezone_set('UTC');
$sql = "";
switch($_POST["type"]){
  case "cards-home" :
    $sql =
      "SELECT cards.id, cards.title, cards.description, " .
      "users.username as author, cards.publish_time, cards.tags " .
      "FROM cards JOIN users ON users.id = cards.userid " .
      "WHERE cards.published = 1 " .
      "ORDER BY cards.publish_time DESC";
      break;
   case "image-upload" :
      $userID = getUserID($_POST['cookieid'], $con);
      $name = $_POST['name'];
      $ext = $_POST['ext'];
      $uid = $_POST['uid'];
      $sql =
        "INSERT INTO `images` (`id`, `userid`, `name`, `extension`, `file`, `tag`) " .
        "VALUES (NULL, '" . $userID ."', '" . $name . "', '" . $ext . "', '" . $uid . "', '')";
      echo $sql;
      break;
    case "user-images" :
      $sql = "SELECT * FROM `images` WHERE `userid`= '" . getUserID($_POST['userid'], $con) . "'";
      break;
    case "add-post" :
      $text  = htmlspecialchars($_POST['text'], ENT_QUOTES);
      $id = $_POST['id'];
      $title = $_POST['title'];
      $desc = $_POST['desc'];
      $userid = getUserID($_POST['cookieid'], $con);

      $timestamp_epoch  = $_POST['timestamp'];
      $dt = new DateTime("@$timestamp_epoch");
      $timestamp = $dt->format('Y-m-d H:i:s');

      $tags = $_POST['tags'];
      $published = $_POST['published'];

      $publish_time_epoch = $_POST['publish_time'];
      $dt2 = new DateTime("@$publish_time_epoch");
      $publish_time = $dt2->format('Y-m-d H:i:s');


      $game = $_POST['game'];

      $sql1 =
        "INSERT INTO `cards` (`id`, `title`, `description`, `userid`, " .
        "`timestamp`, `tags`, `published`, `publish_time`, `game`) " .
        "VALUES ('" . $id . "', '" . $title. "', '" . $desc . "', " .
          $userid . ", '" . $timestamp . "', '" .
          $tags . "', '" . $published . "', '" .
          $publish_time . "', '" . $game . "'); ";
      $sql2 =
          "INSERT INTO `posts` (`id`, `title`, `text`) " .
          "VALUES ('" . $id . "', '" . $title . "', '" . $text . "')";

          mysqli_query($con, $sql1);
          mysqli_query($con, $sql2);
          echo "success";
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
