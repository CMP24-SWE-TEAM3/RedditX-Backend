const mapbox = document.getElementById('map');

if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  mapboxgl.accessToken =
    'pk.eyJ1IjoibW9hemhhc3NhbjIwMjIiLCJhIjoiY2w4MWZzejRiMGZzbzN3cjNxZ3B5a2I5biJ9.NzdIA-vuSnyHaUr6-YGi0A';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/moazhassan2022/cl81hopvt007314pmykyygbfe',
    scrollZoom: false,
    /*center: [31.2357, 30.0444],
  zoom: 16,*/
  });
  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((loc) => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({
      element: el,
      anchor: 'bottom',
    })
      .setLngLat(loc.coordinates)
      .addTo(map);
    new mapboxgl.Popup({
      offset: 30,
    })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}`)
      .addTo(map);
    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 },
  });
}
