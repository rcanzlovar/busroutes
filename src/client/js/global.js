//global.js
function hashrate (labelValue) {
    // Nine Zeroes for Billions
    return Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.abs(Number(labelValue)) / 1.0e+9 + " GH/s"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? Math.abs(Number(labelValue)) / 1.0e+6 + " MH/s"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? Math.abs(Number(labelValue)) / 1.0e+3 + " KH/s"
    : Math.abs(Number(labelValue));
}
function precisionRound(number, precision) {
  var factor = Math.pow(10, precision);
  return Math.round(number * factor) / factor;
}
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		var i, j, x = "";
		var hashnum = 0;
		var minersnum = 0;
		var myArr = myObj.pools;
		for (i in myArr) 
		{
			if ((myObj.pools[i].coin.type)==("VTC")) { hashnum += parseFloat((myObj.pools[i].poolStats.poolHashRate)/2); }
			else { hashnum += parseFloat(myObj.pools[i].poolStats.poolHashRate); }		
			minersnum += parseFloat(myObj.pools[i].poolStats.connectedMiners);		
		}
		var toteshash = hashnum.toString();
		var totesminers = minersnum.toString();
		x += '<li class="nav-item">' ;
		x += '<a class="nav-link">Total Miners: ' + totesminers + '<span class="sr-only">(current)</span></a>';
		x += '</li>';
		x += '<li class="nav-item">';
		x += '<a class="nav-link">Total Hashrate: ' + hashrate(toteshash) + '</a>';
		x += '</li>';
		x += '<li class="nav-item">';
		x += '<a class="nav-link">Servers Online: 1</a>';
		x += '</li>';
		document.getElementById("global").innerHTML = x;
	}
}
document.write("WOOOOOOOOOOOOOOOOOOOO");
//xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools", true);
//xmlhttp.send();


