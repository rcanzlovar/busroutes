<?php
//get-trips.php

$DEBUG = 1; 
echo ("DEBUG = " . $DEBUG);

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca named get-routes.php and made the sql more restrictive
// 20160722 rca named get-trips.php
// 
// fields in trips
// route_id      | varchar(6) j| YES  |     | NULL
// service_id    | varchar(3)  | YES  |     | NULL
// trip_id       | int(3)      | YES  | MUL | NULL
// shape_id      | int(5)      | YES  |     | NULL
// block_id      | varchar(6)  | YES  |     | NULL
// trip_headsign | varchar(40) | NO   |     | NULL
// direction_id  | int(11)     | NO   |     | NULL
//
// fields in routes:
// route_id         | varchar(8)   | NO   | PRI | 0
// route_short_name | varchar(25)  | YES  |     | NULL
// route_long_name  | varchar(150) | YES  | MUL | NULL
// route_type       | int(2)       | YES  |     | NULL
// route_desc       | varchar(40)  | NO   |     | NULL
// route_url        | varchar(120) | NO   |     | NULL
// route_color      | varchar(6)   | NO   |     | NULL
// route_text_color j
//
//rields for stop_times
// trip_id             | int(6)      | YES  |     | NULL
// arrival_time        | time        | YES  |     | NULL
// departure_time      | time        | YES  |     | NULL
// stop_id             | int(5)      | YES  | MUL | NULL
// stop_sequence       | int(3)      | YES  |     | NULL
// stop_headsign       | varchar(50) | NO   |     | NULL
// pickup_type         | int(11)     | NO   |     | NULL
// drop_off_type       | int(11)     | NO   |     | NULL
// shape_dist_traveled | int(11)     | NO   |     | NULL
//
//FIelds for stops
// stop_id       | int(5)       | NO   | PRI | 0
// stop_code     | char(4)      | YES  |     | NULL
// stop_name     | varchar(200) | YES  | MUL | NULL
// stop_lon      | double       | YES  | MUL | NULL
// stop_lat      | double       | YES  | MUL | NULL
// stop_desc     | varchar(200) | NO   |     | NULL
// zone_id       | int(2)       | NO   |     | NULL
// stop_url      | varchar(200) | NO   |     | NULL
// location_type | int(2)       | NO   |     | NULL


include_once ("funcs.php");

include_once ('dbconnect.php');
//require "getlogs.php";
//logit($link);


//s = service_id
//dt=departure_time




if (isset($_GET['service'])) {
    $service_id = $_GET['service']; 
}

if (isset($_GET['stop'])) {
    $service_id = $_GET['s']; 
}


if (isset($_GET['departure'])) {
    $departure_time = $_GET['departure']; 
}

if (isset($_GET['route'])) {
    $route_id = $_GET['route']; 
}

if (isset($_GET['trip'])) {
    $trip_id = $_GET['trip']; 
}


//DEPARTURE TIME
// here we set $time parameters, if needed
// 23feb18 rca
// by default, go 20 minutes in the past and three hours in the future

$sql_time_parameters = "AND st.departure_time > date_sub(curtime(), interval 20 minute) " . 
    "AND st.departure_time < date_add(curtime(), interval 3 hour) ";

if (isset ($departure_time)) {
    // probably should validate the time here and display an 
    if ($departure_time == "all") {
        $sql_time_parameters = "";

    } else {
        $sql_time_parameters = "AND st.departure_time > " . 
            $departure_time . " "  . 
            "AND st.departure_time <= date_add('" . 
            $departure_time . 
            "', INTERVAL 3 HOUR ";
        $sql_time_parameters = "AND st.departure_time > '" . 
           $departure_time .  "' ";
    }
}

    //SERVICE ID
    // here we set $service_id_param
    if (isset ($service_id)) {
		$service_id_param = "AND t.service_id in (" . add_quotes($service_id) . ") ";
    } else {		
		$service_id_param = "AND t.service_id in (" . add_quotes(get_service($link,getdate()["weekday"])) . ") ";
	}


    //ROUTE ID
    // here we set $route_id
    if (!isset ($route_id) ) {
        $route_id = "BOLT";
    } 




    // build SQL query
    $query = 
"SELECT  
r.route_short_name as route_short_name,
r.route_long_name as route_long_name,
r.route_id as route_id,
r.route_color as route_color,
r.route_text_color as route_text_color,
s.stop_desc as stop_desc, 
s.stop_name as stop_name,  
s.stop_id as stop_id,  
s.stop_lat as stop_lat,  
s.stop_lon as stop_lon,  
t.service_id as service_id,  
t.trip_headsign as trip_headsign,
t.trip_id as trip_id,
t.service_id as service_id,
st.stop_sequence as stop_sequence,
st.arrival_time as arrival_time,
st.departure_time as departure_time 
 FROM trips t, stop_times st, routes r, stops s \n";

//print ("QUERY <pre>" . $query . "</pre><br/>\n") if $DEBUG;
    // if trip and rouite are giiven, give precedence to the trip id 
    if (isset ($trip_id)) {
        $query .= " WHERE t.trip_id = '" . $trip_id . "' ";
    } else { 
        if (isset ($route_id)) {
            $query .= " WHERE r.route_id = '" . $route_id . "' ";

        }
    } 

    //associate the tables to each other
    $query .= 
" AND t.trip_id = st.trip_id 
AND s.stop_id = st.stop_id " .
" AND r.route_id = t.route_id " . 
$sql_time_parameters . // what times should we display?  
$service_id_param;		// what service id

    $query .= 
    " ORDER BY t.trip_id,st.arrival_time ";
#    " ORDER BY st.stop_sequence,st.arrival_time ";
#    " ORDER BY t.service_id,st.arrival_time ";
#    " ORDER BY st.stop_sequence,st.arrival_time ";

    // these can get kinda lengthy if you don't limit them, let's only pull a few hundred 
        // of them
//    $query .= " LIMIT 0,2000 "; 
//print ("QUERY <pre>" . $query . "</pre><br/>\n");
 if($DEBUG) {    show_query($query); }




    //run it
    $result = mysqli_query($link,$query) 
        or die('Query failed: ' . mysqli_error($link));


    if (isset ($_GET["trip_id"])) {
        echo "<a href='get-routes.php'>Show All Routes</a><br/>";
	    if (isset($_GET["departure_time"]) && $_GET["departure_time"] == "all") {
            echo "<a href='trips.php?trip_id=" . $_GET["trip_id"] . "'>Show upcoming trips</a><br/>";
	    } else {
            echo "<a href='trips.php'>Show All trips (meaningless)</a><br/>";
	    }

	    // Toggle what time parameters are in play
	    if (isset ($_GET["departure_time"]) && $_GET["departure_time"] == "all") {
           
            printf(
			 "<a href='get-buses.php?&stop_id=%s'>Show upconing buses at this stop</a><br/>",
			 $_GET["stop_id"]		 
			 );
	    } else {
	            
            printf(
			 "<a href='get-buses.php?departure_time=all&stop_id=%s'>Show All Buses at a stop %s</a><br/>",
			 $_GET["stop_id"],		 
			 $_GET["stop_id"]		 
			 );
			
		}
    } 

# initialize before the first record, but don't print header until you've pulled the first 
# record. 
$head_printed = 0; 

//#################### start output here ###########################
while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
    if (!$head_printed) {  

echo "<tr><td colspan=12><h3>"; 
printf(
"<!--// start colorcoded route block -->
<div style='color:#%s;background-color:%s;'>%s</div>
<!-- // end colorcoded route block -->",
    $line["route_text_color"], 
    $line["route_color"], 
    $line["route_short_name"]);
    if (isset($_GET["departure_time"]) && $_GET["departure_time"] == "all") {
	    printf(
"%s - (%s)</h3><br/>
<a href='trips.php?departure_time=all&service_id=%s&route_id=%s'>All trips for %s</a><br/>",
            $line["route_long_name"], 
            $line["trip_headsign"],
            $line["service_id"], 
            $line["route_id"],
            $line["route_id"]);
	} else if (isset($_GET["departure_time"])) {
	    printf(
"%s - (%s)</h3><br/>
<a href='trips.php?departure_time=all&service_id=%s&route_id=%s'>All trips for %s</a><br/>",
            $line["route_long_name"], 
            $line["trip_headsign"],
            $line["service_id"], 
            $line["route_id"],
            $line["route_id"]);
	} else {
	    printf(
"%s - (%s)</h3><br/>
<a href='trips.php?departure_time=all&service_id=%s&route_id=%s'>All trips for %s</a><br/>",
            $line["route_long_name"], 
            $line["trip_headsign"],
            $line["service_id"], 
            $line["route_id"],
            $line["route_id"]);
    }
?></td>
<?php
        // start the table for the rest of the output now that we've 
        //  printed the header
        echo "<table>\n";

        $head_printed = 1; 
    } 

    if (isset ($_GET["trip_id"]) || $line["stop_sequence"] == 1) {
?><tr><td colspan=6>
      <div class="table_of_contents_item floating_element">
        <span class="floating_element">
<a href='http://maps.google.com/maps?z=12&t=m&q=loc:<?php echo $line["stop_lat"]; ?>+<?php echo $line["stop_lon"]; ?>'><img src="img/map.png" border=0 alt="Google Map"></a> 
<?php
    echo $line["stop_sequence"]; 
?> <?php
    echo $line["service_id"] ; 
?><a href="get-buses.php?stop_id=<?php
    echo $line["stop_id"];
?>"><?php
    echo $line["stop_name"];
?></a></td><td><?php 
    echo $line["stop_desc"];

    if (!isset ($trip_id)) {
        printf(
"<br/><a href='trips.php?trip_id=%s'>view this trip</a><br/>", 
            $line["trip_id"]); 
    }

    echo "</span></div></td><td>";
    echo $line["arrival_time"]  . " ";
    echo "</td><td>";
    echo $line["departure_time"]  . " ";
    echo "</td>";
?>


   <td>



<?php
// z is the zoom level (1-20)
// t is the map type ("m" map, "k" satellite, "h" hybrid, "p" terrain, "e" GoogleEarth)
// q is the search query, if it is prefixed by loc: then google assumes it is a lat lon separated by a +


    echo "\t</tr>\n";
  
  } // if isset stop_sequence
//###############################
//        if ($DEBUG) {
//            echo "\t<tr>\n";
//            echo "\t\t<td>$line</td>\n";
            foreach ($line as $col_value) {
                echo "\t\t<td>$col_value</td>\n";
            }
            echo "\t</tr>\n";
 //       }  // if ($DEBUG) 
//###############################

}
echo "</table>\n";

?>
