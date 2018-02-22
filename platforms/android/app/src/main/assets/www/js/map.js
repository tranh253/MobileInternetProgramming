var map, infoWindow;
var start,end;
function initMap() {
  var bounds = new google.maps.LatLngBounds;
  var service = new google.maps.DistanceMatrixService;
  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 40.771, lng: -73.974}
        });//show map
          var markerArray = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;

        // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;

        // Display the route between the initial start and end selections.
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markerArray, stepDisplay, map);
        // Listen to change events from the start and end lists.
        var onChangeHandler = function() {
          calculateAndDisplayRoute(
              directionsDisplay, directionsService, markerArray, stepDisplay, map);
        };

//SHOW LOCATION
  infoWindow = new google.maps.InfoWindow;
       // Try HTML5 geolocation.
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
           document.getElementById('longitude').value ="longitude: "+   position.coords.longitude;
           document.getElementById('latitude').value ="latitude: "+  position.coords.latitude;
           infoWindow.setPosition(pos);
           infoWindow.setContent('You are here');
           infoWindow.open(map);
           map.setCenter(pos);
         }, function() {
           handleLocationError(true, infoWindow, map.getCenter());
         });
       } else {
         // Browser doesn't support Geolocation
         handleLocationError(false, infoWindow, map.getCenter());
       }

  var geocoder = new google.maps.Geocoder();

  document.getElementById('submit').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  document.getElementById('destinaion').addEventListener('click', function() {
    destinationAddress(geocoder, map);
  });

  document.getElementById('dir').addEventListener('click', onChangeHandler);
  document.getElementById('dis').addEventListener('click', function() {
    distance(service,geocoder);
  });
}

function handleLocationError(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
                              'Error: The Geolocation service failed.' :
                              'Error: Your browser doesn\'t support geolocation.');
        infoWindow.open(map);
      }
//SEARCH((
function geocodeAddress(geocoder, resultsMap) {
  var address = document.getElementById('address').value;
  geocoder.geocode({'address': address}, function(results, status) {
    if (status === 'OK') { //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
      document.getElementById('longitude').value ="longitude: "+  results[0].geometry.location.lng();
      document.getElementById('latitude').value ="latitude: "+  results[0].geometry.location.lat();
      start =results[0].geometry.location;
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}
//SEARCH))
function destinationAddress(geocoder, resultsMap) {
  var address2 = document.getElementById('address2').value;
  geocoder.geocode({'address': address2}, function(results, status) {
    if (status === 'OK') { //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
      document.getElementById('longitude').value ="longitude: "+  results[0].geometry.location.lng();
      document.getElementById('latitude').value ="latitude: "+  results[0].geometry.location.lat();
      end =results[0].geometry.location;
      resultsMap.setCenter(results[0].geometry.location);
      var marker = new google.maps.Marker({
        map: resultsMap,
        position: results[0].geometry.location
      });

    } else {
      alert('Geocode was not successful for the following reason: ' + status);
    }
  });
}



//DESTIONATION
//((DESTIONATION
function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markerArray, stepDisplay, map) {
        // First, remove any existing markers from the map.
        for (var i = 0; i < markerArray.length; i++) {
          markerArray[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
          origin: document.getElementById('address').value,
          destination: document.getElementById('address2').value,
          travelMode: 'WALKING'
        }, function(response, status) {
          // Route the directions and pass the response to a function to create
          // markers for each step.
          if (status === 'OK') {
            directionsDisplay.setDirections(response);
            //DISTANCE

          } else {
            window.alert('Directions request failed due to ' + status);
          }
        });
      }


function attachInstructionText(stepDisplay, marker, text, map) {
  google.maps.event.addListener(marker, 'click', function() {
    // Open an info window when the marker is clicked on, containing the text
    // of the step.
    stepDisplay.setContent(text);
    stepDisplay.open(map, marker);
  });
}
//


//Distance
function distance(service,geocoder){

  service.getDistanceMatrix({
          origins: [document.getElementById('address').value],
          destinations: [document.getElementById('address2').value],
          travelMode: 'DRIVING',
        }, function(response, status) {
          if (status !== 'OK') {
            alert('Error was: ' + status);
          } else {
            var originList = response.originAddresses;
            var destinationList = response.destinationAddresses;
            for(var i =0; i<originList.length; i++){
              var results = response.rows[i].elements;
              for(var j=0; j<results.length;j++){
              var element = results[j];
              var dt = element.distance.text;
              document.getElementById('journey').value = dt;
              };
            };
          }
        });
}
