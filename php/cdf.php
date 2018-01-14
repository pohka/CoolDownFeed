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
switch($_REQUEST["type"]){
  case "cards-home" :
    $sql =
      "SELECT posts.id as id, posts.path, title, ".
      "users.username as author, posts.publish_time, posts.tags, posts.thumbnail ".
      "FROM posts INNER JOIN users on posts.userid = users.id ".
      "ORDER BY posts.publish_time DESC";
      break;
    case "user-images" :
      $sql = "SELECT * FROM `images` WHERE `userid`= '" . getUserID($_REQUEST['userid'], $con) . "' ORDER BY timestamp DESC";
      break;
    case "add-post" :
      $text  = htmlspecialchars($_REQUEST['text'], ENT_QUOTES);
      $id = $_REQUEST['id'];
      $path = $_REQUEST['path'];
      $title = $_REQUEST['title'];
      $userid = getUserID($_REQUEST['cookieid'], $con);

      $timestamp_epoch  = $_REQUEST['timestamp'];
      $dt = new DateTime("@$timestamp_epoch");
      $timestamp = $dt->format('Y-m-d H:i:s');

      $tags = $_REQUEST['tags'];
      $published = $_REQUEST['published'];

      $publish_time_epoch = $_REQUEST['publish_time'];
      $dt2 = new DateTime("@$publish_time_epoch");
      $publish_time = $dt2->format('Y-m-d H:i:s');

      $game = $_REQUEST['game'];

      $sql1 =
        "INSERT INTO `posts` (`id`, `path`, `title`, `text`, `userid`, " .
        "`timestamp`, `tags`, `published`, `publish_time`, `game`) " .
        "VALUES ('{$id}', '{$path}', '{$title}', '{$text}', ".
          "'{$userid}', '{$timestamp}', ".
          "'{$tags}', '{$published}', ".
          "'{$publish_time}', '{$game}')";
         mysqli_query($con, $sql1);
         echo "success";
      break;

    case "post-view" :
      $id = $_REQUEST['id'];
      $path = $_REQUEST['path'];
      $sql =
        "SELECT posts.title, users.username, users.avatar, posts.publish_time, posts.text " .
        "FROM `posts` INNER JOIN users ON posts.userid = users.id ".
        "WHERE posts.id = '{$id}' AND posts.path = '{$path}'";
      break;
    case "my-posts" :
      $sid = $_REQUEST['sid'];
      $page = $_REQUEST['page'];
      $itemsPerPage = 25;
      $offset = $itemsPerPage * $page;
      $sql =
        "SELECT * FROM `posts` join sessions on posts.userid = sessions.user_id ".
        "WHERE sessions.session_id = '{$sid}' " .
        "ORDER BY `posts`.`publish_time` DESC LIMIT {$offset},{$itemsPerPage}";
      break;
    case "post-edit-open" :
      $id = $_REQUEST['id'];
      $path = $_REQUEST['path'];
      $sid = $_REQUEST['sid'];
      $sql = "SELECT posts.title, users.username, users.avatar, posts.publish_time, posts.text, posts.published " .
      "FROM `posts` INNER JOIN users ON posts.userid = users.id ".
      "INNER JOIN sessions on posts.userid = sessions.user_id ".
      "WHERE posts.id = '{$id}' AND posts.path = '{$path}' AND sessions.session_id = '{$sid}'";
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
