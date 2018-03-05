// Main Site Funcs
//IP address at home 
var BASEAPI = 'http://192.168.23.18/rtd-routes/api-trips.php';
//ip address at work
BASEAPI = 'http://192.168.20.101/rtd-routes/api-trips.php';
var API = '';

function apitrips(arrayin) {
//	alert ('type: ' + typeof arrayin);
//	alert ('array test  ' + Array.isArray(arrayin));
//	console.log ('arrayin type: ' + typeof arrayin);
//
// we can take in a scalar, an array or an object
//
	var route_list1 = '';
	var route_list2 = '';
	var route_id = '';

	if ( Array.isArray(arrayin)) { //(["thing1","thing2"])
	    for (i = 0;i < arrayin.length; i++) {
	    	route_list1 += arrayin[i] + ",";
	    	route_list2 += "\"" + arrayin[i] + "\",";
	    }
	    //remove  trailing comma
        route_list1 = route_list1.replace(/,\s*$/, "");
        route_list2 = route_list2.replace(/,\s*$/, "");
	    API = BASEAPI  + "?route_list=" + route_list1;
	} else if (typeof arrayin == 'string') { //("thing")
		route_id=arrayin
		API = BASEAPI  + "?route=" + route_id;
	} else if ( typeof arrayin == 'object' && arrayin.route !== '') { //({route:"val"})
		route_id=arrayin.route
		API = BASEAPI  + "?route=" + route_id;
	} else 	if (typeof arrayin == 'undefined' ) { //()
		// cuz iu'm too lazy to handle proper null logic right now. 
		// planning that when i have prior history, i'' fill from that 
		route_id = "BOLT";
		API = BASEAPI + "?route=" + route_id;
	}
	alert("API AFTER " + API)
	//  we can get slick here if we want - if it's all numeric and a certain length
	// then we can assume its a trip
	// eles its a route  - might be able to check if a route with a call 
}

function after_apitrips(arrayin)
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

		var i, j = '';
		var x,y,z; // some collector varia:write
		var h;  //headers




		x = "<ul>";
		var _tripId = '';
		var _arrival_time_end = '';
		var _arrival_time_begin = '';
		var _route_id = '';
		for (i in myObj) {
			// use locObj for simpler referential syntax 
			locObj = myObj[i];		

			if (_tripId != locObj.trip_id) {

			    _route_short_name = locObj["route_short_name"] || '';
			    _route_long_name = locObj["route_long_name"] || '';
			    _route_id = locObj["route_id"] || '';
			    z += "<span class='route_name'>" + _route_id + "</span>";
			    z += "<span class='route_dest'>" + _route_long_name	 + "</span>";

				// get the last one, or blank
				z += _arrival_time_begin	+ " - " + _arrival_time_end;
				z += "<a href=\"?trip=" + _tripId + "\">detail</a>";


//set up for the last iteration of this
				_tripId = locObj.trip_id;
				_arrival_time_end = locObj.arrival_time;

			}
	

		// now let's get the things that didn't change at all 
		//
  			console.log(locObj.trip_id);
			x += '<li>' + locObj.trip_id + ' ' + locObj.stop_name;
			x += '<br>'
			x += '</li>';
			console.log(locObj);

			// stash the values of this locObj into props so we have the last record 
			// needed for getting the last arrival time in a trip before starting the next one
  			for(var prop in locObj) {
  				props[prop] = locObj[prop];
			}
		}//["0"].trip_id
		x += "</ul>"
	



		// y is for debugging purposes, shows the whole thing 
		y += '<ul>';
		for (var prop in props) {
			if (props[prop] != '') {
				y += '<li>' + prop + " " + props[prop] + '</li>';
			}
		}
		y += '</ul>';
		
	
		document.getElementById("main1").innerHTML = z;
		document.getElementById("main2").innerHTML = x;
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