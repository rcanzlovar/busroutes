// rcafuncs.js - functions for busroutes
// 

var SERVER_HOST = '192.168.23.18'; //ip address at home
//    SERVER_HOST = '192.168.20.101'; //ip address at work
    SERVER_HOST = '127.0.0.1'; //ip address at work
//   SERVER_HOST = 'rcanzlovar.com'; //ip address at work

var BASEAPI = 'http://' + SERVER_HOST + '/busroutes/api/'; 

// '/rtd-routes/api-trips.php';
var API = '';

var route_id = '';
var trip_id = '';
var stop_id = '';

///////////////////////////////////////////////////////////
// parse out parameters
function proc_params(arrayin) {
//	alert ('type: ' + typeof arrayin);
//	alert ('array test  ' + Array.isArray(arrayin));
//	console.log ('arrayin type: ' + typeof arrayin);
//
// we can take in a scalar, an array or an object
//
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

	if ( typeof arrayin == 'object' && typeof arrayin.route == 'string') { 
	//({route:"val"})
		route_id=arrayin.route
	    myReturn += "route=" + route_id + '&';
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
	updatestatus( "Fetching <a href='" + BASEAPI + myReturn + "&DEBUG=1' target='_blank'>" + API + "</a>");
	//  we can get slick here if we want - if it's all numeric and a certain length
	// then we can assume its a trip
	// eles its a route  - might be able to check if a route with a call 
}


//##############################################
function updatestatus(status) {
	document.getElementById("status").innerHTML = status;
//	scp -r index.html  js/ anzlovar@gator3290.hostgator.com:public_html/busroutes/ 

}
//##############################################

function trimtrack(string) {
  return string.replace(/(track|gate).+$/i, ''); // $& means the whole matched string
}
//##############################################
//////////////////////////////////////////////////////////////////////////////////////////////////
function apitrips(arrayin)
{
	proc_params(arrayin);
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

		var i, j = '';
		var x,y,z; // some collector varia:write
		var x = '<ul>';
		var x1 = '';
		var y = '<ul>';
		var y1 = '';
		var z = "<ul>";
		var z1 = '';

		var h;  //headers

		var _trip_id = '';
		var _trip_headsign = '';
		var _arrival_time_begin = '';
		var _route_id = '';
		var _route_color = '';
		var _route_text_color = '';
		var _route_long_name = '';
		var _route_short_name = '';

		for (i in myObj) {
			// use locObj for simpler referential syntax 
			locObj = myObj[i];		
  			console.log(" trip id " + locObj.trip_id);
  			console.log(" trip headsign " + locObj.trip_headsign);
			_trip_headsign = locObj.trip_headsign;
			console.log(locObj);

//Trippin! - build a trip profile because the trip_id has changed
            // x has information about routes - small potential bug in 
            // because  
			if (_trip_id != locObj.trip_id ) {
                document.getElementById("status").innerHTML += _trip_id + ",<br>";
			    if (_trip_id) {
//    				z += "<li data-role=\"fieldcontain\" class=\"ui-field-contain ui-last-child\">";
					var saveroute = function(e) { 
						if ( typeof e == 'object' && typeof e.id == 'string') { id = e.id }
						if ( typeof e == 'object' && typeof e.name == 'string') { id = e.id }
						if ( typeof e == 'object' && typeof e.name == 'string') { name = e.name }
						saveThing({'stash':'routes','id': id ,'name': namee ,'result':'main1'});
		  			} 
					z1 = "<h3>"; 

					// which button should we display?
					if (isThingSaved({ 'stash':"routes", 'id':locObj.route_short_name })){
		                z1 += "<a class='btn btn-sm btn-warning' href='#' "
		                	+ "onclick=\"deleteThing({'stash':'routes','id':'"+ locObj.route_short_name + "','result':'main1'});\">X</a>";
					} else {
		                z1 += "<a class='btn btn-sm btn-success' href='#' "
		                    + "onclick=\"saveThing({'stash':'routes','id':'"+ locObj.route_short_name + "','name':'" + locObj.route_long_name + "','result':'main1'});\">+</a>";
                    }

 					//use standardized display 
 					z1 += routeDisplay({
						'id':locObj.route_short_name,
						'name':locObj.route_long_name,
						'txcolor':locObj.route_text_color,
						'bgcolor':locObj.route_color
						})

					z1 += "</h3>";

					z += "<li class='trip_display' style='color:#" +
						_route_text_color +
						";background-color:#" +
						 _route_color +
						";'>";

 					z += routeDisplay({
						'id':locObj.route_short_name,
						'name':locObj.route_long_name,
						'txcolor':locObj.route_text_color,
						'bgcolor':locObj.route_color
						})

					//"<span class='route_name'>" +
					//	_route_short_name +
					//	"</span>" + "&nbsp;" +
					//	_route_long_name + 
					z += "<br />" +
						_trip_headsign +


					z +=	"<span style='float:right;'>" +
						"<a class='btn btn-sm btn-light btn-right' href='#' role='button' " + 
						" onclick=\"apitrips({'trip':'" +  _trip_id    + "'});\">" +
						 _arrival_time_begin + " - " + _arrival_time_end +
						 "</a></span>" +
						 "</li>";
/*

					 <li class='trip_display' id='123'
					   style="color:#ffffff ;background-color:#bb0000;">
					   z&nbsp;
					   BOLT&nbsp; Boulder is the place to be<br /> West bound 
					   <span style="float:right;">
					<a class='btn btn-sm btn-light btn-right' href='#' role='button'> 11:00 - 12:00 </a></span>
					</li>

*/
			    }
			    console.log("tripsign" + locObj.trip_headsign);

				//set up for the next iteration... 
                _route_id         = locObj["route_id"]         || '';
			    _route_short_name = locObj["route_short_name"] || '';
			    _route_long_name  = locObj["route_long_name"]  || '';
			    _route_color      = locObj["route_color"]      || '';
			    _trip_headsign    = locObj.trip_headsign;
			    _route_text_color = locObj["route_text_color"] || '';
			    _trip_id          = locObj["trip_id"]          || '';
				_arrival_time_begin = locObj.departure_time;
			}
  			console.log(" again trip headsign " + locObj.trip_headsign);
			    _trip_headsign    = locObj["trip_headsign"]    || '';

			// update this each time so that when we have a change, 
			//we know what the value was on the last one... 
			_arrival_time_end = locObj.arrival_time;

  			// Build trip index 
  			//x build the links with the stops
//  			x1 += "<h3>" + locObj.stop_name + "</h3>";

	        x1 = "<h3><span class='route_name' "  
	            + " style=\"color:#" + locObj.route_text_color 
                + ";background-color:#" + locObj.route_color 
                + ";\">" 
	            + locObj.route_short_name + "</span>&nbsp;" 
	            + locObj.route_long_name	 + " -&gt; " + locObj.trip_headsign + "</h3>";	

			//id=stop15145
            x += "<li class='trip_display' id='stop" + locObj.stop_id + "'>"
                + "<a class='btn btn-sm btn-light btn-right' href='#' role='button'>" 
		        + locObj.arrival_time 
                + "</a>" 
		        + "<a class='btn btn-sm btn-outline' href='#' role='button' " 
		        + " onclick=\"apitrips({'stop':'" + locObj.stop_id + "'});\">"
	            + locObj.stop_name + "</a>" + "</li>";

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
            y1  =  "<h3>"; 
			if (isThingSaved({ 'stash':"stops`", 'id':locObj.stop_id })){
                y1 += "<a class='btn btn-sm btn-warning' href='#' "
                    + "onclick=\"deleteThing({'stash':'stops','id':'" + locObj.stop_id + "','result':'main2'});\">X</a>";
			} else {
                y1 += "<a class='btn btn-sm btn-success' href='#' "
                    + "onclick=\"saveThing({'stash':'stops','id':'"+ locObj.stop_id + "','name':'" + locObj.stop_name + "','result':'main2'});\">+</a>";
            }
			y1 +=  trimtrack(locObj.stop_name);
            y1  +=  "</h3>"; 

            y += "<li>"  
                + "<a class='btn btn-sm btn-info btn-right' href='#' role='button' " 
                + "onclick=\"apitrips({'trip':'" + locObj.trip_id    + "'});\">" 
                + locObj.departure_time + "</a>" 
                + "<a class='btn btn-sm btn-secondary btn-wide' href='#' role='button' " 
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

		x += "</ul>";
		y += "</ul>";
		z += "</ul>";
		
		//now we assign final values to the fields... 

		//this would be a good place to sort them by time.

		// 14apr18 rca 
		//this is the only place i'm using route_id. is there a better way, perhaps
		// by the length of z1 and z? and shouldn't i give those vars a better name?
		if (route_id != '') {
		    document.getElementById("route_display").innerHTML = z1 + z;
	//           document.getElementById("main2").innerHTML = x;
		}

		if (stop_id != '') {
		    document.getElementById("stop_display").innerHTML = y1 + y;
		}
		
		if (trip_id != '') {
		    document.getElementById("trip_display").innerHTML =  x1 + x;
		}
	    document.getElementById("status").innerHTML = "";
	}
}
xmlhttp.open("GET", BASEAPI + myReturn, true);
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
          showcasing a full stack Javascript project. </p><p>Please contact me if you are interested in hiring me. </p>\
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

