var mapboxAccessToken = 'pk.eyJ1IjoibWpib3ZlZSIsImEiOiJjanMyZmEwd2cwMDB1NDRsN29wczE4MWJnIn0.z_32ibKt2idp3gdsLE4QDg'

var map = L.map('map').setView([35.1095, -106.6504], 12)

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token=' + mapboxAccessToken, {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.light'
}).addTo(map)

var data = L.geoJson(parksData).addTo(map);

function getColor(d) {
    return d > 9 ? '#58508d' :
        d > 7 ? '#6f669f' :
        d > 5 ? '#877cb2' :
        d > 3 ? '#9e93c5' :
        d > 1 ? '#b6abd8' :
                '#cec4eb'
                
}

function style(feature) {
    return {
        fillColor: getColor(feature.properties.PicnicTables),
        color: getColor(feature.properties.PicnicTables),
        weight: 3,
        opacity: 1,
        fillOpacity: 0.7
    }
}

L.geoJson(parksData, {style: style}).addTo(map)

// mouse events
var geojson

function highlightFeature(e) {
    var layer = e.target

    layer.setStyle({
        weight: 2,
        color: '#666',
        fillOpacity: 0.7
    })

    if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
        layer.bringToFront()
    }

    info.update(layer.feature.properties)
}

function resetHighlight(e) {
    geojson.resetStyle(e.target)
    info.update()
}

function zoomToFeature(e) {
    map.fitBounds(e.target.getBounds())
}

function onEachFeature(feature, layer) {
    layer.on({
        mouseover: highlightFeature,
        mouseout: resetHighlight,
        click: zoomToFeature
    })
}

geojson = L.geoJson(parksData, {
    style: style,
    onEachFeature: onEachFeature
}).addTo(map)

var info = L.control()

info.onAdd = function(map) {
    this._div = L.DomUtil.create('div', 'info')
    this.update()
    return this._div
}

info.update = function(props) {
    var name
    if(props) {
        name = props.Name.toLowerCase().split(' ').map(el => el.charAt(0).toUpperCase() + el.slice(1)).join(' ')
        name.includes('Golf Course') || name.includes('Park') ? '' : name = name + ' Park'
        this._div.innerHTML = '<strong>Park: </strong>' + name + '<br><strong>Picnic tables: </strong>' + props.PicnicTables
    } else {
        this._div.innerHTML = 'Hover over a park'
    }
}

info.addTo(map)