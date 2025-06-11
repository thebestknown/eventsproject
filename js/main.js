document.addEventListener("DOMContentLoaded", () => {
  const searchBtn = document.getElementById("searchBtn");
  const cityInput = document.getElementById("cityInput");

  searchBtn.addEventListener("click", () => {
    const city = cityInput.value.trim();
    if (city !== "") {
      localStorage.setItem("selectedCity", city);
      getEventsByCity(city);
    }
  });

  // to get back to the city the user searched
  const params = new URLSearchParams(window.location.search);
  const preloadedCity = params.get("city");

  if (preloadedCity) {
    cityInput.value = preloadedCity;
    getEventsByCity(preloadedCity);
  }

  // function to get the events
  async function getEventsByCity(city) {
    const apiKey = "x7MmszAlCl6Bb4QCcjuuAaEoJ0lGGCfT";
    const url = `https://app.ticketmaster.com/discovery/v2/events.json?apikey=${apiKey}&city=${city}&classificationName=music`;

    try {
      const response = await fetch(url);
      const data = await response.json();

      if (data._embedded) {
        renderEvents(data._embedded.events, city);
      } else {
        document.getElementById("eventList").innerHTML = "<p>No events found.</p>";
      }
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  }

  // to show the events
  function renderEvents(events, city) {
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
          <button class="details-button" data-id="${event.id}">See more details</button>
          <button class="favorite-button" data-id="${event.id}">❤️ Add to Favorites</button>
        </div>
      `;

      eventList.appendChild(div);
    });

    // listeners after rendering
    const detailButtons = document.querySelectorAll(".details-button");
    detailButtons.forEach(button => {
      button.addEventListener("click", () => {
        const eventId = button.getAttribute("data-id");
        localStorage.setItem("selectedEventId", eventId);
        localStorage.setItem("selectedCity", city);
        window.location.href = "event.html";
      });
    });

    // listener for favorite buttons
    const favoriteButtons = document.querySelectorAll(".favorite-button");
    favoriteButtons.forEach(button => {
      button.addEventListener("click", () => {
        const eventId = button.getAttribute("data-id");
        const selectedEvent = events.find(ev => ev.id === eventId);
        if (selectedEvent) {
          let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
          const alreadyExists = favorites.some(ev => ev.id === selectedEvent.id);
          if (!alreadyExists) {
            favorites.push(selectedEvent);
            localStorage.setItem("favorites", JSON.stringify(favorites));
            alert("Added to favorites!");
          } else {
            alert("This event is already in your favorites.");
          }
        }
      });
    });
  }

  // to save on LocalStorage 
  function saveFavorite(event) {
    let favorites = JSON.parse(localStorage.getItem("favorites")) || [];
    const exists = favorites.some(e => e.id === event.id);
    if (!exists) {
      favorites.push(event);
      localStorage.setItem("favorites", JSON.stringify(favorites));
    }
  }
});
