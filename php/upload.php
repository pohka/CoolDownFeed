<?php
//uploads an image to the server
//if the user folder doesn't exist it creates it
//the image data is also added to the database
//images are saved with a unique id

  if(isset($_FILES['image'])){
    $userID = getUserID();
    if($userID != ''){
    $errors= array();
    $file_name = $_FILES['image']['name'];
    $file_size = $_FILES['image']['size'];
    $file_tmp = $_FILES['image']['tmp_name'];
    $file_type = $_FILES['image']['type'];

    $file_ext = pathinfo($file_name, PATHINFO_EXTENSION);
    $extensions= array("jpeg","jpg","png");

    //file format
    if(in_array($file_ext,$extensions) === false){
       $errors[]="extension not allowed, please choose a JPEG or PNG file.";
    }

    //max size
    if($file_size > 2097152){
       $errors[]='File size must be less than 2MB';
    }

    if(empty($errors) == true){
      $path = "/i/".$userID;
      $id = genUID();
      $loc = $path  . "/" . $id . "." . $file_ext;
      $fullPath = $_SERVER['DOCUMENT_ROOT'] . $path;

      //make directory if it doesn't exist
      if (!is_dir($fullPath)) {
           mkdir($fullPath, 0777, true);
       }

       $upload_loc = $_SERVER['DOCUMENT_ROOT'] . $loc;
       if(move_uploaded_file($file_tmp, $upload_loc)){
         //add entry to database
         addImgToDatabase($id, $userID, $id.".".$file_ext, $loc);

         //compress the image
         compressImage($upload_loc, $upload_loc);

         //make a thumnail
         $destPath = $_SERVER['DOCUMENT_ROOT'] . $path . "/" . $id . "-thumb." . $file_ext;
         resizeImage($upload_loc, 260, 146, $destPath);

         //return the img src
         echo $loc;
       }
    }
    else{
       echo "error".$errors;
    }
   }
  }


  //compresses an image and outputs it to the given destiination
  function compressImage($source_image, $dest) {
    $image_info = getimagesize($source_image);
    switch ($image_info['mime']){
      case "image/jpeg":
        $source_image = imagecreatefromjpeg($source_image);
        imagejpeg($source_image, $dest, 90);
        break;
      case 'image/png' :
        $source_image = imagecreatefrompng($source_image);
        imagepng($source_image, $dest, 6);
        break;
    };
  }

  //resize and save image
  function resizeImage($file, $w, $h, $destPath, $crop=FALSE) {
    list($width, $height) = getimagesize($file);
    $r = $width / $height; //ratio
    if ($crop) {
        if ($width > $height) {
            $width = ceil($width-($width*abs($r-$w/$h)));
        } else {
            $height = ceil($height-($height*abs($r-$w/$h)));
        }
        $newwidth = $w;
        $newheight = $h;
    } else {
        if ($w/$h > $r) {
            $newwidth = $h*$r;
            $newheight = $h;
        } else {
            $newheight = $w/$r;
            $newwidth = $w;
        }
    }

    //create and save image
    list($path, $ext)  = explode(".", $file);
    if($ext == "jpg" || $ext == "jpeg"){
      $src = imagecreatefromjpeg($file);
      $dst = imagecreatetruecolor($newwidth, $newheight);
      imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
      imagejpeg($dst, $destPath, 90);
    }
    else if($ext == "png"){
      $src = imagecreatefrompng($file);
      $dst = imagecreatetruecolor($newwidth, $newheight);
      imagecopyresampled($dst, $src, 0, 0, 0, 0, $newwidth, $newheight, $width, $height);
      imagepng($dst, $destPath, 6);
    }
}

  //generate unique identifier
  function genUID(){
  $seed = str_split('abcdefghijklmnopqrstuvwxyz'
                     .'ABCDEFGHIJKLMNOPQRSTUVWXYZ'
                     .'0123456789');
    shuffle($seed); // probably optional since array_is randomized; this may be redundant
    $rand = '';
    foreach (array_rand($seed, 5) as $k) $rand .= $seed[$k];
    return $rand;
  }

  //get user id
  function getUserID(){
    $con = mysqli_connect("cdf2","root","","cdf");
    if(mysqli_connect_errno()){
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }
    $sid = $_REQUEST['sid'];
    $sql = "SELECT user_id FROM `sessions` WHERE session_id = '" . $sid . "'";
    $userID = "";
    $result = mysqli_query($con, $sql);
    if(mysqli_num_rows($result) == 1){
      $row = mysqli_fetch_row($result);
      $userID = $row[0];
    }
    mysqli_close($con);
    return $userID;
  }

  //add image to database
  function addImgToDatabase($id, $userID, $filename, $path){
    $con = mysqli_connect("cdf2","root","","cdf");
    if(mysqli_connect_errno()){
      echo "Failed to connect to MySQL: " . mysqli_connect_error();
    }

    $sql = "INSERT INTO `images` (`id`, `userid`, `filename`, `path`) ".
            "VALUES ('{$id}', '{$userID}', '{$filename}', '{$path}')";

    mysqli_query($con, $sql);
    mysqli_close($con);
  }
?>
