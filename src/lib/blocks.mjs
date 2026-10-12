import { esc, hash, shuffle, km, km2, won, josa } from './util.mjs';
import { frame, telBtn } from './html.mjs';
import { ANCHOR, FAQ_POOL, STEP_SETS, NOTICE, SEC } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/* ── 예약 문의 띠 ─────────────────────────────────────────────────
   번호가 본문 어디에 나오든 '예약 문의'가 붙은 버튼으로만 나온다. */
export function telCta(cfg, place, seedKey) {
  const h = hash(seedKey, 'cta');
  const lines = [
    `${place} 주소를 끝까지 들으면 어느 쪽에서 들어갈지가 그 자리에서 정해집니다.`,
    `${place} 쪽으로 지금 나설 사람이 있는지 통화에서 바로 봐 드립니다.`,
    `${place}에서 받으시려면 코스·시각·주소 셋만 정하면 됩니다.`,
    `${place} 접수는 이 번호 하나로만 들어옵니다. 다른 창구를 두지 않았습니다.`,
  ];
  return `<section class="ask" aria-label="${esc(place)} 예약 문의">
  <p class="ask-p">${esc(at(h, lines))}</p>
  ${telBtn(cfg, { size: 'l' })}
  <p class="ask-s">${esc(at(h, SEC.askTail, 2).replace('@A', cfg.arrive).replace('@H', cfg.hours).replace('@P', cfg.pay))}</p>
</section>`;
}

/* ── 코스 ─────────────────────────────────────────────────────── */
export function courseGrid(courses, seedKey, place, num = '01') {
  const h = hash(seedKey, 'cg');
  // 여덟 개 설명을 다 달면 어느 쪽이든 같은 여덟 문장이 깔린다. 둘만 시드로 골라 단다.
  const withText = new Set(shuffle(courses.map((c) => c.slug), h).slice(0, 2));
  const list = courses.map((c) => {
    const line = at(hash(seedKey, c.slug), c.lines);
    return `<li class="cs">
    <a class="cs-a" href="/course/${c.slug}/">
      <span class="cs-k">${esc(c.ko)}</span>
      <span class="cs-v">${c.min}<i>분</i><em>${won(c.price)}<i>원</i></em></span>
      <span class="cs-p">세기 ${esc(c.pressure)}${c.oil ? ' · 오일 씀' : ' · 오일 안 씀'}</span>
    </a>
    ${withText.has(c.slug) ? `<p class="cs-d">${esc(line)}</p>` : ''}
  </li>`;
  }).join('');
  return frame('course', '코스', `${esc(place)}에서 고르실 수 있는 여덟 가지`,
    `<ul class="cs-ul">${list}</ul>
     <p class="fr-tail">${esc(at(h, SEC.courseTail, 2))} ${at(h, SEC.courseLink, 5)}</p>`,
    at(h, SEC.courseSub, 1), num);
}

/* ── 접수 흐름 ────────────────────────────────────────────────── */
export function stepList(seedKey, num = '04') {
  const h = hash(seedKey, 'st');
  const steps = at(h, STEP_SETS);
  return frame('step', '차례', esc(at(h, SEC.stepTitle, 1)),
    `<ol class="sp-ol">${steps.map((s, i) => `<li class="sp"><span class="sp-n">${String(i + 1).padStart(2, '0')}</span><div class="sp-b"><h3 class="sp-t">${esc(s.t)}</h3><p class="sp-d">${esc(s.d)}</p></div></li>`).join('')}</ol>`,
    at(h, SEC.stepSub, 2), num);
}

/* ── 빠른 정보 표 ─────────────────────────────────────────────── */
export function factTable(rows) {
  return `<table class="fct"><tbody>${rows.map((r) => `<tr><th scope="row">${esc(r[0])}</th><td>${r[1]}</td></tr>`).join('')}</tbody></table>`;
}

/* ── FAQ ─────────────────────────────────────────────────────── */
export function faqBlock(seedKey, c, n = 5, num = '05') {
  const h = hash(seedKey, 'faq');
  const idx = shuffle(FAQ_POOL.map((_, i) => i), h).slice(0, n);
  const qa = idx.map((i) => {
    const item = FAQ_POOL[i];
    const av = item.a[parseInt(hash(seedKey, 'av', i).substr(0, 3), 16) % item.a.length];
    return { q: item.q(c), a: av(c) };
  });
  const html = frame('faq', '물음', esc(at(h, SEC.faqTitle, 3)),
    `<dl class="qa">${qa.map((x, i) => `<div class="qa-i"><dt><span class="qa-n" aria-hidden="true">${String(i + 1).padStart(2, '0')}</span>${esc(x.q)}</dt><dd>${esc(x.a)}</dd></div>`).join('')}</dl>`,
    at(h, SEC.faqSub, 4), num);
  return { html, qa };
}

/* ── 안내/주의 ────────────────────────────────────────────────── */
export function noticeBlock(seedKey, num) {
  const h = hash(seedKey, 'nt');
  const items = shuffle(NOTICE, h).slice(0, 4);
  return frame('notice', '유의', esc(at(h, SEC.noticeTitle, 5)),
    `<ul class="nt">${items.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>`, null, num);
}

/* ── 롱테일 링크 격자 ─────────────────────────────────────────── */
export function longtail(pool, seedKey, n, label, heading, sub, num) {
  const h = hash(seedKey, 'lt');
  const picked = shuffle(pool, h).slice(0, n);
  const items = picked.map((p) => {
    const tpl = ANCHOR[parseInt(hash(seedKey, p.label).substr(0, 3), 16) % ANCHOR.length];
    return `<li><a href="${p.href}">${esc(tpl(p.label))}</a></li>`;
  }).join('');
  return frame('longtail', label, heading, `<ul class="lk">${items}</ul>`, sub || at(h, SEC.ltSub, 6), num);
}

/* ── 맞닿은 동 ───────────────────────────────────────────────────
   ★중심점 사이 거리로 고른 목록이 아니다. 경계선을 2점 이상 공유하는지로 고른다.
     강 건너라 가깝지만 안 붙은 곳은 여기 들어오지 않는다. */
export function adjList(s, seedKey, num) {
  if (!s.adj.length) {
    return frame('adj', '맞닿음', `${esc(s.name)}과 선이 붙은 자리`,
      s.adjCount
        ? `<p class="pl">경계를 맞댄 행정동은 ${s.adjCount}곳이지만 모두 면이거나 이 사이트가 다루지 않는 지역이라, 바로 눌러 볼 쪽을 걸지 못했습니다.</p>`
        : `<p class="pl">경계를 맞댄 행정동이 하나도 없습니다. 물로 둘러싸인 자리라 다리를 건너야만 들어갑니다.</p>`,
      at(hash(seedKey, 'ad'), SEC.adjSubAlone), num);
  }
  const items = s.adj.map((n) => `<li>
    <a href="/${n.sidoSlug}/${n.guSlug}/${n.slug}/">
      <span class="aj-n">${esc(n.name)}</span>
      <span class="aj-g">${n.sameGu ? '같은 시군구' : esc(n.gu)}</span>
    </a></li>`).join('');
  return frame('adj', '맞닿음', `${esc(s.name)}과 경계를 나눠 가진 ${s.adj.length}곳`,
    `<ul class="aj">${items}</ul>`,
    at(hash(seedKey, 'ad'), SEC.adjSub), num);
}

/* ── 구 안의 자리 목록 ──────────────────────────────────────────── */
export function spotIndex(sd, g, seedKey, currentSlug, num) {
  const items = g.spots.map((s) => `<li${s.slug === currentSlug ? ' class="on"' : ''}>
    <a href="/${sd.slug}/${g.slug}/${s.slug}/"${s.slug === currentSlug ? ' aria-current="page"' : ''}>
      <span class="ix-n">${esc(s.name)}</span>
      <span class="ix-m">${km2(s.area)} · 가로 ${km(s.wide)}</span>
    </a></li>`).join('');
  return frame('spotidx', '자리', `${esc(g.name)}에서 쪽을 둔 ${g.spotCount}곳`,
    `<ul class="ix">${items}</ul>`,
    at(hash(seedKey, 'sx'), SEC.spotIdxSub), num);
}

/* ── 시군구 안의 면 목록 ───────────────────────────────────────── */
export function myeonList(g, seedKey, num) {
  if (!g.myeonCount) return '';
  return frame('myeon', '면', `${esc(g.name)} 면 ${g.myeonCount}곳`,
    `<ul class="nm">\n${g.myeon.map((m) => `<li>${esc(m)}</li>`).join('\n')}\n</ul>`,
    at(hash(seedKey, 'my'), SEC.myeonSub), num);
}

/* ── 서브 지역 시군구 안의 동 이름 ───────────────────────────────
   서브 지역은 동마다 쪽을 내지 않는다. 이름은 그대로 적어 검색어는 받는다. */
export function dongNameList(g, seedKey, num) {
  if (!g.dongNames || !g.dongNames.length) return '';
  return frame('dongidx', '행정동', `${esc(g.name)} 행정동 ${g.dongNames.length}곳`,
    `<ul class="nm">\n${g.dongNames.map((d) => `<li>${esc(d)}</li>`).join('\n')}\n</ul>`,
    at(hash(seedKey, 'dn'), SEC.dongSub), num);
}

/* ── 시도 안의 시군구 목록 ────────────────────────────────────── */
export function guIndex(sd, seedKey, currentSlug, num) {
  const items = sd.gu.map((g) => `<li${g.slug === currentSlug ? ' class="on"' : ''}>
    <a href="/${sd.slug}/${g.slug}/"${g.slug === currentSlug ? ' aria-current="page"' : ''}>
      <span class="ix-n">${esc(g.name)}</span>
      <span class="ix-m">${g.main ? `동읍 ${g.spotCount}` : `행정동 ${g.dongCount}`} · ${km2(g.area)}</span>
    </a></li>`).join('');
  return frame('guidx', '시군구', `${esc(sd.name)} 시군구 ${sd.gu.length}곳`,
    `<ul class="ix">${items}</ul>`,
    at(hash(seedKey, 'gi'), SEC.guIdxSub), num);
}

/* ── 맞닿은 시군구 ───────────────────────────────────────────── */
export function touchList(sd, g, seedKey, num) {
  if (!g.touchCount) return '';
  const items = g.touching.map((t) => `<li><a href="/${t.sidoSlug}/${t.slug}/">${esc(t.gu)}<span>${t.same ? '같은 시도' : esc(t.sido)}</span></a></li>`).join('');
  return frame('touch', '이웃', `${esc(g.name)}${josa(g.name, '과/와')} 선이 붙은 시군구 ${g.touchCount}곳`,  // 쪽이 있는 것만 건다
    `<ul class="tc">${items}</ul>`,
    at(hash(seedKey, 'tc'), SEC.adjSub), num);
}

/* ── 아래쪽 안내 링크 (글·약관 등 얕은 쪽용) ─────────────────── */
export function siteLinks(ctx, seedKey) {
  const { regions } = ctx;
  const h = hash(seedKey, 'sl');
  const all = [];
  for (const r of regions) for (const g of r.gu) for (const s of g.spots) all.push({ r, g, s });
  const spots = shuffle(all, h).slice(0, 12);
  return frame('also', '더 보기', '이어서 볼 곳',
    `<ul class="lk">
      <li><a href="/area/">받는 자리 전체</a></li>
      <li><a href="/guide/">이용안내</a></li>
      <li><a href="/price/">금액</a></li>
      <li><a href="/course/">코스</a></li>
      <li><a href="/magazine/">방문 노트</a></li>
      ${regions.map((r) => `<li><a href="/${r.slug}/">${esc(r.name)}</a></li>`).join('')}
      ${spots.map((x) => `<li><a href="/${x.r.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)}</a></li>`).join('')}
    </ul>`,
    '층은 셋입니다 — 시도, 시군구, 그리고 수도권·부산만 동·읍. 면과 서브 지역의 동은 시군구 쪽에 이름으로 올려 두었습니다.');
}
