
<?php
// get-service.php - get the service type (WK, SA, SU, etc) 

// 20160721 rca changed msql_connect to mysqli_connect and mysqli_close
// 20160722 rca renamed to get-service and changed he sql to do this. 
//2016-804 added logging and dbconnect call


include "dbconnect.php";
require "getlogs.php";
logit($link);


echo date("d")." "; 
echo date("m")." "; 
echo date("Y")." "; 
echo date("h:i:s A"); 

ECHO ' <br/>'; 
$today_day = jddayofweek ( cal_to_jd(CAL_GREGORIAN, date("m"),date("d"), date("Y")) , 1 ); 
echo $today_day;

// Performing SQL query
$query = "select service_id  from calendar where $today_day = 1";



$result = mysqli_query($link,$query) or die('Query failed: ' . mysqli_error($link));
//$result = mysqli_query($link, $query) or die('Query failed: ');

// Printing results in HTML
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
