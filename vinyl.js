// ============================================================================
// АКУСТИЧЕСКАЯ ВОЛНА САНКТ-ПЕТЕРБУРГА (ЭСТЕТИКА UNKNOWN PLEASURES)
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

// Музыкальные очаги на карте Питера (создают пики звуковых волн)
const PEAKS = new Array(
  { x: -195, y: -15, amp: 52, rad: 48 }, // Васильевский остров / Севкабель
  { x: -45,  y: -95, amp: 64, rad: 44 }, // Петроградка / Котельная "Камчатка"
  { x: 45,   y: 55,  amp: 72, rad: 52 }, // Центр / Рубинштейна, 13 / Рок-клуб
  { x: 135,  y: 85,  amp: 48, rad: 45 }, // Лиговка / Пушкинская, 10
  { x: 210,  y: -45, amp: 42, rad: 46 }  // Охта / Выборгская сторона
);

// Русло Невы (где линии волн приглушаются и расступаются, образуя реку и острова)
function riverDepth(x, y) {
  // Главная Нева (от Стрелки В.О. на восток и юг)
  const mainY = -12 + Math.sin(x * 0.011) * 28 + (x > 90 ? (x - 90) * 0.38 : 0);
  const dMain = Math.abs(y - mainY);

  // Малая Нева (северо-западный рукав между В.О. и Петроградкой)
  const northY = -15 - (x + 30) * 0.48;
  const dNorth = x < -10 ? Math.abs(y - northY) : 999;

  const d = Math.min(dMain, dNorth);
  if (d < 16) return 1 - d / 16;
  return 0;
}

function drawWaveCity() {
  tick += 0.025;
  vx.clearRect(0, 0, vc.width, vc.height);

  vx.save();
  vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
  vx.scale(vsc, vsc);

  // Позиция курсора в координатах холста для живого отклика
  const mx = (mouseX - (vc.width / 2 + vox)) / vsc;
  const my = (mouseY - (vc.height / 2 + voy)) / vsc;

  const rows = 58;
  const cols = 150;
  const width = 620;
  const height = 430;

  for (let r = 0; r < rows; r++) {
    const baseY = -height / 2 + (r / (rows - 1)) * height;

    vx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c / cols) * width;

      // Огибающая краёв (чтобы по бокам линии плавно затихали в ноль, как на обложке)
      const edgeFade = Math.pow(Math.sin((c / cols) * Math.PI), 1.6);

      // Проверяем русло Невы
      const riv = riverDepth(x, baseY);

      // Считаем высоту пиков в музыкальных районах Питера
      let peakBoost = 0;
      for (const p of PEAKS) {
        const dist = Math.hypot(x - p.x, baseY - p.y);
        if (dist < p.rad * 2.4) {
          const g = Math.exp(-(dist * dist) / (2 * p.rad * p.rad));
          peakBoost += p.amp * g;
        }
      }

      // Лёгкий отклик на наведение курсора
      const mDist = Math.hypot(x - mx, baseY - my);
      const cursorBoost = mDist < 85 ? (1 - mDist / 85) * 18 : 0;

      // Составная звуковая волна (гармоники + живое дыхание)
      const wave1 = Math.sin(x * 0.065 + r * 0.9 + tick) * 0.5 + 0.5;
      const wave2 = Math.cos(x * 0.14 - r * 1.4 - tick * 0.7) * 0.5 + 0.5;
      const noise = (wave1 * 0.65 + wave2 * 0.35);

      // Итоговое смещение линии вверх
      const baseNoise = (1 - riv) * 5.5;
      const signal = (baseNoise + (peakBoost + cursorBoost) * (1 - riv * 0.85)) * noise * edgeFade;
      const y = baseY - signal;

      if (c === 0) vx.moveTo(x, y);
      else vx.lineTo(x, y);
    }

    // Заливка под линией цветом фона, чтобы задние пики перекрывались передними (эффект глубины!)
    vx.lineTo(width / 2, baseY + 35);
    vx.lineTo(-width / 2, baseY + 35);
    vx.closePath();
    vx.fillStyle = "#08090c";
    vx.fill();

    // Сама белая/серебристая линия волны
    vx.beginPath();
    for (let c = 0; c <= cols; c++) {
      const x = -width / 2 + (c / cols) * width;
      const edgeFade = Math.pow(Math.sin((c / cols) * Math.PI), 1.6);
      const riv = riverDepth(x, baseY);

      let peakBoost = 0;
      for (const p of PEAKS) {
        const dist = Math.hypot(x - p.x, baseY - p.y);
        if (dist < p.rad * 2.4) {
          const g = Math.exp(-(dist * dist) / (2 * p.rad * p.rad));
          peakBoost += p.amp * g;
        }
      }

      const mDist = Math.hypot(x - mx, baseY - my);
      const cursorBoost = mDist < 85 ? (1 - mDist / 85) * 18 : 0;

      const wave1 = Math.sin(x * 0.065 + r * 0.9 + tick) * 0.5 + 0.5;
      const wave2 = Math.cos(x * 0.14 - r * 1.4 - tick * 0.7) * 0.5 + 0.5;
      const noise = (wave1 * 0.65 + wave2 * 0.35);

      const baseNoise = (1 - riv) * 5.5;
      const signal = (baseNoise + (peakBoost + cursorBoost) * (1 - riv * 0.85)) * noise * edgeFade;
      const y = baseY - signal;

      if (c === 0) vx.moveTo(x, y);
      else vx.lineTo(x, y);
    }

    vx.strokeStyle = "rgba(226, 230, 240, 0.78)";
    vx.lineWidth = 1.25;
    vx.stroke();
  }

  vx.restore();
  requestAnimationFrame(drawWaveCity);
}
drawWaveCity();
