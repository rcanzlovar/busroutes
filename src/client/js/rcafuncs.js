// Main Site Funcs
var API = 'http://192.168.23.18/rtd-routes/api-trips.php?route=BOLT';


API = 'http://192.168.20.101/rtd-routes/api-trips.php?route=BOLT';





function apitrips()
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		console.log(myObj);

		var x; 
		var y; 

		var z; 

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
			if (_tripId != myObj[i].trip_id) {
				// get the last one, or blank
				_arrival_time_end = props["arrival_time"] || '';
				_route_short_name = props["route_short_name"] || '';
				_route_long_name = props["route_long_name"] || '';
				_route_id = props["route_id"] || '';

				z += "<h3>" + _route_id + "</h3>";
				z += "<h4>" + _route_long_name	 + "</h4>";
				z += _arrival_time_begin	+ " - " + _arrival_time_end;
				z += "trips.php?trip=" + _tripId	;
			    //alert(h);
			    // Now that we've taken care of the last trip, set up for the next




        //        printf("%s %s ",_route_id, _tripid);
				_tripId = myObj[i].trip_id;
				_arrival_time_begin = myObj[i].arrival_time;

			}

  			console.log(myObj[i].trip_id);
			x += '<li>' + myObj[i].trip_id + ' ' + myObj[i].stop_name;
			x += '<br>'
			x += '</li>';
			locObj = myObj[i];		
			console.log(locObj);
  			for(var prop in locObj) {
  				if (!(prop in props)) {
  					props[prop] = locObj[prop];
  				} else if ( props[prop] != locObj[prop]) {
  					props[prop] = '';
  				}
			}
		}//["0"].trip_id
		x += "</ul>"
	

		// now let's get the things that didn't change at all 
		y = '<ul>';
		for (var prop in props) {
			if (props[prop] != '') {
				y += '<li>' + prop + " " + props[prop] + '</li>';
			}
		}
		y += '</ul>';
	
		document.getElementById("main1").innerHTML = x;
		document.getElementById("main2").innerHTML = z;
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
	            console.log(error);
	            document.write(error);
	          },{ timeout: 30000, enableHighAccuracy:false}
	  );
	} else {
	  document.write('Location permission denied');
	}
}