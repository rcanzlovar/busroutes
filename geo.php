<?php
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */
/*  Selection of points within specified radius of given lat/lon      (c) Chris Veness 2008-2016  */
/* - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -  */

    require 'inc/dbparams.inc.php';  // defines $dsn, $username, $password
    $db = new PDO($dsn, $username, $password);
    $db->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_OBJ);

    $lat = $_GET['lat']; // latitude of centre of bounding circle in degrees
    $lon = $_GET['lon']; // longitude of centre of bounding circle in degrees
    $rad = $_GET['rad']; // radius of bounding circle in kilometers


$lat = 39.547191;
$Lon = -104.997556;
$rad = 2;

    $R = 6371;  // earth's mean radius, km

    // first-cut bounding box (in degrees)
    $maxLat = $lat + rad2deg($rad/$R);
    $minLat = $lat - rad2deg($rad/$R);
    $maxLon = $lon + rad2deg(asin($rad/$R) / cos(deg2rad($lon)));
    $minLon = $lon - rad2deg(asin($rad/$R) / cos(deg2rad($lon)));

echo "<ul><li>maxlat $maxLat\n";
echo "</li><li>minlat $minLat\n";
echo "</li><li>minlon $minLon\n";
echo "</li><li>maxlon $maxLon</li></ul>\n";
    $sql = "Select stop_id, stop_name, stop_lat, stop_Lon,
                   acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R As D
            From (
                Select stop_Id, stop_name, stop_Lat, stop_Lon
                From stops
                Where Lat Between :minLat And :maxLat
                  And Lon Between :minLon And :maxLon
            ) As FirstCut
            Where acos(sin(:lat)*sin(radians(Lat)) + cos(:lat)*cos(radians(Lat))*cos(radians(Lon)-:lon)) * :R < :rad
            Order by D";
    $params = [
        'lat'    => deg2rad($lat),
        'lon'    => deg2rad($lon),
        'minLat' => $minLat,
        'minLon' => $minLon,
        'maxLat' => $maxLat,
        'maxLon' => $maxLon,
        'rad'    => $rad,
        'R'      => $R
    ];
    $points = $db->prepare($sql);
    $points->execute($params);
?>

<html>
<table>
    <? foreach ($points as $point): ?>
    <tr>
        <td><?= $point->Postcode ?></td>
        <td><?= number_format($point->Lat,4) ?></td>
        <td><?= number_format($point->Lon,4) ?></td>
        <td><?= number_format($point->D,3) ?></td>
    </tr>
    <? endforeach ?>
</table>
</html>
