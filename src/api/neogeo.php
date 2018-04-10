<?php
//neogeo.php


// 20180320 changed stop_id and trip id to varchar because BART has things like 11111WK for trip ids 

// 20180307 added code for resetting about me fields. updating main1 or main2 based on the param
// 20180305 adding in ability to pass a list of routes like ld-1,ld-2,lx-1,lx-2

// 20180223 changed this to api-trips and made it generate JSON 
// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca named get-routes.php and made the sql more restrictive
// 20160722 rca named get-trips.php
// Table field definition stoff at the the botton 
// 
$DEBUG = 0; 
include_once ("funcs.php");
include_once ('dbconnect.php');

//require "getlogs.php";
//logit($link);

//s = service_id
//dt=departure_time

if (isset($_GET['service'])) {
    $service_id = $_GET['service']; 
}

if (isset($_GET['DEBUG'])) {
    $DEBUG = $_GET['DEBUG']; 
}



// here get the sql 






// here get the sql 
    //show_query has debug built into it 
    show_query($query);

    //run it
    $result = mysqli_query($link,$query) 
        or die('Query failed: ' . mysqli_error($link));
    

//#################### start output here ###########################
//     the json_encode() needs it to be in an array, so...


    $trip_array = array();
    while ($line = mysqli_fetch_assoc($result)) {
        $trip_array[] = $line;
    }
    echo json_encode($trip_array);

    exit;

// fields in TRIPS
// route_id      | varchar(6) j| YES  |     | NULL
// service_id    | varchar(3)  | YES  |     | NULL
// trip_id       | int(3)      | YES  | MUL | NULL
// shape_id      | int(5)      | YES  |     | NULL
// block_id      | varchar(6)  | YES  |     | NULL
// trip_headsign | varchar(40) | NO   |     | NULL
// direction_id  | int(11)     | NO   |     | NULL
//
// fields in ROUTES:
// route_id         | varchar(8)   | NO   | PRI | 0
// route_short_name | varchar(25)  | YES  |     | NULL
// route_long_name  | varchar(150) | YES  | MUL | NULL
// route_type       | int(2)       | YES  |     | NULL
// route_desc       | varchar(40)  | NO   |     | NULL
// route_url        | varchar(120) | NO   |     | NULL
// route_color      | varchar(6)   | NO   |     | NULL
// route_text_color j
//
//rields for STOP_TIMES
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
//FIelds for STOPS
// stop_id       | int(5)       | NO   | PRI | 0
// stop_code     | char(4)      | YES  |     | NULL
// stop_name     | varchar(200) | YES  | MUL | NULL
// stop_lon      | double       | YES  | MUL | NULL
// stop_lat      | double       | YES  | MUL | NULL
// stop_desc     | varchar(200) | NO   |     | NULL
// zone_id       | int(2)       | NO   |     | NULL
// stop_url      | varchar(200) | NO   |     | NULL
// location_type | int(2)       | NO   |     | NULL
//
    /*
    SELECT  
r.route_short_name as route_short_name,
r.route_long_name  as route_long_name,
r.route_id         as route_id,
r.route_color      as route_color,
r.route_text_color as route_text_color,
s.stop_desc        as stop_desc, 
s.stop_name        as stop_name,  
s.stop_id          as stop_id,  
s.stop_lat         as stop_lat,  
s.stop_lon         as stop_lon,  
t.service_id       as service_id,  
t.trip_headsign    as trip_headsign,
t.trip_id          as trip_id,
t.service_id       as service_id,
st.stop_sequence   as stop_sequence,
st.arrival_time    as arrival_time,
st.departure_time  as departure_time 
 FROM trips t, stop_times st, routes r, stops s 
 WHERE t.route_id like 'ff%'  
 AND t.trip_id = st.trip_id  
 AND s.stop_id = st.stop_id  
 AND r.route_id = t.route_id 
 AND st.departure_time <= addtime(curtime() ,'6:0:0') 
 AND st.departure_time > subtime(curtime() ,'0:20:0') 
 AND t.service_id in ('SA')  
 ORDER BY t.trip_id,st.stop_sequence
  */

?>
