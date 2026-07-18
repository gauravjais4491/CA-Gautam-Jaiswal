/* ============================================================
   HOME.JS — index.html only
   Ticker: duplicates items for seamless infinite scroll
   ============================================================ */

document.addEventListener("DOMContentLoaded", function () {
  const track = document.getElementById("tickerTrack");
  if (!track) return;
  // Clone children for seamless loop
  const items = Array.from(track.children);
  items.forEach(function (item) {
    track.appendChild(item.cloneNode(true));
  });
});
