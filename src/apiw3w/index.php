<?php
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  
  dump what3words info into our local tables so we dont have to ping them all the time, 
    just once.
   - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
    $DEBUG = isset($_GET['DEBUG']) ? $_GET['DEBUG']  : 0; 

    // defines $dsn, $dbname, $username, $password
    require '../apitrips/inc/dbparams.inc.php';  
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

    if (isset($_GET['q'])) {
         [$lat, $lon] = explode(",",$_GET['q']);
    } else if (isset($_GET['stop'])) {
        // get latlong from the stop number 
         $stop_id = $_GET['stop']; 
        // [$lat, $lon] = explode(",",getlatlong($_GET['stop']));
        $sql = "Select stop_lat, stop_lon from stops where stop_id = '$stop_id'";
        $spot = $db->prepare($sql);
        if ($spot->execute()) {
            while ($row = $spot->fetch(PDO::FETCH_ASSOC)) {
                $lat = $row['stop_lat'];
                $lon = $row['stop_lon'];
            }
        } 
    } else {
        $lat = isset($_GET['lat']) ? $_GET['lat']  : 39.704446; // latitude of centre of bounding circle in degrees
        $lon = isset($_GET['lon']) ? $_GET['lon']  : -105.250268; // latitude of centre of bounding circle in degrees
    }

    $rad = isset($_GET['rad']) ? $_GET['rad']  : 2; // latitude of centre of bounding circle in degrees

    $R = 6371;  // earth's mean radius, km

    // first-cut bounding box (in degrees)
    $maxLat = $lat + rad2deg($rad/$R);
    $minLat = $lat - rad2deg($rad/$R);
    $maxLon = $lon + rad2deg(asin($rad/$R) / cos(deg2rad($lon)));
    $minLon = $lon - rad2deg(asin($rad/$R) / cos(deg2rad($lon)));

    if ($DEBUG) {
        echo "<pre>
127.0.0.1/busroutes/api/geo/?lat=40.187735&lon=-105.102414
127.0.0.1/busroutes/api/geo/?q=40.187735,-105.102414
127.0.0.1/busroutes/api/geo/?stop=15145
http://maps.google.com/maps?q=40.187735,-105.102414
https://www.transit.wiki/Map:RTD_323
https://www.transit.wiki/RTD_BOLT
https://www.transit.wiki/8th_%26_Coffman
https://www.transit.wiki/RTD_Longmont_Call-n-Ride
</pre>";
echo "<ul><li>";
echo "<a href='http://maps.google.com/maps?q=$lat,$lon' target='_blank'>location $lat, ";
echo " $lon</a>\n";
echo "</li>";
echo "<li>min $minLat\n";
echo " $minLon\n";
echo "</li><li>max $maxLat\n";
echo " $maxLon</li>";
echo "<li>R $R,\n";
echo " rad $rad</li>\n";
echo "</ul>\n";
    }

    $sql = "Select stop_id, stop_name, stop_lat as Lat, stop_Lon as Lon,
                   acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R As D
            From ( 
                SELECT stop_id, stop_name, stop_lat, stop_lon, stop_desc
                FROM stops
                WHERE stop_lat BETWEEN :minLat AND :maxLat
                And stop_lon BETWEEN :minLon AND :maxLon
            ) AS FirstCut
            wHERE acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R < :rad
            ORDER BY D";

    $points = $db->prepare($sql);
    // slip in the parameters 
        $points->bindValue(':lat'    , deg2rad($lat));
        $points->bindValue(':lon'    , deg2rad($lon));
        $points->bindValue(':minLon' , min($minLon,$maxLon));
        $points->bindValue(':minLat' , min($minLat,$maxLat));
        $points->bindValue(':maxLon' , max($minLon,$maxLon));
        $points->bindValue(':maxLat' , max($minLat,$maxLat));
        $points->bindValue(':rad'    , $rad);
        $points->bindValue(':R'      , $R);

if ($points->execute()) {
    if ($DEBUG) { print "<table>"; }
    while ($row = $points->fetch(PDO::FETCH_ASSOC)) {

        //var_dump($row);

    if ($DEBUG) {
        print "<tr><td>";
        print $row["stop_id"] . "</td><td>";
        print $row["stop_name"] . "</td><td>";
        print $row["stop_lat"] . ",";
        print $row["stop_lon"] . "</td><td>";
        print $row["D"] ;
        print "</td></tr>";
    }
    }
    if ($DEBUG) { print "</table>"; }
}





// the simpler one 

    $sql1 = "
    Select stop_id, stop_name, stop_lat, stop_lon, stop_desc
    From stops
    Where stop_lat Between :minLat And :maxLat
      And stop_lon Between :minLon And :maxLon 
      ORDER BY stop_name";

    $points1 = $db->prepare($sql1);
    // this nonsense is to ensure that this works for whatever quadrant of the globe you are using

        $points1->bindValue(':minLon' , min($minLon,$maxLon));
        $points1->bindValue(':minLat' , min($minLat,$maxLat));
        $points1->bindValue(':maxLon' , max($minLon,$maxLon));
        $points1->bindValue(':maxLat' , max($minLat,$maxLat));

// build the array of the stops, then push it out as JSON at the end 
$places = array();
if ($points1->execute()) {
    if ($DEBUG) { print "<table>"; }
    while ($row = $points1->fetch(PDO::FETCH_ASSOC)) {

        // add this row to the array that we'll JSON at the end 
        $object = new stdClass();
        $object->stop_id = $row["stop_id"]; 
        $object->stop_name = $row["stop_name"]; 
        $object->stop_lat = $row["stop_lat"]; 
        $object->stop_lon = $row["stop_lon"]; 
        $places[] = $object;

        //var_dump($row);
        if ($DEBUG) {
            print "<tr><td>";
            print "<a href='/busroutes/api/?stop=" . $row["stop_id"] . "'>detail</a></td><td>";
            print $row["stop_id"] . "</td><td>";
            print $row["stop_name"] . "</td><td>";
            $foo =  $row["stop_desc"];
            $a =      explode(' ',$foo);
            print array_pop($a);
            

            print "</td><td>";
            print " <a href='http://maps.google.com/maps?q=";
            print $row["stop_lat"] . ",";
            print $row["stop_lon"] . "'>map</a>";
            print " <a href='/busroutes/api/geo/?q="; 
            print $row["stop_lat"] . ",";
            print $row["stop_lon"] . "'>hop</a>";
            print " <a href='/busroutes/api/geo/?stop="; 
            print $row["stop_id"] . "'>hip</a>";
            print "</td></tr>";
        } // if $DEBUG
    } // while 
    if ($DEBUG) { print "<table>"; }

    echo json_encode($places);
} // if execute  
?>

