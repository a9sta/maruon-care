import { esc } from './util.mjs';
import * as S from './schema.mjs';

export const ASSET_V = '1';

/**
 * 공통 레이아웃.
 *   head  — SEO·GEO 메타 + JSON-LD
 *   푸터  — 네이버 C랭크 4신호(출처·최신성·수집 경로·정보량) + AI 활용 고지
 *
 * ★전화번호는 **telBtn() 으로만** 찍는다. 번호만 덩그러니 적힌 자리가 생기면 안 된다
 *   (지시: 안심번호 옆에 '예약 문의'를 늘 적고 버튼으로 만든다). 검사도구가 그걸 본다.
 *
 * ★골격을 앞서 만든 네 사이트와 겹치지 않게 짰다.
 *   루네사      : 둥근 점머리 · 알약 버튼 · 4열 푸터
 *   리바이브모션: 왼쪽 눈금 레일 + 모노 순번 · 각진 판 · 4열 푸터
 *   세린터치    : 대괄호 머리표 · 점선 가름 · 둥근 블록 · 머리띠 두 줄 · 3열 푸터
 *   벨벳럽      : 굵은 괘선(3px) + 큰 순번 숫자 · 2열 푸터
 *   마루온      : **모눈 바탕 + 네 모서리 꺾쇠 테두리** · 머리표를 제목 **왼쪽에 세로로**
 *                 세운 얇은 라벨 · 순번은 라벨 안 작은 글자 · **푸터를 가로 띠 세 단**으로 눕힘
 */
export function layout(ctx, opts) {
  const { cfg, siteUrl, latestPosts } = ctx;
  const {
    path, title, desc, h1, body, jsonld = [], geo, crumbs = [],
    noindex = false, bodyClass = '', pageKind = '',
  } = opts;
  const url = `${siteUrl}${path}`;
  const graph = S.graph([
    S.organization(cfg, siteUrl),
    S.website(cfg, siteUrl),
    crumbs.length ? S.breadcrumb(url, crumbs) : null,
    S.webpage({ url, siteUrl, title, desc, breadcrumbId: crumbs.length ? `${url}#crumb` : null }),
    ...jsonld,
  ]);

  return `<!doctype html>
<html lang="ko">
<head>
<meta charset="utf-8">
${cfg.naverVerification ? `<meta name="naver-site-verification" content="${esc(cfg.naverVerification)}"/>` : ''}
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(title)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${url}">
<meta name="robots" content="${noindex ? 'noindex,follow' : 'index,follow,max-image-preview:large,max-snippet:-1'}">
<meta name="format-detection" content="telephone=yes">
<meta name="author" content="${esc(cfg.brand.ko)}">
${geo ? `<meta name="geo.region" content="${esc(geo.iso)}">
<meta name="geo.placename" content="${esc(geo.placename)}">
<meta name="geo.position" content="${geo.lat};${geo.lng}">
<meta name="ICBM" content="${geo.lat}, ${geo.lng}">` : '<meta name="geo.region" content="KR">'}
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(cfg.brand.ko)} 출장마사지">
<meta property="og:locale" content="ko_KR">
<meta property="og:title" content="${esc(title)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${url}">
<meta property="og:image" content="${siteUrl}/assets/og.svg">
<meta name="twitter:card" content="summary">
<meta name="twitter:title" content="${esc(title)}">
<meta name="twitter:description" content="${esc(desc)}">
<link rel="sitemap" type="application/xml" href="/sitemap.xml">
<link rel="alternate" type="application/rss+xml" title="${esc(cfg.rssTitle)}" href="${siteUrl}/rss.xml">
<link rel="icon" href="/assets/favicon.svg" type="image/svg+xml">
<link rel="apple-touch-icon" href="/assets/favicon.svg">
<link rel="manifest" href="/site.webmanifest">
<link rel="stylesheet" href="/assets/maru.css?v=${ASSET_V}">
<script type="application/ld+json">${graph}</script>
</head>
<body class="${bodyClass}" data-kind="${pageKind}">
<a class="jump" href="#main">본문으로 건너뛰기</a>
${header(ctx, path)}
${crumbs.length > 1 ? crumbHtml(crumbs) : ''}
<main id="main">
<h1 class="hd">${h1}</h1>
${body}
</main>
${footer(ctx, latestPosts)}
${dock(cfg)}
<script src="/assets/maru.js?v=${ASSET_V}" defer></script>
</body>
</html>`;
}

/* ── 예약 문의 버튼 ────────────────────────────────────────────────
   안심번호 옆에 '예약 문의'가 **늘 붙어 있어야 한다**. 겉모습은 버튼이지만
   `<a href="tel:">` 로 둔다 — <button> 이면 스크립트 없이는 아무 일도 안 일어나고,
   누르는 즉시 통화로 넘어가야 하기 때문이다.
   size: s(머리띠) · m(본문) · l(대문·하단 바) */
export function telBtn(cfg, { size = 'm', note = true, block = false } = {}) {
  return `<a class="cb cb-${size}${block ? ' cb-f' : ''}" href="tel:${cfg.telRaw}">
  <span class="cb-ic" aria-hidden="true">${phoneMark()}</span>
  <span class="cb-tx"><span class="cb-lb">${esc(cfg.telLabel)}</span><span class="cb-nm">${esc(cfg.tel)}</span></span>
  ${note ? `<span class="cb-nt">${esc(cfg.telNote)}</span>` : ''}
</a>`;
}

/** 머리띠 — 왼쪽에 상호, 오른쪽에 버튼. 메뉴는 그 아래 모눈 칸에 눕힌다. */
function header(ctx, path) {
  const { cfg } = ctx;
  const on = (p) => (path === p || (p !== '/' && path.startsWith(p)) ? ' aria-current="page"' : '');
  return `<header class="tp">
  <div class="tp-a">
    <a class="mk" href="/" aria-label="${esc(cfg.brand.ko)} 처음으로">
      ${plankMark()}<span class="mk-t"><b>${esc(cfg.brand.ko)}</b><i>${esc(cfg.brand.en)}</i></span>
    </a>
    <div class="tp-r">
      ${telBtn(cfg, { size: 's', note: true })}
      <p class="tp-run">${esc(cfg.hours)}<span>${esc(cfg.pay)}</span></p>
    </div>
  </div>
  <nav class="nv" aria-label="주요 메뉴">
    <a href="/area/"${on('/area/')}>받는 자리</a>
    <a href="/course/"${on('/course/')}>코스</a>
    <a href="/price/"${on('/price/')}>금액</a>
    <a href="/guide/"${on('/guide/')}>이용안내</a>
    <a href="/magazine/"${on('/magazine/')}>노트</a>
  </nav>
</header>`;
}

function crumbHtml(crumbs) {
  return `<nav class="trail" aria-label="현재 위치"><ol>${crumbs
    .map((c, i) => (i === crumbs.length - 1
      ? `<li><span aria-current="page">${esc(c.name)}</span></li>`
      : `<li><a href="${c.url.replace(/^https?:\/\/[^/]+/, '')}">${esc(c.name)}</a></li>`))
    .join('')}</ol></nav>`;
}

/** 푸터 = 네이버 C랭크 4신호 + AI 고지. 세로 칼럼 대신 **가로 띠 세 단**. */
function footer(ctx, latestPosts = []) {
  const { cfg, regions, counts, data, updated } = ctx;
  const b = cfg.business;
  const biz = [
    b.name ? `상호 ${esc(b.name)}` : '',
    b.owner ? `대표 ${esc(b.owner)}` : '',
    b.regNo ? `사업자등록번호 ${esc(b.regNo)}` : '',
    b.address ? `주소 ${esc(b.address)}` : '',
    b.privacyOfficer ? `개인정보 책임자 ${esc(b.privacyOfficer)}` : '',
    b.email ? `문의 ${esc(b.email)}` : '',
  ].filter(Boolean).join(' · ');
  const main = regions.filter((r) => r.main);
  const sub = regions.filter((r) => !r.main);

  return `<footer class="ft">
  <div class="ft-1">
    <div class="ft-id">
      <p class="ft-nm">${esc(cfg.brand.ko)}</p>
      <p class="ft-say">가게 자리를 두지 않습니다. 관리사가 부르신 주소로 갑니다. 쪽을 둔 단위는 시군구 ${counts.gu}곳과 동·읍 ${counts.spot}곳이고, 받는 번호는 아래 하나뿐입니다.</p>
    </div>
    <div class="ft-call">
      ${telBtn(cfg, { size: 'm' })}
      <p class="ft-run">${esc(cfg.hours)} · ${esc(cfg.pay)} · 미리 보내실 돈 없음</p>
    </div>
  </div>
  <div class="ft-2">
    <nav class="ft-col" aria-label="동·읍까지 쪽이 있는 지역">
      <p class="ft-h">동·읍까지</p>
      <ul class="ft-chip">${main.map((r) => `<li><a href="/${r.slug}/">${r.name}</a></li>`).join('')}</ul>
      <p class="ft-h">시군구까지</p>
      <ul class="ft-chip ft-chip2">${sub.map((r) => `<li><a href="/${r.slug}/">${r.name}</a></li>`).join('')}</ul>
      <p class="ft-sm"><a href="/area/">받는 자리 전체 보기</a> — 시군구 ${counts.gu} · 동읍 ${counts.spot} · 면 ${counts.myeon}</p>
    </nav>
    <nav class="ft-col" aria-label="안내 문서">
      <p class="ft-h">문서</p>
      <ul class="ft-ul">
        <li><a href="/guide/">이용안내</a></li>
        <li><a href="/price/">금액</a></li>
        <li><a href="/course/">코스</a></li>
        <li><a href="/company/">소개</a></li>
        <li><a href="/terms/">이용약관</a></li>
        <li><a href="/privacy/">개인정보처리방침</a></li>
      </ul>
    </nav>
    <nav class="ft-col" aria-label="최근 글과 수집 경로">
      <p class="ft-h">최근 노트</p>
      <ul class="ft-ul ft-post">${latestPosts.slice(0, 3).map((p) => `<li><a href="${p.path}">${esc(p.title)}</a><time datetime="${p.date}">${p.date}</time></li>`).join('')}</ul>
      <ul class="ft-feed">
        <li><a href="/rss.xml">RSS</a></li>
        <li><a href="/sitemap.xml">사이트맵</a></li>
        <li><a href="/llms.txt">llms.txt</a></li>
      </ul>
      <p class="ft-sm">마지막 갱신 <time datetime="@@LM@@">@@LM@@</time></p>
    </nav>
  </div>
  <div class="ft-3">
    ${biz ? `<p class="ft-biz">${biz}</p>` : '<p class="ft-biz ft-dim">사업자 정보는 확인되는 대로 이 줄에 적습니다.</p>'}
    <p class="ft-ai">지역 설명에 들어간 넓이·가로세로 폭·맞닿은 행정동은 공개 경계 자료를 계산해 뽑았고, 문장은 <strong>AI 도구의 도움을 받아 쓴 뒤</strong> 사람이 다시 읽어 고쳤습니다. 후기·체험담·평점은 싣지 않으며 사람 사진도 쓰지 않습니다. 경계 자료: ${esc(data.source)}</p>
    <p class="ft-cr">© ${esc(updated.slice(0, 4))} ${esc(cfg.brand.ko)}. 질병을 다루는 의료 행위가 아니고, 성적 서비스를 제공하지 않습니다.</p>
  </div>
</footer>`;
}

/** 모바일 하단 고정 바 — 여기서도 번호 옆에 '예약 문의'가 붙는다. */
function dock(cfg) {
  return `<div class="dk">
  ${telBtn(cfg, { size: 'l', note: true, block: true })}
  <span class="dk-s">문 앞까지 ${esc(cfg.arrive)}</span>
</div>`;
}

/** 로고 — 마루널 세 줄 위에 작은 점 하나. 달·호·문·결과 겹치지 않는 모양. */
export function plankMark() {
  return `<svg class="pm" viewBox="0 0 26 26" aria-hidden="true" focusable="false"><path d="M3 15h20M3 19h20M3 23h20" stroke-width="2" stroke-linecap="butt"/><circle cx="13" cy="7.5" r="3.6" fill="none" stroke-width="2"/></svg>`;
}
function phoneMark() {
  return `<svg viewBox="0 0 16 16" width="16" height="16" aria-hidden="true" focusable="false"><path d="M4.2 1.6 6 1.2l1.5 3.3-1.6 1.2c.6 1.7 2 3.1 3.7 3.7l1.2-1.6 3.3 1.5-.4 1.8c-.2.8-.9 1.3-1.7 1.2C7.6 11.8 4.1 8.3 3 3.3c-.1-.8.4-1.5 1.2-1.7Z"/></svg>`;
}

/**
 * 섹션 틀 — 네 모서리에 꺾쇠가 찍힌 모눈 칸. 머리표는 제목 왼쪽에 세로로 선다.
 *   ┌ ─        ─ ┐
 *   │ 03 │ 큰 제목
 *   │ 맞 │ 작은 부제
 *   └ ─        ─ ┘
 */
export function frame(id, label, h2, inner, sub, n) {
  return `<section class="fr" id="${id}" aria-labelledby="${id}-h">
  <div class="fr-h">
    <p class="fr-tag" aria-hidden="true"><span class="fr-no">${n || '··'}</span><span class="fr-lb">${esc(label)}</span></p>
    <div class="fr-tx">
      <h2 id="${id}-h">${h2}</h2>
      ${sub ? `<p class="fr-sb">${sub}</p>` : ''}
    </div>
  </div>
  <div class="fr-b">${inner}</div>
</section>`;
}
