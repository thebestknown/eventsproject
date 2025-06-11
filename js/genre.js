document.addEventListener("DOMContentLoaded", () => {
  const apiKeyTM = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
  const container = document.getElementById("genreEvents");

  const genreButtons = document.querySelectorAll(".genre-btn");
  genreButtons.forEach(button => {
    button.addEventListener("click", async () => {
      const genre = button.dataset.genre;
      container.innerHTML = "<p>Loading...</p>";
      const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeyTM}&classificationName=music&genreId=${genre}&size=20`;

      try {
        const response = await fetch(`https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKeyTM}&classificationName=music&keyword=${genre}`);
        const data = await response.json();
        const events = data._embedded?.events || [];

        if (events.length === 0) {
          container.innerHTML = "<p>No events found for this genre.</p>";
          return;
        }

        container.innerHTML = "";
        events.forEach(event => {
          const venue = event._embedded.venues[0];
          const image = event.images?.[0]?.url || "";

          const card = document.createElement("div");
          card.classList.add("event-card");
          card.innerHTML = `
            <img src="${image}" alt="${event.name}" class="event-img">
            <div class="event-info">
              <h3>${event.name}</h3>
              <p><strong>📍 Venue:</strong> ${venue.name} - ${venue.city.name}</p>
              <p><strong>📅 Date:</strong> ${event.dates.start.localDate}</p>
              <a href="${event.url}" target="_blank" class="buy-button">Buy Tickets 🎟️</a>
            </div>
          `;
          container.appendChild(card);
        });

      } catch (err) {
        console.error("Error fetching events:", err);
        container.innerHTML = "<p>Error loading events.</p>";
      }
    });
  });
});
