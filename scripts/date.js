// Footer dates
const yearSpan = document.getElementById('currentyear');
if (yearSpan) {
  yearSpan.textContent = new Date().getFullYear();
}

const lastMod = document.getElementById('lastModified');
if (lastMod) {
  lastMod.textContent = `Last Modified: ${document.lastModified}`;
}
