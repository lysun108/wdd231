// scripts/directory.js

const directoryEl = document.getElementById('directory');
const gridBtn = document.getElementById('gridBtn');
const listBtn = document.getElementById('listBtn');
const levelFilter = document.getElementById('levelFilter');

// 设置页脚时间
const yearEl = document.getElementById('year');
const lastModifiedEl = document.getElementById('lastModified');
if (yearEl) yearEl.textContent = new Date().getFullYear();
if (lastModifiedEl) {
  const d = new Date(document.lastModified);
  lastModifiedEl.textContent = d.toLocaleString();
}

// 异步加载 JSON
async function loadMembers() {
  try {
    const res = await fetch('data/members.json');
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const members = await res.json();
    renderMembers(members);
    directoryEl.setAttribute('aria-busy', 'false');

    // 添加筛选事件
    levelFilter.addEventListener('change', () => renderMembers(members));
    gridBtn.addEventListener('click', () => setView('grid', members));
    listBtn.addEventListener('click', () => setView('list', members));
  } catch (err) {
    directoryEl.innerHTML = `<p style="color:red;">Failed to load members: ${err.message}</p>`;
  }
}

// 渲染函数
function renderMembers(members) {
  const level = levelFilter.value;
  const filtered = members.filter(m => level === 'all' || String(m.level) === level);
  const isList = directoryEl.classList.contains('list');

  directoryEl.innerHTML = filtered.map(m => {
    const addr = `${m.address.street}, ${m.address.city}, ${m.address.state} ${m.address.zip}`;
    const phone = m.phone.replace(/(\\d{3})(\\d{3})(\\d{4})/, '($1) $2-$3');
    const levelText = m.level === 3 ? 'Gold' : m.level === 2 ? 'Silver' : 'Member';
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

    return `
      <article class="card">
        <img src="${m.logo}" alt="${m.name} logo" class="logo">
        <div class="meta">
          <h3>${m.name}</h3>
          <p>${addr}</p>
          <p><a href="tel:+1${m.phone}">${phone}</a></p>
          <a class="visit" href="${m.website}" target="_blank" rel="noopener">Visit website →</a>
        </div>
        <span class="badge ${badgeClass}">${levelText}</span>
      </article>`;
  }).join('');
}

// 切换视图
function setView(view, members) {
  if (view === 'grid') {
    directoryEl.classList.remove('list');
    directoryEl.classList.add('grid');
    gridBtn.classList.add('active');
    listBtn.classList.remove('active');
  } else {
    directoryEl.classList.remove('grid');
    directoryEl.classList.add('list');
    listBtn.classList.add('active');
    gridBtn.classList.remove('active');
  }
  renderMembers(members);
}

// 页面加载后执行
loadMembers();
