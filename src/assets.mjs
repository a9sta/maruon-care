import fs from 'node:fs';
import path from 'node:path';

/**
 * 손으로 쓴 CSS·JS·SVG. 빌드 도구를 쓰지 않는다.
 * ★무늬는 **모눈 바탕 + 네 모서리 꺾쇠**다. 앞선 네 사이트(둥근 점머리 / 눈금 레일 /
 *   대괄호 머리표 / 굵은 괘선+큰 숫자)와 겹치지 않는 축을 하나 더 잡은 것이다.
 * ★스크립트에 무작위가 없다. 같은 주소면 늘 같은 화면이어야 한다.
 */
export const THEME = {
  paper: '#EEF1F5', card: '#FFFFFF', soft: '#E3E8EF',
  ink: '#16202B', dim: '#56606D',
  acc: '#1E5FA8', accDk: '#164777', accSoft: '#DCE8F6',
  line: '#C7D0DC', warn: '#9A3412',
};

const CSS = (t) => `:root{
  --paper:${t.paper};--card:${t.card};--soft:${t.soft};--ink:${t.ink};--dim:${t.dim};
  --acc:${t.acc};--accDk:${t.accDk};--accSoft:${t.accSoft};--line:${t.line};--warn:${t.warn};
  --grid:28px;--rad:2px;
  --sans:system-ui,-apple-system,"Apple SD Gothic Neo","Noto Sans KR","Malgun Gothic",sans-serif;
  --mono:ui-monospace,"SFMono-Regular",Menlo,Consolas,monospace;
}
*,*::before,*::after{box-sizing:border-box}
html{-webkit-text-size-adjust:100%}
body{margin:0;font-family:var(--sans);color:var(--ink);background:var(--paper);
  background-image:linear-gradient(var(--line) 1px,transparent 1px),linear-gradient(90deg,var(--line) 1px,transparent 1px);
  background-size:var(--grid) var(--grid);background-position:-1px -1px;
  line-height:1.75;font-size:16px;letter-spacing:-.01em;padding-bottom:84px}
@media (min-width:860px){body{padding-bottom:0}}
img,svg{max-width:100%}
a{color:var(--accDk);text-decoration:none}
a:hover{text-decoration:underline}
:focus-visible{outline:3px solid var(--acc);outline-offset:2px}
.jump{position:absolute;left:-9999px}
.jump:focus{position:fixed;left:12px;top:12px;z-index:60;background:var(--ink);color:#fff;padding:10px 14px}

/* ── 머리띠 ───────────────────────────────────────── */
.tp{background:var(--card);border-bottom:1px solid var(--line)}
.tp-a{max-width:1080px;margin:0 auto;padding:14px 18px;display:flex;align-items:center;justify-content:space-between;gap:14px;flex-wrap:wrap}
.mk{display:inline-flex;align-items:center;gap:10px;color:var(--ink)}
.mk:hover{text-decoration:none}
.pm{width:26px;height:26px;stroke:var(--acc);fill:none}
.mk-t b{display:block;font-size:19px;font-weight:800;letter-spacing:-.02em;line-height:1.1}
.mk-t i{display:block;font-style:normal;font-family:var(--mono);font-size:10px;letter-spacing:.22em;color:var(--dim);text-transform:uppercase}
.tp-r{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.tp-run{margin:0;font-size:11px;color:var(--dim);font-family:var(--mono)}
.tp-run span{display:block}
.nv{max-width:1080px;margin:0 auto;padding:0 18px;display:flex;overflow-x:auto}
.nv a{flex:1 0 auto;text-align:center;padding:11px 14px;font-size:14px;font-weight:700;color:var(--dim);
  border-top:1px solid var(--line);border-right:1px solid var(--line);white-space:nowrap}
.nv a:first-child{border-left:1px solid var(--line)}
.nv a:hover{background:var(--accSoft);color:var(--accDk);text-decoration:none}
.nv a[aria-current]{background:var(--ink);color:#fff;border-color:var(--ink)}

/* ── 빵부스러기 ───────────────────────────────────── */
.trail{max-width:1080px;margin:0 auto;padding:10px 18px 0}
.trail ol{list-style:none;display:flex;flex-wrap:wrap;gap:6px;margin:0;padding:0;font-size:12px;color:var(--dim);font-family:var(--mono)}
.trail li+li::before{content:"/";margin-right:6px;color:var(--line)}

/* ── 본문 ─────────────────────────────────────────── */
main{max-width:1080px;margin:0 auto;padding:18px 18px 56px}
.hd{font-size:25px;line-height:1.38;font-weight:800;letter-spacing:-.03em;margin:14px 0 20px;
  padding-left:14px;border-left:6px solid var(--acc)}
@media (min-width:720px){.hd{font-size:32px}}
.hd-s{display:block;font-size:14px;font-weight:600;color:var(--dim);letter-spacing:-.01em;margin-top:5px}
.say p{margin:0 0 14px;font-size:15.5px}
.say{margin-bottom:24px}
.pl{margin:0;font-size:15px;color:var(--dim)}

/* ── 섹션 틀: 네 모서리 꺾쇠 ───────────────────────── */
.fr{position:relative;background:var(--card);border:1px solid var(--line);border-radius:var(--rad);
  padding:22px 20px;margin:0 0 22px}
.fr::before,.fr::after{content:"";position:absolute;width:13px;height:13px;pointer-events:none}
.fr::before{top:-1px;left:-1px;border-top:3px solid var(--ink);border-left:3px solid var(--ink)}
.fr::after{bottom:-1px;right:-1px;border-bottom:3px solid var(--ink);border-right:3px solid var(--ink)}
.fr-h{display:flex;gap:14px;align-items:flex-start;margin-bottom:16px}
.fr-tag{margin:0;display:flex;flex-direction:column;align-items:center;gap:6px;flex:0 0 auto;
  padding:6px 7px;background:var(--accSoft);border:1px solid var(--line);min-width:34px}
.fr-no{font-family:var(--mono);font-size:11px;font-weight:700;color:var(--accDk);letter-spacing:.04em}
.fr-lb{font-size:11px;font-weight:700;color:var(--dim);writing-mode:vertical-rl;letter-spacing:.14em;max-height:84px;overflow:hidden}
.fr-tx{min-width:0}
.fr h2{margin:0;font-size:18.5px;font-weight:800;letter-spacing:-.025em;line-height:1.4}
.fr-sb{margin:6px 0 0;font-size:13.5px;color:var(--dim)}
.fr-tail{margin:14px 0 0;font-size:13px;color:var(--dim);border-top:1px dashed var(--line);padding-top:11px}

/* ── 예약 문의 버튼 ───────────────────────────────── */
.cb{display:inline-flex;align-items:center;gap:9px;background:var(--acc);color:#fff;
  border:1px solid var(--accDk);border-radius:var(--rad);padding:9px 14px;font-weight:700;line-height:1.2}
.cb:hover{background:var(--accDk);text-decoration:none}
.cb-ic{display:inline-flex;width:22px;height:22px;align-items:center;justify-content:center;
  background:rgba(255,255,255,.18);border-radius:1px;flex:0 0 auto}
.cb-ic svg{fill:#fff;width:13px;height:13px}
.cb-tx{display:flex;flex-direction:column;line-height:1.15}
.cb-lb{font-size:10.5px;letter-spacing:.1em;opacity:.9;font-weight:700}
.cb-nm{font-size:15px;font-weight:800;letter-spacing:.01em;font-family:var(--mono)}
.cb-s{padding:7px 11px}.cb-s .cb-nm{font-size:13.5px}
.cb-l{padding:13px 20px}.cb-l .cb-nm{font-size:19px}
.cb-f{display:flex;width:100%;justify-content:center}

/* ── 예약 띠 ──────────────────────────────────────── */
.ask{background:var(--ink);color:#fff;border-radius:var(--rad);padding:22px 20px;margin:0 0 22px;text-align:center}
.ask-p{margin:0 0 14px;font-size:16px;font-weight:700;letter-spacing:-.02em}
.ask-s{margin:12px 0 0;font-size:12.5px;color:#B9C4D2;font-family:var(--mono)}
.ask .cb{border-color:#fff}

/* ── 코스 ─────────────────────────────────────────── */
.cs-ul{list-style:none;margin:0;padding:0;display:grid;gap:10px}
@media (min-width:640px){.cs-ul{grid-template-columns:1fr 1fr}}
.cs{border:1px solid var(--line);padding:12px 13px;background:var(--paper)}
.cs-a{display:grid;gap:3px;color:var(--ink)}
.cs-a:hover{text-decoration:none}
.cs-a:hover .cs-k{color:var(--accDk);text-decoration:underline}
.cs-k{font-weight:800;font-size:16px}
.cs-v{font-family:var(--mono);font-size:13px;color:var(--dim)}
.cs-v em{font-style:normal;color:var(--ink);font-weight:700;margin-left:8px}
.cs-v i{font-style:normal;font-size:11px;margin-left:1px}
.cs-p{font-size:12px;color:var(--dim)}
.cs-d{margin:9px 0 0;font-size:13px;color:var(--dim);border-top:1px dashed var(--line);padding-top:8px}

/* ── 차례 ─────────────────────────────────────────── */
.sp-ol{list-style:none;margin:0;padding:0;display:grid;gap:2px}
.sp{display:flex;gap:13px;padding:12px 0;border-bottom:1px solid var(--line)}
.sp:last-child{border-bottom:0}
.sp-n{font-family:var(--mono);font-size:12px;font-weight:700;color:#fff;background:var(--ink);
  width:26px;height:26px;display:flex;align-items:center;justify-content:center;flex:0 0 auto}
.sp-t{margin:0;font-size:15px;font-weight:800}
.sp-d{margin:3px 0 0;font-size:13.5px;color:var(--dim)}

/* ── 표 ───────────────────────────────────────────── */
.fct,.cmp{width:100%;border-collapse:collapse;font-size:14px}
.fct th,.fct td{border:1px solid var(--line);padding:9px 11px;text-align:left;vertical-align:top}
.fct th{background:var(--paper);width:34%;font-weight:700;color:var(--dim);font-size:13px}
.cmp th,.cmp td{border:1px solid var(--line);padding:8px 10px;text-align:left}
.cmp thead th{background:var(--ink);color:#fff;font-size:12.5px;font-weight:700}
.cmp tbody th{background:var(--paper);font-weight:700}
.cmp tr.on td,.cmp tr.on th{background:var(--accSoft)}
@media (max-width:560px){.cmp{font-size:12.5px}.cmp th,.cmp td{padding:6px 7px}}

/* ── 물음 ─────────────────────────────────────────── */
.qa{margin:0}
.qa-i{border-top:1px solid var(--line);padding:13px 0;display:grid;grid-template-columns:auto 1fr;column-gap:9px}
.qa-i:first-child{border-top:0;padding-top:0}
.qa-n{grid-column:1;grid-row:1;font-family:var(--mono);font-size:11px;color:var(--acc);padding-top:4px}
.qa-q{grid-column:2;grid-row:1;margin:0;font-weight:800;font-size:15px}
.qa-a{grid-column:2;grid-row:2;margin:6px 0 0;font-size:14px;color:var(--dim)}

/* ── 목록들 ───────────────────────────────────────── */
.nt{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.nt li{position:relative;padding-left:17px;font-size:14px;color:var(--dim)}
.nt li::before{content:"";position:absolute;left:0;top:10px;width:7px;height:7px;border:2px solid var(--acc)}
.lk{list-style:none;margin:0;padding:0;display:grid;gap:7px;grid-template-columns:1fr}
@media (min-width:560px){.lk{grid-template-columns:1fr 1fr}}
@media (min-width:860px){.lk{grid-template-columns:1fr 1fr 1fr}}
.lk a{display:block;padding:8px 11px;border:1px solid var(--line);background:var(--paper);font-size:13.5px}
.lk a:hover{background:var(--accSoft);text-decoration:none}
.ix{list-style:none;margin:0;padding:0;display:grid;gap:6px;grid-template-columns:1fr 1fr}
@media (min-width:640px){.ix{grid-template-columns:repeat(3,1fr)}}
@media (min-width:900px){.ix{grid-template-columns:repeat(4,1fr)}}
.ix a{display:grid;gap:1px;padding:8px 10px;border:1px solid var(--line);background:var(--paper)}
.ix a:hover{background:var(--accSoft);text-decoration:none}
.ix-n{font-weight:700;font-size:14px;color:var(--ink)}
.ix-m{font-size:11px;color:var(--dim);font-family:var(--mono)}
.ix li.on a{background:var(--ink);border-color:var(--ink)}
.ix li.on .ix-n{color:#fff}.ix li.on .ix-m{color:#AFC0D4}
.aj{list-style:none;margin:0;padding:0;display:grid;gap:6px;grid-template-columns:1fr 1fr}
@media (min-width:640px){.aj{grid-template-columns:repeat(3,1fr)}}
.aj a{display:flex;justify-content:space-between;align-items:baseline;gap:8px;padding:9px 11px;
  border:1px solid var(--line);border-left:4px solid var(--acc);background:var(--paper)}
.aj a:hover{background:var(--accSoft);text-decoration:none}
.aj-n{font-weight:700;font-size:14px;color:var(--ink)}
.aj-g{font-size:11px;color:var(--dim);font-family:var(--mono)}
.nm{list-style:none;margin:0;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.nm li{font-size:13px;color:var(--dim);background:var(--paper);border:1px solid var(--line);padding:4px 9px}
.tc{list-style:none;margin:0;padding:0;display:grid;gap:6px;grid-template-columns:1fr 1fr}
@media (min-width:640px){.tc{grid-template-columns:repeat(3,1fr)}}
.tc a{display:flex;justify-content:space-between;gap:8px;padding:9px 11px;border:1px dashed var(--line);background:var(--paper);font-size:13.5px;font-weight:700}
.tc a span{font-weight:400;font-size:11px;color:var(--dim);font-family:var(--mono)}
.tc a:hover{background:var(--accSoft);text-decoration:none}
.po{list-style:none;margin:0;padding:0;display:grid;gap:9px}
.po a{display:grid;gap:3px;padding:12px 13px;border:1px solid var(--line);background:var(--paper)}
.po a:hover{background:var(--accSoft);text-decoration:none}
.po b{font-size:15px}
.po span{font-size:13px;color:var(--dim)}
.po time{font-family:var(--mono);font-size:11px;color:var(--dim)}
.pk{list-style:none;margin:0;padding:0;display:grid;gap:8px}
@media (min-width:720px){.pk{grid-template-columns:1fr 1fr}}
.pk a{display:grid;gap:2px;padding:11px 13px;border:1px solid var(--line);border-top:3px solid var(--acc);background:var(--paper)}
.pk a:hover{background:var(--accSoft);text-decoration:none}
.pk b{font-size:15px}.pk span{font-size:13px;color:var(--dim)}

/* ── 대문 ─────────────────────────────────────────── */
.hero{background:var(--card);border:1px solid var(--line);border-top:5px solid var(--ink);padding:26px 20px;margin:0 0 22px}
.hero-sl{margin:0 0 10px;font-size:21px;font-weight:800;letter-spacing:-.03em;line-height:1.4}
@media (min-width:720px){.hero-sl{font-size:27px}}
.hero-p{margin:0 0 18px;font-size:15px;color:var(--dim);max-width:62ch}
.hero-f{list-style:none;margin:20px 0 0;padding:0;display:grid;gap:1px;background:var(--line);border:1px solid var(--line)}
@media (min-width:600px){.hero-f{grid-template-columns:repeat(4,1fr)}}
.hero-f li{background:var(--card);padding:11px 13px}
.hero-f b{display:block;font-size:14.5px;font-weight:800}
.hero-f span{font-size:11.5px;color:var(--dim)}
.lv{display:grid;gap:14px}
@media (min-width:760px){.lv{grid-template-columns:1.1fr 1fr}}
.lv-h{margin:0 0 9px;font-size:12px;font-weight:800;letter-spacing:.1em;color:var(--accDk)}
.lv-s .lv-h{color:var(--dim)}
.lv-ul{list-style:none;margin:0;padding:0;display:grid;gap:6px;grid-template-columns:1fr 1fr}
.lv-ul a{display:grid;gap:1px;padding:10px 11px;border:1px solid var(--line);background:var(--paper)}
.lv-ul a:hover{background:var(--accSoft);text-decoration:none}
.lv-ul b{font-size:15px}
.lv-ul span{font-size:11px;color:var(--dim);font-family:var(--mono)}
.lv-s .lv-ul{grid-template-columns:repeat(3,1fr)}

/* ── 문서·글 ──────────────────────────────────────── */
.doc section{padding:12px 0;border-top:1px solid var(--line)}
.doc section:first-child{border-top:0;padding-top:0}
.doc h3{margin:0 0 5px;font-size:15px;font-weight:800}
.doc p{margin:0;font-size:14px;color:var(--dim)}
.art{background:var(--card);border:1px solid var(--line);padding:22px 20px;margin:0 0 22px}
.art p{margin:0 0 14px;font-size:15.5px;color:var(--ink)}
.art h3{margin:22px 0 9px;font-size:17px;font-weight:800;padding-left:11px;border-left:4px solid var(--acc)}
.art .nt{margin:0 0 14px}
.pmeta{margin:0 0 12px;font-family:var(--mono);font-size:12px;color:var(--dim)}

/* ── 푸터 — 가로 띠 세 단 ─────────────────────────── */
.ft{background:var(--ink);color:#C8D2DE;margin-top:36px}
.ft a{color:#DCE6F2}
.ft-1,.ft-2,.ft-3{max-width:1080px;margin:0 auto;padding:22px 18px}
.ft-1{display:flex;gap:20px;flex-wrap:wrap;align-items:flex-start;justify-content:space-between;border-bottom:1px solid #2C3A4A}
.ft-nm{margin:0 0 7px;font-size:19px;font-weight:800;color:#fff}
.ft-say{margin:0;font-size:13px;max-width:52ch}
.ft-call{display:grid;gap:7px}
.ft-run{margin:0;font-size:11.5px;font-family:var(--mono);color:#93A2B5}
.ft-2{display:grid;gap:20px;border-bottom:1px solid #2C3A4A}
@media (min-width:760px){.ft-2{grid-template-columns:1.4fr 1fr 1.2fr}}
.ft-h{margin:0 0 8px;font-size:11px;font-weight:800;letter-spacing:.14em;color:#8FA3BA}
.ft-chip{list-style:none;margin:0 0 14px;padding:0;display:flex;flex-wrap:wrap;gap:6px}
.ft-chip a{display:inline-block;padding:4px 10px;border:1px solid #38485A;font-size:13px;font-weight:700}
.ft-chip a:hover{background:#243243;text-decoration:none}
.ft-chip2 a{font-weight:400;border-style:dashed}
.ft-ul{list-style:none;margin:0;padding:0;display:grid;gap:5px;font-size:13px}
.ft-post li{display:grid}
.ft-post time{font-family:var(--mono);font-size:10.5px;color:#7F90A5}
.ft-feed{list-style:none;margin:10px 0 0;padding:0;display:flex;gap:10px;font-size:11.5px;font-family:var(--mono)}
.ft-sm{margin:10px 0 0;font-size:11.5px;color:#8FA3BA}
.ft-3{font-size:11.5px;color:#8FA3BA}
.ft-biz{margin:0 0 9px}
.ft-dim{color:#6E8098}
.ft-ai{margin:0 0 9px;line-height:1.7}
.ft-ai strong{color:#D9E4F1}
.ft-cr{margin:0}

/* ── 모바일 하단 바 ───────────────────────────────── */
.dk{position:fixed;left:0;right:0;bottom:0;z-index:40;background:var(--card);
  border-top:2px solid var(--ink);padding:9px 12px calc(9px + env(safe-area-inset-bottom));display:grid;gap:4px;justify-items:center}
.dk-s{font-size:11px;color:var(--dim);font-family:var(--mono)}
.dk.off{transform:translateY(130%)}
.dk{transition:transform .22s ease}
@media (min-width:860px){.dk{display:none}}
@media print{.dk,.nv,.ask{display:none}}
`;

const JS = `(function(){
  /* 푸터가 보이면 하단 바를 내린다. 그것 말고는 아무 일도 하지 않는다 —
     화면을 흔드는 무작위를 넣지 않아야 같은 주소에서 같은 화면이 나온다. */
  var bar=document.querySelector('.dk'),ft=document.querySelector('.ft');
  if(!bar||!ft||!('IntersectionObserver' in window))return;
  new IntersectionObserver(function(es){
    es.forEach(function(e){bar.classList.toggle('off',e.isIntersecting);});
  },{rootMargin:'0px 0px -40px 0px'}).observe(ft);
})();`;

const FAVICON = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><rect width="32" height="32" fill="${t.ink}"/><g stroke="${t.card}" stroke-width="2.4" fill="none"><path d="M5 19h22M5 23.5h22M5 28h22"/><circle cx="16" cy="10" r="4.4"/></g></svg>`;

const LOGO = (t) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 48"><rect width="200" height="48" fill="${t.card}"/><g stroke="${t.acc}" stroke-width="2.4" fill="none"><path d="M8 30h26M8 35h26M8 40h26"/><circle cx="21" cy="16" r="6"/></g><text x="46" y="27" font-family="system-ui,sans-serif" font-size="19" font-weight="800" fill="${t.ink}">마루온</text><text x="46" y="39" font-family="ui-monospace,monospace" font-size="9" letter-spacing="3" fill="${t.dim}">MARUON</text></svg>`;

const OG = (t, cfg) => `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="${t.paper}"/>
<g stroke="${t.line}" stroke-width="1">${Array.from({ length: 21 }, (_, i) => `<path d="M0 ${i * 32} H1200"/>`).join('')}${Array.from({ length: 38 }, (_, i) => `<path d="M${i * 32} 0 V630"/>`).join('')}</g>
<rect x="64" y="64" width="1072" height="502" fill="${t.card}" stroke="${t.line}"/>
<path d="M64 64h40M64 64v40M1136 566h-40M1136 566v-40" stroke="${t.ink}" stroke-width="8" fill="none"/>
<g stroke="${t.acc}" stroke-width="6" fill="none"><path d="M120 190h78M120 206h78M120 222h78"/><circle cx="159" cy="156" r="18"/></g>
<text x="120" y="300" font-family="system-ui,sans-serif" font-size="66" font-weight="800" fill="${t.ink}">${cfg.brand.ko} 출장마사지·홈타이</text>
<text x="120" y="366" font-family="system-ui,sans-serif" font-size="34" fill="${t.dim}">${cfg.brand.slogan}</text>
<text x="120" y="446" font-family="ui-monospace,monospace" font-size="27" fill="${t.accDk}">서울 · 인천 · 경기 · 부산 동읍까지 · ${cfg.hours} · ${cfg.pay}</text>
<text x="120" y="498" font-family="ui-monospace,monospace" font-size="31" font-weight="700" fill="${t.ink}">${cfg.telLabel} ${cfg.tel}</text>
</svg>`;

export function writeAssets(dist, cfg) {
  const dir = path.join(dist, 'assets');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, 'maru.css'), CSS(THEME));
  fs.writeFileSync(path.join(dir, 'maru.js'), JS);
  fs.writeFileSync(path.join(dir, 'favicon.svg'), FAVICON(THEME));
  fs.writeFileSync(path.join(dir, 'logo.svg'), LOGO(THEME));
  fs.writeFileSync(path.join(dir, 'og.svg'), OG(THEME, cfg));
}
