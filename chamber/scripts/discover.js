// chamber/scripts/discover.js
import { places } from "../data/discover.mjs";

const grid = document.querySelector(".discover-grid");
const visitorMessage = document.querySelector("#visitor-message");

// ------------------------------
// 1. localStorage 显示访问信息
// ------------------------------
const STORAGE_KEY = "ls-discover-last-visit";

function showVisitorMessage() {
  const now = Date.now();
  const lastVisit = window.localStorage.getItem(STORAGE_KEY);

  let message = "";

  if (!lastVisit) {
    message = "Welcome! Let us know if you have any questions.";
  } else {
    const diff = now - Number(lastVisit);
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffDays < 1) {
      message = "Back so soon! Awesome!";
    } else if (diffDays === 1) {
      message = "You last visited 1 day ago.";
    } else {
      message = `You last visited ${diffDays} days ago.`;
    }
  }

  visitorMessage.textContent = message;
  window.localStorage.setItem(STORAGE_KEY, String(now));
}

// ------------------------------
// 2. 建立 Discover Card
// ------------------------------
function createCard(place) {
  const card = document.createElement("article");
  card.classList.add("discover-card", `area-${place.id}`);

  const title = document.createElement("h2");
  title.textContent = place.title;

  const figure = document.createElement("figure");
  const img = document.createElement("img");
  img.src = place.photo;
  img.alt = place.title;
  img.loading = "lazy";
  figure.appendChild(img);

  const address = document.createElement("address");
  address.textContent = place.address;

  const desc = document.createElement("p");
  desc.textContent = place.description;

  const btn = document.createElement("button");
  btn.textContent = "Learn More";
  btn.classList.add("learn-more-btn");

  card.appendChild(title);
  card.appendChild(figure);
  card.appendChild(address);
  card.appendChild(desc);
  card.appendChild(btn);

  return card;
}

// ------------------------------
// 3. 载入所有卡片
// ------------------------------
function loadCards() {
  places.forEach(place => {
    const card = createCard(place);
    grid.appendChild(card);
  });
}

// ------------------------------
// 初始化
// ------------------------------
showVisitorMessage();
loadCards();
