mapboxgl.accessToken = mapToken;
const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/mapbox/light-v10', // stylesheet location
    center: house.geometry.coordinates, // starting position [lng, lat]
    zoom: 8 // starting zoom
});

map.addControl(new mapboxgl.NavigationControl());


new mapboxgl.Marker()
    .setLngLat(house.geometry.coordinates)
    .setPopup(
        new mapboxgl.Popup({ offset: 25, className: 'pop-up', closeOnClick: true, closeButton:false })
            .setHTML(
                `<p>$${house.price} ${house.location}</p>`
            )
    )
    .addTo(map)
