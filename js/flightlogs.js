Parse.initialize("olypNgwxjynxQUwH3ivOiGmh9KKnJjoLbCeUFxYb", "SXhVOd9g1JYiXNJrcdRXkjoxY0qCqrBDUioqefPW");
console.log("Parse initialized");
getFlightLogs();

var summaryHtml = "<table>"
  + "<tbody><tr><td>Average Altitude:</td><td class=\"avgAltitude\"></td></tr>"
  + "<tr><td>Highest Altitude:</td><td class=\"topAltitude\"></td></tr>"
  + "<tr><td>Average Speed:</td><td class=\"avgSpeed\"></td></tr>" 
  + "<tr><td>Top Speed:</td><td class=\"topSpeed\"></td></tr>"
  + "<tr><td>Average Wind Speed:</td><td class=\"avgWindSpeed\"></td></tr>"
  + "<tr><td>Top Wind Speed:</td><td class=\"topWindSpeed\"></td></tr>"
  + "<tr><td>Total Flight Time: </td><td class=\"flightTime\"></td></tr>"
  + "</tbody></table>";

function getFlightLogs(){
	var Measurements = Parse.Object.extend("Flight");
	var query = new Parse.Query("Flight");
	query.find({
		success: flightLogscb,
		error: function(error) {
			console.log('something was wrong');
		}
	});
}

function flightLogscb(data){
	var flightsArr = JSON.parse(JSON.stringify(data));
	console.log("Creating table");
	$("#tblflights").html("");
	var html = "";
	
	for (var i = 0; i < flightsArr.length; i++){
		var flight = flightsArr[i];
		var createdAt = new Date(flight.createdAt);
		var flightRowHtml = "<div id=\"" + flight.objectId +"\" class=\"rowItem\"><div class=\"pilotsName\">";
		flightRowHtml += flight.pilot;
		flightRowHtml += "</div><div class=\"flightStartTime\">";
		flightRowHtml += createdAt.toDateString();
		flightRowHtml += "</div><div class=\"droneModel\">";
		flightRowHtml += flight.drone;
		flightRowHtml += "</div><div class=\"flightLocation\">";
		flightRowHtml += flight.startingLocation;
		flightRowHtml += "</div></div><div id=\"" + flight.objectId + "-summary\" class=\"summaryDiv\">" + summaryHtml + "</div>";
		
		html += flightRowHtml;
	}
	
	$("#tblflights").html(html);
	addOnClickEventHandlers(flightsArr);
	
}
function addOnClickEventHandlers(array){
	for (var i = 0; i < array.length; i++){
		var objectId = array[i].objectId;
		
		var $el = $("#" + objectId);
		
		$el.bind("click", onRowClick);
	}
}

function onRowClick(){
	var id = this.getAttribute('id');
	var $content = $("#" + id + "-summary");
	var isHidden = $content.is(":visible") == false
	$(".summaryDiv").slideUp();
	if (isHidden){
		$content.slideDown();
	}
	
	getFlightLogByID(id);
}

function getFlightLogByID(id){
	var Measurements = Parse.Object.extend("flightStats");
	var query = new Parse.Query("flightStats");
	query.equalTo("FlightID", id);
	query.find({
		success: flightStatsHandler,
		error: function(error) {
			console.log('something was wrong');
		}
	});
}

function flightStatsHandler(data){
	var stats = JSON.parse(JSON.stringify(data))[0];
	console.log(stats);
	var id = stats.FlightID;
	$("#" + id + "-summary .avgAltitude").text(stats.AverageAltitude);
	$("#" + id + "-summary .topAltitude").text(stats.HighestAltitude);
	$("#" + id + "-summary .avgSpeed").text(stats.AverageSpeed);
	$("#" + id + "-summary .topSpeed").text(stats.TopSpeed);
	$("#" + id + "-summary .avgWindSpeed").text(stats.AverageWindspeed);
	$("#" + id + "-summary .topWindSpeed").text(stats.TopWindSpeed);
	$("#" + id + "-summary .flightTime").text(stats.TotalFlightTime);
}