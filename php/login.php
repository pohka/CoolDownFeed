<?php
  $con = mysqli_connect("cdf2","root","","cdf");
  if(mysqli_connect_errno())
  {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $sql = "SELECT * FROM users WHERE username = '" . htmlspecialchars($_POST["username"]) ."' AND password = '" . htmlspecialchars($_POST["password"]) ."'";
  $result = mysqli_query($con, $sql);
  $rowcount = mysqli_num_rows($result);

  if($rowcount == 1)
  {
    echo "success";
  }

  mysqli_close($con);
?>
