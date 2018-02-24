<?php
#####################
function show_query ($querystring) {
# put this here so i can control in one place whether and how the 
# queries get displayed.
    if (isset($DEBUG) && $DEBUG == 1) {
        echo "<pre>" . $querystring . "</pre>\n";
    }
}


#####################
function expand_stop_names ($link,$myarray) {
    $out = "";
    if (isset($myarray["stop_name"])) {
        $stopname = $myarray["stop_name"];
    } else {
        $stopname = "Error-no-stop-name";
    }

    if (isset($myarray["scriptfile"])) {
        $scriptfile = $myarray["scriptfile"];
    } else {
        $scriptfile = __FILE__;
    }

    $query = 
"SELECT stop_id, stop_desc, stop_name 
 FROM stops
 WHERE stop_name = '$stopname'";

    show_query($query);

    $result = mysqli_query($link,$query) 
        or die('Query failed: ' . mysqli_error($link) . 'ZZZ');
	if (strtoupper(substr(PHP_OS, 0, 3)) === 'WIN') {
        //echo 'This is a server using Windows!';
    	$scriptfile = preg_replace('(^.+\\)','',$scriptfile);
    } else {
        //echo 'This is a server not using Windows!';
    	$scriptfile = preg_replace('(^.+/)','',$scriptfile);
    }
    

    while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $out .= sprintf("<div class='stopname'><a href='%s?stop_id=%s'>%s - %s<a></div>",
		$scriptfile,
	    $line["stop_id"],
	    $line["stop_name"],
	    $line["stop_desc"]);
        
    }
    // echo "stop_id_out $stop_id_out<br/>";
  //  echo $out;

    return $out; 
}
####
function expand_stopids ($link,$parent_id) {
    $stop_id_out = "";

    $query = 
"SELECT stop_id 
 FROM stops
 WHERE parent_station = '$parent_id'";

    show_query($query);

    $result = mysqli_query($link,$query) 
        or die('Query failed: ' . mysqli_error($link) . 'ZZZ');

    while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $stop_id_out .= $line["stop_id"] . ",";
    }
     return trim($stop_id_out,",");
    // echo "stop_id_out $stop_id_out<br/>";

    return $stop_id_out;
}
####
function get_service ($link,$day) {


// return getdate()["weekday"];

    $service_id_out = "";

    $query = 
"SELECT service_id as service_id 
 FROM calendar
 WHERE $day = '1'";

    show_query($query);

    $result = mysqli_query($link,$query) 
        or die('Query failed: ' . mysqli_error($link) . 'ZZZ');

    while ($line = mysqli_fetch_array($result, MYSQLI_ASSOC)) {
        $service_id_out .= "," . $line["service_id"];
    }
    // echo "stop_id_out $stop_id_out<br/>";

    return trim($service_id_out,",");;
}
#################
function validate_time ($time_in) {
// validate the given date
// validate_time will return the validated time with
// single quotes or the words curtime() without quotes
// so that either can be dropped directly into the SQL

    // make sure that the time is hh:mm:ss
    $dateObj = DateTime::createFromFormat('H:i:s', $time_in);
    if ($dateObj !== false) {
        //valid time
        $delimtime = "'" . $time_in . "'";
    } else{ 
        //invalid time
        // vall bck to the current time. 
        // note that thsi is a sql function and will not run here
        $delimtime = "curtime()";
    }
    return $delimtime;
}
########################
function remove_quotes ($string) {
// given something that looks like a,b,c return 'a','b','c'
    return (str_replace("'", "", $string));


}

########################
function add_quotes ($mylist) {
// given something that looks like a,b,c return 'a','b','c'

    $items = preg_split("/[,\\s]+/", $mylist);
    $sqlItems = array();
    foreach ($items as $item) {
        if ($item == "") { next; }
	$sqlItems[] = "'" . $item . "'";
    }
    // turn arran into CSV and return
    return(implode(",", $sqlItems));
}
#####################
########################
function rem_gates ($string) {
// given something that looks like a,b,c return 'a','b','c'
    return preg_replace("/((Gate|Terminal).+)/","", $string);
}
?>


