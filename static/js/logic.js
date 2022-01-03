// Create map
var myMap = L.map('map',{
    center:[37.0902, -95.7129],
    zoom: 5
})

// Tile layer
L.tileLayer("https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token={accessToken}", {
    attribution: "© <a href='https://www.mapbox.com/about/maps/'>Mapbox</a> © <a href='http://www.openstreetmap.org/copyright'>OpenStreetMap</a> <strong><a href='https://www.mapbox.com/map-feedback/' target='_blank'>Improve this map</a></strong>",
    tileSize: 512,
    maxZoom: 18,
    zoomOffset: -1,
    id: "mapbox/light-v10",
    accessToken: API_KEY
}).addTo(myMap);


// Circle color based on magnitude
function getColor(magnitude){
    switch(true){
        case (magnitude <= 1):
            return '#ea2c2c';
            break;
        case (magnitude <= 2):
            return '#eaa92c';
            break;
        case (magnitude <= 3):
            return '#ff9933';
            break;
        case (magnitude <= 4):
            return '#d5ea2c';
            break;
        case (magnitude <= 5):
            return '#92ea2c';
            break;
        case (magnitude > 5):
            return '#2ceabf';
            break;
        default:
            return '#2c99ea';
            break;
    }
}

// How to make circle radius function with magnitude
function getRadius(magnitude){
    switch(true){
        case (magnitude <= 1):
            return 5;
            break;
        case (magnitude <= 2):
            return 7;
            break;
        case (magnitude <= 3):
            return 9;
            break;
        case (magnitude <= 4):
            return 11;
            break;
        case (magnitude <= 5):
            return 13;
            break;
        case (magnitude > 5):
            return 15;
            break;
        default:
            return 1;
            break;
    }
}  

var GeoJSONUrl = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_month.geojson"

d3.json(GeoJSONUrl).then(function(data){

    L.geoJson(data,{
        pointToLayer: function (feature, latlng) {
            // Create circles
            return L.circleMarker(latlng, {
                radius: getRadius(feature.properties.mag),
                fillColor: getColor(feature.properties.mag),
                color: "#000",
                weight: 1,
                opacity: 1,
                fillOpacity: 0.8
            });
        },
        onEachFeature: function(feature, layer){
            layer.bindPopup(`<h3>${feature.properties.place}</h3><hr><span>Magnitude: ${feature.properties.mag}</span>`)
        }
    }).addTo(myMap);
    
    // Leaflet Legend
    var legend = L.control({position: 'bottomright'});
    legend.onAdd = function (map) {

        var div = L.DomUtil.create('div', 'info legend'),
            mag = [0, 1, 2, 3, 4, 5]
        
        div.innerHTML += "<h4>Magnitude Level</h4><hr>"
        for (var i = 0; i < mag.length; i++) {
            div.innerHTML +=
                '<i style="background:' + getColor(mag[i] + 1) + '"></i> ' +
                mag[i] + (mag[i + 1] ? '&ndash;' + mag[i + 1] + '<br>' : '+');
        }
        return div;
    };
    legend.addTo(myMap);
    
    // Legend 1: https://leafletjs.com/examples/choropleth/
    // Legend 2: https://codepen.io/haakseth/pen/KQbjdO
});