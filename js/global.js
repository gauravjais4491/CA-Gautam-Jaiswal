/* ============================================================
   GLOBAL.JS — Gautam Jaiswal & Associates
   ============================================================ */

function initNavbar() {
  /* Active nav link */
  const page = window.location.pathname.split("/").pop() || "index.html";

  document.querySelectorAll(".nav-links a, .mobile-menu a").forEach((a) => {
    const href = a.getAttribute("href") || "";

    if (href === page || (page === "" && href === "index.html")) {
      a.classList.add("active");
    }
  });

  /* Mobile menu */
  const hamburger = document.getElementById("hamburger");
  const mobileMenu = document.getElementById("mobileMenu");

  if (hamburger && mobileMenu) {
    hamburger.addEventListener("click", () => {
      const open = mobileMenu.classList.toggle("open");
      hamburger.classList.toggle("open", open);
      hamburger.setAttribute("aria-expanded", open);
    });

    mobileMenu.querySelectorAll("a").forEach((a) => {
      a.addEventListener("click", () => {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      });
    });

    document.addEventListener("click", (e) => {
      const nav = document.getElementById("mainNav");

      if (nav && !nav.contains(e.target) && !mobileMenu.contains(e.target)) {
        mobileMenu.classList.remove("open");
        hamburger.classList.remove("open");
        hamburger.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* Nav shadow */
  const mainNav = document.getElementById("mainNav");
  const backTop = document.getElementById("backTop");

  window.addEventListener(
    "scroll",
    () => {
      if (mainNav) mainNav.classList.toggle("scrolled", window.scrollY > 50);

      if (backTop) backTop.classList.toggle("show", window.scrollY > 420);
    },
    { passive: true },
  );
}

/* Everything else */
document.addEventListener("DOMContentLoaded", () => {
  const revealEls = document.querySelectorAll(".reveal");

  if (revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            e.target.classList.add("visible");
            io.unobserve(e.target);
          }
        });
      },
      { threshold: 0.1 },
    );

    revealEls.forEach((el) => io.observe(el));
  }
});
