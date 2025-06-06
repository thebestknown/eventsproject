document.addEventListener("DOMContentLoaded", async () => {
  const apiKey = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
  const eventId = localStorage.getItem("selectedEventId");
  if (!eventId) {
    document.getElementById("eventDetails").innerText = "No event selected.";
    return;
  }

  const backButton = document.getElementById("backButton");
  const selectedCity = localStorage.getItem("selectedCity");

  if (backButton && selectedCity) {
    backButton.setAttribute("href", `index.html?city=${encodeURIComponent(selectedCity)}`);
  } else {
    backButton.setAttribute("href", "index.html");
  }

  const url = `https://app.ticketmaster.com/discovery/v2/events/${eventId}.json?apikey=${apiKey}`;

  try {
    const response = await fetch(url);
    const event = await response.json();
    renderEventDetails(event);
  } catch (error) {
    console.error("Error fetching event details:", error);
    document.getElementById("eventDetails").innerText = "Error loading event details.";
  }
});

function renderEventDetails(event) {
  const venue = event._embedded.venues[0];
  const image = event.images?.[0]?.url || "";
  const price = event.priceRanges?.[0]?.min
    ? `$${event.priceRanges[0].min} - $${event.priceRanges[0].max}`
    : "Not specified";

  const artist = event._embedded?.attractions?.[0]?.name || "Not specified";
  const genre = event.classifications?.[0]?.genre?.name || "Not specified";
  const description = event.info || event.description || "No description available.";
  const promoter = event.promoter?.name || "Not specified";
  const address = venue.address?.line1 || "Address not available";
  const city = venue.city?.name || "";
  const country = venue.country?.name || "";
  const venueUrl = venue.url || null;

  const html = `
    <img src="${image}" alt="${event.name}" class="event-img">
    <div class="event-info">
      <h2>${event.name}</h2>
      <p><strong>🎤 Artist:</strong> ${artist}</p>
      <p><strong>📍 Venue:</strong> ${venue.name}, ${city}, ${country}</p>
      <p><strong>📬 Address:</strong> ${address}</p>
      <p><strong>🎟️ Price:</strong> ${price}</p>
      <p><strong>🗓️ Date:</strong> ${event.dates.start.localDate}</p>
      <p><strong>⏰ Time:</strong> ${event.dates.start.localTime || "Not specified"}</p>
      <p><strong>🎵 Genre:</strong> ${genre}</p>
      <p><strong>🎙️ Promoter:</strong> ${promoter}</p>
      <p><strong>ℹ️ Description:</strong> ${description}</p>
      ${
        venueUrl
          ? `<p><strong>🌐 Venue Website:</strong> <a href="${venueUrl}" target="_blank">${venueUrl}</a></p>`
          : ""
      }
      <a href="${event.url}" target="_blank" class="buy-button">Buy Tickets 🎟️</a>
    </div>
  `;

  document.getElementById("eventDetails").innerHTML = html;
}

