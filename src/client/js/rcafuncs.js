// Main Site Funcs
var API = 'http://192.168.23.18/rtd-routes/api-trips.php?route=BOLT';


//API = 'http://192.168.20.101/rtd-routes/api-trips.php?route=BOLT';





function apitrips(arrayin)
{
	var API = 'http://192.168.23.18/rtd-routes/api-trips.php?route=BOLT';
	if (typeof arrayin == 'undefined' ) { //()
		var route_id = "BOLT";
		API += "?route=" + route_id;
	} else if (typeof arrayin !== 'string') { //("thing")
		var route_id=arrayin.route
		API += "?route=" + route_id;
	} else if ( typeof arrayin.route == 'object') { //({thing:"val"})
		var route_id=arrayin.route
		API += "?route=" + route_id;
	}	
	//  we can get slick here if we want - if it's all numeric and a certain length
	// then we can assume its a trip
	// eles its a route  - might be able to check if a route with a call 


	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);

		var x,y,z; // some collector varia:write

		var h;  //headers

        //count how many times it changes
		var props = {};



		var i, j = '';
//		var myArr = myObj.pools;
		x = "<ul>";
		var _tripId = '';
		var _arrival_time_end = '';
		var _arrival_time_begin = '';
		var _route_id = '';
		for (i in myObj) {
			locObj = myObj[i];		
			if (_tripId != locObj.trip_id) {
				// get the last one, or blank
				_arrival_time_end = props["arrival_time"] || '';
				_route_short_name = props["route_short_name"] || '';
				_route_long_name = props["route_long_name"] || '';
				_route_id = props["route_id"] || '';
				console.log("props before" + props);

				z += "<h3>" + _route_id + "</h3>";
				z += "<h4>" + _route_long_name	 + "</h4>";
				z += _arrival_time_begin	+ " - " + _arrival_time_end;
				z += "<a href=\"?trip=" + _tripId + "\">detail</a>";


				_tripId = myObj[i].trip_id;
				_arrival_time_begin = myObj[i].arrival_time;

			}
	

		// now let's get the things that didn't change at all 
		y += 'props<ul>';
		for (var prop in props) {
			if (props[prop] != '') {
				y += '<li>' + prop + " " + props[prop] + '</li>';
			}
		}
		y += '</ul>';
		//
  			console.log(locObj.trip_id);
			x += '<li>' + locObj.trip_id + ' ' + myObj[i].stop_name;
			x += '<br>'
			x += '</li>';
			console.log(locObj);
  			for(var prop in locObj) {
//  				if (!(prop in props)) {
  					props[prop] = locObj[prop];
//  				}
			}
		}//["0"].trip_id
		x += "</ul>"
	

		// // now let's get the things that didn't change at all 
		// y += '<ul>';
		// for (var prop in props) {
		// 	if (props[prop] != '') {
		// 		y += '<li>' + prop + " " + props[prop] + '</li>';
		// 	}
		// }
		// y += '</ul>';
		//##################
	
		document.getElementById("main1").innerHTML = z;
		document.getElementById("main2").innerHTML = y;
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