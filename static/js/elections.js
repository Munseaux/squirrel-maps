var url = "https://data.cityofnewyork.us/resource/vfnx-vebw.json"

d3.json(url).then(data => {

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
        layers: streetmap
    });

    var electionArr = [];

    data.forEach(squirrel => {
        var lon = squirrel.x;
        var lat = squirrel.y;
        var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        var date = new Date(`${year}.${month}.${day}`);
        var marker = L.marker([lat,lon]).bindPopup(date);
        if (day > 15){
            electionArr.push(marker);
        }
    });
    console.log(electionArr);
    var novSquirrels = L.layerGroup(electionArr);
    var overlayMaps = {
        "Election Squirrels": novSquirrels
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "topleft"});
    legend.onAdd = function() {

        var div = L.DomUtil.create("div", "info legend");
    
        div.innerHTML = "<h3> hiya </h3>"; //add plotly graphs for election results. 
        return div;
      };
  

    legend.addTo(myMap);

    
 

});
//squirrel sightings in november vs baseline. 
//squirrel location in november vs baseline
