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

    var electionSquirrelData = [];
    var squirrelSightings = [];

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

    data.forEach(squirrel => {
        var lon = squirrel.x;
        var lat = squirrel.y;
        
        var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        var date = new Date(`${year}.${month}.${day}`);
        squirrelSightings.push({"Date": date, "Color": squirrel.primary_fur_color});

        var {year, month, day} = squirrel.date.match(/(?<month>\d{2})(?<day>\d{2})(?<year>\d{4})/, 'ig').groups;
        var date = new Date(`${year}.${month}.${day}`);
        var marker = L.marker([lat,lon]).bindPopup(date);
        if (day > 15) {
            if (squirrel.primary_fur_color === "Gray") {
                var marker = L.marker([lat, lon], {icon: graySquirrelMarker}).bindPopup(`<h4>${date}</h4>`);
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
            }
            else if (squirrel.primary_fur_color === "Black") {
                var marker = L.marker([lat, lon], {icon: blackSquirrelMarker}).bindPopup(`<h4>${date}</h4>`);
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
            }
            else if (squirrel.primary_fur_color === "Cinnamon") {
                var marker = L.marker([lat, lon], {icon: redSquirrelMarker}).bindPopup(`<h4>${date}</h4>`);
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
            }
            else {
                var marker = L.marker([lat, lon], {icon: unknownSquirrelMarker}).bindPopup(`<h4>${date}</h4>`);
                electionArr.push(marker);
                electionSquirrelData.push(squirrel);
            }
        }
    });
   
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
        //this sets up a bootstrap dropdown in a legend object of leaflet. This will be used to insert charts into the dropdown so they can be expanded and contracted. insert charts as li tags inside the dropdown-menu ul class. 
        div.innerHTML = "<div class=\"dropdown\"><button class=\"btn btn-secondary dropdown-toggle\" type=\"button\" id=\"dropdownMenuButton1\" data-bs-toggle=\"dropdown\" aria-expanded=\"false\">Charts</button>\"  <ul class=\"dropdown-menu\" aria-labelledby=\"dropdownMenuButton1\"><li><div id = \"barchart1\"></div></li></ul></div>";

        return div;
    };

    legend.addTo(myMap);

    let numberOfGraphs = 1;

    //this is wehre we do the plotly stuff. make sure to use electionSquirrelData array. 
    //cinnamon squirrels = republicans? grey = dems? black = independent? Does this make it a predictive model for the results. 
    //squirrel sightings in november vs baseline. 
    //squirrel location in november vs baseline.

    

    squirrelSightings.sort(function(a,b){
        return new Date(a.Date) - new Date(b.Date);
    });
    
    let blackArr=[];
    let redArr=[];
    let grayArr=[];
    
    let blackCount = 0;
    let redCount = 0;
    let grayCount =0;
    let currentDay = squirrelSightings[0].Date.getDay();
    let currentColor = "";
    for (let i=0; i<squirrelSightings.length; i++){
        
        if(squirrelSightings[i].Date.getDay() === currentDay){
            console.log(squirrelSightings[i].Color);
            
            if(squirrelSightings[i].Color === "Black"){
                blackCount++;

            }else if(squirrelSightings[i].Color === "Gray"){
                grayCount++;

            }else if(squirrelSightings[i].Color === "Cinnamon"){
                redCount++;
            } else {
                null; //handles where color is undefined. 
            }
            
        
        } else{
            blackArr.push(blackCount);
            grayArr.push(grayCount);
            redArr.push(redCount);
            blackCount = 0;
            grayCount = 0;
            redCount = 0;
        }
        currentColor = squirrelSightings[i].Color;
        currentDay = squirrelSightings[i].Date;
    }

    console.log(redArr);
    console.log(blackArr);
    console.log(grayArr);


    var trace1 = {
            x: ['2018-10-01', '2018-10-30'],
            y: grayArr,
            type: "scatter"
    };

    var trace2 = {

    }

    var trace3 = {

    }

    var squirrelElectionsLayout = {
        title: "Squirrel Demographic Trends Near Election Day"
    };    

	Plotly.newPlot("barchart1", [trace1], squirrelElectionsLayout);
    


});

