document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("searchBtn").addEventListener("click", () => {
    const city = document.getElementById("cityInput").value;
    if (city.trim() !== "") {
      getEventsByCity(city);
    }
  });

  async function getEventsByCity(city) {
    const apiKey = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&classificationName=music`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data._embedded) {
        renderEvents(data._embedded.events);
      } else {
        document.getElementById("eventList").innerHTML = "<p>No events found.</p>";
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

function renderEvents(events) {
  const eventList = document.getElementById("eventList");
  eventList.innerHTML = "";

  if (events.length === 0) {
    eventList.innerHTML = "<p>No events found for this city.</p>";
    return;
  }

  events.forEach(event => {
    const div = document.createElement("div");
    div.classList.add("event-card");

    const venue = event._embedded.venues[0];
    const image = event.images?.[0]?.url || "";

    div.innerHTML = `
      <img src="${image}" alt="${event.name}" class="event-img">
      <div class="event-info">
        <h3>${event.name}</h3>
        <p><strong>📍 Venue:</strong> ${venue.name} - ${venue.city.name}</p>
        <p><strong>📅 Date:</strong> ${event.dates.start.localDate}</p>
        <p><strong>⏰ Time:</strong> ${event.dates.start.localTime || "Not specified"}</p>
        <a href="${event.url}" target="_blank" class="buy-button">Buy Tickets 🎟️</a>
        <button class="details-button" data-id="${event.id}">See more</button>
      </div>
    `;

    eventList.appendChild(div);
  });

  // to see "more details"
  const detailButtons = document.querySelectorAll(".details-button");
  detailButtons.forEach(button => {
    button.addEventListener("click", () => {
      const eventId = button.getAttribute("data-id");
      localStorage.setItem("selectedEventId", eventId);
      window.location.href = "event.html";
    });
  });
}

});
