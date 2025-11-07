/* directory.js
   Handles mobile navigation toggle & a11y behavior
   Author: Yang Liao
   Date: 2025-11-07
*/

const navBtn = document.getElementById('nav-toggle');
const nav = document.getElementById('site-nav');
const mql = window.matchMedia('(min-width: 721px)');

// 同步菜单显示状态（移动端收起，桌面端展开）
function syncByViewport(e){
  if (e.matches) {          // 桌面
    nav.removeAttribute('hidden');
    navBtn.setAttribute('aria-expanded','true');
  } else {                  // 移动端
    nav.setAttribute('hidden','');
    navBtn.setAttribute('aria-expanded','false');
  }
}

if (navBtn && nav){
  syncByViewport(mql);
  mql.addEventListener('change', syncByViewport);

  // 点击按钮展开 / 收起菜单
  navBtn.addEventListener('click', () => {
    const willOpen = nav.hasAttribute('hidden');
    navBtn.setAttribute('aria-expanded', String(willOpen));
    if (willOpen) nav.removeAttribute('hidden');
    else nav.setAttribute('hidden','');
  });

  // 按 ESC 键关闭菜单
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !mql.matches && !nav.hasAttribute('hidden')) {
      nav.setAttribute('hidden','');
      navBtn.setAttribute('aria-expanded','false');
      navBtn.focus();
    }
  });
}

// ----------- 年份与最后修改时间 -----------
const yearSpan = document.getElementById('year');
if (yearSpan) yearSpan.textContent = new Date().getFullYear();

const lastModified = document.getElementById('lastModified');
if (lastModified) lastModified.textContent = document.lastModified;
