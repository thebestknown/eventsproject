document.addEventListener("DOMContentLoaded", () => {
  const geoapifyKey = "06fec31e7f004700b105fe676bf21b4e";
  const apiKeyTM = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
  const cityInput = document.getElementById("citySearch");
  const searchBtn = document.getElementById("searchCityBtn");

  // Initialize the map centered at world view
  const map = L.map("map").setView([20, 0], 2);

  // Add Geoapify tile layer
  L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`, {
    attribution: '&copy; <a href="https://www.geoapify.com/">Geoapify</a>',
  }).addTo(map);

  // Custom icon for music events
  const musicIcon = L.icon({
    iconUrl: "assets/icons/music-icon.png",
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -30]
  });

  // Function to fetch and display events by city
  async function loadEventsByCity(city) {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeyTM}&city=${city}&classificationName=music`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      const events = data._embedded?.events || [];

      if (events.length === 0) {
        alert("No events found to display on the map.");
        return;
      }

      // To center the map based on the first venue's location
      const firstVenue = events[0]._embedded.venues[0];
      const lat = firstVenue.location.latitude;
      const lon = firstVenue.location.longitude;
      map.setView([lat, lon], 12);

      // Remove previous markers
      map.eachLayer(layer => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add new markers for events
      events.forEach(event => {
        const venue = event._embedded.venues[0];
        if (!venue?.location) return;

        const coords = [venue.location.latitude, venue.location.longitude];
        const popupContent = `
          <strong>${event.name}</strong><br>
          📍 ${venue.name}<br>
          📅 ${event.dates.start.localDate}<br>
          <a href="${event.url}" target="_blank">Buy Tickets</a>
        `;
        L.marker(coords, { icon: musicIcon }).addTo(map).bindPopup(popupContent);
      });

    } catch (err) {
      console.error("Error loading map or events:", err);
    }
  }

  // Load initial city from localStorage or default to New York
  const initialCity = localStorage.getItem("selectedCity") || "New York";
  cityInput.value = initialCity;
  loadEventsByCity(initialCity);

  searchBtn.addEventListener("click", () => {
    const newCity = cityInput.value.trim();
    if (newCity) {
      loadEventsByCity(newCity);
      localStorage.setItem("selectedCity", newCity);
    }
  });
});
