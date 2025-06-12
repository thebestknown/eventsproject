function showModal(type) {
  const content = {
    contact: `
      <h2>Contact</h2>
      <p>You can contact me at: <a href="email:jeimy@business.com">jeimy@business.com</a></p>
    `,
    privacy: `
      <h2>Privacy Policy</h2>
      <p>We value your privacy. This site does not collect personal data without your consent.</p>
    `,
    terms: `
      <h2>Terms of Service</h2>
      <p>By using this website, you agree to our terms and conditions.</p>
    `
  };
  document.getElementById("modalContent").innerHTML = content[type] || "<p>Not found.</p>";
  document.getElementById("modalOverlay").classList.remove("hidden");
}

function closeModal() {
  document.getElementById("modalOverlay").classList.add("hidden");
}

// ESC key closes modal
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeModal();
});

//closes modal box
document.addEventListener("click", (e) => {
  if (e.target.id === "modalOverlay") closeModal();
});

function openLoginModal() {
    document.getElementById("loginModal").classList.remove("hidden");
  }

  function closeLoginModal() {
    document.getElementById("loginModal").classList.add("hidden");
  }

  document.getElementById("loginForm").addEventListener("submit", function(e) {
  e.preventDefault();
  const email = document.getElementById("email").value.trim();
  const password = document.getElementById("password").value;

  // to simulate the login
  if (email === "admin@example.com" && password === "123456") {
    localStorage.setItem("isLoggedIn", "true");
    document.getElementById("loginMsg").style.color = "green";
    document.getElementById("loginMsg").innerText = "Login successful!";
    closeLoginModal();
    updateLoginStatus();
  } else {
    document.getElementById("loginMsg").innerText = "Invalid credentials";
  }
    function updateLoginStatus() {
    const isLoggedIn = localStorage.getItem("isLoggedIn") === "true";
    const loginBtn = document.getElementById("loginBtn");
    if (isLoggedIn && loginBtn) {
      loginBtn.style.display = "none";
    } 
  }
  document.addEventListener("DOMContentLoaded", () => {
    updateLoginStatus();
  });
});


