document.addEventListener("DOMContentLoaded", async () => {
  const mapBtn = document.getElementById("toggleMapBtn");
  const mapSection = document.getElementById("mapSection");

  let mapInitialized = false;

  mapBtn.addEventListener("click", () => {
    mapSection.classList.toggle("hidden");
    if (!mapInitialized) {
      loadGlobalMap();
      mapInitialized = true;
    }
  });
});

async function loadGlobalMap() {
  const apiKeyTM = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
  const map = L.map("globalMap").setView([20, 0], 2);

  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: "© OpenStreetMap contributors"
  }).addTo(map);

  try {
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeyTM}&classificationName=music&size=100`;
    const response = await fetch(url);
    const data = await response.json();
    const events = data._embedded?.events || [];

    events.forEach(event => {
      const venue = event._embedded.venues[0];
      if (!venue?.location) return;

      const lat = venue.location.latitude;
      const lon = venue.location.longitude;

      L.marker([lat, lon]).addTo(map).bindPopup(`
        <strong>${event.name}</strong><br>
        📍 ${venue.name}, ${venue.city.name}<br>
        📅 ${event.dates.start.localDate}<br>
        <a href="${event.url}" target="_blank">Buy Tickets</a>
      `);
    });
  } catch (err) {
    console.error("Error loading global events:", err);
  }
}
