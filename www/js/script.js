var map, infoWindow;
var start,end;
function initMap() {
  var service = new google.maps.DistanceMatrixService;
  map = new google.maps.Map(document.getElementById('map'), {
          zoom: 13,
          center: {lat: 40.771, lng: -73.974}
        });//show map
          var markers = [];

        // Instantiate a directions service.
        var directionsService = new google.maps.DirectionsService;

        // Create a renderer for directions and bind it to the map.
        var directionsDisplay = new google.maps.DirectionsRenderer({map: map});

        // Instantiate an info window to hold step text.
        var stepDisplay = new google.maps.InfoWindow;

        // Display the route between the initial start and end selections.
        calculateAndDisplayRoute(
            directionsDisplay, directionsService, markers, stepDisplay, map);
        // Listen to change events from the start and end lists.
        var onChangeHandler = function() {
          calculateAndDisplayRoute(
              directionsDisplay, directionsService, markers, stepDisplay, map);
        };


  infoWindow = new google.maps.InfoWindow;
       
       if (navigator.geolocation) {
         navigator.geolocation.getCurrentPosition(function(position) {
           var pos = {
             lat: position.coords.latitude,
             lng: position.coords.longitude
           };
           document.getElementById('lat').value ="latitude: "+  position.coords.latitude;
           document.getElementById('long').value ="longitude: "+   position.coords.longitude;
           infoWindow.setPosition(pos);
           infoWindow.setContent('Your location is here');
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

  document.getElementById('search1').addEventListener('click', function() {
    geocodeAddress(geocoder, map);
  });

  document.getElementById('search2').addEventListener('click', function() {
    destinationAddress(geocoder, map);
  });

  document.getElementById('show').addEventListener('click', onChangeHandler);
  document.getElementById('distance').addEventListener('click', function() {
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
//SEARCH FIRST_ADDRESS
function geocodeAddress(geocoder, resultsMap) {
  var first_add = document.getElementById('origin').value;
  geocoder.geocode({'address': first_add}, function(results, status) {
    if (status === 'OK') { //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
      document.getElementById('lat').value ="latitude: "+  results[0].geometry.location.lat();
      document.getElementById('long').value ="longitude: "+  results[0].geometry.location.lng();
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
//SEARCH SECOND_ADDRESS
function destinationAddress(geocoder, resultsMap) {
  var second_add = document.getElementById('end').value;
  geocoder.geocode({'address': second_add}, function(results, status) {
    if (status === 'OK') { //indicates that no errors occurred; the address was successfully parsed and at least one geocode was returned.
      document.getElementById('lat').value ="latitude: "+  results[0].geometry.location.lat();
      document.getElementById('long').value ="longitude: "+  results[0].geometry.location.lng();
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

//SHOW DIRECTION
function calculateAndDisplayRoute(directionsDisplay, directionsService,
          markers, stepDisplay, map) {
        // First, remove any existing markers from the map.
        for (var i = 0; i < markers.length; i++) {
          markers[i].setMap(null);
        }

        // Retrieve the start and end locations and create a DirectionsRequest using
        // WALKING directions.
        directionsService.route({
          origin: document.getElementById('origin').value,
          destination: document.getElementById('end').value,
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


//CALCULATE DISTANCE
function distance(service,geocoder){

  service.getDistanceMatrix({
          origins: [document.getElementById('origin').value],
          destinations: [document.getElementById('end').value],
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
              document.getElementById('range').value = dt;
              };
            };
          }
        });
}
