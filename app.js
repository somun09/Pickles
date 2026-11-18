/* 추천템 모음 — items.json 을 읽어 카드 목록을 그린다.
   새 아이템은 items.json 배열에 객체 하나를 추가하면 자동 반영된다. */

const BASE_FILTERS = [
  { key: 'all', label: '전체' },
  { key: 'winter', label: '겨울·난방' },
  { key: 'life', label: '생활꿀팁' },
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
  return BASE_FILTERS.concat(extra);
}

function renderChips() {
  const filters = filtersFor(state.items);
  el.chips.innerHTML = filters.map((f) => {
    const pressed = state.filter === f.key ? 'true' : 'false';
    return `<button type="button" class="chip" role="button" data-key="${esc(f.key)}" aria-pressed="${pressed}">${esc(f.label)}</button>`;
  }).join('');
}

function matches(item) {
  if (state.filter !== 'all' && item.categoryKey !== state.filter) return false;
  const q = state.query.trim().toLowerCase();
  if (!q) return true;
  const haystack = [item.title, item.summary, item.categoryLabel, item.price, item.badge]
    .filter(Boolean).join(' ').toLowerCase();
  return haystack.includes(q);
}

function cardHtml(item) {
  const thumb = item.image
    ? `<div class="thumb">
         <img src="${esc(item.image)}" alt="${esc(item.imageAlt || item.title)}" loading="lazy" width="800" height="600">
         ${item.imageNote ? `<span class="thumb-tag">${esc(item.imageNote)}</span>` : ''}
       </div>`
    : '';

  const rating = item.rating
    ? `<p class="rating"><span class="stars" aria-hidden="true">★</span>${esc(item.rating)}</p>`
    : '';

  const meta = [
    `<span>${esc(item.categoryLabel || '추천템')}</span>`,
    item.date ? `<span class="dot">·</span><span class="date">${esc(item.date)}</span>` : '',
  ].join('');

  return `<li class="card">
    ${thumb}
    <div class="card-body">
      <p class="card-meta">${meta}</p>
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

function render() {
  const visible = state.items.filter(matches);
  el.cards.innerHTML = visible.length
    ? visible.map(cardHtml).join('')
    : `<li class="empty">${state.query ? '검색 결과가 없어요. 다른 단어로 찾아보세요.' : '이 카테고리에 아직 등록된 아이템이 없어요.'}</li>`;

  const latest = state.items.reduce((acc, i) => (i.date && i.date > acc ? i.date : acc), '');
  el.resultLine.textContent = latest
    ? `총 ${visible.length}개 · 최근 등록 ${latest}`
    : `총 ${visible.length}개`;
}

el.chips.addEventListener('click', (event) => {
  const chip = event.target.closest('.chip');
  if (!chip) return;
  state.filter = chip.dataset.key;
  renderChips();
  render();
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
      .filter((item) => item && item.title)
      .sort((a, b) => String(b.date || '').localeCompare(String(a.date || '')));
  } catch (error) {
    state.items = [];
    el.resultLine.textContent = '목록을 불러오지 못했어요. 잠시 후 새로고침해 주세요.';
    console.error('items.json load failed:', error);
  }
  renderChips();
  render();
}

load();
