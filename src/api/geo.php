<?php
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Selection of points within specified radius of given lat/lon      (c) Chris Veness 2008-2016  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    require 'inc/dbparams.inc.php';  // defines $dsn, $username, $password
    $dsn = "mysql:host=127.0.0.1;dbname=$dbname";
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

    $lat = isset($_GET['lat']) ? $_GET['lat']  : 39.704446; // latitude of centre of bounding circle in degrees
    $lon = isset($_GET['lon']) ? $_GET['lon']  : -105.250268; // latitude of centre of bounding circle in degrees
    $rad = isset($_GET['rad']) ? $_GET['rad']  : 2; // latitude of centre of bounding circle in degrees


//$lat = 39.704446;
//$lon = -105.250268;
//$rad = 2;

    $R = 6371;  // earth's mean radius, km

    // first-cut bounding box (in degrees)
    $maxLat = $lat + rad2deg($rad/$R);
    $minLat = $lat - rad2deg($rad/$R);
    $maxLon = $lon + rad2deg(asin($rad/$R) / cos(deg2rad($lon)));
    $minLon = $lon - rad2deg(asin($rad/$R) / cos(deg2rad($lon)));

echo "<ul><li>lat $lat\n";
echo "</li><li>lon $lon\n";
echo "</li><li>R $R\n";
echo "</li><li>rad $rad\n";
echo "</li><li>minlat $minLat\n";
echo "</li><li>minlon $minLon\n";
echo "</li><li>maxlat $maxLat\n";
echo "</li><li>maxlon $maxLon</li></ul>\n";
    $sql = "Select stop_id, stop_name, stop_lat, stop_Lon,
                   acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R As D
            From ( 
                SELECT stop_id, stop_name, stop_lat, stop_lon
                FROM stops
    WHERE stop_lat BETWEEN :minLat AND :maxLat
      And stop_lon BETWEEN :maxLon AND :minLon
            ) AS FirstCut
            wHERE acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R < :rad
            ORDER BY D";

    $sql1 = "
    Select stop_id, stop_name, stop_lat, stop_lon
    From stops
    Where stop_lat Between :minLat And :maxLat
      And stop_lon Between :maxLon And :minLon";
    $points1 = $db->prepare($sql1);
        $points1->bindValue(':minLat' , $minLat);
        $points1->bindValue(':minLon' , $minLon);
        $points1->bindValue(':maxLat' , $maxLat);
        $points1->bindValue(':maxLon' , $maxLon);

    $points = $db->prepare($sql);
    // slip in the parameters 
        $points->bindValue(':lat'    , deg2rad($lat));
        $points->bindValue(':lon'    , deg2rad($lon));
        $points->bindValue(':minLat' , $minLat);
        $points->bindValue(':minLon' , $minLon);
        $points->bindValue(':maxLat' , $maxLat);
        $points->bindValue(':maxLon' , $maxLon);
        $points->bindValue(':rad'    , $rad);
        $points->bindValue(':R'      , $R);
//    $points->execute($params);


    $places = array();




if ($points->execute()) {
    print "<table>";
    while ($row = $points->fetch(PDO::FETCH_ASSOC)) {

        //var_dump($row);
        print "<tr><td>";
        print $row["stop_id"] . "</td><td>";
        print $row["stop_name"] . "</td><td>";
        print $row["stop_lat"] . ",";
        print $row["stop_lon"] . "</td><td>";
        print $row["D"] ;
        print "</td></tr>";
    }
    print "</table>";
}

if ($points1->execute()) {
    print "<table>";
    while ($row = $points1->fetch(PDO::FETCH_ASSOC)) {

        //var_dump($row);
        print "<tr><td>";
        print "<a href='/busroutes/api/?stop=" . $row["stop_id"] . "'>detail</a></td><td>";
        print $row["stop_id"] . "</td><td>";
        print $row["stop_name"] . "</td><td>";
        print $row["stop_lat"] . ",";
        print $row["stop_lon"] . "</td><td>";
        print "</td></tr>";
    }
    print "</table>";
}
?>