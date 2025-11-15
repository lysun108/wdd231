// scripts/spotlights.js
// 使用 data/members.json 里的数据，随机显示 2–3 个 Gold / Silver 会员的广告卡片。

const SPOTLIGHT_CONTAINER = document.querySelector('#spotlight-container');

// 如果路径不同，在这里改
const MEMBERS_JSON_URL = 'data/members.json';

// level 数字到等级名称的映射：1=非盈利/普通, 2=Silver, 3=Gold
function mapLevelToName(level) {
  if (level === 3) return 'Gold';
  if (level === 2) return 'Silver';
  if (level === 1) return 'Non-profit';
  return 'Member';
}

/**
 * 从 JSON 中获取成员数组
 * 你的 JSON 是一个数组，所以直接返回 data 即可
 */
async function getMembers() {
  const response = await fetch(MEMBERS_JSON_URL);

  if (!response.ok) {
    throw new Error(`HTTP error: ${response.status}`);
  }

  const data = await response.json();

  if (Array.isArray(data)) {
    return data;
  }

  return [];
}

/**
 * 只保留 Gold / Silver 成员（level 3 或 2）
 */
function filterGoldAndSilver(members) {
  return members.filter((member) => member.level === 3 || member.level === 2);
}

/**
 * 洗牌并取前 n 个
 */
function pickRandomItems(list, count) {
  const copy = [...list];

  // Fisher–Yates 洗牌
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }

  return copy.slice(0, count);
}

/**
 * 生成单个 spotlight 卡片
 */
function createSpotlightCard(member) {
  const card = document.createElement('article');
  card.classList.add('card', 'spotlight-card');

  // Logo
  const img = document.createElement('img');
  img.src = member.logo || 'images/partners/placeholder.svg';
  img.alt = `${member.name || 'Chamber member'} logo`;
  img.loading = 'lazy';

  // 公司名
  const nameEl = document.createElement('h3');
  nameEl.textContent = member.name || 'Company Name';

  // 会员等级（由 level 转换）
  const levelName = mapLevelToName(member.level);
  const levelEl = document.createElement('p');
  levelEl.classList.add('membership-level');
  levelEl.textContent = `${levelName} Member`;

  // 地址（拼接 street / city / state / zip）
  const addrObj = member.address || {};
  const addressParts = [
    addrObj.street,
    `${addrObj.city || ''}${addrObj.city && (addrObj.state || addrObj.zip) ? ', ' : ''}${addrObj.state || ''}`,
    addrObj.zip
  ].filter(Boolean);

  const addrEl = document.createElement('p');
  addrEl.classList.add('spotlight-address');
  addrEl.textContent = addressParts.join('\n');

  // 电话
  const phoneEl = document.createElement('p');
  phoneEl.classList.add('spotlight-phone');
  if (member.phone) {
    phoneEl.textContent = `📞 ${member.phone}`;
  }

  // 网站
  let linkEl = null;
  if (member.website) {
    linkEl = document.createElement('a');
    linkEl.classList.add('text-link');
    linkEl.textContent = 'Visit website';
    linkEl.href = member.website.startsWith('http')
      ? member.website
      : `https://${member.website}`;
    linkEl.target = '_blank';
    linkEl.rel = 'noopener';
  }

  // 组装卡片内容
  const body = document.createElement('div');
  body.classList.add('card-body');
  body.appendChild(nameEl);
  body.appendChild(levelEl);
  if (addrEl.textContent) body.appendChild(addrEl);
  if (member.phone) body.appendChild(phoneEl);
  if (linkEl) body.appendChild(linkEl);

  card.appendChild(img);
  card.appendChild(body);

  return card;
}

/**
 * 主入口：加载并渲染 spotlights
 */
async function loadSpotlights() {
  if (!SPOTLIGHT_CONTAINER) {
    console.warn('No #spotlight-container element found.');
    return;
  }

  try {
    SPOTLIGHT_CONTAINER.innerHTML = '';

    const members = await getMembers();
    const goldSilverMembers = filterGoldAndSilver(members);

    if (!goldSilverMembers.length) {
      SPOTLIGHT_CONTAINER.textContent = 'No gold or silver members available.';
      return;
    }

    // rubric 要求 2–3 个，如果不够就用现有数量
    let count = 3;
    if (goldSilverMembers.length === 2) {
      count = 2;
    } else if (goldSilverMembers.length < 2) {
      count = goldSilverMembers.length;
    }

    const selected = pickRandomItems(goldSilverMembers, count);

    selected.forEach((member) => {
      const card = createSpotlightCard(member);
      SPOTLIGHT_CONTAINER.appendChild(card);
    });
  } catch (error) {
    console.error('Error loading member spotlights:', error);
    SPOTLIGHT_CONTAINER.textContent = 'Unable to load member spotlights.';
  }
}

document.addEventListener('DOMContentLoaded', loadSpotlights);
