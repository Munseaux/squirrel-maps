// % of squirrels in the various districts. 
//% of squirrels shopping (in a store)
// % of squirrels out to dinner (in a resturant)
// % of squirrels visitng a museum
//look at categories of places on google and determine what good categories would be. 

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

    var expandArr = [];

    data.forEach(squirrel => {
        var lon = Number(squirrel.x);
        var lat = Number(squirrel.y);
        var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        var date = new Date(`${year}.${month}.${day}`);
        
        let centerLat = 40.785091;
        let centerLon = -73.968285;
        console.log(lon);
        console.log(lat);
        
        let latMeters = 0;
        let lonMeters = 0; //number of meters to move the point for both lat and lon. 
        let r_earth = 6378.137;
        let pi = Math.PI;
        let m = (1 / ((2 * pi / 360) * r_earth)) / 1000; //1 meter in degrees.

        //update meters depending on how close the point is to the center of central park 

        if (lat > centerLat){
            latMeters = 500;
        } else {
            latMeters = -500;
        }
        if (lon > centerLon){
            lonMeters = 500;
        } else {
            lonMeters = -500;
        }

        let newLat  = lat + (latMeters * m);
        let newLon = lon + (lonMeters * m) / Math.cos(lat * (pi / 180));


        //desperate attempts to make the lon and lat scale properly
        // lon = String(lon).slice(0,4) + Math.round((String(lon).slice(5,16) * .5))
        // lat = String(lat).slice(0,4) + Math.round((String(lat).slice(5,16) * .5))

        //number of km per degree of longitude: (pi/180) * r_earth * cos(theta*pi/180) where theta is latitude in degress and r_earth = 6378km

        //number of km per degree of latitude: (pi/180) * r_earth = 111 km / degree AKA roughly the same at all locations. 

        //therefore: 

        // new_latitude  = latitude  + (dy / r_earth) * (180 / pi);
        // new_longitude = longitude + (dx / r_earth) * (180 / pi) / cos(latitude * pi/180);

        //so therefore: 

        // number of km per degree = ~111km (111.32 in google maps, but range varies
        //between 110.567km at the equator and 111.699km at the poles)
        // 1km in degree = 1 / 111.32km = 0.0089
        // 1m in degree = 0.0089 / 1000 = 0.0000089

        

        console.log(lon);
        console.log(lat);

        var marker = L.marker([newLat,newLon]).bindPopup(`<h3>${date}</h3>`);
        expandArr.push(marker);
    });

    var expandSquirrels = L.layerGroup(expandArr);
    var overlayMaps = {
        "Extrapolated Squirrels": expandSquirrels
    };

    L.control.layers(baseMaps, overlayMaps, {
        collapsed: false
    }).addTo(myMap);

    var legend = L.control({position: "topleft"});
    legend.onAdd = function() {

        var div = L.DomUtil.create("div", "info legend");
        //this sets up a bootstrap dropdown in a legend object of leaflet. This will be used to insert charts into the dropdown so they can be expanded and contracted. insert charts as li tags inside the dropdown menu ul class. 
        div.innerHTML = "<div class=\"dropdown\"><button class=\"btn btn-secondary dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton1\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Charts</button>\"  <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton1\"></ul></div>"; 
        return div;
    };

    legend.addTo(myMap);

    //this is where the plotly logic should go. 

    
 

});
//squirrel sightings in november vs baseline. 
//squirrel location in november vs baseline
