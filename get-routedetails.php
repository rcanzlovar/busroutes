
<html>

<?php
$page_title = "Details about route $route";

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close

include_once "dbconnect.php";
require "getlogs.php";
logit($link);


include "header.php";
?>
<body>
<?php

$route_id = $_GET["route_id"] ? $_GET["route_id"] : "BOLT"; 
// Performing SQL query
$query = "SELECT * FROM routes where routes.route_id = '$route_id'";

$result = mysqli_query($link,$query) or die('Query failed: ' . mysqli_error($link));
//$result = mysqli_query($link, $query) or die('Query failed: ');

// Printing results in HTML
echo "<table>\n";
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    echo "\t<tr>\n";
        echo "\t\t<td>$line</td>\n";
    foreach ($line as $col_value) {
        echo "\t\t<td>$col_value</td>\n";
    }
    echo "\t</tr>\n";
}
echo "</table>\n";
include "dbdisconnect.php";
?>
