<?php
$name = ''; $type = ''; $size = ''; $error = '';
   function compress_image($source_url, $destination_url, $quality) {

      $info = getimagesize($source_url);

          if ($info['mime'] == 'image/jpeg')
          $image = imagecreatefromjpeg($source_url);

          elseif ($info['mime'] == 'image/gif')
          $image = imagecreatefromgif($source_url);

          elseif ($info['mime'] == 'image/png')
          $image = imagecreatefrompng($source_url);

          echo $destination_url;
          imagejpeg($image, $destination_url, $quality);
          return $destination_url;
        }

        if ($_POST) {
            if ($_FILES["file"]["error"] > 0) {
            $error = $_FILES["file"]["error"];
        }
        else if (($_FILES["file"]["type"] == "image/gif") ||
            ($_FILES["file"]["type"] == "image/jpeg") ||
            ($_FILES["file"]["type"] == "image/png") ||
            ($_FILES["file"]["type"] == "image/pjpeg")) {

            $url = ' C:/Users/Jeoff/Documents/cdf2/temp/compressed.jpg';
            $filename = compress_image($_FILES["file"]["tmp_name"], $url, 50);
        }
        else {
            $error = "Uploaded image should be jpg or gif or png";
        }
      }
?>
<html>
    <head>
        <title>Php code compress the image</title>
    </head>
    <body>

        <div class="error">
            <?php
                if($_POST){
                  if ($error) {
            ?>
            <label class="error"><?php echo $error; ?></label>
            <?php
            }
         }
       ?>
       </div>
           <fieldset class="well">
               <legend>Upload Image:</legend>
                   <form action="" name="img_compress" id="img_compress" method="post" enctype="multipart/form-data">
                       <ul>
                           <li>
                               <label>Upload:</label>
                                   <input type="file" name="file" id="file"/>
                               </li>
                           <li>
                               <input type="submit" name="submit" id="submit" class="submit btn-success"/>
                           </li>
                       </ul>
                  </form>
           </fieldset>
     </body>
</html>
