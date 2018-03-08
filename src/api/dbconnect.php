<?php
// dbconnect.php - keep the database connect details out of the main code. 
include 'inc/dbparams.inc.php';

// put this at the top of any code to connect to the database 
if (!isset ($link) && $DEBUG) {
    echo "link exists before dbconnect <br/>\n";
} 

if (!isset ($link)) {
    // no link, create one
    // Connecting, selecting database
    $link = mysqli_connect($dbhost, $username, $password)
        or die('Could not connect: ' . mysqli_error());

    mysqli_select_db($link,$dbname) or die('Could not select database');
} 
if (isset ($link) && $DEBUG) {
    echo "link exists after dbconnect<br/>\n";
}
?>