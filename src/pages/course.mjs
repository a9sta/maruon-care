import { layout, frame } from '../lib/html.mjs';
import { esc, hash, won, josa, km2 } from '../lib/util.mjs';
import { title, desc, clampDesc } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import { factTable, faqBlock, stepList, noticeBlock, longtail, telCta, courseGrid } from '../lib/blocks.mjs';
import { SEC } from '../content/copy.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

/* ★동·읍 × 코스는 만들지 않는다. 1,275 × 8 = 10,200쪽이 되는데, 자리가 바뀌어도
   코스 설명이 같아서 전부 얇은 조합 페이지가 된다(도어웨이로 읽힌다).
   코스는 전국 한 장 + 시도별 한 장까지만 낸다. */

const OIL_NOTE = {
  true: '오일을 씁니다. 마치고 씻으실 수 있는 상황인지 미리 확인해 주십시오.',
  false: '오일을 쓰지 않습니다. 옷을 입은 채로 받으셔도 되고 마치고 바로 나가실 수 있습니다.',
};
const PRESSURE_NOTE = [
  '세기는 받는 동안 언제든 바꿉니다. 처음 십 분쯤 지나면 어느 정도가 맞는지 서로 감이 옵니다.',
  '적어 둔 세기는 기준일 뿐입니다. 아프면 아프다고 말씀해 주시는 편이 훨씬 낫습니다.',
  '같은 세기라도 사람마다 다르게 느낍니다. 숫자보다 그날 몸 상태를 먼저 봅니다.',
];
const WHY = [
  (c) => `${c.ko}${josa(c.ko, '을/를')} 고르시는 분은 대개 ${c.for} 부르십니다.`,
  (c) => `이 코스는 ${c.for} 맞습니다. 다른 사정이면 통화에서 바꿔 드립니다.`,
  (c) => `${c.for} 이쪽을 권합니다. 고르고 나서 바꾸셔도 값은 그때 정한 코스대로입니다.`,
];

/* ── 코스 한 장 ───────────────────────────────────────────────── */
export function coursePage(ctx, c) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const path = `/course/${c.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `course/${c.slug}`;
  const h = hash(seed, 'cp');

  const fc = {
    place: c.ko, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
    minPrice: won(Math.min(...courses.map((x) => x.price))),
  };

  const lead = `<div class="say">
  <p>${esc(at(h, WHY, 0)(c))} ${esc(c.lines[0])}</p>
  <p>${esc(c.lines[1])} ${esc(c.lines[2])}</p>
  <p>${esc(OIL_NOTE[String(c.oil)])} ${esc(at(h, PRESSURE_NOTE, 1))}</p>
</div>`;

  const facts = frame('fact', '실측', `${esc(c.ko)} 기준`,
    factTable([
      ['기본 시간', `${c.min}분`],
      ['금액', `${won(c.price)}원 — 어느 지역이든 같음`],
      ['세기', esc(c.pressure)],
      ['진행 속도', esc(c.tempo)],
      ['많이 쓰는 자리', esc(c.focus)],
      ['오일', c.oil ? '씀' : '안 씀'],
      ['준비물', c.oil ? '수건 두 장과 누울 자리' : '누울 자리 (수건은 한 장이면 충분)'],
      ['접수', `${esc(cfg.hours)} · ${esc(cfg.pay)} · 문 앞까지 ${esc(cfg.arrive)}`],
    ]), at(h, SEC.factSub, 7), '00');

  const others = courses.filter((x) => x.slug !== c.slug);
  const compare = frame('cmp', '견주기', `${esc(c.ko)}${josa(c.ko, '과/와')} 다른 코스의 차이`,
    `<table class="cmp"><thead><tr><th scope="col">코스</th><th scope="col">시간</th><th scope="col">금액</th><th scope="col">세기</th><th scope="col">오일</th></tr></thead>
     <tbody>
      <tr class="on"><th scope="row">${esc(c.ko)}</th><td>${c.min}분</td><td>${won(c.price)}원</td><td>${esc(c.pressure)}</td><td>${c.oil ? '씀' : '안 씀'}</td></tr>
      ${others.map((x) => `<tr><th scope="row"><a href="/course/${x.slug}/">${esc(x.ko)}</a></th><td>${x.min}분</td><td>${won(x.price)}원</td><td>${esc(x.pressure)}</td><td>${x.oil ? '씀' : '안 씀'}</td></tr>`).join('')}
     </tbody></table>`,
    '시간이 길다고 더 센 것이 아닙니다. 세기와 길이는 따로 보십시오.', '01');

  const { html: faqHtml, qa } = faqBlock(seed, fc, 5, '03');

  const pool = [];
  for (const r of regions) pool.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });
  for (const r of regions) {
    if (!r.main) continue;
    for (const g of r.gu) pool.push({ label: `${g.name}`, href: `/${r.slug}/${g.slug}/` });
  }

  const body = [
    lead,
    facts,
    telCta(cfg, c.ko, seed),
    compare,
    stepList(seed, '02'),
    faqHtml,
    noticeBlock(seed, '04'),
    longtail(pool, seed, 22, '지역별', `${c.ko}${josa(c.ko, '을/를')} 지역에서 찾기`, '시도를 고르시면 그 지역 안내로 넘어갑니다.', '05'),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.course(c),
      desc: clampDesc(desc.course(c)),
      h1: `${esc(c.ko)} <span class="hd-s">${c.min}분 ${won(c.price)}원 · 세기 ${esc(c.pressure)}</span>`,
      body,
      pageKind: 'course',
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '코스', url: `${siteUrl}/course/` },
        { name: c.ko, url },
      ],
      jsonld: [
        S.service({
          siteUrl, url, cfg,
          name: `${c.ko} 출장마사지·홈타이`,
          desc: clampDesc(desc.course(c)),
          areaServed: { '@type': 'Country', name: '대한민국' },
          courses: [c],
        }),
        S.faqPage(url, qa),
      ],
    }),
  };
}

/* ── 시도 × 코스 ──────────────────────────────────────────────── */
export function sidoCoursePage(ctx, sd, c) {
  const { cfg, siteUrl, courses } = ctx;
  const path = `/${sd.slug}/course/${c.slug}/`;
  const url = `${siteUrl}${path}`;
  const seed = `${sd.name}/course/${c.slug}`;
  const h = hash(seed, 'sc');

  const fc = {
    place: `${sd.name} ${c.ko}`, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
    tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
    minPrice: won(Math.min(...courses.map((x) => x.price))),
  };

  const open = [
    `${sd.name}에서 ${c.ko}${josa(c.ko, '을/를')} 받으실 때도 시간과 금액은 ${c.min}분 ${won(c.price)}원 그대로입니다. 지역에 따라 값을 올리지 않습니다.`,
    `${c.ko}${josa(c.ko, '은/는')} ${sd.name} 어느 자리에서 부르셔도 같은 구성으로 갑니다. 달라지는 것은 도착까지 걸리는 시간뿐입니다.`,
    `${sd.name} 안에서 ${c.ko} 접수는 다른 코스와 같은 번호로 받습니다. ${c.min}분 ${won(c.price)}원입니다.`,
  ];
  const second = sd.main
    ? `${sd.name}${josa(sd.name, '은/는')} 동·읍 ${sd.spotCount}곳까지 쪽을 내려 두었습니다. 사시는 동을 눌러 그 자리의 넓이와 맞닿은 동을 먼저 보시면, 왜 어떤 날은 빨리 닿고 어떤 날은 늦는지 짐작이 가실 것입니다.`
    : `${sd.name}${josa(sd.name, '은/는')} 시군구 ${sd.gu.length}곳까지 쪽을 두었습니다. 동 이름은 각 시군구 쪽에 목록으로 올려 두었고, 전화에서 동 이름을 그대로 말씀해 주시면 됩니다.`;

  const lead = `<div class="say">
  <p>${esc(at(h, open, 0))}</p>
  <p>${esc(second)}</p>
  <p>${esc(c.lines[(parseInt(h.substr(3, 3), 16)) % c.lines.length])}</p>
</div>`;

  const facts = frame('fact', '실측', `${esc(sd.name)} ${esc(c.ko)} 기준`,
    factTable([
      ['지역', `<a href="/${sd.slug}/">${esc(sd.full)}</a>`],
      ['쪽을 둔 깊이', sd.main ? `시군구 ${sd.gu.length} → 동·읍 ${sd.spotCount}` : `시군구 ${sd.gu.length}`],
      ['기본 시간', `${c.min}분`],
      ['금액', `${won(c.price)}원 — ${esc(sd.name)} 안에서 동일`],
      ['세기 · 속도', `${esc(c.pressure)} · ${esc(c.tempo)}`],
      ['많이 쓰는 자리', esc(c.focus)],
      ['오일', c.oil ? '씀' : '안 씀'],
      ['받는 넓이', km2(sd.area)],
    ]), at(h, SEC.factSub, 7), '00');

  const { html: faqHtml, qa } = faqBlock(seed, fc, 4, '02');

  const pool = [];
  for (const g of sd.gu) pool.push({ label: `${g.name} ${c.ko}`, href: `/${sd.slug}/${g.slug}/` });
  for (const x of courses) {
    if (x.slug === c.slug) continue;
    pool.push({ label: `${sd.name} ${x.ko}`, href: `/${sd.slug}/course/${x.slug}/` });
  }

  const body = [
    lead,
    facts,
    telCta(cfg, `${sd.name} ${c.ko}`, seed),
    courseGrid(courses, seed, sd.name, '01'),
    faqHtml,
    stepList(seed, '03'),
    longtail(pool, seed, 20, '지역·코스', `${sd.name} 안에서 더 보기`, null, '04'),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.sidoCourse(sd, c),
      desc: clampDesc(desc.sidoCourse(sd, c)),
      h1: `${esc(sd.name)} ${esc(c.ko)} <span class="hd-s">${c.min}분 ${won(c.price)}원 출장마사지·홈타이</span>`,
      body,
      pageKind: 'sidocourse',
      geo: { iso: sd.iso, placename: sd.full, lat: sd.lat, lng: sd.lng },
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '받는 자리', url: `${siteUrl}/area/` },
        { name: sd.name, url: `${siteUrl}/${sd.slug}/` },
        { name: c.ko, url },
      ],
      jsonld: [
        S.service({
          siteUrl, url, cfg,
          name: `${sd.name} ${c.ko} 출장마사지·홈타이`,
          desc: clampDesc(desc.sidoCourse(sd, c)),
          areaServed: { '@type': 'AdministrativeArea', name: sd.full },
          courses: [c],
        }),
        S.faqPage(url, qa),
      ],
    }),
  };
}
