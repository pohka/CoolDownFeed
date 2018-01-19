<?php
 function connect(){
   $con = mysqli_connect("cdf2","root","","cdf");
   if(mysqli_connect_errno())
   {
     echo "Failed to connect to MySQL: " . mysqli_connect_error();
   }
   date_default_timezone_set('UTC');
   return $con;
 }

 function disconnect($con){
   mysqli_close($con);
 }
?>
