document.addEventListener("DOMContentLoaded", async () => {
  const geoapifyKey = "06fec31e7f004700b105fe676bf21b4e";
  const apiKeyTM = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";

  const city = localStorage.getItem("selectedCity") || "New York";
  const map = L.map("map").setView([0, 0], 13);

  L.tileLayer(`https://maps.geoapify.com/v1/tile/dark-matter-brown/{z}/{x}/{y}.png?apiKey=${geoapifyKey}`, {
    attribution: '&copy; <a href="https://www.geoapify.com/">Geoapify</a>',
  }).addTo(map);

  // get events by place
  const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeyTM}&city=${city}&classificationName=music`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    const events = data._embedded?.events || [];

    if (events.length === 0) {
      alert("No events found to display on the map.");
      return;
    }

    // To position the map in the first found city
    const firstVenue = events[0]._embedded.venues[0];
    const lat = firstVenue.location.latitude;
    const lon = firstVenue.location.longitude;
    map.setView([lat, lon], 12);

    // To add markers
    events.forEach(event => {
      const venue = event._embedded.venues[0];
      const coords = [venue.location.latitude, venue.location.longitude];
      const popupContent = `
        <strong>${event.name}</strong><br>
        📍 ${venue.name}<br>
        📅 ${event.dates.start.localDate}<br>
        <a href="${event.url}" target="_blank">Buy Tickets</a>
      `;

      L.marker(coords).addTo(map).bindPopup(popupContent);
    });
  } catch (err) {
    console.error("Error loading map or events:", err);
  }
});
