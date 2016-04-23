//For Flight Logs, not for live map data
//connects to Andy's parse account
//initialization of pubnub if you want to change the pubnub make sure you change the sub key and the channel name in the ,subscribe below.
var pubnub = PUBNUB.init({
    subscribe_key: 'sub-c-2156b6e8-0867-11e6-bbd9-02ee2ddab7fe',
	restore: true,
    error: function (error) {
        console.log('Error:', error);
    }
})

//this is where we subscribe to the channel Young has set up
pubnub.subscribe({
	channel: 'test_channel', 
	connect: function (e) {console.log("Connected to pubnub")},
	message: subscribeMessageHandler, //is called everytime a message is recieved
	error: function (error) {
		console.log(JSON.stringify(error));
	}
});

function subscribeMessageHandler(message) {
	var data = convertMessageToObject(message);
	//this is where you will store and do text to speech if enable
	//storeMeasurements(data.long, data.lad)
	var textToSpeechEnabled = false;
	if (textToSpeechEnabled){
		var sentence = "Your longitude is currently " + data.long + ". Your latitude is currently " + data.lad + ".";
		textToSpeech(sentence); 
	}
	console.log(message);
	
}

function textToSpeech(text) {
	responsiveVoice.speak(text);
}

function convertMessageToObject(message) {
	var obj = {};
	var measurements = message.split(',');
	
	for(var i = 0; i < measurements.length; i++){
		var keyValuePair = measurements[i].split(':');
		var key = keyValuePair[0];
		var value = keyValuePair[1];
		obj[key] = value;
	}
	
	return obj;
}

//Must be called on page load 
function initParse() {
	Parse.initialize("olypNgwxjynxQUwH3ivOiGmh9KKnJjoLbCeUFxYb", "SXhVOd9g1JYiXNJrcdRXkjoxY0qCqrBDUioqefPW");
	console.log("Parse initialized");
}

function startFlight() {
	var Measurements = Parse.Object.extend("Flight");
    var measurements = new Measurements();
	var data = {};
	measurements.save(data, {
		success: function(object) {
			//TODO you want to store the object.id somewhere (hidden input or localstorage) so that it can be used when storing rows
			console.log("The id of your object is: " + object.id);
		},
		error: function(model, error) {
			console.log(error);
		}
	});
}

//pass in the measurements you want stored, make the data object with the key's as the column names then call measurements.save
function storeMeasurements(longitude, latitude) { //Add all columns here
    var Measurements = Parse.Object.extend("Measurements");
    var measurements = new Measurements();
	var data = {
		Longitude: longitude,
		Latitude: latitude
		//Add all columns here
	};
	measurements.save(data, {
		success: function(object) {
			console.log("The id of your object is: " + object.id);
		},
		error: function(model, error) {
			console.log(error);
		}
	});
}

//returns all measurements from the table 
function getMeasurements(){
	var Measurements = Parse.Object.extend("Measurements");
	var query = new Parse.Query("Measurements"); // change this based on what is found https://parse.com/docs/js/guide#queries to query the data
	query.find({
		success: processLogs,
		error: function(error) {
			alert('something was wrong');
		}
	});
}

//this is where you will update the html
function processLogs(data) {
	var measurements = JSON.stringify(results);
	console.log("Measurements are: ", measurements);
}
