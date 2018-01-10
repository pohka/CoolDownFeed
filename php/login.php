<?php
  $con = mysqli_connect("cdf2","root","","cdf");
  if(mysqli_connect_errno())
  {
    echo "Failed to connect to MySQL: " . mysqli_connect_error();
  }

  $pass = htmlspecialchars($_REQUEST["password"]);
  $user = htmlspecialchars($_REQUEST["username"]);
  $sql = "SELECT * FROM users WHERE username = '" . $user ."' AND password = '" . $pass ."'";
  $result = mysqli_query($con, $sql);
  $rowcount = mysqli_num_rows($result);

  if($rowcount == 1)
  {
    $row = mysqli_fetch_row($result);
    $salt1 = "placeholder";
    $salt2 = "placeholder";
    $id = md5($salt1.$user.$salt2);

    $data = array(
      "session" => $id,
      "user_name" => $row[1],
      "user_avatar" => $row[2]
    );
    echo json_encode($data);
  }
  else{
    $myObj->name = "John";
    echo json_encode($myObj);
  }

  mysqli_close($con);
?>
