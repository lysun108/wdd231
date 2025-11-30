// scripts/join.js
// Join page specific logic only

document.addEventListener("DOMContentLoaded", () => {
  // Hidden timestamp: used on thankyou.html
  const ts = document.querySelector("#timestamp");
  if (ts) {
    // 用 ISO 格式，thankyou.js 那边更好解析
    ts.value = new Date().toISOString();
  }

  // Modals
  const cards = document.querySelectorAll(".level-card");
  const dialogs = document.querySelectorAll("dialog.modal");

  cards.forEach((card) => {
    const button = card.querySelector("button");
    button?.addEventListener("click", () => {
      const id = card.dataset.modal;
      const dlg = document.getElementById(id);
      if (dlg && typeof dlg.showModal === "function") {
        dlg.showModal();
      }
    });
  });

  // close buttons + click outside to close
  dialogs.forEach((dlg) => {
    const closeBtn = dlg.querySelector(".modal-close");
    closeBtn?.addEventListener("click", () => dlg.close());

    dlg.addEventListener("click", (e) => {
      const box = dlg.querySelector(".modal-box");
      if (box && !box.contains(e.target)) {
        dlg.close();
      }
    });
  });
});
