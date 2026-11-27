// ============================================================================
// ВИЗУАЛЬНЫЙ МИР: СПЛИН — «ГРАНАТОВЫЙ АЛЬБОМ» (1998)
// ============================================================================

const vc = document.getElementById("vinylCv");
const vx = vc.getContext("2d");

let vox = 0, voy = 0, vsc = 1, vdrag = false, vlx = 0, vly = 0;
let mouseX = -9999, mouseY = -9999, tick = 0;

function resizeVinyl() {
  vc.width = window.innerWidth;
  vc.height = window.innerHeight;
}
window.addEventListener("resize", resizeVinyl);
resizeVinyl();

vc.onmousedown = e => { vdrag = true; vlx = e.clientX; vly = e.clientY; };
window.addEventListener("mousemove", e => {
  mouseX = e.clientX;
  mouseY = e.clientY;
  if (!vdrag) return;
  vox += e.clientX - vlx;
  voy += e.clientY - vly;
  vlx = e.clientX;
  vly = e.clientY;
});
window.addEventListener("mouseup", () => { vdrag = false; });
vc.onwheel = e => {
  e.preventDefault();
  vsc = Math.min(2.4, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9)));
};

// Генератор детерминированных случайных чисел
let seed = 1998;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

// Генерируем плотный ковёр гранатовых зёрен вокруг центральной гильзы
const SEEDS = new Array();
const SHELL_R = 88;

for (let ring = SHELL_R + 12; ring <= 480; ring += 23) {
  const count = Math.floor((Math.PI * 2 * ring) / 25);
  for (let i = 0; i < count; i++) {
    const baseA = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.16;
    const baseR = ring + (rnd() - 0.5) * 11;
    const bx = Math.cos(baseA) * baseR;
    const by = Math.sin(baseA) * baseR;
    SEEDS.push({
      bx: bx,
      by: by,
      x: bx,
      y: by,
      vx: 0,
      vy: 0,
      rx: 12 + rnd() * 5.5,
      ry: 8.5 + rnd() * 4,
      ang: rnd() * Math.PI * 2,
      hueShift: (rnd() - 0.5) * 14,
      phase: rnd() * Math.PI * 2
    });
  }
}

// Отрисовка одного полупрозрачного гранатового зерна с бликом
function drawSeed(s) {
  vx.save();
  vx.translate(s.x, s.y);
  vx.rotate(s.ang);

  // Мягкая глубокая тень под зерном
  vx.fillStyle = "rgba(8, 2, 4, 0.72)";
  vx.beginPath();
  vx.ellipse(2, 3, s.rx * 1.04, s.ry * 1.04, 0, 0, Math.PI * 2);
  vx.fill();

  // Рубиновое тело зерна (многослойный градиент)
  const g = vx.createRadialGradient(-s.rx * 0.25, -s.ry * 0.25, 1, 0, 0, s.rx * 1.15);
  const rMain = Math.min(210, Math.max(120, Math.floor(168 + s.hueShift)));
  g.addColorStop(0, "rgba(" + rMain + ", 24, 42, 0.92)");
  g.addColorStop(0.62, "rgba(112, 10, 22, 0.95)");
  g.addColorStop(1, "rgba(44, 4, 10, 0.98)");

  vx.fillStyle = g;
  vx.beginPath();
  // Слегка огранённая форма натурального зерна
  vx.moveTo(-s.rx, 0);
  vx.bezierCurveTo(-s.rx, -s.ry * 1.15, s.rx * 0.7, -s.ry * 1.1, s.rx, 0);
  vx.bezierCurveTo(s.rx * 0.7, s.ry * 1.1, -s.rx, s.ry * 1.15, -s.rx, 0);
  vx.closePath();
  vx.fill();

  // Внутренняя косточка (лёгкий светлый отблеск в глубине)
  vx.fillStyle = "rgba(255, 130, 145, 0.14)";
  vx.beginPath();
  vx.ellipse(0, 0, s.rx * 0.42, s.ry * 0.35, 0, 0, Math.PI * 2);
  vx.fill();

  // Глянцевый студийный блик на грани
  vx.fillStyle = "rgba(255, 220, 225, 0.36)";
  vx.beginPath();
  vx.ellipse(-s.rx * 0.32, -s.ry * 0.35, s.rx * 0.28, s.ry * 0.13, -0.35, 0, Math.PI * 2);
  vx.fill();

  vx.restore();
}

// Вспомогательная функция для текста по дуге на донце гильзы
function drawCurvedText(text, radius, startAngle, stepAngle, bottomHalf) {
  vx.save();
  for (let i = 0; i < text.length; i++) {
    const a = startAngle + i * stepAngle;
    vx.save();
    vx.rotate(a);
    vx.translate(0, bottomHalf ? radius : -radius);
    if (bottomHalf) vx.rotate(Math.PI);
    vx.fillText(text[i], 0, 0);
    vx.restore();
  }
  vx.restore();
}

// Отрисовка металлического донца гильзы по центру (в стиле обложки 1998 года)
function drawShellCasing(mx, my) {
  const distToMouse = Math.hypot(mx, my);
  const hoverBoost = distToMouse < SHELL_R ? (1 - distToMouse / SHELL_R) * 0.08 : 0;

  vx.save();
  vx.scale(1 + hoverBoost, 1 + hoverBoost);

  // Глубокая тень гильзы на зёрнах
  vx.fillStyle = "rgba(0, 0, 0, 0.8)";
  vx.beginPath();
  vx.arc(4, 7, SHELL_R + 4, 0, Math.PI * 2);
  vx.fill();

  // Внешняя закраина латунной/стальной гильзы с патиной
  const rimGrad = vx.createRadialGradient(-25, -25, 10, 0, 0, SHELL_R);
  rimGrad.addColorStop(0, "#b8b49c");
  rimGrad.addColorStop(0.65, "#8b8873");
  rimGrad.addColorStop(0.92, "#666352");
  rimGrad.addColorStop(1, "#3d3b30");

  vx.fillStyle = rimGrad;
  vx.beginPath();
  vx.arc(0, 0, SHELL_R, 0, Math.PI * 2);
  vx.fill();

  // Утопленное внутреннее кольцо под надпись
  vx.strokeStyle = "rgba(30, 29, 22, 0.65)";
  vx.lineWidth = 2;
  vx.beginPath();
  vx.arc(0, 0, SHELL_R - 7, 0, Math.PI * 2);
  vx.stroke();

  // Кольцо вокруг капсюля
  vx.fillStyle = "#7a7763";
  vx.beginPath();
  vx.arc(0, 0, 44, 0, Math.PI * 2);
  vx.fill();
  vx.strokeStyle = "#2b2a20";
  vx.lineWidth = 2.5;
  vx.stroke();

  // Внутренний бортик и сам капсюль в центре
  vx.strokeStyle = "rgba(215, 212, 190, 0.35)";
  vx.lineWidth = 1.5;
  vx.beginPath();
  vx.arc(0, 0, 34, 0, Math.PI * 2);
  vx.stroke();

  const capGrad = vx.createRadialGradient(-6, -6, 2, 0, 0, 24);
  capGrad.addColorStop(0, "#a8a48c");
  capGrad.addColorStop(0.8, "#7c7965");
  capGrad.addColorStop(1, "#454336");
  vx.fillStyle = capGrad;
  vx.beginPath();
  vx.arc(0, 0, 24, 0, Math.PI * 2);
  vx.fill();
  vx.strokeStyle = "#1f1e17";
  vx.lineWidth = 2.2;
  vx.stroke();

  // Штампованная гравировка на гильзе: ★ СПЛИН ★ ГРАНАТОВЫЙ АЛЬБОМ и клейма 17 / Д
  vx.fillStyle = "rgba(32, 31, 24, 0.85)";
  vx.font = "700 11.5px -apple-system, BlinkMacSystemFont, monospace";
  vx.textAlign = "center";
  vx.textBaseline = "middle";

  // Верхняя дуга: ★ СПЛИН ★ ГРАНАТОВЫЙ
  drawCurvedText("★ СПЛИН ★ ГРАНАТОВЫЙ", 63, -1.78, 0.175, false);
  // Нижняя дуга: АЛЬБОМ
  drawCurvedText("АЛЬБОМ", 63, 0.45, -0.18, true);

  // Мелкие заводские клейма "17" сверху и "Д" снизу у капсюля
  vx.font = "700 9px monospace";
  vx.fillStyle = "rgba(35, 34, 26, 0.7)";
  vx.fillText("17", 0, -38);
  vx.fillText("Д", 0, 38);

  vx.restore();
}

function drawSpleenWorld() {
  tick += 0.02;
  vx.fillStyle = "#140306";
  vx.fillRect(0, 0, vc.width, vc.height);

  vx.save();
  vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
  vx.scale(vsc, vsc);

  const mx = (mouseX - (vc.width / 2 + vox)) / vsc;
  const my = (mouseY - (vc.height / 2 + voy)) / vsc;

  // Физика упругого отталкивания зёрен от курсора
  for (let i = 0; i < SEEDS.length; i++) {
    const s = SEEDS[i];
    const breathX = Math.cos(tick + s.phase) * 1.2;
    const breathY = Math.sin(tick + s.phase) * 1.2;
    const targetX = s.bx + breathX;
    const targetY = s.by + breathY;

    const dx = s.x - mx;
    const dy = s.y - my;
    const dist = Math.hypot(dx, dy);

    if (dist < 75 && dist > 0.1) {
      const push = (1 - dist / 75) * 4.5;
      s.vx += (dx / dist) * push;
      s.vy += (dy / dist) * push;
    }

    // Возврат на место (пружина) + затухание
    s.vx += (targetX - s.x) * 0.08;
    s.vy += (targetY - s.y) * 0.08;
    s.vx *= 0.78;
    s.vy *= 0.78;
    s.x += s.vx;
    s.y += s.vy;

    drawSeed(s);
  }

  // Донце гильзы по центру поверх зёрен
  drawShellCasing(mx, my);

  // Мягкая тёмная виньетка по краям экрана
  vx.restore();
  const vig = vx.createRadialGradient(
    vc.width / 2, vc.height / 2, Math.min(vc.width, vc.height) * 0.32,
    vc.width / 2, vc.height / 2, Math.max(vc.width, vc.height) * 0.72
  );
  vig.addColorStop(0, "rgba(0, 0, 0, 0)");
  vig.addColorStop(1, "rgba(5, 1, 2, 0.85)");
  vx.fillStyle = vig;
  vx.fillRect(0, 0, vc.width, vc.height);

  requestAnimationFrame(drawSpleenWorld);
}
drawSpleenWorld();
