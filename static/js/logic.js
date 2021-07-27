var url = "https://data.cityofnewyork.us/resource/vfnx-vebw.json"

d3.json(url).then(data => {
  console.log(data);
  var streetmap = L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/streets-v11",
    accessToken: API_KEY
  });

  var darkmap = L.tileLayer("https://api.mapbox.com/styles/v1/mapbox/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "dark-v10",
    accessToken: API_KEY
  });

  // Define a baseMaps object to hold our base layers
  var baseMaps = {
    "Street Map": streetmap,
    "Dark Map": darkmap
  };

  
  var myMap = L.map("map", {
    center: [40.7831, -73.9712],
    zoom: 12,
    layers: streetmap
  });


  var squirrelArr = [];
  var amArr = [];
  var pmArr = [];
  var greyArr = [];
  var cinnamonArr = [];
  var blackArr = [];
  data.forEach(squirrel => {
    var lon = squirrel.x;
    var lat = squirrel.y;
    var color = squirrel.primary_fur_color;
    if (lon) {
      var marker = L.marker([lat, lon]).bindPopup("hello");
      squirrelArr.push(marker);
    }
    if (squirrel.shift === "AM") {
      
      amArr.push(marker);
    } else if (squirrel.shift === "PM") {
      pmArr.push(marker);
    }
    //undefined, grey, cinnamon, black
    if (color === "Gray"){
      greyArr.push(marker);
    } else if (color === "Cinnamon"){
      cinnamonArr.push(marker);
    } else if (color === "Black"){
      blackArr.push(marker);
    } 
    
  });
  console.log(greyArr);
  var squirrels = L.layerGroup(squirrelArr);
  var amSquirrels = L.layerGroup(amArr);
  var pmSquirrels = L.layerGroup(pmArr);
  var greySquirrels = L.layerGroup(greyArr);
  var blackSquirrels = L.layerGroup(blackArr);
  var cinnamonSquirrels = L.layerGroup(cinnamonArr);
  var overlayMaps = {
    "Squirrels": squirrels,
    "Morning Squirrels": amSquirrels,
    "Afternoon Squirrels": pmSquirrels,
    "Grey Squirrels": greySquirrels,
    "Black Squirrels": blackSquirrels,
    "Cinnamon Squirrels": cinnamonSquirrels
  };

  L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
  }).addTo(myMap);


});








  

  