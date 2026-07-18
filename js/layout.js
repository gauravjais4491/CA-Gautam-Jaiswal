async function loadComponent(id, file) {
  const element = document.getElementById(id);

  if (!element) return;

  try {
    const response = await fetch(file);

    if (!response.ok) {
      throw new Error(`Unable to load ${file}`);
    }

    element.innerHTML = await response.text();
  } catch (err) {
    console.error(err);
  }
}

async function initLayout() {
  await Promise.all([
    loadComponent("navbar", "components/navbar.html"),
    loadComponent("footer", "components/footer.html"),
    loadComponent("whatsapp", "components/whatsapp.html"),
    loadComponent("backTopContainer", "components/back-to-top.html"),
  ]);

  if (typeof initNavbar === "function") {
    initNavbar();
  }
}

document.addEventListener("DOMContentLoaded", initLayout);
