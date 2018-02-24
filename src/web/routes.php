<html>
<?php

include_once ("funcs.php");
include ("header.php");
echo "<body>";

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

// http://www3.rtd-denver.com/schedules/getSchedule.action?runboardId=162&routeType=12&routeId=BOLT&serviceType=3`
// http://www3.rtd-denver.com/schedules/getSchedule.action
//?runboardId=162
//&routeType=12
//&routeId=BOLT
//&serviceType=3`
// http://www3.rtd-denver.com/schedules/getSchedule.action?routeId=BOLT

$DEBUG = 1; 

include_once ('dbconnect.php');

include "get-routes.php";
include "get-trips.php";


include ('dbdisconnect.php');
?>
