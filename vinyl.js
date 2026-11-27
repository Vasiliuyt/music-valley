// ============================================================================
// 2D-ПЛАКАТ ГРУППЫ «СПЛИН»: АЛЬБОМЫ КАК ГРАНАТОВЫЕ ЗЁРНА (БЕЗ ГРАДИЕНТОВ)
// ============================================================================

const vc = document.getElementById("vinylCv");
const vx = vc.getContext("2d");

let vox = 0, voy = 0, vsc = 1, vdrag = false, vlx = 0, vly = 0;
let mouseX = -9999, mouseY = -9999, tick = 0;
let hoveredAlbum = null, activeAlbum = null;

function resizeVinyl() {
  vc.width = window.innerWidth;
  vc.height = window.innerHeight;
}
window.addEventListener("resize", resizeVinyl);
resizeVinyl();

// Ключевые альбомы «Сплина» — каждое крупное зерно открывает свой релиз
const ALBUMS = new Array(
  {
    id: "dust", title: "Пыльная быль", year: "1994", x: -230, y: -115, rx: 22, ry: 14, ang: -0.4,
    note: "Дебютный альбом, записанный по ночам в петербургском театре «Буфф» на деньги, заработанные озвучкой рекламы.",
    tracks: new Array("Жертва талого льда", "Рыба без трусов", "Сказка", "Под сурдинку")
  },
  {
    id: "lantern", title: "Фонарь под глазом", year: "1997", x: -120, y: 125, rx: 24, ry: 15, ang: 0.5,
    note: "Пластинка, с которой группа вышла на всероссийский уровень: акустическая меланхолия, флейта и нервный питерский рок.",
    tracks: new Array("Англо-русский словарь", "Бонни и Клайд", "Частушки", "Моя любовь")
  },
  {
    id: "granat", title: "Гранатовый альбом", year: "1998", x: 0, y: -20, rx: 32, ry: 20, ang: -0.2,
    note: "Главный прорыв конца 90-х: жёсткий гитарный звук, нерв эпохи и абсолютные хиты, определившие звучание русского рока.",
    tracks: new Array("Орбит без сахара", "Выхода нет", "Весь этот бред", "Катись, колесо!")
  },
  {
    id: "altavista", title: "Альтависта", year: "1999", x: 115, y: -145, rx: 24, ry: 15, ang: 0.35,
    note: "Экспериментальный, тяжёлый и психоделический поворот после стадионного успеха «Гранатового альбома».",
    tracks: new Array("Молоко и мёд", "Альтависта", "Пил-курил", "Мотоциклетная цепь")
  },
  {
    id: "25kadr", title: "25-й кадр", year: "2001", x: 145, y: 95, rx: 26, ry: 16, ang: -0.55,
    note: "Один из самых плотных по хитам альбомов 2000-х, записанный обновлённым составом с острыми социальными и лирическими текстами.",
    tracks: new Array("Линия жизни", "Моё сердце", "Остаёмся зимовать", "Феллини")
  },
  {
    id: "newpeople", title: "Новые люди", year: "2003", x: -15, y: 185, rx: 24, ry: 15, ang: 0.25,
    note: "Минималистичный, прозрачный и нервный альбом-наблюдение за меняющимся городом и людьми нового века.",
    tracks: new Array("Новые люди", "Время, назад!", "Гандбол", "Сломано всё")
  },
  {
    id: "split", title: "Раздвоение личности", year: "2007", x: 265, y: -35, rx: 25, ry: 16, ang: 0.65,
    note: "Двойная концептуальная работа из 17 песен на стыке психоделии, романса и тяжёлого арт-рока.",
    tracks: new Array("Скажи", "Маяк (на стихи Маяковского)", "Мама мия", "Прочь из моей головы")
  },
  {
    id: "resonans", title: "Резонанс", year: "2014", x: -265, y: 45, rx: 23, ry: 14, ang: -0.7,
    note: "Двухчастный философский цикл зрелого «Сплина» с камерной поэзией и акустическими балладами.",
    tracks: new Array("Рай в шалаше", "Оркестр", "Танцуй!", "Старый дом")
  }
);

// Создаём встроенную боковую панель под альбом, если её ещё нет в HTML
let sidePanel = document.getElementById("albumDrawer");
if (!sidePanel) {
  sidePanel = document.createElement("div");
  sidePanel.id = "albumDrawer";
  sidePanel.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:360px;max-width:calc(100vw - 40px);background:#100d10;border:1px solid #2b181d;border-radius:12px;padding:22px;z-index:120;display:none;flex-direction:column;gap:14px;color:#e6e2e3;font-family:-apple-system,sans-serif;overflow-y:auto";
  document.body.appendChild(sidePanel);
}

function openAlbumPanel(alb) {
  activeAlbum = alb;
  sidePanel.style.display = "flex";
  const trkHtml = alb.tracks.map(t => `<div style="background:#191215;border:1px solid #2e181e;padding:8px 11px;border-radius:6px;font-size:12.5px;margin-top:6px">${t}</div>`).join("");
  const spUrl = "https://spotify.com" + encodeURIComponent("Сплин " + alb.title);
  sidePanel.innerHTML = `
    <div style="display:flex;justify-content:space-between;align-items:flex-start">
      <div>
        <div style="font-size:10px;letter-spacing:1.4px;text-transform:uppercase;color:#c92a3e;font-weight:700;margin-bottom:4px">СПЛИН • ${alb.year}</div>
        <h2 style="font-size:21px;color:#fff;font-weight:600">${alb.title}</h2>
      </div>
      <button id="closeAlbBtn" style="background:#1c1518;color:#a89ea1;border:1px solid #301d22;padding:5px 10px;border-radius:6px;cursor:pointer">✕</button>
    </div>
    <div style="background:#161013;border-left:2px solid #c92a3e;padding:11px 13px;font-size:13px;line-height:1.5;color:#cfc6c9">${alb.note}</div>
    <div>
      <div style="font-size:10px;text-transform:uppercase;letter-spacing:1.1px;color:#7a6c70;font-weight:700;margin-bottom:4px">Ключевые треки</div>
      ${trkHtml}
    </div>
    <a href="${spUrl}" target="_blank" style="margin-top:auto;background:#c92a3e;color:#fff;text-align:center;padding:11px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Открыть альбом в Spotify ↗</a>
  `;
  document.getElementById("closeAlbBtn").onclick = () => {
    sidePanel.style.display = "none";
    activeAlbum = null;
  };
}

// Генерируем плоский 2D-ковёр фоновых гранатовых зёрен (без наложения на альбомы)
let seed = 1998;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const BG_SEEDS = new Array();
for (let i = 0; i < 260; i++) {
  const a = rnd() * Math.PI * 2;
  const r = Math.sqrt(rnd()) * 420;
  const bx = Math.cos(a) * r * 1.18;
  const by = Math.sin(a) * r * 0.85;

  // Оставляем аккуратную охранную зону вокруг зёрен-альбомов
  let tooClose = false;
  for (const alb of ALBUMS) {
    if (Math.hypot(bx - alb.x, by - alb.y) < alb.rx + 26) {
      tooClose = true;
      break;
    }
  }
  if (tooClose) continue;

  const tonePick = rnd();
  const fill = tonePick < 0.45 ? "#240a10" : (tonePick < 0.82 ? "#330e17" : "#1c070c");
  BG_SEEDS.push({
    bx: bx, by: by, x: bx, y: by, vx: 0, vy: 0,
    rx: 10 + rnd() * 7,
    ry: 6 + rnd() * 4.5,
    ang: rnd() * Math.PI * 2,
    fill: fill,
    phase: rnd() * Math.PI * 2
  });
}

function getHoveredAlbum(mx, my) {
  for (let i = ALBUMS.length - 1; i >= 0; i--) {
    const a = ALBUMS[i];
    if (Math.hypot(mx - a.x, my - a.y) <= a.rx + 10) return a;
  }
  return null;
}

vc.onmousedown = e => {
  vdrag = true;
  vdragMoved = false;
  vlx = e.clientX;
  vly = e.clientY;
};
let vdragMoved = false;
window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (vdrag) {
    vox += e.clientX - vlx;
    voy += e.clientY - vly;
    vlx = e.clientX;
    vly = e.clientY;
    vdragMoved = true;
  }
});
window.addEventListener("mouseup", () => {
  if (vdrag && !vdragMoved && hoveredAlbum) {
    openAlbumPanel(hoveredAlbum);
  }
  vdrag = false;
});
vc.onwheel = e => {
  e.preventDefault();
  vsc = Math.min(2.2, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9)));
};

// Плоская 2D-отрисовка одного гранатового зерна (строго без градиентов)
function drawFlatSeed(x, y, rx, ry, ang, fillCol, strokeCol, lineW, hasFacet) {
  vx.save();
  vx.translate(x, y);
  vx.rotate(ang);

  vx.beginPath();
  vx.moveTo(-rx, 0);
  vx.lineTo(-rx * 0.45, -ry * 0.92);
  vx.lineTo(rx * 0.48, -ry * 0.88);
  vx.lineTo(rx, 0);
  vx.lineTo(rx * 0.48, ry * 0.88);
  vx.lineTo(-rx * 0.45, ry * 0.92);
  vx.closePath();

  vx.fillStyle = fillCol;
  vx.fill();

  if (strokeCol) {
    vx.strokeStyle = strokeCol;
    vx.lineWidth = lineW || 1;
    vx.stroke();
  }

  // Плоская геометрическая грань-прожилка внутри зерна (2D-графика)
  if (hasFacet) {
    vx.beginPath();
    vx.moveTo(-rx * 0.55, -ry * 0.15);
    vx.lineTo(rx * 0.35, -ry * 0.35);
    vx.strokeStyle = "rgba(255, 255, 255, 0.28)";
    vx.lineWidth = 1.4;
    vx.stroke();
  }

  vx.restore();
}

function drawSpleen2D() {
  tick += 0.018;
  vx.fillStyle = "#0a0809";
  vx.fillRect(0, 0, vc.width, vc.height);

  vx.save();
  vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
  vx.scale(vsc, vsc);

  const mx = (mouseX - (vc.width / 2 + vox)) / vsc;
  const my = (mouseY - (vc.height / 2 + voy)) / vsc;
  hoveredAlbum = getHoveredAlbum(mx, my);
  vc.style.cursor = hoveredAlbum ? "pointer" : (vdrag ? "grabbing" : "grab");

  // 1. Фоновые плоские зёрна с лёгким откликом на курсор
  for (let i = 0; i < BG_SEEDS.length; i++) {
    const s = BG_SEEDS[i];
    const tx = s.bx + Math.cos(tick + s.phase) * 1.4;
    const ty = s.by + Math.sin(tick + s.phase) * 1.4;
    const dx = s.x - mx, dy = s.y - my;
    const dist = Math.hypot(dx, dy);
    if (dist < 70 && dist > 0.1) {
      const f = (1 - dist / 70) * 3.5;
      s.vx += (dx / dist) * f;
      s.vy += (dy / dist) * f;
    }
    s.vx = (s.vx + (tx - s.x) * 0.08) * 0.8;
    s.vy = (s.vy + (ty - s.y) * 0.08) * 0.8;
    s.x += s.vx;
    s.y += s.vy;

    drawFlatSeed(s.x, s.y, s.rx, s.ry, s.ang, s.fill, "#140408", 1, false);
  }

  // 2. Тонкие 2D-нити хронологии между альбомами
  vx.beginPath();
  for (let i = 0; i < ALBUMS.length; i++) {
    const a = ALBUMS[i];
    i === 0 ? vx.moveTo(a.x, a.y) : vx.lineTo(a.x, a.y);
  }
  vx.strokeStyle = "rgba(201, 42, 62, 0.22)";
  vx.lineWidth = 1;
  vx.setLineDash(new Array(4, 6));
  vx.stroke();
  vx.setLineDash(new Array());

  // 3. Акцентные кликабельные зёрна-альбомы
  for (let i = 0; i < ALBUMS.length; i++) {
    const a = ALBUMS[i];
    const isH = hoveredAlbum && hoveredAlbum.id === a.id;
    const isAct = activeAlbum && activeAlbum.id === a.id;
    const scaleBoost = isH || isAct ? 1.14 : 1;

    if (isH || isAct) {
      vx.beginPath();
      vx.arc(a.x, a.y, a.rx + 14, 0, Math.PI * 2);
      vx.strokeStyle = "rgba(224, 49, 71, 0.45)";
