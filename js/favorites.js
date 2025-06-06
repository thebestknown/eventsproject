document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("favoritesList");
  const favorites = JSON.parse(localStorage.getItem("favorites")) || [];

  if (favorites.length === 0) {
    container.innerHTML = "<p>No favorite events yet.</p>";
    return;
  }

  favorites.forEach(event => {
    const venue = event._embedded.venues[0];
    const image = event.images?.[0]?.url || "";

    const div = document.createElement("div");
    div.classList.add("event-card");

    div.innerHTML = `
      <img src="${image}" alt="${event.name}" class="event-img">
      <div class="event-info">
        <h3>${event.name}</h3>
        <p><strong>📍 Venue:</strong> ${venue.name} - ${venue.city.name}</p>
        <p><strong>📅 Date:</strong> ${event.dates.start.localDate}</p>
        <p><strong>⏰ Time:</strong> ${event.dates.start.localTime || "Not specified"}</p>
        <a href="${event.url}" target="_blank" class="buy-button">Buy Tickets 🎟️</a>
        <button class="remove-button" data-id="${event.id}">🗑️ Remove</button>
      </div>
    `;

    container.appendChild(div);
  });

  container.addEventListener("click", e => {
    if (e.target.classList.contains("remove-button")) {
      const id = e.target.getAttribute("data-id");
      let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
      favorites = favorites.filter(ev => ev.id !== id);
      localStorage.setItem("favorites", JSON.stringify(favorites));
      location.reload();
    }
  });
});
