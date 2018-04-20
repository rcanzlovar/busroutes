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
    if (returnParams	== '') { 
    	return({'error':"no input"})
    }
    console.log("returnparams = " + returnParams);
//FORWARD get lat/lon given w3w
//	var MYAPI = "https://api.what3words.com/v2/forward?";
//	MYAPI += "key=11DTQNS9&";
//	MYAPI += "format=json&display=full&";
//	MYAPI += "addr=descriptive.wriggle.clipped&";

//BACKWARD get w3w given lat/lon
// 19apr18 rca 
// add what3words field
// ALTER TABLE `stops` ADD `what3words` VARCHAR(30) NULL DEFAULT NULL AFTER `wheelchair_boarding`, ADD UNIQUE `what3words_index` (`what3words`(30));
// UPDATE `stops` SET `what3words` = 'this.that.other' WHERE `stops`.`stop_lat` = $stop_lat AND stop_lon = $stop_lon
    var MYAPI = "https://api.what3words.com/v2/reverse?";
	MYAPI += "key=11DTQNS9&";
	MYAPI += "format=json&display=full&";
	if (typeof returnParams == 'string') { 
	    MYAPI += returnParams; 
	    console.log("MYAPI" + MYAPI); 
    } else if ( typeof returnParams == 'object' && typeof arrayin.error == 'string') { 
    	console.log ("error " + returnParams.error);
       MYAPI += "coords=51.521251,-0.203586";
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
			    console.log(myObj.map);

			    console.log("to string " + myObj.bounds.toString());
			    console.log(myObj.bounds.northeast);
			    console.log(myObj.bounds.northwest);
			    console.log(myObj.bounds.southeast);
			    console.log(myObj.bounds.southwest);

			    console.log(myObj.geometry.lat);
			    console.log(myObj.geometry.lng);
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

	    updatestatus(myObj.words);
	    var	foo = myObj.words;
	    return(foo);
	}
}
xmlhttp.open("GET", MYAPI, true);
xmlhttp.send();
}


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
