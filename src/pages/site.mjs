import { layout, frame, telBtn } from '../lib/html.mjs';
import { esc, hash, km, km2, won, josa, shuffle } from '../lib/util.mjs';
import { title, desc, clampDesc, BRAND } from '../lib/seo.mjs';
import * as S from '../lib/schema.mjs';
import {
  courseGrid, stepList, factTable, faqBlock, noticeBlock,
  longtail, guIndex, telCta, siteLinks,
} from '../lib/blocks.mjs';
import { SEC } from '../content/copy.mjs';
import { POSTS } from '../content/posts.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];
const baseCtx = (cfg, courses, place) => ({
  place, hours: cfg.hours, pay: cfg.pay, arrive: cfg.arrive,
  tel: cfg.tel, telLabel: cfg.telLabel, telNote: cfg.telNote,
  minPrice: won(Math.min(...courses.map((c) => c.price))),
});

/* ── 대문 ─────────────────────────────────────────────────────── */
export function homePage(ctx) {
  const { cfg, siteUrl, courses, regions, counts, latestPosts } = ctx;
  const seed = 'home';
  const h = hash(seed, 'hm');
  const main = regions.filter((r) => r.main);
  const sub = regions.filter((r) => !r.main);

  const hero = `<section class="hero" aria-label="처음 안내">
  <p class="hero-sl">${esc(cfg.brand.slogan)}</p>
  <p class="hero-p">가게 자리를 두지 않습니다. 부르시면 관리사가 그 주소로 갑니다. 서울·인천·경기·부산은 동과 읍까지 쪽을 내려 두었고, 대전·대구·울산과 지정한 시·군은 시군구까지 적어 두었습니다.</p>
  ${telBtn(cfg, { size: 'l' })}
  <ul class="hero-f">
    <li><b>${esc(cfg.hours)}</b><span>전화가 끊기지 않습니다</span></li>
    <li><b>${esc(cfg.pay)}</b><span>미리 보내실 돈이 없습니다</span></li>
    <li><b>${esc(cfg.arrive)}</b><span>문 앞까지 보통 이 정도</span></li>
    <li><b>동·읍 ${counts.spot}곳</b><span>시군구 ${counts.gu}곳에 걸쳐</span></li>
  </ul>
</section>`;

  const areaBlock = frame('area', '받는 자리', '사시는 데를 먼저 고르십시오',
    `<div class="lv">
      <div class="lv-b">
        <p class="lv-h">동·읍까지 쪽이 있는 곳</p>
        <ul class="lv-ul">${main.map((r) => `<li><a href="/${r.slug}/"><b>${esc(r.name)}</b><span>시군구 ${r.gu.length} · 동읍 ${r.spotCount}</span></a></li>`).join('')}</ul>
      </div>
      <div class="lv-b lv-s">
        <p class="lv-h">시군구까지 쪽이 있는 곳</p>
        <ul class="lv-ul">${sub.map((r) => `<li><a href="/${r.slug}/"><b>${esc(r.name)}</b><span>시군구 ${r.gu.length}</span></a></li>`).join('')}</ul>
      </div>
    </div>
    <p class="fr-tail">어느 쪽이든 번호와 금액은 같습니다. <a href="/area/">전체 목록</a>에서 한눈에 보실 수 있습니다.</p>`,
    '두 층으로 나눈 것은 깊이 차이일 뿐, 방문을 가려 받는다는 뜻이 아닙니다.', '01');

  const whyBlock = frame('why', '쓰는 방식', '왜 맞닿은 동을 먼저 보는가',
    `<div class="say">
      <p>동 쪽에 들어가시면 그 자리의 넓이와 가로·세로 폭, 그리고 <strong>경계가 실제로 붙어 있는 행정동</strong>이 적혀 있습니다. 중심점 사이가 몇 킬로미터인지로 뽑은 목록이 아니라, 경계선의 좌표를 나눠 가졌는지로 뽑은 목록입니다.</p>
      <p>강 건너는 지도에서 가까워도 다리까지 돌아야 하고, 산이 끼면 아예 길이 없습니다. 그래서 "가깝다"는 말 대신 "붙어 있다"를 기준으로 삼았습니다. 접수가 들어오면 붙어 있는 쪽부터 사람을 찾습니다.</p>
      <p>숫자는 전부 공개 경계 자료를 계산해 나온 값이고, 같은 자료를 다시 계산하면 같은 값이 나옵니다. 어떻게 셌는지는 <a href="/magazine/where-the-line-runs/">노트에 적어 두었습니다</a>.</p>
    </div>`, null, '02');

  const postBlock = frame('note', '노트', '받기 전에 알아 두면 좋은 것',
    `<ul class="po">${latestPosts.map((p) => `<li><a href="${p.path}"><b>${esc(p.title)}</b><span>${esc(p.summary)}</span><time datetime="${p.date}">${p.date}</time></a></li>`).join('')}</ul>
     <p class="fr-tail"><a href="/magazine/">노트 전체 보기</a></p>`,
    '후기나 체험담이 아닙니다. 받기 전에 정해 두시면 좋은 것만 적었습니다.', '05');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '지금 계신 곳'), 6, '06');

  const pool = [];
  for (const r of regions) {
    if (r.main) for (const g of r.gu) for (const s of g.spots) pool.push({ label: `${g.name} ${s.name}`, href: `/${r.slug}/${g.slug}/${s.slug}/` });
    else for (const g of r.gu) pool.push({ label: `${r.name} ${g.name}`, href: `/${r.slug}/${g.slug}/` });
  }

  const body = [
    hero,
    areaBlock,
    whyBlock,
    courseGrid(courses, seed, '어느 자리에서든', '03'),
    stepList(seed, '04'),
    postBlock,
    faqHtml,
    noticeBlock(seed, '07'),
    longtail(pool, seed, 30, '바로 가기', '많이 찾으시는 자리', null, '08'),
    telCta(cfg, '지금 계신 곳', seed),
  ].join('\n');

  return {
    path: '/',
    html: layout(ctx, {
      path: '/',
      title: title.home(),
      desc: clampDesc(desc.home()),
      h1: `${esc(cfg.brand.ko)} 출장마사지·홈타이 <span class="hd-s">서울·인천·경기·부산 동읍 ${counts.spot}곳 · 시군구 ${counts.gu}곳 방문</span>`,
      body,
      pageKind: 'home',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }],
      jsonld: [
        S.service({
          siteUrl, url: siteUrl + '/', cfg,
          name: `${cfg.brand.ko} 출장마사지·홈타이 방문 관리`,
          desc: clampDesc(desc.home()),
          areaServed: { '@type': 'Country', name: '대한민국' },
          courses,
        }),
        S.itemList(`${siteUrl}/#sidolist`, '받는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.faqPage(`${siteUrl}/`, qa),
      ],
    }),
  };
}

/* ── 지역 허브 ────────────────────────────────────────────────── */
export function areaHub(ctx) {
  const { cfg, siteUrl, regions, counts, courses } = ctx;
  const seed = 'area';
  const h = hash(seed, 'ah');

  const lead = `<div class="say">
  <p>쪽을 둔 자리를 한 장에 모았습니다. 시군구 ${counts.gu}곳, 동·읍 ${counts.spot}곳입니다. 면 ${counts.myeon}곳은 따로 쪽을 내지 않았지만 접수와 방문은 똑같이 받습니다.</p>
  <p>서울·인천·경기·부산은 동과 읍마다 들어가 보실 수 있고, 나머지 지역은 시군구 쪽에 동 이름을 목록으로 올려 두었습니다. 깊이가 다른 것은 찾는 분이 많은 쪽을 더 잘게 나눠 둔 것일 뿐입니다.</p>
</div>`;

  const blocks = regions.map((r, i) => frame(`sd-${r.slug}`, r.main ? '동·읍까지' : '시군구까지', `<a href="/${r.slug}/">${esc(r.name)}</a> ${r.main ? `동·읍 ${r.spotCount}곳` : `시군구 ${r.gu.length}곳`}`,
    `<ul class="ix">${r.gu.map((g) => `<li><a href="/${r.slug}/${g.slug}/"><span class="ix-n">${esc(g.name)}</span><span class="ix-m">${r.main ? `동읍 ${g.spotCount}` : `행정동 ${g.dongCount}`} · ${km2(g.area)}</span></a></li>`).join('')}</ul>`,
    r.main
      ? `${r.name}${josa(r.name, '은/는')} 시군구를 누르면 그 안의 동·읍이 나옵니다. 행정동 합은 ${r.dongCount}곳입니다.`
      : `${r.name}${josa(r.name, '은/는')} 시군구까지입니다. 행정동 ${r.dongCount}곳의 이름은 각 시군구 쪽에 있습니다.`,
    String(i + 1).padStart(2, '0'))).join('\n');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '사시는 동네'), 4, '98');

  const body = [lead, telCta(cfg, '사시는 곳', seed), blocks, faqHtml, stepList(seed, '99')].join('\n');

  return {
    path: '/area/',
    html: layout(ctx, {
      path: '/area/',
      title: title.areaHub(counts),
      desc: clampDesc(desc.areaHub(counts)),
      h1: `받는 자리 전체 <span class="hd-s">시군구 ${counts.gu}곳 · 동읍 ${counts.spot}곳</span>`,
      body,
      pageKind: 'areahub',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '받는 자리', url: `${siteUrl}/area/` }],
      jsonld: [
        S.itemList(`${siteUrl}/area/#list`, '받는 시도', regions.map((r) => ({ name: r.name, url: `${siteUrl}/${r.slug}/` }))),
        S.faqPage(`${siteUrl}/area/`, qa),
      ],
    }),
  };
}

/* ── 코스 허브 ────────────────────────────────────────────────── */
export function courseHub(ctx) {
  const { cfg, siteUrl, courses, regions } = ctx;
  const seed = 'coursehub';
  const h = hash(seed, 'ch');
  const sorted = courses.slice().sort((a, b) => a.price - b.price);

  const lead = `<div class="say">
  <p>여덟 가지입니다. 고르실 때 보실 것은 셋뿐입니다 — 세기, 걸리는 시간, 오일을 쓰는지. 그 셋만 정하시면 나머지는 통화에서 맞춥니다.</p>
  <p>가장 짧은 것이 ${sorted[0].ko === '건식' ? '건식' : sorted[0].ko} 쪽이고 가장 긴 것이 아로마입니다. 길다고 더 센 것이 아니고, 비싸다고 더 좋은 것도 아닙니다. 몸 상태에 따라 맞는 것이 다를 뿐입니다.</p>
</div>`;

  const table = frame('all', '한눈에', '여덟 가지를 나란히',
    `<table class="cmp"><thead><tr><th scope="col">코스</th><th scope="col">시간</th><th scope="col">금액</th><th scope="col">세기</th><th scope="col">속도</th><th scope="col">오일</th></tr></thead>
     <tbody>${sorted.map((c) => `<tr><th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a></th><td>${c.min}분</td><td>${won(c.price)}원</td><td>${esc(c.pressure)}</td><td>${esc(c.tempo)}</td><td>${c.oil ? '씀' : '안 씀'}</td></tr>`).join('')}</tbody></table>`,
    '금액 낮은 차례로 놓았습니다. 어느 지역에서 부르셔도 같은 값입니다.', '01');

  const pickBy = frame('bycase', '고르기', '이런 때는 이쪽을',
    `<ul class="pk">${courses.map((c) => `<li><a href="/course/${c.slug}/"><b>${esc(c.ko)}</b><span>${esc(c.for)}</span></a></li>`).join('')}</ul>`,
    '고르고 나서 바꾸셔도 됩니다. 값은 마지막에 정한 코스로 계산합니다.', '02');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '사시는 곳'), 4, '03');

  const pool = [];
  for (const r of regions) for (const c of courses) pool.push({ label: `${r.name} ${c.ko}`, href: `/${r.slug}/course/${c.slug}/` });

  const body = [lead, table, pickBy, telCta(cfg, '코스 상담', seed), faqHtml, longtail(pool, seed, 24, '지역별', '지역에서 코스 찾기', null, '04')].join('\n');

  return {
    path: '/course/',
    html: layout(ctx, {
      path: '/course/',
      title: title.page(`코스 ${courses.length}가지 출장마사지·홈타이`),
      desc: clampDesc(`출장마사지·홈타이 코스 ${courses.length}가지를 세기·시간·오일 여부로 견주어 두었습니다. 금액은 ${won(sorted[0].price)}원부터이고 지역에 따라 달라지지 않습니다.`),
      h1: `코스 ${courses.length}가지 <span class="hd-s">세기 · 시간 · 오일로 견주기</span>`,
      body,
      pageKind: 'coursehub',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '코스', url: `${siteUrl}/course/` }],
      jsonld: [
        S.itemList(`${siteUrl}/course/#list`, '코스', courses.map((c) => ({ name: c.ko, url: `${siteUrl}/course/${c.slug}/` }))),
        S.faqPage(`${siteUrl}/course/`, qa),
      ],
    }),
  };
}

/* ── 금액 ─────────────────────────────────────────────────────── */
export function pricePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'price';
  const sorted = courses.slice().sort((a, b) => a.price - b.price);

  const lead = `<div class="say">
  <p>아래가 전부입니다. 여기 없는 돈은 받지 않습니다.</p>
  <p>지역에 따라 값이 달라지지 않습니다. 읍이든 도심이든 같은 코스면 같은 금액입니다. 멀리 가는 날이 있다고 해서 그 몫을 이용자께 넘기지 않기로 했습니다.</p>
</div>`;

  const table = frame('tbl', '금액표', '코스별 기본 시간과 금액',
    `<table class="cmp"><thead><tr><th scope="col">코스</th><th scope="col">기본 시간</th><th scope="col">금액</th><th scope="col">1분당</th></tr></thead>
     <tbody>${sorted.map((c) => `<tr><th scope="row"><a href="/course/${c.slug}/">${esc(c.ko)}</a></th><td>${c.min}분</td><td><b>${won(c.price)}원</b></td><td>${won(Math.round(c.price / c.min))}원</td></tr>`).join('')}</tbody></table>`,
    '1분당 값은 견주어 보시라고 적어 둔 것입니다. 분 단위로 쪼개 받지는 않습니다.', '01');

  const noExtra = frame('nox', '안 붙는 것', '여기에 더 붙지 않습니다',
    `<ul class="nt">
      <li>길 값 · 이동비 — 어느 자리든 받지 않습니다.</li>
      <li>심야 할증 — 새벽에도 표에 적힌 값 그대로입니다.</li>
      <li>공휴일 할증 — 명절에도 같습니다.</li>
      <li>예약금 · 보증금 — 미리 보내실 돈이 없습니다.</li>
      <li>위약금 — 미루시거나 무르셔도 받지 않습니다.</li>
      <li>주차비 — 저희 쪽에서 냅니다.</li>
    </ul>`,
    '계좌를 먼저 알려 달라는 연락이 오면 저희가 아닙니다.', '02');

  const pay = frame('how', '계산', '어떻게 내시면 되는지',
    factTable([
      ['때', '마친 뒤 그 자리에서'],
      ['수단', '현금 · 카드 — 어느 쪽이든 값이 같습니다'],
      ['영수증', '말씀하시면 드립니다'],
      ['시간을 늘릴 때', '통화에서 미리 정하시면 그만큼 더해서 계산합니다'],
      ['두 분이 받으실 때', '각각 계산합니다. 묶음 할인은 없습니다'],
    ]), null, '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '사시는 자리'), 4, '04');

  const body = [lead, table, noExtra, pay, telCta(cfg, '금액 확인', seed), faqHtml, siteLinks(ctx, seed)].join('\n');

  return {
    path: '/price/',
    html: layout(ctx, {
      path: '/price/',
      title: title.page(`금액표 ${won(sorted[0].price)}원부터 출장마사지·홈타이`),
      desc: clampDesc(`코스별 기본 시간과 금액입니다. ${won(sorted[0].price)}원부터이고, 길 값·심야 할증·예약금을 붙이지 않습니다. 마친 뒤에 현금이나 카드로 계산합니다.`),
      h1: `금액 <span class="hd-s">${won(sorted[0].price)}원부터 · 여기 없는 돈은 받지 않습니다</span>`,
      body,
      pageKind: 'price',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '금액', url: `${siteUrl}/price/` }],
      jsonld: [S.faqPage(`${siteUrl}/price/`, qa)],
    }),
  };
}

/* ── 이용안내 ─────────────────────────────────────────────────── */
export function guidePage(ctx) {
  const { cfg, siteUrl, courses } = ctx;
  const seed = 'guide';

  const lead = `<div class="say">
  <p>처음 부르시는 분을 기준으로 적었습니다. 통화 한 번이면 끝나는 일이라 길게 읽으실 것은 없습니다.</p>
</div>`;

  const what = frame('need', '준비', '집에 있어야 하는 것',
    `<ul class="nt">
      <li>누울 자리 하나 — 바닥이든 침대든 됩니다.</li>
      <li>수건 두 장 — 쓰던 것으로 충분합니다. 오일을 안 쓰는 코스면 한 장이면 됩니다.</li>
      <li>조용한 방 하나 — 집에 다른 분이 계셔도 괜찮습니다.</li>
    </ul>
    <p class="fr-tail">시트와 오일, 베드는 관리사가 들고 갑니다. 따로 사 두실 것이 없습니다.</p>`,
    null, '01');

  const timing = frame('when', '시각', '언제 부르실 수 있는지',
    factTable([
      ['접수', `${esc(cfg.hours)} — 새벽에도 번호가 같습니다`],
      ['도착', `${esc(cfg.arrive)}이 보통. 둘레가 막힌 자리는 더 걸립니다`],
      ['미루기', '언제든 됩니다. 돈이 붙지 않습니다'],
      ['무르기', '관리사가 이미 문 앞이면 한 번만 알려 주십시오'],
      ['가장 붐비는 때', '금요일과 토요일 밤 10시 전후'],
      ['가장 한가한 때', '평일 오전 — 이때는 거의 바로 갑니다'],
    ]), null, '02');

  const refuse = frame('no', '못 하는 때', '접수를 돌려 드리는 경우',
    `<ul class="nt">
      <li>성적인 요구가 섞인 경우 — 그 자리에서 끊습니다.</li>
      <li>열이 있거나 다친 자리가 부어 있는 경우 — 다른 날로 돌려 드립니다.</li>
      <li>주소를 끝까지 말씀하지 않으시는 경우 — 어디로 갈지 정할 수 없습니다.</li>
      <li>관리사에게 개인 연락처를 요구하시는 경우.</li>
      <li>치료가 필요해 보이는 경우 — 병원을 먼저 권합니다.</li>
    </ul>`,
    '돌려 드린다고 해서 돈을 받지 않습니다.', '03');

  const { html: faqHtml, qa } = faqBlock(seed, baseCtx(cfg, courses, '부르시는 곳'), 6, '05');

  const body = [lead, what, timing, stepList(seed, '04'), refuse, telCta(cfg, '처음 이용', seed), faqHtml, noticeBlock(seed, '06'), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/guide/',
    html: layout(ctx, {
      path: '/guide/',
      title: title.page('이용안내 접수부터 계산까지'),
      desc: clampDesc('출장마사지·홈타이를 처음 부르실 때 필요한 것만 모았습니다. 준비물, 접수 가능한 시각, 돌려 드리는 경우, 계산 방법을 차례로 적었습니다.'),
      h1: `이용안내 <span class="hd-s">통화 한 번으로 끝나는 차례</span>`,
      body,
      pageKind: 'guide',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '이용안내', url: `${siteUrl}/guide/` }],
      jsonld: [S.faqPage(`${siteUrl}/guide/`, qa)],
    }),
  };
}

/* ── 소개 ─────────────────────────────────────────────────────── */
export function companyPage(ctx) {
  const { cfg, siteUrl, counts, data, courses } = ctx;
  const seed = 'company';

  const lead = `<div class="say">
  <p>${esc(cfg.brand.ko)}(${esc(cfg.brand.en)})은 매장 없이 방문만 하는 곳입니다. 업소 목록을 싣는 디렉토리가 아니라 저희가 직접 받는 접수 창구 하나를 두고 있습니다.</p>
  <p>이름은 마루와 온기에서 땄습니다. 받는 자리가 늘 남의 집 방바닥이기 때문입니다.</p>
</div>`;

  const line = frame('line', '지키는 선', '무엇을 하고 무엇을 하지 않나요?',
    `<ul class="nt">
      <li>하는 일 — 근육을 풀어 드리는 데까지입니다.</li>
      <li>하지 않는 일 — 성적인 서비스를 제공하지 않습니다.</li>
      <li>하지 않는 일 — 질병을 다루는 의료 행위를 하지 않습니다.</li>
      <li>싣지 않는 것 — 후기·체험담·평점. 지어낸 글이 섞이기 쉽습니다.</li>
      <li>쓰지 않는 것 — 사람 사진. 실제와 다른 사진이 돌아다니는 일이 많습니다.</li>
      <li>받지 않는 것 — 예약금·보증금. 먼저 보내실 돈이 없습니다.</li>
    </ul>`, null, '01');

  const how = frame('data', '자료', '화면의 숫자는 어디서 왔나요?',
    `<div class="say">
      <p>지역 쪽의 넓이·가로세로 폭·맞닿은 행정동은 모두 공개된 행정동 경계 자료를 계산해 뽑았습니다. 넓이는 경계 도형의 면적을, 가로세로는 그 도형을 감싸는 네모의 변 길이를 씁니다.</p>
      <p>맞닿았는지는 두 동이 <strong>같은 좌표를 두 개 이상 나눠 가졌는지</strong>로 봅니다. 모서리에서 점 하나로 스친 것은 빼습니다. 중심점 사이 거리로 "가까운 동"을 뽑으면 강 건너가 섞이기 때문에 그 방식을 쓰지 않았습니다.</p>
      <p>자료가 갱신되면 다시 계산해서 화면의 숫자도 같이 바뀝니다. 사람이 손으로 적어 넣은 칸은 없습니다.</p>
    </div>
    ${factTable([
      ['경계 자료', esc(data.source)],
      ['판 번호', esc(data.version)],
      ['커버리지 기준', esc(data.coverageFrom)],
      ['쪽을 둔 단위', `시도 ${counts.sido} · 시군구 ${counts.gu} · 동읍 ${counts.spot}`],
      ['쪽이 없는 단위', `면 ${counts.myeon}곳 — 이름만 적음`],
      ['맞닿은 쌍', `${counts.adjPair}쌍 (동·읍 사이)`],
    ])}`, null, '02');

  const body = [lead, line, how, telCta(cfg, '문의', seed), siteLinks(ctx, seed)].join('\n');

  return {
    path: '/company/',
    html: layout(ctx, {
      path: '/company/',
      title: title.page(`${cfg.brand.ko} 소개와 자료 출처`),
      desc: clampDesc(`${cfg.brand.ko}이 하는 일과 하지 않는 일, 그리고 지역 쪽의 숫자를 어떤 자료로 어떻게 계산했는지 적어 두었습니다.`),
      h1: `${esc(cfg.brand.ko)} 소개 <span class="hd-s">지키는 선과 자료 출처</span>`,
      body,
      pageKind: 'company',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '소개', url: `${siteUrl}/company/` }],
    }),
  };
}

/* ── 이용약관 ─────────────────────────────────────────────────── */
const TERMS = [
  ['제1조 (목적)', '이 약관은 마루온(이하 "회사")이 제공하는 출장 방문 관리 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무를 정하는 데 목적이 있습니다.'],
  ['제2조 (접수 경로)', '접수는 사이트에 적힌 안심번호로 거는 통화로만 받습니다. 메신저·게시판·전자우편으로는 접수하지 않으며, 회사가 먼저 연락처를 수집해 두지 않습니다.'],
  ['제3조 (서비스의 범위)', '회사는 이용자가 지정한 장소로 관리사를 보내 근육 이완을 돕는 수기 관리를 제공합니다. 질병의 진단·치료 등 의료 행위는 하지 않으며, 성적 서비스는 제공하지 않습니다.'],
  ['제4조 (지역 정보의 성격)', '사이트에 적힌 넓이·가로세로 폭·맞닿은 행정동은 공개된 행정동 경계 자료를 계산한 값입니다. 도로 사정이나 실제 이동 시간을 보장하는 값이 아니며, 참고용으로 적어 둔 것입니다.'],
  ['제5조 (요금과 결제)', '요금은 금액표에 적힌 대로이며 지역에 따라 달라지지 않습니다. 관리를 마친 뒤 현장에서 현금 또는 카드로 받습니다. 예약금·보증금 등 사전 입금은 어떤 명목으로도 받지 않습니다.'],
  ['제6조 (변경과 취소)', '이용자는 방문 전 언제든 시각을 바꾸거나 취소할 수 있으며 위약금을 물지 않습니다. 다만 관리사가 이미 도착한 뒤의 취소는 그 사실을 즉시 알려야 합니다.'],
  ['제7조 (회사의 거절권)', '다음 각 호에 해당하면 회사는 접수를 거절하거나 진행 중인 관리를 중단할 수 있습니다. 1. 성적 서비스를 요구하는 경우 2. 관리사에게 폭언·폭행·개인 연락처 요구를 하는 경우 3. 이용자가 주소를 특정하지 않는 경우 4. 발열·개방창 등 관리가 적절하지 않은 상태인 경우.'],
  ['제8조 (이용자의 협조)', '이용자는 관리에 필요한 최소한의 공간과 수건을 준비하고, 건강 상태 중 관리에 영향을 줄 수 있는 사항을 접수 시 알려야 합니다.'],
  ['제9조 (후기와 평점)', '회사는 후기·체험담·평점을 수집하거나 게시하지 않습니다. 사이트의 어떤 문장도 특정 이용자의 경험을 옮긴 것이 아닙니다.'],
  ['제10조 (책임의 한계)', '회사는 관리 과정에서 회사의 고의 또는 과실로 발생한 손해에 대해 책임을 집니다. 다만 이용자가 알리지 않은 건강 상태로 생긴 결과, 천재지변이나 통신 장애로 인한 지연에는 책임을 지지 않습니다.'],
  ['제11조 (약관의 변경)', '이 약관이 바뀌면 사이트에 올리고, 올린 날부터 적용합니다. 바뀐 뒤에 접수하시면 바뀐 약관에 동의하신 것으로 봅니다.'],
];

export function termsPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="say"><p>아래는 ${esc(cfg.brand.ko)}의 이용약관입니다. 접수하시면 이 내용에 동의하신 것으로 봅니다.</p></div>`,
    frame('terms', '약관', '전문', `<div class="doc">${TERMS.map(([t, d]) => `<section><h3>${esc(t)}</h3><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    telCta(cfg, '약관 문의', 'terms'),
    siteLinks(ctx, 'terms'),
  ].join('\n');
  return {
    path: '/terms/',
    html: layout(ctx, {
      path: '/terms/',
      title: title.page('이용약관'),
      desc: clampDesc(`${cfg.brand.ko} 출장 방문 관리 이용약관입니다. 접수 경로, 서비스 범위, 요금과 결제, 변경·취소, 거절 사유를 ${TERMS.length}개 조문으로 적었습니다.`),
      h1: `이용약관 <span class="hd-s">${TERMS.length}개 조문</span>`,
      body,
      pageKind: 'terms',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '이용약관', url: `${siteUrl}/terms/` }],
    }),
  };
}

/* ── 개인정보처리방침 ─────────────────────────────────────────── */
const PRIVACY = [
  ['1. 모으는 것', '접수 통화에서 방문 주소와 연락 가능한 번호, 고르신 코스와 시각을 듣습니다. 이름·생년월일·주민등록번호는 묻지 않습니다.'],
  ['2. 쓰는 곳', '관리사를 보내고 도착을 알리는 데만 씁니다. 광고 문자나 전화를 보내지 않습니다.'],
  ['3. 번호의 성격', '사이트에 적힌 번호는 안심번호입니다. 이용자의 전화번호가 관리사에게 그대로 넘어가지 않습니다.'],
  ['4. 두는 기간', '방문이 끝나고 민원이 없으면 그날 안에 지웁니다. 분쟁이 생긴 건만 해결될 때까지 따로 둡니다.'],
  ['5. 넘기지 않음', '제3자에게 제공하거나 위탁하지 않습니다. 법령에 따른 수사기관의 적법한 요구가 있을 때만 예외입니다.'],
  ['6. 자동 수집', '이 사이트는 정적 파일로만 되어 있습니다. 로그인·장바구니·댓글이 없고, 광고 추적이나 분석 스크립트를 넣지 않았습니다. 쿠키를 심지 않습니다.'],
  ['7. 이용자의 권리', '모아 둔 내용을 알려 달라거나 지워 달라고 하실 수 있습니다. 같은 번호로 전화 주시면 그 통화에서 처리합니다.'],
  ['8. 책임자', '개인정보 보호 책임자는 사업자 정보가 확정되는 대로 이 자리에 적습니다. 그 전까지는 사이트에 적힌 안심번호가 창구입니다.'],
];

export function privacyPage(ctx) {
  const { cfg, siteUrl } = ctx;
  const body = [
    `<div class="say"><p>짧습니다. 모으는 것이 적기 때문입니다.</p></div>`,
    frame('pp', '방침', '전문', `<div class="doc">${PRIVACY.map(([t, d]) => `<section><h3>${esc(t)}</h3><p>${esc(d)}</p></section>`).join('')}</div>`, null, '01'),
    telCta(cfg, '개인정보 문의', 'privacy'),
    siteLinks(ctx, 'privacy'),
  ].join('\n');
  return {
    path: '/privacy/',
    html: layout(ctx, {
      path: '/privacy/',
      title: title.page('개인정보처리방침'),
      desc: clampDesc('접수 통화에서 듣는 것과 쓰는 곳, 두는 기간을 적었습니다. 쿠키와 추적 스크립트를 쓰지 않는 정적 사이트입니다.'),
      h1: `개인정보처리방침 <span class="hd-s">모으는 것이 적습니다</span>`,
      body,
      pageKind: 'privacy',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '개인정보처리방침', url: `${siteUrl}/privacy/` }],
    }),
  };
}

/* ── 노트 목록 ────────────────────────────────────────────────── */
export function magazineIndex(ctx) {
  const { cfg, siteUrl } = ctx;
  const list = POSTS.slice().sort((a, b) => b.date.localeCompare(a.date));
  const body = [
    `<div class="say"><p>받기 전에 알면 쓸모 있는 것만 적습니다. 후기나 체험담은 올리지 않습니다.</p></div>`,
    frame('list', '노트', `글 ${list.length}편`,
      `<ul class="po">${list.map((p) => `<li><a href="/magazine/${p.slug}/"><b>${esc(p.title)}</b><span>${esc(p.summary)}</span><time datetime="${p.date}">${p.date}</time></a></li>`).join('')}</ul>`,
      '새 글이 올라오면 RSS로도 나갑니다.', '01'),
    telCta(cfg, '접수', 'magazine'),
    siteLinks(ctx, 'magazine'),
  ].join('\n');
  return {
    path: '/magazine/',
    html: layout(ctx, {
      path: '/magazine/',
      title: title.page('방문 노트'),
      desc: clampDesc(`출장마사지·홈타이를 받기 전에 정해 두시면 좋은 것들을 ${list.length}편으로 적었습니다. 후기·체험담은 싣지 않습니다.`),
      h1: `방문 노트 <span class="hd-s">글 ${list.length}편</span>`,
      body,
      pageKind: 'magazine',
      crumbs: [{ name: '처음', url: `${siteUrl}/` }, { name: '노트', url: `${siteUrl}/magazine/` }],
      jsonld: [S.itemList(`${siteUrl}/magazine/#list`, '방문 노트', list.map((p) => ({ name: p.title, url: `${siteUrl}/magazine/${p.slug}/` })))],
    }),
  };
}

export function postPage(ctx, p) {
  const { cfg, siteUrl } = ctx;
  const path = `/magazine/${p.slug}/`;
  const url = `${siteUrl}${path}`;
  const html = p.body.map((b) => {
    if (typeof b === 'string') return `<p>${b.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')}</p>`;
    if (b[0] === 'h3') return `<h3>${esc(b[1])}</h3>`;
    if (b[0] === 'ul') return `<ul class="nt">${b[1].map((x) => `<li>${esc(x)}</li>`).join('')}</ul>`;
    return '';
  }).join('\n');

  const others = POSTS.filter((x) => x.slug !== p.slug).slice(0, 4);
  const body = [
    `<p class="pmeta"><time datetime="${p.date}">${p.date}</time> · ${esc(cfg.brand.ko)} 방문 노트</p>`,
    `<article class="doc art">${html}</article>`,
    telCta(cfg, '접수', p.slug),
    frame('more', '다른 글', '이어서 읽을 것',
      `<ul class="po">${others.map((x) => `<li><a href="/magazine/${x.slug}/"><b>${esc(x.title)}</b><span>${esc(x.summary)}</span><time datetime="${x.date}">${x.date}</time></a></li>`).join('')}</ul>`,
      null, '01'),
    siteLinks(ctx, p.slug),
  ].join('\n');

  return {
    path,
    html: layout(ctx, {
      path,
      title: title.post(p),
      desc: clampDesc(desc.post(p)),
      h1: esc(p.title),
      body,
      pageKind: 'post',
      crumbs: [
        { name: '처음', url: `${siteUrl}/` },
        { name: '노트', url: `${siteUrl}/magazine/` },
        { name: p.title, url },
      ],
      jsonld: [S.article({ url, siteUrl, title: p.title, desc: p.summary, date: p.date, cfg })],
    }),
  };
}

/* ── 404 ──────────────────────────────────────────────────────── */
export function notFound(ctx) {
  const { cfg, siteUrl, regions } = ctx;
  const body = [
    `<div class="say"><p>주소가 바뀌었거나 없는 쪽입니다. 아래에서 다시 찾아 주십시오.</p></div>`,
    frame('back', '돌아가기', '자주 찾는 쪽',
      `<ul class="lk">
        <li><a href="/">처음</a></li>
        <li><a href="/area/">받는 자리 전체</a></li>
        <li><a href="/course/">코스</a></li>
        <li><a href="/price/">금액</a></li>
        <li><a href="/guide/">이용안내</a></li>
        ${regions.map((r) => `<li><a href="/${r.slug}/">${esc(r.name)}</a></li>`).join('')}
      </ul>`, null, '01'),
    telCta(cfg, '바로 접수', '404'),
  ].join('\n');
  return {
    path: '/404.html',
    html: layout(ctx, {
      path: '/404.html',
      title: title.page('찾는 쪽이 없습니다'),
      desc: '주소가 바뀌었거나 없는 쪽입니다.',
      h1: '찾는 쪽이 없습니다',
      body,
      noindex: true,
      pageKind: '404',
    }),
  };
}
