// Main Site Funcs
var API = 'http://192.168.23.18/rtd-routes/api-trips.php?route=BOLT';




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

        //count how many times it changes
		var props = {};



		var i, j = '';
//		var myArr = myObj.pools;
		x = "<ul>";
		for (i in myObj) {

  			console.log(myObj[i].trip_id);
			x += '<li>' + myObj[i].trip_id + ' ' + myObj[i].stop_name;
			x += '<br>'
			x += '</li>';
			locObj = myObj[i];		
			console.log(locObj);
  			for(var prop in locObj) {
  				console.log ("prop "+prop);
  				console.log (props[prop]);
  				console.log (locObj[prop]);
  				if (!(prop in props)) {
  					props[prop] = locObj[prop];
  				} else if ( props[prop] != locObj[prop]) {
  					props[prop] = '';
  				}
			    if(myObj.hasOwnProperty(prop))
        			x += '<div>' + myObj[prop] + "</div>";
			}
		}//["0"].trip_id
		console.log(props);

		// now let's get the things that didn't change at all 
		y = '<ul>';
		for (var prop in props) {
			if (props[prop] != '') {
				y += '<li>' + prop + " " + props[prop] + '</li>';
			}
		}
		y += '</ul>';
		z += y + '<ul>' + x + '</ul>'; 
	
		document.getElementById("main1").innerHTML = x;
		document.getElementById("main2").innerHTML = y;
	}
}
xmlhttp.open("GET", API, true);
xmlhttp.send();
}
	//