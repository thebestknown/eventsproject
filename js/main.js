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
    const container = document.getElementById("eventList");
    container.innerHTML = "";

    events.forEach(event => {
      const div = document.createElement("div");
      div.classList.add("event-card");

      div.innerHTML = `
        <h3>${event.name}</h3>
        <p><strong>Venue:</strong> ${event._embedded.venues[0].name}</p>
        <p><strong>Date:</strong> ${event.dates.start.localDate} at ${event.dates.start.localTime}</p>
        <a href="${event.url}" target="_blank">Buy Tickets 🎟️</a>
      `;

      container.appendChild(div);
    });
  }
});
