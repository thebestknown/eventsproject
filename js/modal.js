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
