// Footer meta
const yearEl = document.getElementById('year');
const lastModifiedEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModifiedEl) {
  const d = new Date(document.lastModified);
  lastModifiedEl.textContent = isNaN(d) ? document.lastModified : d.toLocaleString();
}
