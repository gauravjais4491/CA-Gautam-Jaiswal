/* ============================================================
   CONTACT.JS — contact.html only
   Form validation, spam honeypot, Formspree submit, thank-you redirect
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contactForm");
  if (!form) return;

  const fields = {
    name: document.getElementById("fname"),
    company: document.getElementById("fcompany"),
    email: document.getElementById("femail"),
    phone: document.getElementById("fphone"),
    service: document.getElementById("fservice"),
    message: document.getElementById("fmessage"),
  };
  const honeypot = document.getElementById("website");
  const countEl = document.getElementById("fmessageCount");
  const submitBtn = document.getElementById("btnSubmit");
  const MSG_MAX = 1000;

  /* ── Validators: return '' when valid, else an error message ──
     Keys match the `fields` map and the "f<key>Err" element ids.  */
  const validators = {
    name: function (v) {
      v = v.trim();
      if (!v) return "Please enter your name.";
      if (/\d/.test(v)) return "Name cannot contain numbers.";
      if (v.length < 3) return "Name must be at least 3 characters.";
      if (v.length > 50) return "Name is too long (50 characters max).";
      // Letters with single separators (space, dot, apostrophe, hyphen) between words.
      if (!/^[A-Za-z]+(?:[ .'-][A-Za-z]+)*$/.test(v)) {
        return "Please enter a valid full name (letters only).";
      }
      return "";
    },
    company: function (v) {
      v = v.trim();
      if (v.length > 80) return "Company name is too long (80 characters max).";
      return "";
    },
    email: function (v) {
      v = v.trim();
      if (!v) return "Please enter your email address.";
      if (v.length > 120) return "Email address is too long.";
      if (!/^[^\s@]+@[^\s@]+\.[A-Za-z]{2,}$/.test(v))
        return "Please enter a valid email address.";
      return "";
    },
    phone: function (v) {
      v = v.trim();
      if (!v) return "Please enter your mobile number.";
      if (!/^\d+$/.test(v)) return "Phone number can only contain digits.";
      if (!/^[6-9]\d{9}$/.test(v))
        return "Enter a valid 10-digit mobile number starting with 6-9.";
      return "";
    },
    message: function (v) {
      v = v.trim();
      if (!v) return "Please enter a message.";
      if (v.length < 10)
        return "Please enter a more detailed message (at least 10 characters).";
      if (v.length > MSG_MAX)
        return "Message is too long (" + MSG_MAX + " characters max).";
      return "";
    },
  };

  const KEYS = Object.keys(validators);

  function errEl(key) {
    return document.getElementById("f" + key + "Err");
  }

  function showError(key, msg) {
    const input = fields[key];
    const el = errEl(key);
    if (input) {
      input.classList.add("invalid");
      input.setAttribute("aria-invalid", "true");
    }
    if (el) {
      el.textContent = msg;
      el.classList.add("show");
    }
  }

  function clearError(key) {
    const input = fields[key];
    const el = errEl(key);
    if (input) {
      input.classList.remove("invalid");
      input.removeAttribute("aria-invalid");
    }
    if (el) {
      el.textContent = "";
      el.classList.remove("show");
    }
  }

  function validateField(key) {
    const input = fields[key];
    if (!validators[key] || !input) return true;
    const msg = validators[key](input.value);
    if (msg) {
      showError(key, msg);
      return false;
    }
    clearError(key);
    return true;
  }

  /* ── Live: stop digits/symbols ever landing in the name field ── */
  if (fields.name) {
    fields.name.addEventListener("input", function () {
      const cleaned = this.value.replace(/[^A-Za-z\s.'-]/g, "");
      if (cleaned !== this.value) {
        const drop = this.value.length - cleaned.length;
        const pos = Math.max(0, this.selectionStart - drop);
        this.value = cleaned;
        try {
          this.setSelectionRange(pos, pos);
        } catch (e) {
          /* older browsers */
        }
      }
    });
  }

  /* ── Live: allow only digits in the phone field (max 10) ── */
  if (fields.phone) {
    fields.phone.addEventListener("input", function () {
      const cleaned = this.value.replace(/\D/g, "").slice(0, 10);
      if (cleaned !== this.value) {
        const drop = this.value.length - cleaned.length;
        const pos = Math.max(0, this.selectionStart - drop);
        this.value = cleaned;
        try {
          this.setSelectionRange(pos, pos);
        } catch (e) {
          /* older browsers */
        }
      }
    });
  }

  /* ── Real-time feedback: validate on blur, re-check while fixing ── */
  KEYS.forEach(function (key) {
    const input = fields[key];
    if (!input) return;
    input.addEventListener("blur", function () {
      validateField(key);
    });
    input.addEventListener("input", function () {
      if (input.classList.contains("invalid")) validateField(key);
    });
  });

  /* ── Message character counter ── */
  function updateCount() {
    if (!fields.message || !countEl) return;
    const len = fields.message.value.length;
    countEl.textContent = len + " / " + MSG_MAX;
    countEl.classList.toggle("limit", len >= MSG_MAX);
  }
  if (fields.message && countEl) {
    fields.message.addEventListener("input", updateCount);
    updateCount();
  }

  form.addEventListener("submit", function (e) {
    // Honeypot: real users never fill this. If it has a value, it's a bot — block.
    if (honeypot && honeypot.value.trim() !== "") {
      e.preventDefault();
      return;
    }

    // Run our own validation. If anything fails, stop the submit and focus it.
    let firstInvalid = null;
    KEYS.forEach(function (key) {
      const ok = validateField(key);
      if (!ok && !firstInvalid) firstInvalid = fields[key];
    });
    if (firstInvalid) {
      e.preventDefault();
      firstInvalid.focus();
      return;
    }

    // All valid → let the browser submit the form natively to Formspree.
    // Formspree emails the enquiry and redirects to the _next URL (thank-you page).
    // We do NOT call preventDefault here, so the real submission goes through.
    // Native submission also works when previewing the file locally — unlike fetch.
    if (typeof gtag === "function") {
      gtag("event", "contact_form_submit", {
        event_category: "Lead Generation",
        event_label: fields.service.value || "General Enquiry",
        value: 1,
      });
    }
    if (submitBtn) submitBtn.textContent = "Sending…";
  });
});
