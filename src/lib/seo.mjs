/**
 * 타이틀·디스크립션 정본.
 *
 * ★토막 모양을 앞선 네 사이트와 전부 다르게 둔다. 같은 뼈대에 단어만 갈면 그것도 중복이다.
 *     루네사       `{동} 출장 {코스어} 마사지·홈타이 - 루네사 | {시도} {행동어}`
 *     리바이브모션 `{구} 출장마사지 {코스어} 홈타이 | {시도} {구} 방문 {행동어} - 리바이브모션`
 *     세린터치     `{동} 출장마사지 홈타이 {코스어} · {구} {동} 방문 {행동어} | 세린터치`
 *     벨벳럽       `{동} {코스어} 출장마사지 홈타이 — {구} {동} 방문 {행동어} · 벨벳럽`
 *     마루온       `{동} 출장마사지·홈타이 {코스어} | {구} {동} {행동어} — 마루온`
 *   앞 토막 안에 가운뎃점을 넣고, 가운데를 파이프로, 브랜드 앞을 줄표로 끊는다.
 *   네 사이트 어느 쪽과도 구두점 차례가 겹치지 않는다.
 * ★'마사지'는 제목에 한 번만 넣는다(스터핑 방지).
 * ★'여성전용마사지'는 쓰지 않는다 — 업소를 싣지 않아 뒷받침할 자료가 없다.
 *
 * 디스크립션은 **가운데 문장을 그 자리의 실측값으로 채운다.**
 * 이 사이트가 쓰는 값은 맞닿은 행정동 수·구 밖과 붙은 수·가로세로 폭이다.
 */
import { hash, km, km2, josa } from './util.mjs';

const at = (h, arr, slot = 0) => arr[parseInt(h.substr((slot * 3) % 29, 3), 16) % arr.length];

export const BRAND = '마루온';
const KEY = '출장마사지·홈타이 방문 관리';

/** 제목에 끼우는 코스어 — 실제로 받는 여덟 가지에서만 돌린다. */
const COURSE_WORD = ['스웨디시', '아로마', '타이', '딥티슈', '경락', '스포츠', '건식', '하체집중'];
/** 제목 꼬리 행동어 */
const ACT = ['맞닿은 동 보기', '문 앞까지 몇 분', '밤에도 접수', '바로 통화', '오늘 방문'];

/* ── 제목 ─────────────────────────────────────────────────────────── */
export const title = {
  home: () => `${BRAND} 출장마사지·홈타이 | 서울 인천 경기 부산 동읍 방문 관리 24시 — 바로 통화`,
  areaHub: (c) => `출장마사지 받는 자리 동읍 ${c.spot}곳 | 시군구 ${c.gu}곳 홈타이 방문 — ${BRAND}`,
  sido: (sd) => `${sd.name} 출장마사지·홈타이 ${sd.main ? `동읍 ${sd.spotCount}곳` : `시군구 ${sd.gu.length}곳`} | ${sd.name} 방문 ${at(hash(sd.name, 'sdt'), ACT)} — ${BRAND}`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gt');
    return `${g.name} 출장마사지·홈타이 | ${sd.name} ${g.name} ${g.main ? `동읍 ${g.spotCount}곳` : `행정동 ${g.dongCount}곳`} ${at(h, ACT, 0)} — ${BRAND}`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'st');
    return `${s.name} 출장마사지·홈타이 ${at(h, COURSE_WORD, 0)} | ${g.name} ${s.name} ${at(h, ACT, 1)} — ${BRAND}`;
  },
  course: (c) => `${c.ko} 출장마사지·홈타이 ${c.min}분 ${c.price.toLocaleString('ko-KR')}원 | 세기 ${c.pressure} — ${BRAND}`,
  sidoCourse: (sd, c) => `${sd.name} ${c.ko} 출장마사지·홈타이 | ${sd.name} 방문 ${at(hash(sd.name, c.slug), ACT)} — ${BRAND}`,
  page: (t) => `${t} | ${BRAND} 출장마사지·홈타이`,
  post: (p) => `${p.title} | ${BRAND} 방문 노트`,
};

/* ── 디스크립션 ───────────────────────────────────────────────────── */
/** 동 설명 가운데 문장 — 그 자리에서만 나오는 숫자로 짠다. */
function spotMiddle(sd, g, s, h) {
  const a0 = s.adj[0], a1 = s.adj[1];
  if (!s.adjCount) {
    return [
      `뭍으로 이어진 이웃이 없는 ${km2(s.area)} 자리, 가로 ${km(s.wide)}·세로 ${km(s.tall)}`,
      `다리를 건너야 닿는 자리이고 넓이는 ${km2(s.area)}`,
    ][parseInt(h.substr(6, 3), 16) % 2];
  }
  const frames = [
    () => `넓이 ${km2(s.area)}에 가로 ${km(s.wide)}·세로 ${km(s.tall)}, 경계를 맞댄 행정동은 ${s.adjCount}곳`,
    () => (a0 ? `선이 붙은 이웃 ${s.adjCount}곳 가운데 ${a0.name}${a1 ? `·${a1.name}` : ''} 쪽이 먼저 이어집니다` : `둘레가 면이라 이어 볼 동이 없고 넓이는 ${km2(s.area)}`),
    () => (s.outCount
      ? `${g.name} 안쪽으로 ${s.adj.length - s.outCount}곳, 시군구 밖으로 ${s.outCount}곳과 맞닿은 ${km2(s.area)} 자리`
      : `둘레가 모두 ${g.name} 안쪽이고 넓이는 ${km2(s.area)}`),
    () => `가로 ${km(s.wide)} 세로 ${km(s.tall)}짜리 칸이고 ${s.kind === '읍' ? `${g.name}에서 길이 모이는 읍` : `맞닿은 동은 ${s.adjCount}곳`}`,
    () => `${km2(s.area)} 넓이에 둘레로 ${s.adjCount}곳이 붙어 있어 들어가는 길이 여럿`,
    () => (a0 ? `${a0.name}${josa(a0.name, '과/와')} 경계를 나눠 가진 자리, 넓이는 ${km2(s.area)}` : `${km2(s.area)} 넓이에 바로 이어지는 동이 없는 자리`),
  ];
  return frames[parseInt(h.substr(6, 3), 16) % frames.length]();
}
const TAIL = [
  '예약 문의 버튼으로 바로 통화하고 마친 뒤 계산합니다',
  '안심번호 한 통이면 되고 미리 보내실 돈이 없습니다',
  '새벽에도 번호가 같고 할증이 붙지 않습니다',
  '길 값을 따로 받지 않으며 어느 자리든 금액이 같습니다',
  '밤낮 없이 접수하고 값은 끝난 뒤에 받습니다',
];

export const desc = {
  home: () =>
    '서울·인천·경기·부산은 동·읍까지, 대전·대구·울산과 지정 시·군은 시군구까지 쪽을 둔 출장마사지·홈타이 방문 관리 안내. 사시는 자리를 눌러 넓이와 맞닿은 동을 먼저 보시고 안심번호로 접수하십시오.',
  areaHub: (c) =>
    `출장마사지·홈타이를 받는 동·읍 ${c.spot}곳과 시군구 ${c.gu}곳을 한자리에 모았습니다. 자리마다 넓이와 가로세로 폭, 경계가 실제로 붙어 있는 행정동을 적어 두었습니다.`,
  sido: (sd) =>
    sd.main
      ? `${sd.name} ${KEY} 안내. 시군구 ${sd.gu.length}곳과 동·읍 ${sd.spotCount}곳에 쪽을 두었습니다.${sd.myeonCount ? ` 면 ${sd.myeonCount}곳도 같은 번호로 받습니다.` : ''} 후불이고 24시간 전화가 이어집니다.`
      : `${sd.name} ${KEY} 안내. 시군구 ${sd.gu.length}곳에 쪽을 두었습니다. 동 이름은 각 시군구 쪽 목록에 있고, 금액과 번호는 다른 지역과 같습니다.`,
  gu: (sd, g) => {
    const h = hash(sd.name, g.name, 'gd');
    const t0 = g.touching[0];
    const mid = g.main
      ? [
        `동·읍 ${g.spotCount}곳에 쪽을 두었고 넓이는 ${km2(g.area)}`,
        g.touchAll ? (t0 ? `맞닿은 시군구가 ${g.touchAll}곳이고 그 가운데 ${t0.gu} 쪽으로 선이 가장 길게 붙습니다` : `맞닿은 시군구가 ${g.touchAll}곳이고 넓이는 ${km2(g.area)}`) : `뭍으로 이어진 이웃이 없는 섬이고 넓이는 ${km2(g.area)}`,
        g.myeonCount ? `행정동 ${g.dongCount}곳 가운데 ${g.spotCount}곳에 쪽을 두고 면 ${g.myeonCount}곳은 이름만 적었습니다` : `행정동 ${g.dongCount}곳 전부에 쪽을 두었습니다`,
        `${km2(g.area)} 안에 받는 자리 ${g.spotCount}곳`,
      ][parseInt(h.substr(3, 3), 16) % 4]
      : [
        `행정동 ${g.dongCount}곳이 들어 있고 넓이는 ${km2(g.area)}`,
        g.touchAll ? `맞닿은 시군구 ${g.touchAll}곳과 선을 나눠 가진 ${km2(g.area)} 자리` : `뭍으로 이어진 이웃이 없는 ${km2(g.area)} 자리`,
        g.myeonCount ? `동 ${g.dongNames.length}곳과 면 ${g.myeonCount}곳 모두 같은 번호로 받습니다` : `동 ${g.dongNames.length}곳 어디서 부르셔도 같은 번호로 받습니다`,
      ][parseInt(h.substr(3, 3), 16) % 3];
    return `${sd.name} ${g.name} ${KEY}. ${mid}. ${TAIL[parseInt(h.substr(9, 3), 16) % TAIL.length]}.`;
  },
  spot: (sd, g, s) => {
    const h = hash(sd.name, g.name, s.name, 'sd');
    return `${sd.name} ${g.name} ${s.name} ${KEY}. ${spotMiddle(sd, g, s, h)}. ${TAIL[parseInt(h.substr(9, 3), 16) % TAIL.length]}.`;
  },
  course: (c) =>
    `${c.ko} 출장 방문 안내. ${c.focus}${josa(c.focus, '을/를')} 보며 세기는 ${c.pressure}, 속도는 ${c.tempo}${josa(c.tempo, '으로/로')} 둡니다. ${c.min}분 ${c.price.toLocaleString('ko-KR')}원이고 지역이 달라져도 같은 값입니다.`,
  sidoCourse: (sd, c) =>
    `${sd.name} ${c.ko} ${KEY}. ${c.for} 고르는 코스이고 ${c.focus}에 시간을 씁니다. ${sd.name} 어디서 부르셔도 ${c.min}분 ${c.price.toLocaleString('ko-KR')}원입니다.`,
  post: (p) => p.summary,
};

/** 설명이 예산을 넘기면 문장 단위로 자른다. */
export function clampDesc(s, limit = 155) {
  if (s.length <= limit) return s;
  const parts = s.split(/(?<=\.)\s+/);
  let out = '';
  for (const p of parts) {
    if ((out + p).length > limit) break;
    out += (out ? ' ' : '') + p;
  }
  return out || s.slice(0, limit - 1) + '…';
}
