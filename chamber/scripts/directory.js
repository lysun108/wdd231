// scripts/directory.js
// Author: Yang Liao
// Date: 2025-11-07

// ---------- Elements ----------
const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const levelFilter = document.getElementById('levelFilter');

// Footer time
const yearEl = document.getElementById('year');
const lastModifiedEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModifiedEl) {
  const d = new Date(document.lastModified);
  lastModifiedEl.textContent = d.toLocaleString();
}

// ---------- Mobile nav toggle (a11y) ----------
const navBtn = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');
const mql = window.matchMedia('(min-width: 721px)');

function syncByViewport(e){
  if (!nav || !navBtn) return;
  if (e.matches) { // desktop
    nav.removeAttribute('hidden');
    navBtn.setAttribute('aria-expanded','true');
  } else {         // mobile
    nav.setAttribute('hidden','');
    navBtn.setAttribute('aria-expanded','false');
  }
}

if (navBtn && nav){
  // 初始同步
  syncByViewport(mql);
  mql.addEventListener('change', syncByViewport);

  // 点击展开/收起
  navBtn.addEventListener('click', () => {
    const willOpen = nav.hasAttribute('hidden');
    navBtn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) nav.removeAttribute('hidden');
    else nav.setAttribute('hidden','');
  });

  // ESC 关闭（仅移动端生效）
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mql.matches && nav && !nav.hasAttribute('hidden')) {
      nav.setAttribute('hidden','');
      navBtn.setAttribute('aria-expanded','false');
      navBtn.focus();
    }
  });
}

// ---------- Data load & render ----------
async function loadMembers() {
  try {
    if (directoryEl) directoryEl.setAttribute('aria-busy', 'true');

    const res = await fetch('data/members.json', { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();

    renderMembers(members);
    if (directoryEl) directoryEl.setAttribute('aria-busy', 'false');

    // Events
    levelFilter.addEventListener('change', () => renderMembers(members));
    gridBtn.addEventListener('click', () => setView('grid', members));
    listBtn.addEventListener('click', () => setView('list', members));
  } catch (err) {
    if (directoryEl) {
      directoryEl.innerHTML = `<p style="color:red;">Failed to load members: ${err.message}</p>`;
      directoryEl.setAttribute('aria-busy', 'false');
    }
    // 可选：console.error(err);
  }
}

function renderMembers(members) {
  const level = levelFilter.value;
  const filtered = members.filter(m => level === 'all' || String(m.level) === level);
  const isList = directoryEl.classList.contains('list');

  directoryEl.innerHTML = filtered.map(m => {
    const addr = `${m.address.street}, ${m.address.city}, ${m.address.state} ${m.address.zip}`;
    const phone = m.phone.replace(/(\d{3})(\d{3})(\d{4})/, '($1) $2-$3');
    const levelText = m.level === 3 ? 'Gold' : (m.level === 2 ? 'Silver' : 'Member');
    const badgeClass = levelText.toLowerCase();

    if (isList) {
      return `
        <article class="card">
          <img src="${m.logo}" alt="${m.name} logo" class="logo">
          <h3>${m.name} <span class="badge ${badgeClass}">${levelText}</span></h3>
          <p class="addr">${addr}</p>
          <p class="phone"><a href="tel:+1${m.phone}">${phone}</a></p>
        </article>`;
    }

    // Grid
    return `
      <article class="card">
        <img src="${m.logo}" alt="${m.name} logo" class="logo">
        <div class="meta">
          <h3>${m.name}</h3>
          <p>${addr}</p>
          <p><a href="tel:+1${m.phone}">${phone}</a></p>
          <a class="visit" href="${m.website}" target="_blank" rel="noopener noreferrer">Visit website →</a>
        </div>
        <span class="badge ${badgeClass}">${levelText}</span>
      </article>`;
  }).join('');
}

function setView(view, members) {
  if (view === 'grid') {
    directoryEl.classList.remove('list');
    directoryEl.classList.add('grid');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
    gridBtn.setAttribute('aria-pressed', 'true');
    listBtn.setAttribute('aria-pressed', 'false');
  } else {
    directoryEl.classList.remove('grid');
    directoryEl.classList.add('list');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
    listBtn.setAttribute('aria-pressed', 'true');
    gridBtn.setAttribute('aria-pressed', 'false');
  }
  renderMembers(members);
}

// init
loadMembers();
