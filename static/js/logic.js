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
    scrollWheelZoom: false
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
      greyArr.push(marker);
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


  // Adding legend to Squirrels are Legion tab
  var legend = L.control({position: "topleft"});
  legend.onAdd = function() {
      var div = L.DomUtil.create("div", "info legend");
      //this sets up a bootstrap dropdown in a legend object of leaflet. This will be used to insert charts into the dropdown so they can be expanded and contracted. insert charts as li tags inside the dropdown menu ul class. 
      div.innerHTML = "<div class=\"dropdown\"><button class=\"btn btn-secondary dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton1\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Charts</button>\"  <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton1\"><li><div id = \"barchart1\"></div></li><li><div id = \"piechart\"></div></li><li><div id = \"barchart2\"></div></li></ul></div>"; 
      return div;
  };


  legend.addTo(myMap);

  console.log(greyArr.length);
  console.log(blackArr.length)
  console.log(cinnamonArr.length)
  console.log(greyArr.length + blackArr.length)

  // Squirrel Demographic plot --------------------------------------------------------------------------------------------------

  var squirrelDemographicsData = [
    {
      x: ["Grey", "Black", "Cinnamon"],
      y: [greyArr.length, blackArr.length, cinnamonArr.length],
      text: "Squirrel Number",
      type:"bar",
      marker: {
        color: ['rgb(160, 160, 160)', 'rgb(32, 32, 32)', '#D2691E'],
        opacity: 0.8,
        line: {
          color: ['rgb(96, 96, 96)', 'rgb(0, 0, 0)', 'rgb(102, 51, 0)'],
          width: 3
        }
      }
    }
  ];

  var squirrelDemographicsLayout = {
    title: "Squirrel Demographics",
    yaxis: {
      title: {
        text: "Squirrel Number"
      }
    },
    xaxis: {
      title: {
        text: "Fur Color"
      }
    }
  };

  // Squirrel Demographic Pie Chart --------------------------------------------------------------------------------------------------

  var squirrelPieData = [
    {
      labels: ["Grey", "Black", "Cinnamon"],
      values: [greyArr.length, blackArr.length, cinnamonArr.length],
      text: "Squirrel Number",
      type:"pie",
      opacity: 0.8,
      marker: {
        colors: ['rgb(160, 160, 160)', 'rgb(32, 32, 32)', '#D2691E'],
        line: {
          color: ['rgb(96, 96, 96)', 'rgb(0, 0, 0)', 'rgb(102, 51, 0)'],
          width: 3
        }
      }
    }
  ];

  var squirrelPieLayout = {
    title: "Squirrel Percentage by Fur Color",
    height: 500,
    width: 700
  };


  // AM vs PM squirrel Sightings --------------------------------------------------------------------------------------------------
  var AMPMsquirrelData = [
    {
      x: ["AM", "PM"],
      y: [amArr.length, pmArr.length],
      text: "Squirrel Number",
      type:"bar",
      marker: {
        color: ['rgb(255, 255, 102)', 'rgb(102, 0, 204)'],
        opacity: 0.8,
        line: {
          color: ['rgb(255, 178, 102)', 'rgb(51, 0, 102)'],
          width: 3
        }
      }
    }
  ];

  var AMPMsquirrelLayout = {
    title: "Squirrel by AM/PM",
    yaxis: {
      title: {
        text: "Squirrel Number"
      }
    },
    xaxis: {
      title: {
        text: "Ante- or Post-Meridiem"
      }
    }
  };

  Plotly.newPlot("barchart1", squirrelDemographicsData, squirrelDemographicsLayout);
  Plotly.newPlot("piechart", squirrelPieData, squirrelPieLayout);
  Plotly.newPlot("barchart2", AMPMsquirrelData, AMPMsquirrelLayout);

  // Adds all squirrel markers as the default marker layer on map
  squirrels.addTo(myMap);


});




//TODO flask integration to serve up multiple pages. I want to be able 
// to link to other viz pages besides the default route. 
// squirrel sightings over time compared to local election results. 
//overlay increasing manhatten size to determine where squirrels would be if central park
// was the same size as the entire island. 



  

  