const vc = document.getElementById("vinylCv");
const vx = vc.getContext("2d");

let vox = 0, voy = 20, vsc = 1, vdrag = false, vlx = 0, vly = 0;

function resizeVinyl() {
  vc.width = window.innerWidth;
  vc.height = window.innerHeight;
}
window.addEventListener("resize", resizeVinyl);
resizeVinyl();

vc.onmousedown = e => { vdrag = true; vlx = e.clientX; vly = e.clientY; };
window.addEventListener("mousemove", e => {
  if (!vdrag) return;
  vox += e.clientX - vlx;
  voy += e.clientY - vly;
  vlx = e.clientX;
  vly = e.clientY;
});
window.addEventListener("mouseup", () => { vdrag = false; });
vc.onwheel = e => {
  e.preventDefault();
  vsc = Math.min(2.5, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9)));
};

const TILT = 0.54;
function pt(r, a) {
  return { x: Math.cos(a) * r, y: Math.sin(a) * r * TILT };
}

const CANALS = [
  { rBase: 205, width: 15, amp1: 11, freq1: 2, phase1: 0.3, amp2: 5, freq2: 5, phase2: 1.1 },
  { rBase: 325, width: 13, amp1: 14, freq1: 3, phase1: 1.7, amp2: 6, freq2: 4, phase2: 0.5 }
];

function getCanalR(c, a) {
  return c.rBase + Math.sin(a * c.freq1 + c.phase1) * c.amp1 + Math.cos(a * c.freq2 + c.phase2) * c.amp2;
}

const STREETS_R =;
function getStreetR(baseR, a) {
  return baseR + Math.sin(a * 2 + baseR * 0.02) * 6;
}

const ALLEYS = [
  { a: 0.35, r1: 122, r2: 205 }, { a: 1.15, r1: 205, r2: 325 }, { a: 1.95, r1: 122, r2: 205 },
  { a: 2.65, r1: 205, r2: 325 }, { a: 3.45, r1: 122, r2: 205 }, { a: 4.15, r1: 205, r2: 325 },
  { a: 4.95, r1: 122, r2: 205 }, { a: 5.75, r1: 205, r2: 325 },
  { a: 0.75, r1: 325, r2: 418 }, { a: 2.35, r1: 325, r2: 418 }, { a: 3.85, r1: 325, r2: 418 }, { a: 5.35, r1: 325, r2: 418 }
];

function isRoadOrWater(r, a) {
  const na = ((a % (Math.PI * 2)) + Math.PI * 2) % (Math.PI * 2);
  for (const c of CANALS) {
    if (Math.abs(r - getCanalR(c, na)) < c.width * 0.5 + 8) return true;
  }
  for (const sr of STREETS_R) {
    if (Math.abs(r - getStreetR(sr, na)) < 8.5) return true;
  }
  for (const al of ALLEYS) {
    if (r >= al.r1 && r <= al.r2 && Math.abs(na - al.a) < 0.042) return true;
  }
  return false;
}

const HOUSES = [];
let seed = 108;
function rnd() {
  seed = (seed * 1664525 + 1013904223) % 4294967296;
  return seed / 4294967296;
}

const BUILDING_LINES =;

BUILDING_LINES.forEach((rLine, lineIdx) => {
  const count = Math.floor(rLine * 0.24);
  for (let i = 0; i < count; i++) {
    if (rnd() < 0.22) continue;
    const a = (i / count) * Math.PI * 2 + (rnd() - 0.5) * 0.035;
    const r = rLine + Math.sin(a * 2 + lineIdx) * 4 + (rnd() - 0.5) * 2.5;
    if (r < 126 || r > 416 || isRoadOrWater(r, a)) continue;
    const pos = pt(r, a);
    HOUSES.push({
      x: pos.x,
      y: pos.y,
      w: 5.5 + rnd() * 11,
      d: 4 + rnd() * 4.5,
      h: 8 + rnd() * 22 * (1 - (r - 125) / 420),
      ang: a + Math.PI / 2 + (rnd() - 0.5) * 0.12
    });
  }
});

HOUSES.sort((a, b) => a.y - b.y);

function drawHouse(b) {
  const c = Math.cos(b.ang), s = Math.sin(b.ang) * TILT;
  const dx1 = c * b.w, dy1 = s * b.w;
  const dx2 = -Math.sin(b.ang) * b.d, dy2 = Math.cos(b.ang) * b.d * TILT;

  const p1 = { x: b.x - dx1 - dx2, y: b.y - dy1 - dy2 };
  const p2 = { x: b.x + dx1 - dx2, y: b.y + dy1 - dy2 };
  const p3 = { x: b.x + dx1 + dx2, y: b.y + dy1 + dy2 };
  const p4 = { x: b.x - dx1 + dx2, y: b.y - dy1 + dy2 };

  vx.fillStyle = "rgba(0, 0, 0, 0.5)";
  vx.beginPath();
  vx.moveTo(p1.x, p1.y);
  vx.lineTo(p4.x, p4.y);
  vx.lineTo(p4.x - b.h * 0.45, p4.y + b.h * 0.18);
  vx.lineTo(p1.x - b.h * 0.45, p1.y + b.h * 0.18);
  vx.closePath();
  vx.fill();

  vx.fillStyle = "#1e2330";
  vx.beginPath();
  vx.moveTo(p4.x, p4.y);
  vx.lineTo(p3.x, p3.y);
  vx.lineTo(p3.x, p3.y - b.h);
  vx.lineTo(p4.x, p4.y - b.h);
  vx.closePath();
  vx.fill();

  vx.fillStyle = "#141822";
  vx.beginPath();
  vx.moveTo(p3.x, p3.y);
  vx.lineTo(p2.x, p2.y);
  vx.lineTo(p2.x, p2.y - b.h);
  vx.lineTo(p3.x, p3.y - b.h);
  vx.closePath();
  vx.fill();

  vx.strokeStyle = "#08090d";
  vx.lineWidth = 1.2;
  vx.beginPath();
  vx.moveTo(p4.x, p4.y);
  vx.lineTo(p3.x, p3.y);
  vx.lineTo(p2.x, p2.y);
  vx.stroke();

  vx.fillStyle = "#293042";
  vx.beginPath();
  vx.moveTo(p1.x, p1.y - b.h);
  vx.lineTo(p2.x, p2.y - b.h);
  vx.lineTo(p3.x, p3.y - b.h);
  vx.lineTo(p4.x, p4.y - b.h);
  vx.closePath();
  vx.fill();
  vx.strokeStyle = "rgba(255, 255, 255, 0.12)";
  vx.lineWidth = 0.6;
  vx.stroke();
}

function drawVinylLoop() {
  vx.clearRect(0, 0, vc.width, vc.height);
  vx.save();
  vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
  vx.scale(vsc, vsc);

  vx.fillStyle = "rgba(0, 0, 0, 0.85)";
  vx.beginPath(); vx.ellipse(0, 22, 445, 445 * TILT, 0, 0, Math.PI * 2); vx.fill();
  vx.fillStyle = "#13161f";
  vx.beginPath(); vx.ellipse(0, 10, 440, 440 * TILT, 0, 0, Math.PI * 2); vx.fill();

  const g = vx.createRadialGradient(-40, -20, 30, 0, 0, 440);
  g.addColorStop(0, "#191d28");
  g.addColorStop(0.55, "#0d0f15");
  g.addColorStop(1, "#141720");
  vx.fillStyle = g;
  vx.beginPath(); vx.ellipse(0, 0, 440, 440 * TILT, 0, 0, Math.PI * 2); vx.fill();
  vx.strokeStyle = "rgba(255, 255, 255, 0.13)";
  vx.lineWidth = 1.5;
  vx.stroke();

  for (let r = 122; r < 430; r += 8) {
    vx.beginPath(); vx.ellipse(0, 0, r, r * TILT, 0, 0, Math.PI * 2);
    vx.strokeStyle = r % 24 === 0 ? "rgba(255, 255, 255, 0.05)" : "rgba(255, 255, 255, 0.018)";
    vx.lineWidth = 1;
    vx.stroke();
  }

  vx.save();
  vx.beginPath(); vx.ellipse(0, 0, 437, 437 * TILT, 0, 0, Math.PI * 2); vx.clip();

  STREETS_R.forEach(sr => {
    vx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.06; a += 0.04) {
      const p = pt(getStreetR(sr, a), a);
      a === 0 ? vx.moveTo(p.x, p.y) : vx.lineTo(p.x, p.y);
    }
    vx.strokeStyle = "#0a0c11";
    vx.lineWidth = 13;
    vx.stroke();
    vx.setLineDash([4, 6]);
    vx.strokeStyle = "rgba(255, 255, 255, 0.09)";
    vx.lineWidth = 0.8;
    vx.stroke();
    vx.setLineDash([]);
  });

  ALLEYS.forEach(al => {
    const p1 = pt(al.r1, al.a), p2 = pt(al.r2, al.a);
    vx.beginPath(); vx.moveTo(p1.x, p1.y); vx.lineTo(p2.x, p2.y);
    vx.strokeStyle = "#0a0c11";
    vx.lineWidth = 9;
    vx.stroke();
  });

  CANALS.forEach(c => {
    vx.beginPath();
    for (let a = 0; a <= Math.PI * 2 + 0.06; a += 0.04) {
      const p = pt(getCanalR(c, a), a);
      a === 0 ? vx.moveTo(p.x, p.y) : vx.lineTo(p.x, p.y);
    }
    vx.strokeStyle = "rgba(130, 142, 168, 0.22)";
    vx.lineWidth = c.width + 3;
    vx.stroke();
    vx.strokeStyle = "#050609";
    vx.lineWidth = c.width;
    vx.stroke();

    [0.8, 2.4, 4.0, 5.5].forEach(ba => {
      const rMid = getCanalR(c, ba);
      const b1 = pt(rMid - c.width * 0.65, ba), b2 = pt(rMid + c.width * 0.65, ba);
      vx.beginPath(); vx.moveTo(b1.x, b1.y); vx.lineTo(b2.x, b2.y);
      vx.strokeStyle = "#2c3447";
      vx.lineWidth = 5;
      vx.stroke();
    });
  });

  vx.restore();

  vx.fillStyle = "#151923";
  vx.beginPath(); vx.ellipse(0, 0, 112, 112 * TILT, 0, 0, Math.PI * 2); vx.fill();
  vx.strokeStyle = "rgba(196, 163, 90, 0.45)";
  vx.lineWidth = 1.2;
  vx.stroke();
  vx.fillStyle = "#07080b";
  vx.beginPath(); vx.ellipse(0, 0, 11, 11 * TILT, 0, 0, Math.PI * 2); vx.fill();

  HOUSES.forEach(drawHouse);

  vx.restore();
  requestAnimationFrame(drawVinylLoop);
}
drawVinylLoop();
