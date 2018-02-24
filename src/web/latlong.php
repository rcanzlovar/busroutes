<?php
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Selection of points within specified radius of given lat/lon      (c) Chris Veness 2008-2014  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    require 'inc/dbparams.inc.php';  // defines $dsn, $username, $password
    include "dbconnect.php";

    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

//    $lat = $_GET['lat']; // latitude of centre of bounding circle in degrees
//    $lon = $_GET['lon']; // longitude of centre of bounding circle in degrees
//    $rad = $_GET['rad']; // radius of bounding circle in kilometers
    $lat = 40.187735;
    $lon = -105.102414;
    $rad = 2;

 
    $R = 6371;  // earth's mean radius, km

    // first-cut bounding box (in degrees)
    $maxLat = $lat + rad2deg($rad/$R);
    $minLat = $lat - rad2deg($rad/$R);
    // compensate for degrees longitude getting smaller with increasing latitude
    $maxLon = $lon + rad2deg($rad/$R/cos(deg2rad($lat)));
    $minLon = $lon - rad2deg($rad/$R/cos(deg2rad($lat)));

    $sql = 
	//"Select stop_Id as id, Postcode, stop_Lat as lat, stop_Lon as lon,
    //            acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R As D
    //        From (
           "    Select stop_id, stop_name, stop_Lat as lat, stop_Lon as lon
                From stops
                Where lat Between :minLat And :maxLat
                  And lon Between :maxLon And :minLon
    //        ) As FirstCut
    //        Where acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R < :rad
    //        Order by D"
	;
    $params = array(
        'lat'    => deg2rad($lat),
        'lon'    => deg2rad($lon),
        'minLat' => $minLat,
        'minLon' => $minLon,
        'maxLat' => $maxLat,
        'maxLon' => $maxLon,
        'rad'    => $rad,
        'R'      => $R,
    );
    $points = $db->prepare($sql);
    $points->execute($params);
?>

<html>
<table>
    <? foreach ($points as $point): ?>
    <tr>
        <td><?= $point->stop_name ?></td>
        <td><?= number_format($point->stop_id,1) ?></td>
        <td><?= number_format($point->Lat,3) ?></td>
        <td><?= number_format($point->Lon,3) ?></td>
    </tr>
    <? endforeach ?>
</table>
</html>