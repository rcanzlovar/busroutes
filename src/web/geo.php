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

http://maps.google.com/maps?z=12&t=m&q=loc:
$lat = 39.547191;
$lon = -104.997556;
$lat = 40.187735;
$lon = -105.102414;


$rad = 2;

    $R = 6371;  // earth's mean radius, km

    // first-cut bounding box (in degrees)
    $_maxLat = $lat + rad2deg($rad/$R);
    $_minLat = $lat - rad2deg($rad/$R);
    $_maxLon = $lon + rad2deg(asin($rad/$R) / cos(deg2rad($lon)));
    $_minLon = $lon - rad2deg(asin($rad/$R) / cos(deg2rad($lon)));
	
	// max and min get funny when you're working with negative numbers
	$maxLon = max($_maxLon, $_minLon);
	$minLon = min($_maxLon, $_minLon);
	$maxLat = max($_maxLat, $_minLat);
	$minLat = min($_maxLat, $_minLat);
	
	

echo "<ul>";
echo "<li>minlat $minLat\n";
echo "</li><li>maxlat $maxLat\n";
echo "</li><li>lat $lat " .  deg2rad($lat) . ",\n";
echo "</li><li>lon $lon " .  deg2rad($lon) . ",\n";

echo "</li><li>minlon $minLon\n";
echo "</li><li>maxlon $maxLon</li></ul>\n";
    $sql = "Select stop_id, stop_name, lat, Lon,
            From (
                Select stop_Id, stop_name, stop_Lat as lat, stop_Lon as lon,

                From stops
                Where stop_Lat > :minLat 
                And stop_lat < :maxLat
                AND stop_lon > :minLon 
				And stop_Lon < :maxLon
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
	/*
	$sf = 3.14159 / 180; // scaling factor
    $er = 6350; // earth radius in miles, approximate
    $mr = 100; // max radius
    $sql = "SELECT * FROM stops 
    WHERE $mr >= $er * ACOS(SIN(lat*$sf)*SIN($lat*$sf) 
	+ COS(lat*$sf)*COS($lat*$sf)*COS((lon-$lon)*$sf))
    ORDER BY ACOS(SIN(lat*$sf)*SIN($lat*$sf) + COS(lat*$sf)*COS($lat*$sf)*COS((lon-$lon)*$sf))";
	
	*/
	
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
