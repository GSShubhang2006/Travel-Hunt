const map = new mapboxgl.Map({
    accessToken: mapToken,
    container: "map",
    center: mapCoordinates,
    zoom: 12
});

const marker = new mapboxgl.Marker({color:"red"})
    .setLngLat(mapCoordinates)
    .setPopup(new mapboxgl.Popup({offset: 25, })
    
    .setHTML(`
                <div class="map-popup">
                    <h5>📍 ${Maplocation}</h5>
                    <p>Exact location after booking</p>
                </div>
            `)
    .setMaxWidth("300px")
    .addTo(map))
    .addTo(map);