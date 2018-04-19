// rcafuncs.js - functions for busroutes
// 
//	scp -r index.html  js/ anzlovar@gator3290.hostgator.com:public_html/busroutes/ 

// 16 apr 18 added funcionality for apigo so that now i can look things up by 
// lat/long (?q=38,-105 or ?lat=38&lon=-105) or stop=123)
// need to add  the what 3 woords fnctionality 

// 17apr18 rca 
// what3words support - 
//GET https://api.what3words.com/v2/forward?addr=descriptive.wriggle.clipped&display=full&format=json&key=11DTQNS9
//
//GET https://api.what3words.com/v2/reverse?coords=51.521251,-0.203586&display=full&format=json&key=11DTQNS9


var SERVER_HOST = '192.168.23.18'; //ip address at home
//    SERVER_HOST = '192.168.20.101'; //ip address at work
    SERVER_HOST = '127.0.0.1'; //ip address at work
//   SERVER_HOST = 'rcanzlovar.com'; //ip address at work

var BASEAPI = 'http://' + SERVER_HOST + '/busroutes/'; 


//$_GET['DEBUG'] ? $_GET['DEBUG'] : 1;
DEBUG = 1;
if (DEBUG) { console.log("DEBUG TURNED ON IN rcafuncs.js"); }

// '/rtd-routes/api-trips.php';
var API = '';

var departure_time = '';
var route_id = '';
var stop_id = '';
var stop_lat = '';
var stop_lon = '';
var trip_id = '';

// proc_geo_params - look for lat and lon parameters and put them into a form that 
// is usable by ... whatever...
// what3words wants 'coords=32-105'
// google uses g=32,-105
function proc_geo_params(arrayin) {
	var returnParams = '&';
	if ( typeof arrayin == 'object' && typeof arrayin.return == 'string' ) { 
		returnVar = arrayin.return;
	} else {
		returnVar = 'coords';
	}

	if ( typeof arrayin == 'object' && typeof arrayin.lat == 'string' && typeof arrayin.lon == 'string' ) { 
		returnParams = returnVar + '=' + arrayin.lat + ',' + arrayin.lon + '&';
		return (returnParams);
	} else {
		return ({'error':'ERROR need lat and lon'});
	}
}

///////////////////////////////////////////////////////////
// parse out parameters
function proc_params(arrayin) {
//	alert ('type: ' + typeof arrayin);
//	alert ('array test  ' + Array.isArray(arrayin));
//	console.log ('arrayin type: ' + typeof arrayin);
//
// we can take in a scalar, an array or an object
//
// start with the ? add things& and then chop the trailing & at the end 
    var myReturn = '?';

//ROUTE
	if ( Array.isArray(arrayin)) { 
	//(["thing1","thing2"])
	// make it a CSV 
	    route_id += "route=" + route_id + '&';
	    for (i = 0;i < arrayin.length; i++) {
	    	route_id += arrayin[i] + ",";
	    }
	    //remove  trailing comma
        route_id = myReturn.replace(/,\s*$/, "");
	    myReturn += route_id + '&';
	} 

	if (typeof arrayin == 'string') { 
	//("thing")
		route_id=arrayin
	    myReturn += "route=" + route_id + '&';
    }  

    // as of what time do we run this, if not now? 
	if ( typeof arrayin == 'object' && typeof arrayin.departure == 'string') { 
	//({departure:"val"})
	    departure_time = arrayin.departure;
	    myReturn += "departure=" + arrayin.departure + '&';
	} 
	
	if ( typeof arrayin == 'object' && typeof arrayin.route == 'string') { 
	//({route:"val"})
		route_id=arrayin.route
	    myReturn += "route=" + route_id + '&';
	} 

//departure
    if ( typeof arrayin == 'object' && typeof arrayin.departure == 'string') { 
    //({stop:"val"})
	    myReturn += "departure=" + arrayin.departure + '&';
	} 

//STOP
    if ( typeof arrayin == 'object' && typeof arrayin.stop == 'string') { 
    //({stop:"val"})
        stop_id=arrayin.stop
	    myReturn += "stop=" + stop_id + '&';
	} 

//TRIP
	if ( typeof arrayin == 'object' && typeof arrayin.trip == 'string') { 
	//({trip:"num"})
		trip_id=arrayin.trip
	    myReturn += "trip=" + trip_id + '&';
	} else 	if (typeof arrayin == 'undefined' ) { 
	//()
		// cuz i'm too lazy to handle proper null logic right now. 
		// planning that when i have prior history, i'' fill from that 
//		API = BASEAPI;
	}
    myReturn = myReturn.replace(/&\s*$/, "");
	// do we need to worry about whether this is the first and only param on CGI?
//	updatestatus( "Fetching <a href='" + BASEAPI + myReturn + "&DEBUG=1' target='_blank'>" + BASEAPI + myReturn + "</a>");
	return myReturn;
	//  we can get slick here if we want - if it's all numeric and a certain length
	// then we can assume its a trip
	// eles its a route  - might be able to check if a route with a call 
}
//##############################################
//////////////////////////////////////////////////////////////////////////////////////////////////
function apitrips(arrayin)
{
	var returnParams = proc_params(arrayin);
	API = BASEAPI + 'apitrips/' + returnParams;
	updatestatus( "Fetching <a href='" + API + "&DEBUG=1' target='_blank'>" + API + "</a>");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

		var i, j = '';

		var route_display = '<ul>'; // was x 
		var route_display_head = '';
		var stop_display = '<ul>';
		var stop_display_head = '';//was y
		var trip_display = "<ul>"; //was z
		var trip_display_head = '';

		var h;  //headers

		var _trip_id = '';
		var _trip_headsign = '';
		var _arrival_time_begin = '';
		var _arrival_time_end = '';
		var _route_id = '';
		var _route_color = '';
		var _route_text_color = '';
		var _route_long_name = '';
		var _route_short_name = '';

		for (i in myObj) {
			// use locObj for simpler referential syntax 
			locObj = myObj[i];		
			if (DEBUG) {
			    addstatus( "loop=" + i + ":<br>" );
			    console.log(locObj);
			}


//			_trip_headsign = locObj.trip_headsign;

//Trippin! - build a trip profile because the trip_id has changed
            // x has information about routes - small potential bug in 
            // because  
			if (_trip_id != locObj.trip_id ) {
				addstatus( "trip_id=" + _trip_id + ",<br>");
// trip_display += "<li data-role=\"fieldcontain\" class=\"ui-field-contain ui-last-child\">";
				var saveroute = function(e) { 
					if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
					if ( typeof e == 'object' && typeof e.name == 'string') { id = e.id }
					if ( typeof e == 'object' && typeof e.name == 'string') { name = e.name }
					saveThing({'stash':'routes','id': id ,'name': namee ,'result':'main1'});
	  			} 
				trip_display_head = "<h3>"; 

				// which button should we display?
				if (isThingSaved({ 'stash':"routes", 'id':locObj.route_short_name })){
	                trip_display_head += "<a class='btn btn-sm btn-warning' href='#' "
	                	+ "onclick=\"deleteThing({'stash':'routes','id':'"+ locObj.route_short_name + "','result':'main1'});\">X</a>";
				} else {
	                trip_display_head += "<a class='btn btn-sm btn-success' href='#' "
	                    + "onclick=\"saveThing({'stash':'routes','id':'"+ locObj.route_short_name + "','name':'" + locObj.route_long_name + "','result':'main1'});\">+</a>";
				}

 					//use standardized display 
 				trip_display_head += routeDisplay({
					'id':locObj.route_short_name,
					'name':locObj.route_long_name,
					'txcolor':locObj.route_text_color,
					'bgcolor':locObj.route_color
				});

				trip_display_head += "</h3>";

				trip_display += "<li class='trip_display'>";

				// put this first so it can float to the top right 
				// and make the other text flow around it

				// a trip button jas some text and a time label. 
				trip_display +=	trip_button({
					'label': _arrival_time_begin + " - " + _arrival_time_end,
					'trip_id': trip_id
				});
 
				trip_display += routeDisplay({
					'id':locObj.route_short_name,
					'name':locObj.route_long_name + "<br /><em>" +
				    _trip_headsign + "</em>",
					'txcolor':locObj.route_text_color,
					'bgcolor':locObj.route_color
				});
 					trip_display += "</li>"

/*

					 <li class='trip_display' id='123'
					   style="color:#ffffff ;background-color:#bb0000;">
					   z&nbsp;
					   BOLT&nbsp; Boulder is the place to be<br /> West bound 
					   <span style="float:right;">
					<a class='btn btn-sm btn-light btn-right' href='#' role='button'> 11:00 - 12:00 </a></span>
					</li>

*/
			    console.log("tripsign" + locObj.trip_headsign);

				//set up for the next iteration... 
                _route_id         = locObj["route_id"]         || '';
			    _route_short_name = locObj["route_short_name"] || '';
			    _route_long_name  = locObj["route_long_name"]  || '';
			    _route_color      = locObj["route_color"]      || '';
			    _trip_headsign    = locObj["trip_headsign"]    || '';
			    _route_text_color = locObj["route_text_color"] || '';
			    _trip_id          = locObj["trip_id"]          || '';
				_arrival_time_begin = locObj.departure_time;
			}
  			console.log(" again trip headsign " + locObj.trip_headsign);

			// update this each time so that when we have a change, 
			//we know what the value was on the last one... 
			_arrival_time_end = locObj.arrival_time;


//ROUTE 

	        route_display_head = "<h3><span class='route_name' "  
	            + " style=\"color:#" + locObj.route_text_color 
                + ";background-color:#" + locObj.route_color 
                + ";\">" 
	            + locObj.route_short_name + "</span>&nbsp;" 
	            + locObj.route_long_name	 + " to " + locObj.trip_headsign;

	        route_display_head += "</h3>";	
	        if (departure_time != '') {
	           route_display_head += " at " + departure_time;
	        }

			//id=stop15145
            route_display += "<li class='trip_display' id='stop" + locObj.stop_id + "'>"
                + "<a class='btn btn-sm btn-light btn-right' href='#' role='button'>" 
		        + locObj.arrival_time 
                + "</a>" 
		        + "<a class='btn btn-sm btn-outline' href='#' role='button' " 
		        + " onclick=\"apitrips({'stop':'" + locObj.stop_id + "'" 
		        + ",'departure':'" + locObj.departure_time + "'});\">"
	            + locObj.stop_name + "</a>" + "</li>";

// STOP OR I'll....
/*
  <li>
    <a class="btn btn-lg btn-light btn-right" href="#" role="button">10:12</a>
    <a class='btn btn-sm btn-secondary btn-wide' href='#' role='button' 
 onclick="apitrips({'stop':'tjonmg.stop_id'});"
 style="overflow: hidden;">
stopname</a>
  </li>
*/

            // gets stop information
            // remove "gate * " and track* at the end 
            var short_stop_name = locObj.stop_name;


            // 20180411 rca added button for adding or detracgin 
            stop_display_head  =  "<h3>"; 
			if (isThingSaved({ 'stash':"stops`", 'id':locObj.stop_id })){
                stop_display_head += "<a class='btn btn-sm btn-warning' href='#' "
                    + "onclick=\"deleteThing({'stash':'stops','id':'" + locObj.stop_id + "','result':'main2'});\">X</a>";
			} else {
                stop_display_head += "<a class='btn btn-sm btn-success' href='#' "
                    + "onclick=\"saveThing({'stash':'stops','id':'"+ locObj.stop_id + "','name':'" + locObj.stop_name + "','result':'main2'});\">+</a>";
            }
			stop_display_head +=  trimtrack(locObj.stop_name);
            stop_display_head  +=  "</h3>"; 

            stop_display += "<li>";
            // check for departure time, if we have specified a departure time,
            //then we should check the time, make the ones that are technically dead
            //red-colored so we know not to count on it
            if (departure_time != '' && departure_time > locObj.departure) {
//            	"<a class='btn btn-sm btn-danger btn-right' href='#' role='button' " 
//                + "onclick=\"apitrips({'trip':'" + locObj.trip_id    + "'});\">" 
//                + locObj.departure_time + "</a>" 
            	stop_display += 
					trip_button({
					'label': locObj.depaqrture_time,
					'trip_id': locObj.trip_id
				});
            } else {
            	stop_display += "<a class='btn btn-sm btn-info btn-right' href='#' role='button' " 
                + "onclick=\"apitrips({'trip':'" + locObj.trip_id    + "'});\">" 
                + locObj.departure_time + "</a>" 
            }

            	stop_display += "<a class='btn btn-sm btn-primary btn-wide' href='#' role='button' " 
                + " onclick=\"apitrips({'route':'" + locObj.route_short_name + "'});\">" 
 				+ routeDisplay({
						'id':locObj.route_short_name,
						'name':  locObj.trip_headsign,
						'txcolor':locObj.route_text_color,
						'bgcolor':locObj.route_color
						})
                + "</a></li>";
			// stash the values of this locObj into props so we have the last record 
			// needed for getting the last arrival time in a trip before starting the next one
		}//["0"].trip_id

		route_display += "</ul>";
		stop_display += "</ul>";
		trip_display += "</ul>";
		
		//now we assign final values to the fields... 

		//this would be a good place to sort them by time.

		// 14apr18 rca 
		//this is the only place i'm using route_id. is there a better way, perhaps
		// by the length of trip_display_head and z? and shouldn't i give those vars a better name?
		if (route_id != '') {
		    document.getElementById("route_display").innerHTML = route_display_head + route_display;
	//           document.getElementById("main2").innerHTML = x;
		}

		if (stop_id != '') {
		    document.getElementById("stop_display").innerHTML = stop_display_head + stop_display;
		}
		
		if (trip_id != '') {
		    document.getElementById("trip_display").innerHTML =  trip_display_head + trip_display;
		}
	    updatestatus("");
	}
}
xmlhttp.open("GET", API + returnParams, true);
xmlhttp.send();
}

//##############################################

function trimtrack(string) {
	// some have "gate x" "track z"
  return string.replace(/(track|gate).+$/i, ''); // $& means the whole matched string
}
//##############################################
//////////////////////////////////////////////////////////////////////////////////////////////////
// what3words support 
//apiw3w({'coords':'35,-102'})
//apiw3w({'coords':'35,-102'})=> returns 3w 
//apiw3w({'lat':'35','lon':'-102'}) => returns 3w 

//apiw3w({'addr':{{'lat':'35','lon':'-102'}})
//apiw3w({'addr':'35,-102'})
function apiw3w(arrayin)
{
	//GET https://api.what3words.com/v2/forward?addr=descriptive.wriggle.clipped&display=full&format=json&key=11DTQNS9
//
//GET https://api.what3words.com/v2/reverse?coords=51.521251,-0.203586&display=full&format=json&key=11DTQNS9
	// handle w3w things..

    console.log("arrayin");
    console.log(arrayin);

	var returnParams = proc_geo_params(arrayin);

    console.log(returnParams);
	//FORWARD
//	var MYAPI = "https://api.what3words.com/v2/forward?";
//	MYAPI += "key=11DTQNS9&";
//	MYAPI += "format=json&display=full&";
//	MYAPI += "addr=descriptive.wriggle.clipped&";

// 19apr18 rca 
// add what3words field
// ALTER TABLE `stops` ADD `what3words` VARCHAR(30) NULL DEFAULT NULL AFTER `wheelchair_boarding`, ADD UNIQUE `what3words_index` (`what3words`(30));
// UPDATE `stops` SET `what3words` = 'this.that.other' WHERE `stops`.`stop_lat` = $stop_lat AND stop_lon = $stop_lon




    var MYAPI = "https://api.what3words.com/v2/reverse?";
	MYAPI += "key=11DTQNS9&";
	MYAPI += "format=json&display=full&";
	if (typeof returnParams == 'string') { 
	    MYAPI += returnParams; 
    } else if ( typeof returnParams == 'object' && typeof arrayin.error == 'string') { 
    	console.log (returnParams.error);
    	// bail here?
    }
    // as of what time do we run this, if not now? 
    //   MYAPI += "coords=51.521251,-0.203586";

	var stop_display = '';
	var stop_display_head = "<h3><a href='http://what3words.com/'>what3words</a></h3>";


	updatestatus( "Fetching <a href='" + MYAPI + "&DEBUG=1' target='_blank'>" + MYAPI + "</a>");

	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

//        if (myObj.status.code ==  200) {
			    console.log(myObj.words);
			    console.log(myObj.crs.properties.href);
			    console.log(myObj.geometry.lat);
			    console.log(myObj.geometry.lng);
			    console.log(myObj.map);
			    console.log(myObj);

//        }
/*


		for (i in myObj) {
			// use locObj for simpler referential syntax 
			locObj = myObj[i];		
			if (DEBUG) {
			    addstatus( "loop=" + i + ":<br>" );
			    console.log(locObj);
			}

*/

	    updatestatus("");
	    return (myObj.words);
	}
}
xmlhttp.open("GET", MYAPI, true);
xmlhttp.send();
}

//################################################################

function apigeo(arrayin)
{
	var stop_display = '';
	var stop_display_head = "<h3>Nearby stops...</h3>";

	var returnParams = proc_params(arrayin);
	API = BASEAPI + 'apigeo/' + returnParams;
	updatestatus( "Fetching <a href='" + API + "&DEBUG=1' target='_blank'>" + API + "</a>");
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);


		for (i in myObj) {
			// use locObj for simpler referential syntax 
			locObj = myObj[i];		
  			console.log(" stop id " + locObj.stop_id);
			console.log(locObj);

            stop_display += "<span class='stop_display' id='stop" + locObj.stop_id + "'>"
                + "<a class='btn btn-sm btn-light btn-right' " 
				+ " href='http://maps.google.com/maps?q=" + locObj.stop_lat + "," + locObj.stop_lon + "'"
				+ " role='button'>map</a>" 
		        + "<a class='btn btn-sm btn-outline' href='#' role='button' " 
		        + " onclick=\"apitrips({'stop':'" + locObj.stop_id + "' });\">"
	            + locObj.stop_name + "</a>" 
	            + apiw3w({'lat':myObj.stoplat,'lon':myObj.stop_lon})
	            + "</span>";
		}
		if (stop_display != '') {
		    document.getElementById("stop_display").innerHTML = stop_display_head + stop_display;
		}
	    updatestatus("");
	}
}
xmlhttp.open("GET", API, true);
xmlhttp.send();
}

//################################################################
function routeDisplay (e) {
						if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
						if ( typeof e == 'object' && typeof e.name == 'string') { name = e.name }
						if ( typeof e == 'object' && typeof e.txcolor == 'string') { txcolor = e.txcolor }
						if ( typeof e == 'object' && typeof e.bgcolor == 'string') { bgcolor = e.bgcolor }
					    return "<span class='route_name' " 
	      		          + " style=\"color:#" + txcolor
	      		          + ";background-color:#" + bgcolor + ";\">" 
	      		          + id + "</span> " 
						  + name;	 
}

//################################################################
function get_location () {
	if (navigator.geolocation) {
	  navigator.geolocation.getCurrentPosition(
	          function(position) {
	            /* Geocoding based on latitude and longitude */
	            // do stuff
	            console.log(position);
	            document.write(position);
	          },
	          function(error) {
	            console.log("error is " + error);
	            document.write(error);
	          },{ timeout: 30000, enableHighAccuracy:false}
	  );
	} else {
	  document.write('Location permission denied');
	}
}


//################################################################
// I dont think this is the best way to set up the events below but ... 
function resetContact () {

	document.getElementById("blurb").innerHTML = " <h4>What is this?</h4> \
          <p>Bus systems have adopted a common format called GTFS (google transport file system or somesuch) that makes it easy to describe an entire transportation \
          systen, including detailed mapping, in a series of text (CSV) files. This system allows you to navigate around in a city's \
          public transportation system. This implementation use the iformation published by RTD on the Front Range (Denver / Boulder) of Colorado, but I've done some preliminary \
          testing using the info published by BART </p>\
          <h4>Who is Bob?</h4>\
          <p>Bob Anzlovar (rcanzlovar at gmail) is the programmer and designer of this little app. He's done a couple \
            of other versions in PHP. This is \
          showcasing a full stack Javascript project. </p><p>Please contact me if this interests you. </p>\
          Source code at <a href='http://github.com/rcanzlovar/busroutes'>github.com/rcanzlovar/busroutes</a>\
	<a href='http://rcanzlovar.com/'><img src='img/bobpic.jpg' alt='on to my website...'> </a>";

  //#######
  document.getElementById('showHideTrip').onclick = function() {
    divTest = document.getElementById('trip_display');
    if (divTest.style.display === "none") {
        document.getElementById('route_display').style.display = 'none';
        document.getElementById('stop_display').style.display = 'none';
        document.getElementById('trip_display').style.display = 'block';
    } else {
        document.getElementById('route_display').style.display = 'block';
        document.getElementById('stop_display').style.display = 'block';
        document.getElementById('trip_display').style.display = 'none';
    }
  }
  //#######
  document.getElementById('showHideRoute').onclick = function() {
    divTest = document.getElementById('route_display');
    if (divTest.style.display === "none") {
        document.getElementById('route_display').style.display = 'block';
        document.getElementById('stop_display').style.display = 'none';
        document.getElementById('trip_display').style.display = 'none';
    } else {
        document.getElementById('route_display').style.display = 'none';
        document.getElementById('stop_display').style.display = 'block';
        document.getElementById('trip_display').style.display = 'block';
    }
  }
  //#######
  document.getElementById('showHideStop').onclick = function() {
    divTest = document.getElementById('stop_display');
    if (divTest.style.display === "none") {
        document.getElementById('route_display').style.display = 'none';
        document.getElementById('stop_display').style.display = 'block';
        document.getElementById('trip_display').style.display = 'none';
//        document.getElementById('heading').style.display = 'block';
        // divTest.style.display = 'block';
    } else {
        document.getElementById('route_display').style.display = 'block';
        document.getElementById('stop_display').style.display = 'none';
        document.getElementById('trip_display').style.display = 'block';
        // divTest.style.display = "none";
    }
  }
  //#######
  document.getElementById('showHideContainer').onclick = function() {
  	  var elem = document.getElementById("showHideContainer");
  	  console.log("this hide container thing" + document.getElementById("showHideContainer"));

    divTest = document.getElementById('heading');

    if (divTest.style.display === "none") {
        document.getElementById('heading').style.display = 'block';
    } else {
        document.getElementById('heading').style.display = 'none';
    }
  }
  //#######

  document.getElementById('showHideblurb').onclick = function() {
    divTest = document.getElementById('blurb');
    if (divTest.style.display === "none") {
//        document.getElementById('heading').style.display = 'block';
        document.getElementById('blurb').style.display = 'block';
        // divTest.style.display = 'block';
    } else {
        document.getElementById('blurb').style.display = 'none';
        // divTest.style.display = "none";
    }
  }
}
//#########################################################3
// set up 'heading' element with the saved stops and routes.  
function resetHead () {
    fetchThings({'stash':'routes','result':'main1'});
    fetchThings({'stash':'stops','result':'main2'});
}

//##############################################
function addstatus(status) {
	document.getElementById("status").innerHTML += status;
}
//##############################################
function updatestatus(status) {
	if (status != '') {
		document.getElementById("status").innerHTML = 
			"<h4>"
			+ status;
			+ "<h4>";
	}	else {
		document.getElementById("status").innerHTML = status;
	}
}
//##############################################

function trimtrack(string) {
	// some have "gate x" "track z"
  return string.replace(/(track|gate).+$/i, ''); // $& means the whole matched string
}
 //######################################################
 function trip_button(arrayin) {

 	return ( "<span style='float:right;'>" 
			+ 	"<a class='btn btn-sm btn-light btn-right' href='#' role='button' " 
			+ 	" onclick=\"apitrips({'trip':'" +  arrayin.trip_id    + "'});\">" 
			+  arrayin.label
			+ 	 "</a></span>" );
 }
 //######################################################