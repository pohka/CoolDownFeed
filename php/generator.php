<?php
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
?>
