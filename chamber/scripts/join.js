// join.js (module)

// Mobile nav toggle (same pattern as your directory page)
const navToggle = document.querySelector("#nav-toggle");
const siteNav = document.querySelector("#site-nav");

if (navToggle && siteNav) {
  navToggle.addEventListener("click", () => {
    const expanded = navToggle.getAttribute("aria-expanded") === "true";
    navToggle.setAttribute("aria-expanded", String(!expanded));
    siteNav.hidden = expanded;
  });
}

// Footer meta
document.querySelector("#year").textContent = new Date().getFullYear();
document.querySelector("#lastModified").textContent = document.lastModified;

// Hidden timestamp
const ts = document.querySelector("#timestamp");
if (ts) ts.value = new Date().toLocaleString();

// Modals
const cards = document.querySelectorAll(".level-card");
const dialogs = document.querySelectorAll("dialog.modal");

cards.forEach((card) => {
  card.querySelector("button")?.addEventListener("click", () => {
    const id = card.dataset.modal;
    const dlg = document.getElementById(id);
    if (dlg && typeof dlg.showModal === "function") dlg.showModal();
  });
});

// close buttons + click outside to close
dialogs.forEach((dlg) => {
  dlg.querySelector(".modal-close")?.addEventListener("click", () => dlg.close());

  dlg.addEventListener("click", (e) => {
    const box = dlg.querySelector(".modal-box");
    if (box && !box.contains(e.target)) dlg.close();
  });
});
