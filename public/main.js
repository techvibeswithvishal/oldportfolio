// ========== Contact Form Submission ==========
document.getElementById("contactForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const message = document.getElementById("message").value.trim();

  fetch("/submit-form", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ name, email, message })
  })
    .then(res => res.json())
    .then(data => {
      alert(data.message);
      document.getElementById("contactForm").reset();
    })
    .catch(err => console.error("Error submitting form:", err));
});


// ========== Theme Toggle ==========
document.addEventListener("DOMContentLoaded", function () {
  const themeToggleBtn = document.getElementById("theme-toggle");

  if (!themeToggleBtn) return;

  const root = document.documentElement;

  // Apply saved theme
  const savedTheme = localStorage.getItem("theme") || "dark";
  root.setAttribute("data-theme", savedTheme);
  themeToggleBtn.innerHTML = savedTheme === "dark" ? "🌙" : "🔆";

  // Toggle logic
  themeToggleBtn.addEventListener("click", () => {
    const current = root.getAttribute("data-theme");
    const newTheme = current === "dark" ? "light" : "dark";
    root.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
    themeToggleBtn.innerHTML = newTheme === "dark" ? "🌙" : "🔆";
  });
});
