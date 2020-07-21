function create_map() {
    var mapboxAccessToken = "pk.eyJ1IjoicHpnZGllZ28iLCJhIjoiY2tjdHlvY3ZvMWY2ajJ4b3lsOHUzczhzZyJ9.7HfewqvwRHtLD341mi-5WQ";
    var map = L.map('mapid', {
        zoomControl: false,
        doubleClickZoom: false,
        zoomSnap: false,
        zoomDelta: false,
        trackResize: false,
        touchZoom: false,
        scrollWheelZoom: false
    }).setView([10.4107951, -66.7840741], 12);

    var geojson;

    var info = L.control();


    L.tileLayer('https://api.mapbox.com/styles/v1/{id}/tiles/{z}/{x}/{y}?access_token=' + mapboxAccessToken, {
        id: 'mapbox/light-v9',
        attribution: '',
        tileSize: 512,
        zoomOffset: -1
    }).addTo(map);



    d3.json(geojson_url, function (error, places) {
        if (error) console.log(error);
        geojson = L.geoJson(places.features, {
            style: style,
            onEachFeature: onEachFeature,
        }).addTo(map);
    });

    info.onAdd = function (map) {
        this._div = L.DomUtil.create('div', 'info'); // create a div with a class "info"
        this.update();
        return this._div;
    };

    // method that we will use to update the control based on feature properties passed
    info.update = function (props) {
        this._div.innerHTML = (props ?
            '<h5 class="c-' + props.supply_time + '">' + props.name + '</h5>' + mapSupplyTime(props.supply_time) :
            'Hover or click over an Area');
    };

    info.addTo(map);

    function getColor(number) {
        return number == 1 ? '#df4131' :
            number == 2 ? '#d8df31' :
            number == 3 ? '#71b56c' :
            '#FFEDA0';
    }

    function style(feature) {
        return {
            fillColor: getColor(feature.properties.supply_time),
            weight: 2,
            opacity: 1,
            color: 'white',
            dashArray: '3',
            fillOpacity: 0.7
        };
    }

    function highlightFeature(e) {
        var layer = e.target;

        layer.setStyle({
            weight: 5,
            color: '#666',
            dashArray: '',
            fillOpacity: 0.7
        });

        if (!L.Browser.ie && !L.Browser.opera && !L.Browser.edge) {
            layer.bringToFront();
        }

        info.update(layer.feature.properties);
    }

    function resetHighlight(e) {
        geojson.resetStyle(e.target);
        info.update();
    }

    function onEachFeature(feature, layer) {
        layer.on({
            mouseover: highlightFeature,
            mouseout: resetHighlight,
            click: highlightFeature,
            dblclick: resetHighlight,
        });
    }

    function mapSupplyTime(number) {
        return number == 1 ? '< 6 Hours/Week' :
            number == 2 ? '6 ~ 24 Hours/week' :
            number == 3 ? '> 24 Hours' :
            'null';
    }
}