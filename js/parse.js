//For Flight Logs, not for live map data
//connects to Andy's parse account
function initParse() {
	Parse.initialize("olypNgwxjynxQUwH3ivOiGmh9KKnJjoLbCeUFxYb", "SXhVOd9g1JYiXNJrcdRXkjoxY0qCqrBDUioqefPW");
	console.log("Parse initialized");
}

//create measurements object, add measurements object to it, saves
function storeMeasurements(longitude, latitude) {
    var Measurements = Parse.Object.extend("Measurements");
    var measurements = new Measurements();
      measurements.save({Longitude: longitude, Latitude: latitude}, {
      	//name it same as column names in table
      success: function(object) {
        console.log("The id of your object is: " + object.id);
      },
      error: function(model, error) {
        console.log(error);
      }
    });
}

//check if you can use SQL query to get data from this table (from Parse)
function getMeasurements(){
	var Measurements = Parse.Object.extend("Measurements");
	var query = new Parse.Query("Measurements");
	query.find({
		success: function(results){
			var measurements = JSON.stringify(results); 
			console.log(measurements);
		},
		error: function(error) {
			alert('something was wrong');
		}
	});
}
//after calling getmeasurements, get measurements.longitude and measurements.latitude