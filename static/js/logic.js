

var myMap = L.map("map", {
    center: [40.7831, -73.9712],
    zoom: 12
  });

L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
  attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
  tileSize: 512,
  maxZoom: 18,
  zoomOffset: -1,
  id: "mapbox/streets-v11",
  accessToken: API_KEY
}).addTo(myMap);


var url = "https://data.cityofnewyork.us/resource/vfnx-vebw.json"


d3.json(url).then(data => {
  console.log(data);

  data.forEach(squirrel => {
    var lon = squirrel.x;
    var lat = squirrel.y;

    if(lon) {
      var marker = L.marker([lat, lon]).addTo(myMap);
    }


  })

})