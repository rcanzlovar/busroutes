<html>
<?php
include_once ('funcs.php');
include_once ('dbconnect.php');
$page_title = "Trips";
include ('header.php');
$DEBUG = 1; 

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca named get-routes.php and made the sql more restrictive
// 20160722 rca named get-trips.phpa
// 
//trios table fields
// route_id      | varchar(6) j| YES  |     | NULL    |       |
// service_id    | varchar(3)  | YES  |     | NULL    |       |
// trip_id       | int(3)      | YES  | MUL | NULL    |       |
// shape_id      | int(5)      | YES  |     | NULL    |       |
// block_id      | varchar(6)  | YES  |     | NULL    |       |
// trip_headsign | varchar(40) | NO   |     | NULL    |       |
// direction_id  | int(11)     | NO   |     | NULL    |  
//
//
// fields in routes:
// route_id         | varchar(8)   | NO   | PRI | 0       |       |
// route_short_name | varchar(25)  | YES  |     | NULL    |       |
// route_long_name  | varchar(150) | YES  | MUL | NULL    |       |
// route_type       | int(2)       | YES  |     | NULL    |       |
// route_desc       | varchar(40)  | NO   |     | NULL    |       |
// route_url        | varchar(120) | NO   |     | NULL    |       |
// route_color      | varchar(6)   | NO   |     | NULL    |       |
// route_text_color j
//
//rields for stop_times
// trip_id             | int(6)      | YES  |     | NULL    |       |
// arrival_time        | time        | YES  |     | NULL    |       |
// departure_time      | time        | YES  |     | NULL    |       |
// stop_id             | int(5)      | YES  | MUL | NULL    |       |
// stop_sequence       | int(3)      | YES  |     | NULL    |       |
// stop_headsign       | varchar(50) | NO   |     | NULL    |       |
// pickup_type         | int(11)     | NO   |     | NULL    |       |
// drop_off_type       | int(11)     | NO   |     | NULL    |       |
// shape_dist_traveled | int(11)     | NO   |     | NULL    


//FIelds for stops
// stop_id       | int(5)       | NO   | PRI | 0       |       |
// stop_code     | char(4)      | YES  |     | NULL    |       |
// stop_name     | varchar(200) | YES  | MUL | NULL    |       |
// stop_lon      | double       | YES  | MUL | NULL    |       |
// stop_lat      | double       | YES  | MUL | NULL    |       |
// stop_desc     | varchar(200) | NO   |     | NULL    |       |
// zone_id       | int(2)       | NO   |     | NULL    |       |
// stop_url      | varchar(200) | NO   |     | NULL    |       |
// location_type | int(2)       | NO   |     | NULL 

include ('get-trips.php');
include ('dbdisconnect.php');
include ('footer.php');
?>
