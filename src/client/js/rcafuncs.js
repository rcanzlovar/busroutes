// rcafuncs.js - functions for busroutes
// 

var SERVER_HOST = '192.168.23.18'; //ip address at home
//    SERVER_HOST = '192.168.20.101'; //ip address at work
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
	route_id = '';
    stop_id = '';
    trip_id = '';

	if ( Array.isArray(arrayin)) { 
	//(["thing1","thing2"])
	    for (i = 0;i < arrayin.length; i++) {
	    	route_id += arrayin[i] + ",";
	    	//route_list1 += arrayin[i] + ",";
	    	//route_list2 += "\"" + arrayin[i] + "\",";
	    }
	    //remove  trailing comma
        route_id = route_id.replace(/,\s*$/, "");
	    API = BASEAPI  + "?route=" + route_id;
	} else if (typeof arrayin == 'string') { 
	//("thing")
		route_id=arrayin
		API = BASEAPI  + "?route=" + route_id;
    } else if ( typeof arrayin == 'object' && typeof arrayin.stop == 'string') { 
    //({stop:"val"})
        stop_id=arrayin.stop
        API = BASEAPI  + "?stop=" + stop_id;
	} else if ( typeof arrayin == 'object' && typeof arrayin.route == 'string') { 
	//({route:"val"})
		route_id=arrayin.route
		API = BASEAPI  + "?route=" + route_id;
	} else if ( typeof arrayin == 'object' && typeof arrayin.trip == 'string') { 
	//({trip:"num"})
		trip_id=arrayin.trip
		API = BASEAPI  + "?trip=" + trip_id;
	} else 	if (typeof arrayin == 'undefined' ) { 
	//()
		// cuz i'm too lazy to handle proper null logic right now. 
		// planning that when i have prior history, i'' fill from that 
		API = BASEAPI;
	}
	updatestatus( "Fetching:: " + API + " ...");
	//  we can get slick here if we want - if it's all numeric and a certain length
	// then we can assume its a trip
	// eles its a route  - might be able to check if a route with a call 
}
function updatestatus(status) {
	document.getElementById("status").innerHTML = status;
//	scp -r index.html  js/ anzlovar@gator3290.hostgator.com:public_html/busroutes/ 

}

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
		var x = '';
		var x1 = '';
		var y = '';
		var y1 = '';
		var z = '';
		var z1 = '';

		var h;  //headers

		var _trip_id = '';
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
			console.log(locObj);

            // x has information about routes - small potential bug in 
            // because  
			if (_trip_id != locObj.trip_id ) {
                document.getElementById("status").innerHTML += _trip_id + ",<br>";
			    if (_trip_id) {
//    				z += "<li data-role=\"fieldcontain\" class=\"ui-field-contain ui-last-child\">";
	      		    z1 = "<h3><span class='route_name' " + 
	      		         " style=\"color:#" + locObj.route_text_color + 
	      		         ";background-color:#" + locObj.route_color + ";\">" +
	      		         locObj.route_short_name + "</span> " +
	      		         locObj.route_long_name	 + "</h3>";	
//                    z += "<li>";
//z1 = "<h3>" +  _route_short_name; 

                    z +- "<div class='trip_display' id='" + _trip_id + "'>";
	      		    z += "<div>";
	      		    z += "<span class='route_name' " + 
	      		         " style=\"color:#" + _route_text_color + 
	      		         ";background-color:#" + _route_color + ";\">&nbsp;" +
	      		         _route_short_name + "&nbsp;</span> " +
	      		         _route_long_name	 + "<br />";	
	      		         _trip_headsign	 + "</div>";	

                    z += "<a class='btn btn-sm btn-info' href='#' role='button' " + 
                        " onclick=\"apitrips({'trip':'" +  _trip_id    + "'});\">";
                    z += _arrival_time_begin + " - " + _arrival_time_end;
//	      		    z +=  _route_short_name + " - ";
//	      		    z += _route_long_name;	
                    z +=    "</a>"; 
//                    z += "<img src='img/info16.png' border=0 alt='Detail'>";
                    // get the info from the last one 

//                    z += "<span class='time'>" + _arrival_time_begin + " - " + _arrival_time_end + "</span";

                    z += "</div><br />"; // class=trip_display
//                    z += "</li>";

			    }

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

			// update this each time... 
			_arrival_time_end = locObj.arrival_time;


  			//x build the links with the stops
//  			x1 += "<h3>" + locObj.stop_name + "</h3>";
	      		    x1 = "<h3><span class='route_name' " + 
	      		         " style=\"color:#" + locObj.route_text_color + 
	      		         ";background-color:#" + locObj.route_color + ";\">" +
	      		         locObj.route_short_name + "</span> " +
	      		         locObj.route_long_name	 + "</h3>";	

//  			x1 = "<span>" + locObj.route_short_name + "</h3>";
 ////// 			x1 += "<h3>" + locObj.route_long_name + "</h3>";
//  			x1 += "<h3>" + locObj.trip_headsign + "</h3>";
            x += "<div class='trip_display' id='stop";
			x += locObj.stop_id;
            x +=  "'>";

			x += "<span class='time'>" + locObj.arrival_time + "</span>";

			x += "<a class='btn btn-sm btn-info' href='#' role='button' " +
			     " onclick=\"apitrips({'stop':'" +  locObj.stop_id    + "'});\">"; 
			x +=  locObj.stop_name + "</a>";
			x += "</div>"


            // gets stop information
            y1  =  "<h3>"; 
			y1 +=  locObj.stop_name;
            y1  +=  "</h3>"; 

            y += "<div>";

            y += "<a class='btn btn-sm btn-info' href='#' role='button' " + 
                 " onclick=\"apitrips({'trip':'" +  locObj.trip_id    + "'});\">";


//            y += "<img src='img/info16.png' border=0 alt='Detail'>";
            y  +=  locObj.departure_time; 
            y += "</a>";

            y += " <a href='#'  onclick=\"apitrips({'route':'" + locObj.route_id    + "'});\">";
            y += "<span class='route_name' " + 
                 " style=\"color:#" + locObj.route_text_color + 
                 ";background-color:#" + locObj.route_color + ";\">" +
                 locObj.route_short_name + "</span> ";
            y +=  locObj.route_long_name   + "</a>";   


            y += "</div>";

			// stash the values of this locObj into props so we have the last record 
			// needed for getting the last arrival time in a trip before starting the next one
////  			for(var prop in locObj) { props[prop] = locObj[prop]; }
		}//["0"].trip_id

//		alert("routeid:" + route_id + " stopid:" + stop_id + " tripid:" + trip_id);
	
		if (route_id != '') {
		    document.getElementById("main1").innerHTML = z1 + z;
//            document.getElementById("main2").innerHTML = x;
		}

		if (stop_id != '') {
		    document.getElementById("main1").innerHTML = y1 + y;
		}
	
		if (trip_id != '') {
		    //document.getElementById("main2").innerHTML =  x1 + x || "unaccountably empty";
		    //document.getElementById("main2").innerHTML =  x1 + x + '';
		    document.getElementById("main2").innerHTML =  x1 + x;
		}
    document.getElementById("status").innerHTML = "";
	}
}
xmlhttp.open("GET", API, true);
xmlhttp.send();
}
	//



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


function resetContact () {
	document.getElementById("main1").innerHTML = " <h4>What is this?</h4> \
          <p>Bus systems have adopted a common format called GTFS that makes it easy to describe an entire transportation \
          systen, including mapping, in a series of text (CSV) files. This system allows you to navigate around in a city's \
          public transportation system. In this incarnation, it's RTD on the Front Range of Colorado, but I've done some preliminary \
          testing using the info published by BART </p>\
          <h4>Who is Bob?</h4>\
          <p>Bob Anzlovar (rcanzlovar at gmail) is the programmer and designer of this little app. He's done a couple \
            of other versions in PHP. This is \
          showing that I can build a full stack Javascript project. Please contact me if you are interested in hiring me. </p> ";
	document.getElementById("main2").innerHTML = " <a href='http://rcanzlovar.com/'>\
          <img src='http://rcanzlovar.com/wp-content/uploads/2012/05/20120520-012031.jpg' alt='Praise Bob!'> </a>";
  document.getElementById('showHideContainer').onclick = function() {
    divTest = document.getElementById('heading');
    if (divTest.style.display === "none") {
        divTest.style.display = 'block';
    }
    else {
        divTest.style.display = "none";
    }
  }


}

function resetHead () {
	document.getElementById("heading").innerHTML = "\
<h1>Bus Routes 2018</h1>\
        <p class=\"lead\">No matter where you go, there you are. We can help. </p>\
        <p><a class=\"btn btn-lg btn-secondary\" href=\"#\" role=\"button\" onclick=\"apitrips({route:'BOLT'});\">BOLT Object</a></p>\
        <p><a class=\"btn btn-lg btn-secondary\" href=\"#\" role=\"button\" onclick=\"apitrips(['LD1','LD2','lx1','lx2']);\">LD/LX array</a></p>\
        <p><a class=\"btn btn-lg btn-secondary\" href=\"#\" role=\"button\" onclick=\"apitrips(['ff1','ff2','ff3','ff4','ff5','ff6']);\">FF array</a></p>\
        <p><a class=\"btn btn-lg btn-success\" href=\"#\" role=\"button\" onclick=\"apitrips(['0','BOLT']);\">0  and bolt array</a></p>\
        <p><a class=\"btn btn-lg btn-success\" href=\"#\" role=\"button\" onclick=\"apitrips('0');\">0 string</a></p>\
        <p><a class=\"btn btn-lg btn-info\" href=\"#\" role=\"button\" onclick=\"apitrips();\">Default</a></p>";
}


