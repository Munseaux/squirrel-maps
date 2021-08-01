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
    zoom: 14,
    layers: streetmap,
    scrollWheelZoom: false,
    doubleClickZoom: false
  });


  var squirrelArr = [];
  var amArr = [];
  var pmArr = [];
  var greyArr = [];
  var cinnamonArr = [];
  var blackArr = [];

  // Creating variables for days of the week
  var sunSquirrel = 0;
  var monSquirrel = 0;
  var tueSquirrel = 0;
  var wedSquirrel = 0;
  var thuSquirrel = 0;
  var friSquirrel = 0;
  var satSquirrel = 0;

  data.forEach(squirrel => {
    var lon = squirrel.x;
    var lat = squirrel.y;
    var color = squirrel.primary_fur_color;
    var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
    var date = new Date(`${year}.${month}.${day}`);

    if (date.getDay() === 0) {
      sunSquirrel++;
    }
    else if(date.getDay() === 1) {
      monSquirrel++;
    }
    else if(date.getDay() === 2) {
      tueSquirrel++;
    }
    else if(date.getDay() === 3) {
      wedSquirrel++;
    }
    else if(date.getDay() === 4) {
      thuSquirrel++;
    }
    else if(date.getDay() === 5) {
      friSquirrel++;
    }
    else if(date.getDay() === 6) {
      satSquirrel++;
    }
    

    // Creating differently colored markers for each fur color
    var graySquirrelMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-grey.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var blackSquirrelMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-black.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var redSquirrelMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });
    var unknownSquirrelMarker = new L.Icon({
      iconUrl: 'https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png',
      shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/0.7.7/images/marker-shadow.png',
      iconSize: [25, 41],
      iconAnchor: [12, 41],
      popupAnchor: [1, -34],
      shadowSize: [41, 41]
    });

    //setup markers with appropriate squirrel color and popup text. 
    if (lon) {
      if (squirrel.primary_fur_color === "Gray") {
        var marker = L.marker([lat, lon], {icon: graySquirrelMarker}).bindPopup("I'm a Gray Squirrel!");
        squirrelArr.push(marker);
      }

      else if (squirrel.primary_fur_color === "Black") {
        var marker = L.marker([lat, lon], {icon: blackSquirrelMarker}).bindPopup("My fur is black!");
        squirrelArr.push(marker);
      }

      else if (squirrel.primary_fur_color === "Cinnamon") {
        var marker = L.marker([lat, lon], {icon: redSquirrelMarker}).bindPopup("My fur is red, but some may call it 'cinnamon'");
        squirrelArr.push(marker);
      }

      else {
        var marker = L.marker([lat, lon], {icon: unknownSquirrelMarker}).bindPopup("They didn't record what color MY fur is");
        squirrelArr.push(marker);
      }
      
    }
    if (squirrel.shift === "AM") {
      
      amArr.push(marker);
    } else if (squirrel.shift === "PM") {
      pmArr.push(marker);
    }

    //undefined, grey, cinnamon, black
    if (color === "Gray"){
      grayArr.push(marker);
    } else if (color === "Cinnamon"){
      cinnamonArr.push(marker);
    } else if (color === "Black"){
      blackArr.push(marker);
    } 
    
  });
  
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

  legend.addTo(myMap);

  // Adds all squirrel markers as the default marker layer on map
  squirrels.addTo(myMap);


});
