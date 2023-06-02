var api = 'https://verkehr.autobahn.de/o/autobahn/'

// Initialize the map
var map = L.map('map').setView([51.1657, 10.4515], 6)

// Load the tile layer from OpenStreetMap
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    maxZoom: 18
}).addTo(map)

// Try to load the roads from the API on page load
fetchRoadData()

// Load the roads from the API
function fetchRoadData() {
    // Load the data from the API
    fetch(api)
    .then((response) => response.json())
    .then(function (json) {
        // Get the roads from the API
        var roads = json.roads

        // Check if the roads were loaded
        if (!roads) {
            alert('Error loading the roads from the API')
            return
        }

        // Create Options for the select
        var options = ''
        for (var i = 0; i < roads.length; i++) {
            options += '<option value="' + roads[i] + '">' + roads[i] + '</option>'
        }
        // Inject the options to the select
        document.getElementById('roads').innerHTML = options

        // Enable the request button
        document.getElementById('request').disabled = false
        document.getElementById('request').style.display = 'inline'

        // Disable the reload button
        document.getElementById('loadRoads').disabled = true
        document.getElementById('loadRoads').style.display = 'none'

    })
    .catch(function (error) {
        console.error(error)
        alert('Error loading the roads from the API')
    });
}

function fetchChargingStationData(){
    // Remove all markers from the map
    map.eachLayer(function (layer) {
        if (layer instanceof L.Marker) {
            map.removeLayer(layer)
        }
    })

    // Get the current road from the select
    var currentRoad = document.getElementById('roads').value.trim()

    // Load the data from the API
    fetch(api + "/" + currentRoad + "/services/electric_charging_station")
    .then((response) => response.json())
    .then(function (json) {
        // Get the chargingStations from the API
        var chargingStations = json.electric_charging_station

        // Check if the chargingStations were loaded
        if (!chargingStations) {
            alert('Error loading the charging stations from the API')
            return
        }

        // Check if the chargingStations exist on selected road
        if (chargingStations.length == 0) {
            alert('No charging stations found for the selected road')
            return
        }

        // Add markers to the map
        for (var i = 0; i < chargingStations.length; i++) {
            var chargingStation = chargingStations[i]

            // Create a marker for the chargingStation
            var marker = L.marker([chargingStation.coordinate.lat, chargingStation.coordinate.long]).addTo(map)

            // Create a readable description for the popup
            var readableDescription = ''
            chargingStation.description.forEach(element => {
                readableDescription += element + '<br>'
            });

            // Add a popup to the marker
            marker.bindPopup("<h3>" + chargingStation.title + "</h3><p>" + readableDescription + "</p>")
        }
    }).catch(function (error) {
        console.error(error)
        alert('Error loading the charging stations from the API')
    })
}