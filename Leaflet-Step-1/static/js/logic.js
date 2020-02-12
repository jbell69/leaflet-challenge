// Store our API endpoint inside queryUrl
var queryUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

// Perform a GET request to the query URL
d3.json(queryUrl, function (data) {
  // Once we get a response, send the data.features object to the createFeatures function
  createFeatures(data.features);
});

function createFeatures(data) {
  // Create a map object
  var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom: 4
  });

  L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets-basic",
    accessToken: API_KEY
  }).addTo(myMap);

  // Loop through the features array
  data.forEach(feature => {
    var mag = feature.properties.mag;

    // Conditionals for countries points
    var color = "";
    if (mag <= 1) {
      color = "green";
    }
    else if (mag <= 2) {
      color = "yellow";
    }
    else if (mag <= 3) {
      color = "#E59866";
    }
    else if (mag <= 4) {
      color = "orange";
    }
    else if (mag <= 5) {
      color = "#D35400";
    }
    else {
      color = "red";
    }

    // Add circles to map
    L.circle([feature.geometry.coordinates[1], feature.geometry.coordinates[0]], {
      fillOpacity: 0.75,
      color: color,
      fillColor: color,
      // Adjust radius
      radius: mag * 10000
    }).bindPopup("<h3> Location: " + feature.properties.place + "<hr>Mag: " + mag + "</h3>").addTo(myMap);
  });

  // Add legend
  var legend = L.control({ position: "bottomright" });
  legend.onAdd = function () {
    var div = L.DomUtil.create("div", "info legend");
    var magLabel = ["0-1", "1-2", "2-3", "3-4", "4-5", "5+"];
    var colors = ["green", "yellow", "#E59866", "orange", "#D35400", "red"];
    var labels = [];

    // Add min & max
    var legendInfo = "<h1>Median Income</h1>" +
      "<div class=\"labels\">" +
      "<div>" + magLabel[0] + "</div>" +
      "<div>" + magLabel[magLabel.length - 1] + "</div>" +
      "</div>";

    div.innerHTML = legendInfo;

    magLabel.forEach(function (magLabel, index) {
      labels.push("<li style=\"background-color: " + colors[index] + "\"></li>");
    });

    div.innerHTML += "<ul>" + labels.join("") + "</ul>";
    return div;
  };

  // Adding legend to the map
  legend.addTo(myMap);
//   for (var i = 0; i < colors.length; i++) {
//     div.innerHTML +=
//       '<li style="background-color:' + colors[i] + '">' + magLabel[i] + '</li>';
//   }
//   div.innerHTML += "<ul>" + labels.join("") + "</ul>";
//   return div;
// }

// // Adding legend to the map
// legend.addTo(myMap);

}

