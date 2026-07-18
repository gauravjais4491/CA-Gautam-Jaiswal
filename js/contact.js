/* ============================================================
   CONTACT.JS — contact.html only
   Form validation, Formspree submit, thank-you redirect
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
  const countEl = document.getElementById("fmessageCount");
  const submitBtn = document.getElementById("btnSubmit");
  const MSG_MAX = 1000;

  /* ── Validators: return '' when valid, else an error message ──
     Keys match the `fields` map and the "f<key>Err" element ids.  */
  const validators = {
    name: function (v) {
      v = v.trim().replace(/\s+/g, " ");
      if (!v) return "Please enter your name.";
      if (/\d/.test(v)) return "Name cannot contain numbers.";
      if (v.length < 3) return "Name must be at least 3 characters.";
      if (v.length > 50) return "Name is too long (50 characters max).";
      // Letters (any language) with single separators between words.
      if (!/^\p{L}+(?:[ .'-]\p{L}+)*$/u.test(v)) {
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
      // Accept autofilled / pasted numbers with +91, spaces, dashes, etc.
      let d = v.replace(/\D/g, "");
      if (d.length > 10) d = d.slice(-10); // drop country code / leading 0
      if (!d) return "Please enter your mobile number.";
      if (!/^[6-9]\d{9}$/.test(d))
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
    // Normalize an autofilled/pasted phone to the 10-digit local number so what
    // we validate — and submit — is clean (handles +91, spaces, dashes, etc.).
    if (key === "phone") {
      let d = input.value.replace(/\D/g, "");
      if (d.length > 10) d = d.slice(-10);
      if (d !== input.value) input.value = d;
    }
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
      const cleaned = this.value.replace(/[^\p{L}\s.'-]/gu, "");
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
      const cleaned = this.value.replace(/\D/g, "").slice(0, 15);
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

  form.addEventListener("submit", async function (e) {
    // We always handle the submit ourselves so we control the redirect.
    e.preventDefault();

    // Run our own validation. If anything fails, focus the first bad field.
    let firstInvalid = null;
    KEYS.forEach(function (key) {
      const ok = validateField(key);
      if (!ok && !firstInvalid) firstInvalid = fields[key];
    });
    if (firstInvalid) {
      firstInvalid.focus();
      return;
    }

    // GA4 conversion event (best effort)
    if (typeof gtag === "function") {
      gtag("event", "contact_form_submit", {
        event_category: "Lead Generation",
        event_label: fields.service.value || "General Enquiry",
        value: 1,
      });
    }

    const label = submitBtn ? submitBtn.textContent : "";
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = "Sending…";
    }

    try {
      // Send to Formspree in the background. The Accept header makes Formspree
      // reply with JSON instead of redirecting to ITS page — so WE decide where
      // the visitor goes next, and they always land on our thank-you page.
      const response = await fetch(form.action, {
        method: "POST",
        body: new FormData(form),
        headers: { Accept: "application/json" },
      });

      if (!response.ok) {
        throw new Error("Formspree responded " + response.status);
      }

      window.location.href = "thank-you.html";
    } catch (err) {
      console.error("Contact form submission failed:", err);
      alert(
        "Sorry, your message couldn't be sent. Note: the form only works on the live site or a local server — not when opening the file directly. Otherwise please email us at support@gjaca.in.",
      );
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
      }
    }
  });
});
