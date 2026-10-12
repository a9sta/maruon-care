import { layout, frame } from '../lib/html.mjs';
import { esc, hash, km, km2, won, josa } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseGrid, stepList, factTable, faqBlock, noticeBlock, longtail,
  adjList, spotIndex, myeonList, dongNameList, guIndex, touchList, telCta,
} from '../lib/blocks.mjs';
import {
  SPOT_LEAD_A, SPOT_LEAD_A_EUP, SPOT_LEAD_B, SPOT_LEAD_B_NONE, SPOT_LEAD_C, SPOT_LEAD_C_ALONE,
  GU_LEAD, SIDO_LEAD_MAIN, SIDO_LEAD_SUB, SEC, walkWord, shapeWord,
} from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/** 리드·FAQ 틀에 넘기는 값 꾸러미. 전부 경계 자료를 계산해 나온 사실이다. */
function spotCtx(ctx, sd, g, s) {
  const { cfg, courses } = ctx;
  const longer = s.wide >= s.tall ? s.wide : s.tall;
  const shorter = s.wide >= s.tall ? s.tall : s.wide;
  return {
    sd, g, s,
    nm: s.name, gu: g.name, sido: sd.name, kind: s.kind,
    area: km2(s.area), wide: km(s.wide), tall: km(s.tall),
    long: km(longer), short: km(shorter),
    shape: shapeWord(s.ratio), walk: walkWord(s.area),
    adjAll: s.adjCount, adjN: s.adj.length, out: s.outCount, inn: s.adj.length - s.outCount,
    a0: s.adj[0], a1: s.adj[1], alone: s.adj.length === 0,
    place: `${g.name} ${s.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
    minPrice: won(Math.min(...courses.map((c) => c.price))),
  };
}

/* ── 동·읍 쪽 — 메인 네 시도에서만 낸다 ────────────────────────── */
export function spotPage(ctx, sd, g, s) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/${s.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}/${s.name}`;
  const h = hash(seed, 'spot');
  const c = spotCtx(ctx, sd, g, s);

  const poolA = s.kind === '읍' ? SPOT_LEAD_A_EUP : SPOT_LEAD_A;
  const lead = `<div class="say">
  <p>${at(h, poolA, 0)(c)}</p>
  <p>${at(h, s.adjCount ? SPOT_LEAD_B : SPOT_LEAD_B_NONE, 1)(c)}</p>
  <p>${at(h, c.alone ? SPOT_LEAD_C_ALONE : SPOT_LEAD_C, 2)(c)}</p>
</div>`;

  const facts = frame('fact', '실측', `${esc(s.name)} 숫자로`,
    factTable([
      ['시도', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
      ['시군구', `<a href="/${sd.slug}/${g.slug}/">${esc(g.name)}</a>`],
      ['갈래', s.kind === '읍' ? '읍 — 군에서 길과 가게가 모이는 자리' : '행정동'],
      ['넓이', `${km2(s.area)} — ${esc(c.walk)}`],
      ['가로 · 세로', `${km(s.wide)} × ${km(s.tall)} · ${esc(c.shape)} 칸`],
      ['맞닿은 행정동', s.adjCount
        ? `모두 ${s.adjCount}곳${s.adj.length ? ` · 이 중 ${s.adj.length}곳에 쪽이 있음` : ' · 쪽이 있는 곳 없음'}`
        : '없음 — 물로 둘러싸인 자리'],
      ['시군구 밖과 맞닿음', s.outCount ? `${s.outCount}곳` : `없음 — 둘레가 모두 ${esc(g.name)} 안쪽`],
      ['접수', `${esc(cfg.hours)} · 값은 ${esc(cfg.pay)} · 문 앞까지 ${esc(cfg.arrive)}`],
    ]),
    at(h, SEC.factSub, 7), '00');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '06');

  // 다른 시도의 자리 — 깊은 쪽끼리 이어 막힌 쪽이 생기지 않게 한다
  const pool = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    if (r.main) for (const x of r.gu) for (const y of x.spots) pool.push({ label: `${x.name} ${y.name}`, href: `/${r.slug}/${x.slug}/${y.slug}/` });
    else for (const x of r.gu) pool.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }

  const body = [
    lead,
    facts,
    telCta(cfg, `${g.name} ${s.name}`, seed),
    courseGrid(courses, seed, s.name, '01'),
    adjList(s, seed, '02'),
    spotIndex(sd, g, seed, s.slug, '03'),
    stepList(seed, '04'),
    guIndex(sd, seed, g.slug, '05'),
    faqHtml,
    noticeBlock(seed, '07'),
    longtail(pool, seed, 24, '다른 지역', at(h, SEC.crossHead, 8), null, '08'),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.spot(sd, g, s),
      desc: clampDesc(desc.spot(sd, g, s)),
      h1: `${esc(g.name)} ${esc(s.name)} <span class="hd-s">${s.kind === '읍' ? '읍' : '동'}까지 내려 적은 출장마사지·홈타이</span>`,
      body,
      pageKind: 'spot',
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name} ${s.name}`, lat: s.lat, lng: s.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '받는 자리', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` },
        { name: s.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name} ${s.name}`, { lat: s.lat, lng: s.lng },
          { area: s.area, containedIn: { '@type': 'AdministrativeArea', name: `${sd.full} ${g.name}` } }),
        S.service({
          siteUrl, url, cfg,
          name: `${g.name} ${s.name} 출장마사지·홈타이 방문 관리`,
          desc: clampDesc(desc.spot(sd, g, s)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.faqPage(url, qa),
      ],
    }),
  };
}

/* ── 시군구 쪽 ────────────────────────────────────────────────── */
export function guPage(ctx, sd, g) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/${g.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/${g.name}`;
  const h = hash(seed, 'gu');
  const t0 = g.touching[0];

  const c = {
    sido: sd.name, name: g.name, gu: g.name, main: g.main, mainSite: g.main,
    unitW: g.main ? '동·읍' : '행정동',
    unitN: g.main ? g.spotCount : g.dongNames.length,
    spotCount: g.spotCount, dongCount: g.dongCount, myeonCount: g.myeonCount,
    area: km2(g.area), touchCount: g.touchCount, touchAll: g.touchAll,
    t0: t0 ? t0.gu : '', outSido: g.touching.some((x) => !x.same),
    place: `${sd.name} ${g.name}`,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
    minPrice: won(Math.min(...courses.map((x) => x.price))),
  };

  // 같은 풀에서 둘을 뽑으므로 겹치지 않게 뒤 칸을 밀어 준다
  const i0 = parseInt(h.substr(0, 3), 16) % GU_LEAD.length;
  const i1 = (i0 + 1 + (parseInt(h.substr(9, 3), 16) % (GU_LEAD.length - 1))) % GU_LEAD.length;
  const lead = `<div class="say">
  <p>${GU_LEAD[i0](c)}</p>
  <p>${GU_LEAD[i1](c)}</p>
</div>`;

  const byArea = g.spots.slice().sort((a, b) => b.area - a.area);
  const rows = [
    ['시도', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
    ['행정동 합', `${g.dongCount}곳`],
    g.main
      ? ['쪽을 둔 동·읍', `${g.spotCount}곳`]
      : ['쪽을 둔 깊이', '시군구까지 — 동 이름은 아래 목록에'],
    ['면', g.myeonCount ? `${g.myeonCount}곳 — 이름만 적음` : '없음'],
    ['넓이', km2(g.area)],
    ['맞닿은 시군구', g.touchAll ? `모두 ${g.touchAll}곳${g.touchCount ? ` · ${g.touching.slice(0, 3).map((x) => esc(x.gu)).join(' · ')}` : ' · 이 사이트에 쪽이 있는 곳은 없음'}` : '없음 — 뭍으로 이어진 이웃이 없는 섬'],
    ['시도 밖과 맞닿음', g.touching.some((x) => !x.same) ? `${g.touching.filter((x) => !x.same).length}곳` : '없음'],
    ['접수', `${esc(cfg.hours)} · 값은 ${esc(cfg.pay)}`],
  ];
  if (g.main && byArea.length) {
    rows.splice(5, 0, ['가장 넓은 자리', `<a href="/${sd.slug}/${g.slug}/${byArea[0].slug}/">${esc(byArea[0].name)}</a> ${km2(byArea[0].area)}`]);
  }
  const facts = frame('fact', '실측', `${esc(g.name)} 숫자로`, factTable(rows), at(h, SEC.factSub, 7), '00');

  const { html: faqHtml, qa } = faqBlock(seed, c, 5, '05');

  const pool = [];
  for (const r of regions) for (const x of r.gu) {
    if (r.slug === sd.slug && x.slug === g.slug) continue;
    pool.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }

  const body = [
    lead,
    facts,
    telCta(cfg, `${sd.name} ${g.name}`, seed),
    g.main ? spotIndex(sd, g, seed, null, '01') : dongNameList(g, seed, '01'),
    myeonList(g, seed, '02'),
    courseGrid(courses, seed, g.name, '03'),
    touchList(sd, g, seed, '04'),
    faqHtml,
    stepList(seed, '06'),
    noticeBlock(seed, '07'),
    guIndex(sd, seed, g.slug, '08'),
    longtail(pool, seed, 20, '옆 시군구', '옆 시군구에서 받는 자리', null, '09'),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.gu(sd, g),
      desc: clampDesc(desc.gu(sd, g)),
      h1: `${esc(sd.name)} ${esc(g.name)} <span class="hd-s">출장마사지·홈타이 ${g.main ? `동·읍 ${g.spotCount}곳` : `행정동 ${g.dongCount}곳`}</span>`,
      body,
      pageKind: 'gu',
      geo: { iso: sd.iso, placename: `${sd.full} ${g.name}`, lat: g.lat, lng: g.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '받는 자리', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: g.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, `${sd.full} ${g.name}`, { lat: g.lat, lng: g.lng },
          { area: g.area, containedIn: { '@type': 'AdministrativeArea', name: sd.full } }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} ${g.name} 출장마사지·홈타이 방문 관리`,
          desc: clampDesc(desc.gu(sd, g)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        g.main && g.spots.length
          ? S.itemList(`${url}#spotlist`, `${g.name} 동·읍`, g.spots.map((s) => ({ name: s.name, url: `${siteUrl}/${sd.slug}/${g.slug}/${s.slug}/` })))
          : null,
        S.faqPage(url, qa),
      ].filter(Boolean),
    }),
  };
}

/* ── 시도 쪽 ──────────────────────────────────────────────────── */
export function sidoPage(ctx, sd) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/${sd.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = sd.name;
  const h = hash(seed, 'sd');
  const byArea = sd.gu.slice().sort((a, b) => b.area - a.area);

  const c = {
    name: sd.name, full: sd.full, guCount: sd.gu.length,
    spotCount: sd.spotCount, dongCount: sd.dongCount, myeonCount: sd.myeonCount,
    place: sd.name,
    hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
    minPrice: won(Math.min(...courses.map((x) => x.price))),
  };

  const lead = `<div class="say"><p>${at(h, sd.main ? SIDO_LEAD_MAIN : SIDO_LEAD_SUB, 0)(c)}</p></div>`;

  const facts = frame('fact', '실측', `${esc(sd.name)} 숫자로`,
    factTable([
      ['행정 명칭', esc(sd.full)],
      ['쪽을 둔 깊이', sd.main ? '시군구 → 동·읍' : '시군구까지'],
      ['시군구', `${sd.gu.length}곳`],
      ['행정동 합', `${sd.dongCount}곳`],
      sd.main ? ['쪽을 둔 동·읍', `${sd.spotCount}곳`] : ['동 이름', '각 시군구 쪽에 목록으로'],
      ['면', sd.myeonCount ? `${sd.myeonCount}곳 — 시군구 쪽에 이름으로` : '없음'],
      ['받는 넓이', km2(sd.area)],
      ['가장 넓은 시군구', `<a href="/${sd.slug}/${byArea[0].slug}/">${esc(byArea[0].name)}</a> ${km2(byArea[0].area)}`],
      ['접수', `${esc(cfg.hours)} · 값은 ${esc(cfg.pay)}`],
    ]), at(h, SEC.factSub, 7), '00');

  const { html: faqHtml, qa } = faqBlock(seed, c, 4, '05');

  const csLinks = frame('sidocourse', '코스', `${esc(sd.name)} 코스별 안내`,
    `<ul class="lk">${courses.map((x) => `<li><a href="/${sd.slug}/course/${x.slug}/">${esc(sd.name)} ${esc(x.ko)} 출장마사지</a></li>`).join('')}</ul>`,
    `코스마다 쓰는 자리와 손놀림이 다릅니다. 값은 ${esc(sd.name)} 전역이 한 가지로 묶여 있습니다.`, '03');

  let pickBlock = '';
  if (sd.main) {
    const topSpots = [];
    for (const g of sd.gu) for (const s of g.spots) topSpots.push({ g, s });
    topSpots.sort((a, b) => b.s.adjCount - a.s.adjCount || b.s.area - a.s.area);
    pickBlock = frame('spotpick', '자리', `${esc(sd.name)}에서 이웃이 많은 동·읍`,
      `<ul class="lk">${topSpots.slice(0, 18).map((x) => `<li><a href="/${sd.slug}/${x.g.slug}/${x.s.slug}/">${esc(x.g.name)} ${esc(x.s.name)} 맞닿음 ${x.s.adjCount}</a></li>`).join('')}</ul>`,
      `둘레에 붙은 동이 많은 자리는 어느 쪽에서든 들어갈 수 있습니다. 전체 ${sd.spotCount}곳은 시군구를 눌러 보십시오.`, '02');
  } else {
    const byTouch = sd.gu.slice().sort((a, b) => b.dongCount - a.dongCount);
    pickBlock = frame('gupick', '시군구', `${esc(sd.name)}에서 행정동이 많은 곳`,
      `<ul class="lk">${byTouch.slice(0, 12).map((g) => `<li><a href="/${sd.slug}/${g.slug}/">${esc(g.name)} 행정동 ${g.dongCount}곳</a></li>`).join('')}</ul>`,
      '행정동이 많다는 것은 그만큼 주소가 촘촘하다는 뜻입니다.', '02');
  }

  const pool = [];
  for (const r of regions) {
    if (r.slug === sd.slug) continue;
    for (const x of r.gu) pool.push({ label: `${r.name} ${x.name}`, href: `/${r.slug}/${x.slug}/` });
  }

  const body = [
    lead,
    facts,
    telCta(cfg, sd.name, seed),
    guIndex(sd, seed, null, '01'),
    pickBlock,
    csLinks,
    courseGrid(courses, seed, sd.name, '04'),
    faqHtml,
    stepList(seed, '06'),
    longtail(pool, seed, 20, '다른 시도', '다른 시도에서 받는 자리', null, '07'),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.sido(sd),
      desc: clampDesc(desc.sido(sd)),
      h1: `${esc(sd.name)} <span class="hd-s">${sd.main ? `동·읍 ${sd.spotCount}곳` : `시군구 ${sd.gu.length}곳`} 출장마사지·홈타이</span>`,
      body,
      pageKind: 'sido',
      geo: { iso: sd.iso, placename: sd.full, lat: sd.lat, lng: sd.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '받는 자리', url: `${siteUrl}/area/` },
        { name: sd.name, url },
      ],
      jsonld: [
        S.place(`${url}#place`, sd.full, { lat: sd.lat, lng: sd.lng }, { area: sd.area, alternateName: sd.alias }),
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} 출장마사지·홈타이 방문 관리`,
          desc: clampDesc(desc.sido(sd)),
          areaServed: { '@id': `${url}#place` },
          courses,
        }),
        S.itemList(`${url}#gulist`, `${sd.name} 시군구`, sd.gu.map((g) => ({ name: g.name, url: `${siteUrl}/${sd.slug}/${g.slug}/` }))),
        S.faqPage(url, qa),
      ],
    }),
  };
}
