// Main Site Funcs
var API = 'http://api.getmining.net:8080/api/';
var defaultPool = ''; //ID
// current indicator + cache
var currentPool;
var walletValue = '';
var API = '';

//For now lets just make this noice and dirty..
//document.getElementById("btg1").addEventListener("click", showBTG1);
//document.getElementById("vtc1").addEventListener("click", showVTC1);
//document.getElementById("btc1").addEventListener("click", showBTC1);
//document.getElementById("bch1").addEventListener("click", showBCH1);
//document.getElementById("dash1").addEventListener("click", showDASH1);
//document.getElementById("zec1").addEventListener("click", showZEC1);
//document.getElementById("ltc1").addEventListener("click", showLTC1);

function showPayouts(){
	if (currentPool==null){alert("You must select a pool first.");}
	//if (currentPool=='vtc1') {}
	else {alert("Payment displays per pool are not enabled yet, please search by wallet address.");}	
}

function searchWallet(){
	if (currentPool==null){alert("You must select a pool first!");}
	//else {walletQuery();}
	else {walletValue=document.getElementById("walletString").value;API='http://api.getmining.net:8080/api/pools/'+currentPool+'/miners/'+walletValue;walletQuery(API);}
	//else {alert("Wallet Searches are not enabled yet, please check back soon!");}	
}
//Load our avail pools in the top right corner
function apitrips()
{
	alert("woo");
		document.getElementById("main").innerHTML = "STICK IT IN MAIN";;
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		console.log(myObj);
		var x = 'FOUND THE THING';
		var i, j = '';
//		var myArr = myObj.pools;
		for (i in myObj) {		
  			console.log(myObj[i].trip_id);
			x += '<li>' + myObj[i].id + ' ' + myObj[i].stop_name + '</li>';		
		}//["0"].trip_id
		document.getElementById("main").innerHTML = x;
	}
}
xmlhttp.open("GET", "http://192.168.23.18/rtd-routes/api-trips.php?route=BOLT", true);
xmlhttp.send();
}
	//

//Load our avail pools in the top right corner
function loadPools()
{
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		var x = '';
		var i, j = '';
		var myArr = myObj.pools;
		for (i in myArr) {			
			x += '<li><a href="'+myObj.pools[i].id+'.html">' + myObj.pools[i].id + '</a></li>';		
		}
		document.getElementById("CurrentID").innerHTML = x;
	}
}
xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools", true);
xmlhttp.send();
}
	//########################
//This is executed when pressing the Pools navbar link
function GeneralPoolStats(){
var F = '<section class="text-center placeholders"><h1>Available Pools:</h1></section><section class="text-center"><p><img src="img/flags/us.png"> us1.getmining.net</p></section><div class="table-responsive"><table class="table table-striped"><thead><tr><th>Icon</th><th>Coin</th><th>Ports</th><th>Pool Fee</th><th>Pool Hashrate</th><th>Workers</th></tr></thead><tbody>';		
var L = '</tbody></table></div>';
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		var x = '';
		var i, j = '';
		var myArr = myObj.pools;
		for (i in myArr) {			
			x += "<tr>" ;
			x += '<td><a href="'+myObj.pools[i].id+'.html"><img src="img/coins/' + myObj.pools[i].coin.type + '.png"></a></td>';
			x += '<td><a href="'+myObj.pools[i].id+'.html">' + myObj.pools[i].coin.type + "</a></td>";
			x += "<td>";
			var myArr2 = myObj.pools[i].ports;
			for (j in myArr2) 
			{  
				x += JSON.stringify(j) + '  ';
			}
			x += "</td>";
			//x += "<td>" + myObj.pools[i].ports[0] + "</td>";
			x += "<td>" + myObj.pools[i].poolFeePercent + "%</td>";
			if ((myObj.pools[i].coin.type)==("VTC")) { x += "<td>" + hashrate((myObj.pools[i].poolStats.poolHashRate/2)) + "</td>"; }
			else { x += "<td>" + hashrate(myObj.pools[i].poolStats.poolHashRate) + "</td>"; }
			x += "<td>" + myObj.pools[i].poolStats.connectedMiners + "</td>";
			//x += "<td>" + myObj.pools[i].poolStats.validSharesPerSecond + "</td>";
			x += "</tr>";			
		}
		document.getElementById("main").innerHTML = F + x + L;
	}
}
xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools", true);
xmlhttp.send();
}
function newsPageStats(){
var F = '<section class="text-center placeholders"><h1>Available Pools:</h1></section><section class="text-center"><p><img src="img/flags/us.png"> stratum+tcp://us1.getmining.net</p></section><div class="table-responsive"><table class="table table-striped"><thead><tr><th>Icon</th><th>Coin</th><th>Ports</th><th>Pool Fee</th><th>Pool Hashrate</th><th>Workers</th></tr></thead><tbody>';
var L = '</tbody></table></div>';
var xmlhttp = new XMLHttpRequest();
xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		var x = '';
		var i, j = '';
		var myArr = myObj.pools;
		for (i in myArr) {			
			x += "<tr>" ;
			x += '<td><a href="'+myObj.pools[i].id+'.html"><img src="img/coins/' + myObj.pools[i].coin.type + '.png"></a></td>';
			x += '<td><a href="'+myObj.pools[i].id+'.html">' + myObj.pools[i].coin.type + "</a></td>";
			x += "<td>";
			var myArr2 = myObj.pools[i].ports;
			for (j in myArr2) 
			{  
				x += JSON.stringify(j) + '  ';
			}
			x += "</td>";
			//x += "<td>" + myObj.pools[i].ports[0] + "</td>";
			x += "<td>" + myObj.pools[i].poolFeePercent + "%</td>";
			if ((myObj.pools[i].coin.type)==("VTC")) { x += "<td>" + hashrate((myObj.pools[i].poolStats.poolHashRate/2)) + "</td>"; }
			else { x += "<td>" + hashrate(myObj.pools[i].poolStats.poolHashRate) + "</td>"; }
			x += "<td>" + myObj.pools[i].poolStats.connectedMiners + "</td>";
			//x += "<td>" + myObj.pools[i].poolStats.validSharesPerSecond + "</td>";
			x += "</tr>";			
		}
		document.getElementById("main").innerHTML = F + x + L;
	}
}
xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools", true);
xmlhttp.send();
}


//Show our VTC1 Info Page
function showVTC1() {
	var F2 = '<section class="text-center placeholders"><h1>VTC1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/VTC.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = '';		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate((myObj2.pool.poolStats.poolHashRate)/2)+'</br></br>';
			kk +=	'<b><a href="http://www.getmining.net/vtc1-payments.html">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="http://www.getmining.net/vtc1-blocks.html">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>7575</td><td>GPU Mining</td></tr><tr><td>8585</td><td>Multi GPU Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("xmain").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/vtc1", true);
	xmlhttp2.send();
}
function viewVTC1Blocks(){
	var F2 = '<section class="text-center placeholders"><h1>VTC1 Blocks Mined:</h1></section></br><section class="text-center"><p>';
	var kk = '';
	var L2 = '</p></section>';
	//alert(L2);
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			var i = '';
			for (i in myObj) {
			kk +=	'<section class="text-center table table-info">';
			kk +=	'Block Height: '+myObj[i].blockHeight+'</br>';
			kk +=	'Network Difficulty: '+myObj[i].networkDifficulty+'</br>';
			kk +=	'Status: '+myObj[i].status+'</br>';
			kk +=	'Confirmation Progress: '+myObj[i].confirmationProgress+'</br>';
			kk +=	'Effort: '+myObj[i].effort+'</br>';
			kk +=	'Transaction Confirmation Data: '+myObj[i].transactionConfirmationData+'</br>';
			kk +=	'Reward: '+(myObj[i].reward)+'</br>';
			kk +=	'<b><a href="'+(myObj[i].infoLink)+'">View This Block!</a></b></br>';
			kk +=	'Mined On: '+(myObj[i].created);
			kk +=	'</section></br></br>';
			}
		}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools/vtc1/blocks", true);
	xmlhttp.send();
}
function viewVTC1Payments(){
	var F2 = '<section class="text-center placeholders"><h1>VTC1 Pool Payments:</h1></section></br><section class="text-center"><p>';	
	var L2 = '</p></section>';
	var kk = '';
	var xmlhttp = new XMLHttpRequest();
		xmlhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj = JSON.parse(this.responseText);
			var i = '';
			for (i in myObj) {
			kk +=	'<section class="text-center table table-info">';
			kk +=	'Address: <a href="https://bitinfocharts.com/vertcoin/address/'+myObj[i].address+'">'+myObj[i].address+'</a></br>';
			kk +=	'Amount: '+myObj[i].amount+'</br>';
			kk +=	'Transaction ID: <a href="'+myObj[i].transactionInfoLink+'">'+myObj[i].transactionConfirmationData+'</a></br>';
			kk +=	'Processed At: '+myObj[i].created+'</br>';
			kk +=	'</section></br>';
			}
		}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp.open("GET", "http://api.getmining.net:8080/api/pools/vtc1/payments", true);
	xmlhttp.send();
}
//Show our BTC1 Info Page
function showBTC1() {
	var F2 = '<section class="text-center placeholders"><h1>BTC1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/BTC.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>6223</td><td>ASIC Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/btc1", true);
	xmlhttp2.send();
}
//Show our BTG1 Info Page
function showBTG1() {
	var F2 = '<section class="text-center placeholders"><h1>BTG1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/BTG.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>7001</td><td>GPU Mining</td></tr><tr><td>7002</td><td>Multi GPU Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/btg1", true);
	xmlhttp2.send();
}
//Show our DASH1 Info Page
function showDASH1() {
	var F2 = '<section class="text-center placeholders"><h1>DASH1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/DASH.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>3062</td><td>ASIC Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/dash1", true);
	xmlhttp2.send();
}
//Show our BCH1 Info Page
function showBCH1() {
	var F2 = '<section class="text-center placeholders"><h1>BCH1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/BCH.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>9090</td><td>ASIC Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/bch1", true);
	xmlhttp2.send();
}
//Show our ZEC1 Info Page
function showZEC1() {
	var F2 = '<section class="text-center placeholders"><h1>ZEC1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/ZEC.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>6060</td><td>GPU Mining</td></tr><tr><td>6061</td><td>Multi GPU Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/zec1", true);
	xmlhttp2.send();
}
//Show our LTC1 Info Page
function showLTC1() {
	var F2 = '<section class="text-center placeholders"><h1>LTC1 Pool Statistics:</h1></section><section class="text-center placeholders"><img src="img/coins/LTC.png" style="width:64px;height:64px;border:0;"></section></br><section class="text-center"><p>';
	var L2 = '</p></section>';
	var xmlhttp2 = new XMLHttpRequest();
		xmlhttp2.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			var myObj2 = JSON.parse(this.responseText);
			var kk = "";		
			kk +=	'Pool Fee: '+myObj2.pool.poolFeePercent+'%</br>';
			kk +=	'Minimum Payout: '+myObj2.pool.paymentProcessing.minimumPayment+'</br>';
			kk +=	'Payout Scheme: '+myObj2.pool.paymentProcessing.payoutScheme+'</br>';
			kk +=	'Pool Wallet: <a href="'+myObj2.pool.addressInfoLink+'">'+myObj2.pool.address+'</a></br>';
			kk +=	'Connected Miners: '+myObj2.pool.poolStats.connectedMiners+'</br>';
			kk +=	'Pool Hashrate: '+hashrate(myObj2.pool.poolStats.poolHashRate)+'</br></br>';
			kk +=	'<b><a href="#">View Pool Payout History</a></b></br>';
			kk +=	'<b><a href="#">View Blocks Mined by Pool</a></b></br></br>';
			kk +=	'Network Statuses:</br>';
			//kk +=	'Coin Network: '+myObj2.pool.networkStats.networkType+'</br>';
			kk +=	'Network Hashrate: '+hashrate(myObj2.pool.networkStats.networkHashRate)+'</br>';
			kk +=	'Network Difficulty: '+myObj2.pool.networkStats.networkDifficulty+'</br>';
			kk +=	'Network Block Height: '+myObj2.pool.networkStats.blockHeight+'</br></br>';
			kk +=	'Pool is operating on the following ports:</br>';
			kk +=	'<div class="table-danger"><table class="table table-danger"><tbody><tr><td><b>Port:</b></td><td><b>Configured Use:</b></td></tr><tr><td>4242</td><td>ASIC Mining</td></tr></tbody></table></div></br>Available On Server</br>us1.getmining.net';
			}

				document.getElementById("main").innerHTML = F2 + kk + L2;
		}
	xmlhttp2.open("GET", "http://api.getmining.net:8080/api/pools/ltc1", true);
	xmlhttp2.send();
}
//Show Our About Page
function showAboutPage(){
	var content = '';
	content += '<section class="text-center placeholders"><h1>About Getmining.Net</h1></section><section class="text-center"></br><p>GetMining.net is owned and operated by Hydra Technologies LLC. Headquartered in Denver, CO our stratum multi pools use dedicated machine clusters spread around the globe to bring each supported region the lowest possible latency. Backed by 24HR on site colocation services GetMining.net features true gigabit stratum pool infrastructure.</p></section>';
	document.getElementById("main").innerHTML = content;
}
//Show Our FAQ Page
function showFAQ(){
	var content = '';
	content += '<section class="text-center placeholders"><h1>Frequently Asked Questions</h1></section><section class="text-center"></br><h5>Do I need to register an account to mine?</h5></br><p>Registration is not required. Just configure your miner with your <b>wallet address as username and x or an identifier as password.</b> Then start mining. Your first submitted share will automatically register you with our pool.</p></br></br><h5>Why is my reported hashrate zero or different from what my miner reports?</h5></br><p>Pool and miner hashrates are re-calculated every ten minutes. Therefore it can take a maximum of ten minutes for your hashrate to update depending on the submission time of your first valid share. The hashrate we display at the pool is a rough approximation of your hashrate based on your submitted shares and can therefore differ significantly from the hashrate displayed locally. When in doubt always consider the value displayed by your miner as the correct one.</p></br></br><h5>How will I get paid?</h5></br><p>All of our pools utilize the PPLNS payout scheme. PPLNS is short for- Pay Per Last N Shares. The image below illustrates the system. One round has an arbitrary number of shares which is solely based on sheer luck. Proportional reward systems only consider shares of one round when calculating rewards. PPLNS however, uses a quite constant number N of shares for calculating rewards. This number N changes only with the difficulty:</p></br><p><img src="img/shares_round.png" alt="PPLNS" /></p></br><p>As you know the number of shares needed to solve a block within a round is different. Round one and three needed <em>(difficulty * 2)</em> shares to be solved. Round two and four are quite short rounds. There were less than <em>(difficulty * 2)</em> shares necessary to solve them. Round five however is a very long round which means the pool needed more than <em>(difficulty * 2)</em> shares to solve the block. From this follows that:</p><ul><li>Rounds one and three are like proportional rounds. All of your shares from the given round are considered for reward calculations</li><li>For rounds two and four, shares from the previous rounds are considered for calculations as well (marked green). In other words: regardless of round boundaries we always consider the last <em>(difficulty * 2)</em> shares. Your portion of the amount of shares is used to calculate your reward.</li><li>Round five however is very long. In this round your lowermost shares (within the marked red part) are silently dropped if they are not within the last <em>(difficulty * 2)</em> shares.</li></ul></br><p><strong>PPLNS favors constant and/or occasional loyal pool members over pool hoppers.</strong> Pool hoppers are betting for a &quot;quick win&quot; (like round two above) with low shares per round. If the round exceeds a certain amount of shares they hop to another proportional pool which started a new round more recently. This assures better rewards for pool hoppers over occasional or constant miners which are loyal to their pool. Pool hopping however implies that pool hoppers need to know when a round is started and how much shares are considered for reward. This is very easy with proportional reward system. While using PPLNS, this is no longer true. On long rounds (like round five above) the pool hoppers shares won’t be considered for reward calculations in favor of loyal miners. This is due to the fact that pool hoppers only mine on the beginning of rounds. On short and normal rounds pool hoppers won’t lose their shares. Due to the fact that shares from previous rounds from loyal miners are considered <strong>twice</strong> (or even more often on extremely short rounds) the pool hopper won’t get the same reward as from proportional reward system.</p><p>Assuming blocks have been found, payouts are processed and send every hour. This process is fully automated.</p></br></br><h5>When will I get paid?</h5></br><p>You wont see any balance in your account until a block has been found by the pool and after the block has reached a mature status. This may take a couple hours, depending on the coin. As soon as a block can be considered mature by the pool, your shares will be used to calculate your contribution towards finding the block. The more youve contributed, the higher your cut of the block reward will be. Your cut of the block reward will then be credited to your pending balance. If your balance reaches or exceeds the pools minimum payout amount, the pool will transfer your <b>entire</b> balance to your wallet and <b>reset</b> your pending balance to zero. The minimum payout for each pool is listed in its <b>Pool Stats</b> area.</p></br><p>We are a small pool for the time being, and as such it may take some time to find a block. On larger pools you would see some balance earlier because they will find blocks faster, but you will get a smaller share of the reward than what you would in a smaller pool. Over time you will earn more or less the same amount when mining on a large pool or on a small one.</p><p>In other words, the rewards you get on average are exactly proportional to your part in the total work done by the pool. If you mine in a pool <strong>twice as large</strong>, the pool will collect twice as much rewards but your share in them will be <strong>cut by half</strong>, meaning you get the same on average.</p></section>';
	document.getElementById("main").innerHTML = content;
}

/*
function vtcHourlyChart() {
var F3 = '<section class="text-center"><h1>24HR Stats</h1></section><div class="table-responsive"><table class="table table-striped"><thead><tr><th>Hours</th><th>Hash Rate</th><th>Miners</th></tr></thead><tbody>';		
var L3 = '</tbody></table></div>';
var xmlhttp3 = new XMLHttpRequest();
xmlhttp3.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		var i, j, x = "";
		var myArr = myObj;
		for (i in myArr.stats[i]) {	
			x += "<tr>";
			x += '<td>' + myArr2[i] + '</td>';
			x += '<td>'+myArr2[i].poolHashRate+'</td>";
			x += "<td>"+myArr2[i].connectedMiners+"</td>";
			//x += "<td>" + myArr2[i].validSharesPerSecond + " P/s</td>";
			x += "</tr>";			
		}
		document.getElementById("PoolStats").innerHTML = F3 + x + L3;
	}
}
xmlhttp3.open("GET", "http://api.getmining.net:8080/api/pools/vtc1/stats/hourly", true);
xmlhttp3.send();
}*/

//Utility Funcs
function hashrate (labelValue) {
	return Math.abs(Number(labelValue)) >= 1.0e+18
    ? Math.abs(Number(labelValue)) / 1.0e+18 + " EH/s"
	//PH/s
	: Math.abs(Number(labelValue)) >= 1.0e+15
    ? Math.abs(Number(labelValue)) / 1.0e+15 + " PH/s"
	// TH/s
	: Math.abs(Number(labelValue)) >= 1.0e+12
    ? Math.abs(Number(labelValue)) / 1.0e+12 + " TH/s"
    // Nine Zeroes for Billions
    : Math.abs(Number(labelValue)) >= 1.0e+9
    ? Math.abs(Number(labelValue)) / 1.0e+9 + " GH/s"
    // Six Zeroes for Millions 
    : Math.abs(Number(labelValue)) >= 1.0e+6
    ? Math.abs(Number(labelValue)) / 1.0e+6 + " MH/s"
    // Three Zeroes for Thousands
    : Math.abs(Number(labelValue)) >= 1.0e+3
    ? Math.abs(Number(labelValue)) / 1.0e+3 + " KH/s"
    : Math.abs(Number(labelValue));
}

function setPool(varval)
{
	currentPool= varval;
	alert(currentPool);
	//loadPoolPage();
}

function _formatter(value, decimal, unit) {
    if (value === 0) {
        return '0 ' + unit;
    } else {
        var si = [
            { value: 1e-6, symbol: "μ" },
            { value: 1e-3, symbol: "m" },
            { value: 1, symbol: "" },
            { value: 1e3, symbol: "k" },
            { value: 1e6, symbol: "M" },
            { value: 1e9, symbol: "G" },
            { value: 1e12, symbol: "T" },
            { value: 1e15, symbol: "P" },
            { value: 1e18, symbol: "E" },
        ];
        for (var i = si.length - 1; i > 0; i--) {
            if (value >= si[i].value) {
                break;
            }
        }
        return (value / si[i].value).toFixed(decimal).replace(/\.0+$|(\.[0-9]*[1-9])0+$/, "$1") + ' ' + si[i].symbol + unit;
    }
}

//Ideally tho.. this will parse out our wallet address and then pass that info along..
function walletQuery(apiurl){	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange = function() {
	if (this.readyState == 4 && this.status == 200) {
		var myObj = JSON.parse(this.responseText);
		alert('This wallet address has '+myObj.pendingShares+' Pending Shares, a Pending Balance of '+myObj.pendingBalance+' Coins, and '+myObj.totalPaid+' Coins Paid out in Total.');
	}
}
xmlhttp.open("GET", apiurl, false);
xmlhttp.send();
	
}
