document.addEventListener("DOMContentLoaded", () => {
  // 1. Select Form Elements
  const form = document.getElementById("consultationForm");
  const nameInput = document.getElementById("name");
  const phoneInput = document.getElementById("phone");
  const emailInput = document.getElementById("email");
  const messageInput = document.getElementById("message");
  const countryCodeInput = document.getElementById("countryCode");
  const submitBtn = document.querySelector(".form-submit");

  window.addEventListener("pageshow", function (event) {
    if (event.persisted) {
      // Page was loaded from bfcache (back button on mobile)
      // Force a fresh reload to clear form data
      window.location.reload();
    }
  });
  // 2. Guard Clause: Safely exit if the form elements are missing on the current page
  if (!form || !nameInput || !phoneInput || !emailInput || !messageInput || !submitBtn) {
    return;
  }

  // --- Real-time Input Character Restrictions ---
  // Name: allow letters, spaces, apostrophe, hyphen, dot
  nameInput.addEventListener("input", () => {
    nameInput.value = nameInput.value.replace(/[^A-Za-z\s.'-]/g, "");
  });

  // Phone: digits only, max 10
  phoneInput.addEventListener("input", () => {
    phoneInput.value = phoneInput.value.replace(/\D/g, "").slice(0, 10);
  });

  // 3. Form Submission Handling
  form.addEventListener("submit", async (event) => {
    event.preventDefault(); // Stop default browser page reload

    // Capture and clean up values at the exact moment of submission
    const name = nameInput.value.trim();
    const phone = phoneInput.value.trim();
    const email = emailInput.value.trim();
    const message = messageInput.value.trim();
    const countryCode = countryCodeInput ? countryCodeInput.value : "";

    // --- Strict Validation Checks ---
    // Name validation
    const nameRegex = /^(?=.{3,50}$)[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/;

    if (!nameRegex.test(name)) {
      alert("Please enter a valid full name.");
      nameInput.focus();
      return;
    }

    // Phone validation
    const phoneRegex = /^[6-9]\d{9}$/;
    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid 10-digit mobile number starting with 6-9.");
      phoneInput.focus();
      return;
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/;

    if (!emailRegex.test(email)) {
      alert("Please enter a valid email address.");
      emailInput.focus();
      return;
    }

    // Message validation (Ensures genuine text length, ignoring leading/trailing spaces)
    if (message.trim().length < 10) {
      alert("Please enter a more detailed message (minimum 10 characters).");
      messageInput.focus();
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Submitting...";

    try {
      const formData = new FormData(form);

      // Overwrite phone parameter to send the cleanly combined international format
      formData.set("phone", `${countryCode} ${phone}`.trim());

      // Ensure form.action holds your endpoint (e.g., Formspree, Web3Forms, Netlify, or your backend)
      const response = await fetch(form.action, {
        method: "POST",
        body: formData,
        headers: {
          Accept: "application/json"
        }
      });

      if (!response.ok) {
        throw new Error(`Submission failed: ${response.status}`);
      }

      // Clear all form fields before leaving the page
      form.reset();

      // Redirect to thank you page
      const base = window.location.pathname.replace(/\/[^/]*$/, "/");
      window.location.href = base + "html/thank-you.html";

    } catch (error) {
      console.error("Submission Failure:", error);
      alert("Oops! Something went wrong while submitting your enquiry. Please try again later.");
    } finally {
      // Re-enable button state regardless of success or catch blocks
      submitBtn.disabled = false;
      submitBtn.textContent = "Submit Enquiry →";
    }
  });


  const hamburgerBtn = document.getElementById('hamburgerBtn');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileLinks = document.querySelectorAll('.mobile-link');

  // Toggle menu open/close
  hamburgerBtn.addEventListener('click', function () {
    hamburgerBtn.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    hamburgerBtn.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
  });

  // Close menu when a link is clicked
  mobileLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      hamburgerBtn.classList.remove('active');
      mobileMenu.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
    });
  });
});