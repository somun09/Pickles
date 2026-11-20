/* 생활 아이템 & 동네 정보 — items.json 을 읽어 카드 목록을 그린다.
   새 항목은 items.json 의 items 배열에 객체 하나를 추가하면 자동 반영된다.
   - type: "product"(쿠팡 추천템) | "link"(당근·상담·채널 링크)
   - active: false 이면 화면에 그리지 않는다(검수 승인 전 광고 링크 보관용). */

const BASE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'winter', label: '겨울·자취템' },
  { key: 'life', label: '생활정보·상담' },
  { key: 'channel', label: '채널' },
];

const state = { items: [], filter: 'all', query: '' };

const el = {
  chips: document.getElementById('chips'),
  q: document.getElementById('q'),
  cards: document.getElementById('cards'),
  resultLine: document.getElementById('resultLine'),
};

function esc(value) {
  return String(value == null ? '' : value).replace(/[&<>"']/g, (c) => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;',
  }[c]));
}

function filtersFor(items) {
  const extra = [];
  items.forEach((item) => {
    if (!item.categoryKey) return;
    const known = BASE_FILTERS.some((f) => f.key === item.categoryKey) ||
      extra.some((f) => f.key === item.categoryKey);
    if (!known) extra.push({ key: item.categoryKey, label: item.categoryLabel || item.categoryKey });
  });
  return BASE_FILTERS.concat(extra).filter((f) =>
    f.key === 'all' || items.some((i) => i.categoryKey === f.key));
}

function countFor(key) {
  return key === 'all' ? state.items.length : state.items.filter((i) => i.categoryKey === key).length;
}

function renderChips() {
  const filters = filtersFor(state.items);
  if (!filters.some((f) => f.key === state.filter)) state.filter = 'all';
  el.chips.innerHTML = filters.map((f) => {
    const pressed = state.filter === f.key ? 'true' : 'false';
    return `<button type="button" class="chip" role="button" data-key="${esc(f.key)}" aria-pressed="${pressed}">`
      + `${esc(f.label)}<span class="chip-count">${countFor(f.key)}</span></button>`;
  }).join('');
}

function matches(item) {
  if (state.filter !== 'all' && item.categoryKey !== state.filter) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.title, item.summary, item.categoryLabel, item.price, item.tag, item.note]
    .filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(q);
}

function metaHtml(item) {
  return `<span class="tag">${esc(item.tag || item.categoryLabel || '정보')}</span>`
    + (item.date ? `<span class="dot">·</span><span class="date">${esc(item.date)}</span>` : '');
}

function productCardHtml(item) {
  const thumb = item.image
    ? `<div class="thumb">
         <img src="${esc(item.image)}" alt="${esc(item.imageAlt || item.title)}" loading="lazy" width="900" height="600">
         ${item.imageNote ? `<span class="thumb-tag">${esc(item.imageNote)}</span>` : ''}
       </div>`
    : '';

  const rating = item.rating
    ? `<p class="rating"><span class="stars" aria-hidden="true">★</span>${esc(item.rating)}</p>`
    : '';

  return `<li class="card card--product">
    ${thumb}
    <div class="card-body">
      <p class="card-meta">${metaHtml(item)}</p>
      <h2>${esc(item.title)}</h2>
      ${item.summary ? `<p class="summary">${esc(item.summary)}</p>` : ''}
      <div class="price-row">
        ${item.price ? `<span class="price">${esc(item.price)}</span>` : ''}
        ${item.priceNote ? `<span class="price-note">${esc(item.priceNote)}</span>` : ''}
      </div>
      ${rating}
      <a class="cta" href="${esc(item.link)}" target="_blank" rel="sponsored noopener noreferrer">
        ${esc(item.ctaLabel || '쿠팡에서 보기')} <span aria-hidden="true">↗</span>
      </a>
    </div>
  </li>`;
}

function linkCardHtml(item) {
  return `<li class="card card--link">
    <a class="link-card" href="${esc(item.link)}" target="_blank" rel="noopener noreferrer">
      <span class="link-icon" aria-hidden="true">${esc(item.icon || '↗')}</span>
      <span class="link-body">
        <span class="card-meta">${metaHtml(item)}</span>
        <span class="link-title">${esc(item.title)}</span>
        ${item.summary ? `<span class="link-summary">${esc(item.summary)}</span>` : ''}
        <span class="link-cta">${esc(item.ctaLabel || '바로가기')} <span aria-hidden="true">↗</span></span>
      </span>
    </a>
  </li>`;
}

function cardHtml(item) {
  return item.type === 'link' ? linkCardHtml(item) : productCardHtml(item);
}

function emptyText() {
  if (state.query) return '검색 결과가 없어요. 다른 단어로 찾아보세요.';
  if (state.filter === 'life') return '상담·생활정보 링크를 준비하고 있어요. 곧 올라갑니다.';
  return '이 카테고리에 아직 등록된 항목이 없어요.';
}

function render() {
  const visible = state.items.filter(matches);
  el.cards.innerHTML = visible.length
    ? visible.map(cardHtml).join('')
    : `<li class="empty">${emptyText()}</li>`;

  const label = state.filter === 'all'
    ? '전체'
    : (filtersFor(state.items).find((f) => f.key === state.filter) || {}).label || '';
  el.resultLine.textContent = state.query
    ? `'${state.query}' 검색 결과 ${visible.length}개`
    : `${label} ${visible.length}개`;
}

function setFilter(key, push) {
  state.filter = key;
  if (push) {
    const next = key === 'all' ? location.pathname + location.search : `#${key}`;
    history.replaceState(null, '', next);
  }
  renderChips();
  render();
}

el.chips.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  setFilter(chip.dataset.key, true);
});

let typing;
el.q.addEventListener('input', (event) => {
  clearTimeout(typing);
  const value = event.target.value;
  typing = setTimeout(() => { state.query = value; render(); }, 120);
});

function normalize(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data.items)) return data.items;
  return [];
}

async function load() {
  try {
    const res = await fetch(`items.json?v=${Date.now()}`, { cache: 'no-store' });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    state.items = normalize(await res.json())
      /* active:false 항목(검수 전 광고 링크)은 화면에 그리지 않는다. */
      .filter((item) => item && item.title && item.active !== false)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || ''))
        || (a.order || 0) - (b.order || 0));
  } catch (error) {
    state.items = [];
    el.resultLine.textContent = '목록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.';
    console.error('items.json load failed:', error);
  }

  const hash = decodeURIComponent(location.hash.replace('#', ''));
  if (hash && state.items.some((i) => i.categoryKey === hash)) state.filter = hash;

  renderChips();
  render();
}

load();
