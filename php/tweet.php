<?php
  header('Access-Control-Allow-Origin: *');
  $url = $_REQUEST["tweet"];
  $json = file_get_contents($url);
  echo $json;
 ?>
