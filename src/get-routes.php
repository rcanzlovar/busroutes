<?php
// get-routes.php
//
// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca named get-routes.php and made the sql more restrictive
//
// fields in routes:
// route_id         | varchar(8)   | NO   | PRI | 0       |       |
// route_short_name | varchar(25)  | YES  |     | NULL    |       |
// route_long_name  | varchar(150) | YES  | MUL | NULL    |       |
// route_type       | int(2)       | YES  |     | NULL    |       |
// route_desc       | varchar(40)  | NO   |     | NULL    |       |
// route_url        | varchar(120) | NO   |     | NULL    |       |
// route_color      | varchar(6)   | NO   |     | NULL    |       |
// route_text_color 
//
// http://www3.rtd-denver.com/schedules/getSchedule.action?runboardId=162&routeType=12&routeId=BOLT&serviceType=3`
// http://www3.rtd-denver.com/schedules/getSchedule.action
//?runboardId=162
//&routeType=12
//&routeId=BOLT
//&serviceType=3`
// http://www3.rtd-denver.com/schedules/getSchedule.action?routeId=BOLT
#############

$DEBUG = 1; 

$page_title = "Routes page";
include_once ("funcs.php");
include_once ('dbconnect.php');
include ("header.php");

require "getlogs.php";
logit($link);

// build SQL query
$query = 'SELECT * FROM routes';
if ($_GET["route_id"]) {
    $query .= " where route_id = '" . $_GET["route_id"] . "'";
}

show_query($query);

//run it
$result = mysqli_query($link,$query) or 
    die('Query failed: ' . mysqli_error($link));
?>
<table>
<?php
// Printing results in HTML
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
?>
<tr><th>  
<a href="trips.php?route_id=<?php 
    echo $line["route_id"]; 
?>"><?php

// start colorcoded route block
        echo "\t<div style='width:100;color:#" .
            $line["route_text_color"] . ";" .  
            "background-color:#" . $line["route_color"] . ";" .
            "'>" . 
            $line["route_short_name"] .
            "</div> ";
// end colorcoded route block
?></a></th><th><?php echo $line["route_long_name"]; ?></a></th></tr>
<tr><td colspan=2>
<?php  echo $line["route_desc"];  ?></td></tr>
<tr><td><a href="http://www3.rtd-denver.com/schedules/getSchedule.action?routeId=<?php 
    echo $line["route_id"]; 
?>">RTD Page for <?php 
    echo $line["route_id"]; 
?></a></td><td><a href="trips.php?route_id=<?php 
    echo $line["route_id"]; 
?>">Get Trips</a></td></tr>
<?php
}

echo "</table>\n";
include ("footer.php");
?>
