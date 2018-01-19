<?php
  //adds a post to the database
  define('__ROOT__', dirname(dirname(__FILE__)));
  require_once(__ROOT__."/php/connect.php");
  require_once(__ROOT__."/php/helper.php");
  $con = connect();
  $text  = htmlspecialchars($_REQUEST['text'], ENT_QUOTES);
  $id = $_REQUEST['id'];
  $path = $_REQUEST['path'];
  $title = $_REQUEST['title'];
  $userid = getUserID($_REQUEST['cookieid'], $con);
  $banner = $_REQUEST['banner'];

  $tags = $_REQUEST['tags'];
  $published = $_REQUEST['published'];


  $publish_time_epoch = $_REQUEST['publish_time'];
  $dt2 = new DateTime("@$publish_time_epoch");
  $publish_time = $dt2->format('Y-m-d H:i:s');

  $msg = "";
  $publish_time = "";

  //check to see if this post has been published already
  //if updating a published post,
  //use the existing publish_time
  if($published == 1){
    $checksql = "SELECT published, publish_time FROM posts WHERE id = '{$id}'";
    $result = mysqli_query($con, $checksql);
    $rows = array();
    while($r = mysqli_fetch_assoc($result)) {
        $rows[] = $r;
    }
    $data = array_values($rows)[0];

    //update existing, that is published
    //if published on server is 1 and is published in the past
    if($data["published"] == 1 && strtotime($data["publish_time"]) < time()){
        $publish_time = $data["publish_time"];
        $msg = "Updated";
    }
    else{
      if($_REQUEST["publish_time"] > time()){
        $msg = "Publish Scheduled";
      }
      else{
        $msg = "Published Now";
      }
    }
  }
  //otherwise use the given publish_time
  if($publish_time == ""){
    $publish_time_epoch = $_REQUEST['publish_time'];
    $dt2 = new DateTime("@$publish_time_epoch");
    $publish_time = $dt2->format('Y-m-d H:i:s');
    if($published != 1){
      $msg =  "Saved";
    }
  }
  echo $msg;

  $game = $_REQUEST['game'];

  $sql =
    "REPLACE INTO `posts` (`id`, `path`, `title`, `text`, `userid`, " .
    "`tags`, `published`, `publish_time`, `game`, `banner`) " .
    "VALUES ('{$id}', '{$path}', '{$title}', '{$text}', ".
      "'{$userid}', '{$tags}', '{$published}', ".
      "'{$publish_time}', '{$game}', '{$banner}')";
     mysqli_query($con, $sql);

  disconnect($con);
?>
