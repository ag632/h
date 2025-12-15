let map;
let markers = [];

function initMap(lat, lng) {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat, lng },
    zoom: 14
  });
}

// Get user location
navigator.geolocation.getCurrentPosition(
  position => {
    const userLat = position.coords.latitude;
    const userLng = position.coords.longitude;

    initMap(userLat, userLng);

    // User marker
    new google.maps.Marker({
      position: { lat: userLat, lng: userLng },
      map,
      label: "You"
    });

    loadBuses();
    setInterval(loadBuses, 10000); // refresh every 10 sec
  },
  () => alert("Location access required")
);

// Load bus locations
async function loadBuses() {
  const res = await fetch("/api/buses");
  const buses = await res.json();

  // Clear old markers
  markers.forEach(m => m.setMap(null));
  markers = [];

  buses.forEach(bus => {
    const marker = new google.maps.Marker({
      position: { lat: bus.lat, lng: bus.lng },
      map,
      icon: "https://maps.google.com/mapfiles/ms/icons/bus.png"
    });

    const info = new google.maps.InfoWindow({
      content: `
        <b>Route:</b> ${bus.route}<br>
        <b>Direction:</b> ${bus.direction}
      `
    });

    marker.addListener("click", () => info.open(map, marker));
    markers.push(marker);
  });
}
