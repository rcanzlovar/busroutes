<html>
<?php

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca named get-routes.php and made the sql more restrictive
// 20160722 rca named get-trips.phpa
// 
//trips table fields
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
| shape_dist_traveled | int(11)     | NO   |     | NULL    

include_once ('dbconnect.php');
require "getlogs.php";
logit($link);



// build SQL query
$query = 
"SELECT * 
FROM trips t, stop_times st 
WHERE t.trip_id = st.trip_id 
AND t.route_id = $toute_id
";



if (isset ($_GET["trip_id"])) {
    $query .= " where trip_id = '" . $_GET["trip_id"] . "' ";
} elseif (isset ($_GET["route_id"])) {
    $query .= " where route_id = '" . $_GET["route_id"] . "' ";
}


if ($DEBUG) { echo $query ; }
//run it
$result = mysqli_query($link,$query) 
    or die('Query failed: ' . mysqli_error($link));
//$result = mysqli_query($link, $query) or die('Query failed: ');


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



// Printing results in HTML
echo "<table>\n";
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
?>

<tr><th bgcolor="<?php echo $line["route_name"]?>">  
<a href="get-stops.php?route_id=<?php echo $line["route_id"]; ?>">
    <?php echo $line["stop_name"] ?></th><th><?php echo $line["route_long_name"]; ?></a></th></tr>
<tr><td colspan=2>
<?php  echo $line["route_desc"];  ?></td></tr>
<tr><td><a href="http://www3.rtd-denver.com/schedules/getSchedule.action?routeId=<?php echo $line["route_id"]; ?>">
RTD Page for <?php echo $line["route_id"]; ?></a></td><td>
<a href="get-stops.php?route_id=<?php echo $line["route_id"]; ?>.pdf">Get Stops</a>
</td></tr>


<?php
}

echo "</table>\n";

include ('dbdisconnect.php');
?>
