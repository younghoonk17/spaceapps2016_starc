function initMap() {
var map = new google.maps.Map(document.getElementById('map'), {
zoom: 3,
center: {lat: 0, lng: -180},
mapTypeId: google.maps.MapTypeId.TERRAIN
});

var flightPlanCoordinates = [
{lat: 37.772, lng: -122.214},
{lat: 21.291, lng: -157.821},
{lat: -18.142, lng: 178.431},
{lat: -27.467, lng: 153.027}
];
var flightPath = new google.maps.Polyline({
path: flightPlanCoordinates,
geodesic: true,
strokeColor: '#FF0000',
strokeOpacity: 1.0,
strokeWeight: 2
});

flightPath.setMap(map);
}


var map;
var map_marker;
var lat = null;
var lng = null;
var lineCoordinatesArray = [];

// sets your location as default
if (navigator.geolocation) {
  navigator.geolocation.getCurrentPosition(function(position) { 
    var locationMarker = null;
    if (locationMarker){
      // return if there is a locationMarker bug
      return;
    }

    lat = position.coords["latitude"];
    lng = position.coords["longitude"];

    // calls PubNub
    pubs();

    // initialize google maps
    google.maps.event.addDomListener(window, 'load', initialize());
  },
  function(error) {
    console.log("Error: ", error);
  },
  {
    enableHighAccuracy: true
  }
  );
} 

function pubs() {
	pubnub = PUBNUB.init({
		publish_key: 'publish_key',
		subscribe_key: 'subscribe_key'
	})
}
function pubs() {
  pubnub = PUBNUB.init({
    publish_key: 'demo',
    subscribe_key: 'demo'
  })

  pubnub.subscribe({
    channel: "mymaps",
    message: function(message, channel) {
      console.log(message)
      lat = message['lat'];
      lng = message['lng'];
      //custom method
      redraw();
    },
    connect: function() {console.log("PubNub Connected")}
  })
}
function initialize() {
  	var myLatLng = {lat: -36.862532, lng: 174.812334}
    var mapCanvas = document.getElementById('map');
    var mapOptions = { 
      center: new google.maps.LatLng(-36.862532, 174.812334),
      zoom: 13,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var map = new google.maps.Map(mapCanvas, mapOptions)
    var marker = new google.maps.Marker({
	    position: myLatLng,
	    map: map,
	    title: 'Hello World!'
	})
  }
google.maps.event.addDomListener(window, 'load', initialize);