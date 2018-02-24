<?php
$DEBUG = 1;
 require "funcs.php";
 require "getlogs.php";

include_once "dbconnect.php";

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
//20160723 rca added style and made the page pretty, added stop name to the query
//		added header
// 20160804 added loggig

$page_title = "Buses Coming to This Stop";
include "header.php";

$foo = "1234";


$array = array(
    "stop_id"=>(isset($_GET["stop_id"]) ?  : "", 
    "command"=>__FILE__,
    "departure_time"=>$_GET["departure_time"], 
    "trip_id"=>$_GET["trip_id"] );
logit($link,$array);


// GEt info about the indicated stops - this willget replaced by an incude later

// here we should check if this is a place with many stops like 
// Union Station, Coffman PnR, or any other Pnr that has multiple gates.

//coffman 33677, 33674,33676,17798
//17th and main soutbound 15145
// Union station stops  33646,33727,33647,34344,34343,25434,34331,34329,34330,34310,34311,34313,34314,34315,34316,34321,34317,34319,34323,34325,34326,34327,34328,25430,34667,34668 
// Brooomfield Station   33528,33529,34658,33534,33535,33533,33532,33745,33527,33536,34659
//
// select  based on the parent_station for places that have several 
// distinct stop_ids at the same place like a pnr 
// SELECT * from stops where parent_station = 33727 order by stop_desc;

// if we give nothing, do the ones for a known selection of stops
// this would be a select of favorites but i dont have that table yet 
// here we would check if there is a parent_station specified 

        $stop_id = $_GET["stop_id"] 
            ? $_GET["stop_id"]  
            : '17996,4515,15145,33677,33674,33676,17998';

// $stop_names = &get-stopnames($stop_id); // this can be singular or a csv list but include the () 

// get service type, assume weekda/friday  if none given
// should put a call to the get-service routine 
$service_id = isset ($_GET["service_id"]) ? "(" . $_GET["service_id"] . ")" : "('WK','FR')";


?>
<?php
 $query = 
"SELECT s.stop_id as stop_id, 
s.stop_name as stop_name, 
s.stop_desc as stop_desc, 
s.parent_station as parent_station, 
s.stop_lat as stop_lat, 
s.stop_lon as stop_lon   
 FROM stops s
 WHERE stop_id in ( $stop_id ) 
 ORDER BY s.stop_desc";

show_query($query);

$result = mysqli_query($link,$query) or die('Query failed: ' . mysqli_error($link));

// Printing results in HTML
echo "<div class='section_header'>$page_title </div>";  


// echo "<table>\n";
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {

?>
      <div class="page_header floating_element">
        <span class="floating_element">


<a href='http://maps.google.com/maps?z=12&t=m&q=loc:<?php
     echo $line["stop_lat"]; 
?>+<?php 
    echo $line["stop_lon"]; 
?>'><img src="img/map.png" border=0 alt="Google Map"><?php
    echo $line["stop_name"];
?>( <?php 
    echo $line["stop_name"];
?> )<br/><?php
    echo $line["stop_desc"]; 
    if ($line["parent_station"] != "") { 
        echo "(parent:" . $line["parent_station"] . ")";
    }
?>
        </span>
      </div> 
<?php
    if ($line["parent_station"] != "") {
       $stop_id .= expand_stopids($link,$line["parent_station"]);
        // echo "expanded stop_id $stop_id<br/>";
    }

//    echo "\t<tr>\n";
//        echo "\t\t<td>$line</td>\n";
//    foreach ($line as $col_value) {
//        echo "\t\t<td>$col_value</td>\n";
//    }
//    echo "\t</tr>\n";
}
// echo "</table>\n";


if (isset($_GET["departure_time"])) { 
    echo "departure_time " . $_GET["departure_time"] . "<br/>";
    $time_ref = validate_time($_GET["departure_time"]);

    if ($_GET["departure_time"] == "all") {
        // all means we don't suppress any of it
        $time_parameters = " ";
    } else { 
        // validate_time will return the validated time with 
        // single quotes or the words curtime() without quotes 
        // so that either can be dropped directly into the SQL
        $time_ref = validate_time($_GET["departure_time"]);

echo "time_ref $time_ref<br/>";

        $time_parameters = 
" AND st.departure_time > $time_ref
AND st.departure_time < addtime($time_ref, '03:00:00')"; 

    }  

} else {
    $time_parameters = 
" AND st.departure_time > curtime()
AND st.departure_time < addtime(curtime(), '03:00:00')";


}


//added select based on CURTIME()
///////////////////////
 $query = 
"SELECT  t.route_id AS route_id, 
    t.service_id AS service_id,  
    st.stop_id AS stop_id,
    s.stop_name AS stop_name,
    st.trip_id AS trip_id, 
    st.departure_time AS departure_time,
    r.route_color AS route_color,
    r.route_long_name AS route_long_name,
    r.route_desc AS route_desc,
    r.route_short_name AS route_short_name,
    r.route_text_color AS route_text_color
FROM stop_times as st, trips as t, routes as r, stops as s 
WHERE st.stop_id in ($stop_id) 
AND t.trip_id = st.trip_id 
AND s.stop_id = st.stop_id 
AND r.route_id = t.route_id 
AND t.service_id in $service_id 
$time_parameters 
ORDER BY st.departure_time";
// #t.route_id = 'BOLT'";
show_query($query);

$result = mysqli_query($link,$query) or die('Query failed: ' . mysqli_error($link));
echo "<table>\n";
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
?>
<tr><th> <a href='get-routes.php?route_id=<?php echo $line["route_id"]; ?>'>
<?php
// start colorcoded route block
// start colorcoded route block
        echo "\t<div style='width:100;color:#" . 
            $line["route_text_color"] . ";" . 
            "background-color:#" . $line["route_color"] . ";" . 
            "'>" . 
            $line["route_short_name"] .
            "</div> ";
// end colorcoded route block

?></a>
</th><th align="left">    <?php 
    echo $line["route_short_name"]; 
?> - <?php 
    echo $line["route_long_name"]; 
?><br/><?
    echo $line["route_desc"]; 
?></th><th align="right">    
<?php 
    echo $line["stop_name"]; 
?></a></th>
<td><a href="trips.php?trip_id=<?php  
    echo $line["trip_id"];  
?>&stop_id=<?php  
    echo $line["stop_id"];  
?>&departure_time=<?php  
    echo $line["departure_time"];  
?>"><?php  
    echo $line["departure_time"];  
?></a>
?></a></td></tr>


<?php
}
echo "</table>\n";


// Default Printing results in HTML - remove once i have the right display 
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

// Free resultset
mysqli_free_result($result);

// Closing connection
mysqli_close($link);
?>
<?php 
include "footer.php";
exit;
//####### GOOGLE MAPS LINK ### 
//google maps parameters:
// z is the zoom level (1-20)
$z = '12';
// t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
$t = 'h';
// q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +
$q = 'loc:' . 
    $line["route_latitude"] .
    '+' .  
    $line["route_longitude"] 
?>
<tr><td><a href='http://maps.google.com/maps?z=<?php
    echo $z;
?>&t=<?php
    echo $t;
?>h&q=<?php 
    echo $q;
?>'>Google Map</a><?php
//####### GOOGLE MAPS LINK ### 
?>
    d"]"command"=>$_GET["stop_id"], 
