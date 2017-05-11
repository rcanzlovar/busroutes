<?php 
function logit ($link) {
    $array = array(
        "stop_id"=>(isset($_GET["stop_id"]) ? $_GET["stop_id"] : ""), 
        "route_id"=>(isset($_GET["route_id"]) ? $_GET["route_id"] : ""), 
        "service_id"=>(isset($_GET["service_id"]) ? $_GET["service_id"] : ""), 
        "command"=>__FILE__,
        "departure_time"=>(isset($_GET["departure_time"]) ? $_GET["departure_time"] : ""), 
        "trip_id"=>(isset($_GET["trip_id"]) ? $_GET["trip_id"] : "") ); 
    _logit($link,$array);
}



function _logit($link,$array) {
    
    //the log time in epoch format 
    $logtime = date('U');
 
    // change the IP address into something unrecognizable but still 
    // selectable
    $identifier =  
        (isset($_SERVER['REMOTE_ADDR'])
         ? $_SERVER['REMOTE_ADDR']
         : "TESTDATA"); 
    if (isset($array["command"])) { 
        $command = $array["command"];
    }
    if (isset($array["route_id"])) { 
        $route_id = $array["route_id"];
    }
    if (isset($array["service_id"])) { 
        $service_id = $array["service_id"];
    }
    if (isset($array["trip_id"])) { 
        $trip_id = $array["trip_id"];
    }
    if (isset($array["stop_id"])) { 
        $stop_id = $array["stop_id"];
    }

    if (isset($array["departure_time"])) { 
        $departure_time = $array["departure_time"];
    }


    $query = "INSERT INTO logs 
      (identifier,logtime,command,route_id,trip_id,
       departure_time,service_id,stop_id)
VALUES 
      ('$identifier',
       '$logtime',
       '$command',
       '$route_id',
       '$trip_id',
       '$departure_time',
       '$service_id',
       '$stop_id')";
//     echo $query . "\n";
     $result = mysqli_query($link,$query) or die('Query failed: ' . mysqli_error($link));
// only for debugging    if ($result) { echo "one thing"; } else { echo " other"; }
}



if (0) { 
    include "dbconnect.php";

    logit($link,array("route_id"=>"BOLT", 
       "command"=>"get-routes.php",
       "stop_id"=>"17996",
       "trip_id"=>"17996",
       "service_id"=>"WK",
       "stop_id"=>"17996" ));
}
?>
