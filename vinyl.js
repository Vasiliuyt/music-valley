{
  const vc = document.getElementById("vinylCv"), vx = vc.getContext("2d");
  let vox = 0, voy = 0, vsc = 1, drag = false, moved = false, lx = 0, ly = 0, mx = -999, my = -999, t = 0, hov = null, act = null;
  function rsz() { vc.width = innerWidth; vc.height = innerHeight; }
  window.addEventListener("resize", rsz); rsz();

  const ALB = new Array(
    { id: "dust", n: "Пыльная быль", y: "1994", x: -220, y0: -110, rx: 22, ry: 14, a: -0.4, d: "Дебютный альбом, записанный по ночам в петербургском театре «Буфф».", tr: new Array("Жертва талого льда", "Рыба без трусов", "Сказка") },
    { id: "lan", n: "Фонарь под глазом", y: "1997", x: -115, y0: 120, rx: 24, ry: 15, a: 0.5, d: "Прорывной альбом с флейтой, акустической меланхолией и нервом Питера.", tr: new Array("Англо-русский словарь", "Бонни и Клайд", "Частушки") },
    { id: "grn", n: "Гранатовый альбом", y: "1998", x: 0, y0: -15, rx: 32, ry: 20, a: -0.2, d: "Главный стадионный рывок конца 90-х с жёстким гитарным саундом.", tr: new Array("Орбит без сахара", "Выхода нет", "Весь этот бред") },
    { id: "alt", n: "Альтависта", y: "1999", x: 115, y0: -140, rx: 24, ry: 15, a: 0.35, d: "Тяжёлый, психоделический поворот после успеха «Гранатового альбома».", tr: new Array("Молоко и мёд", "Альтависта", "Пил-курил") },
    { id: "k25", n: "25-й кадр", y: "2001", x: 145, y0: 95, rx: 26, ry: 16, a: -0.55, d: "Один из самых плотных по хитам альбомов 2000-х в обновлённом составе.", tr: new Array("Линия жизни", "Моё сердце", "Остаёмся зимовать", "Феллини") },
    { id: "new", n: "Новые люди", y: "2003", x: -10, y0: 180, rx: 24, ry: 15, a: 0.25, d: "Минималистичный и нервный альбом-наблюдение за меняющимся городом.", tr: new Array("Новые люди", "Время, назад!", "Гандбол") },
    { id: "spl", n: "Раздвоение личности", y: "2007", x: 260, y0: -30, rx: 25, ry: 16, a: 0.65, d: "Двойной концептуальный альбом на стыке арт-рока и психоделии.", tr: new Array("Скажи", "Маяк", "Мама мия") },
    { id: "res", n: "Резонанс", y: "2014", x: -260, y0: 45, rx: 23, ry: 14, a: -0.7, d: "Двухчастный философский цикл зрелого «Сплина».", tr: new Array("Рай в шалаше", "Оркестр", "Танцуй!") }
  );

  let box = document.getElementById("albBox");
  if (!box) {
    box = document.createElement("div"); box.id = "albBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:350px;background:#100c0e;border:1px solid #2b161c;border-radius:12px;padding:20px;z-index:120;display:none;flex-direction:column;gap:12px;color:#e6e2e3;font-family:sans-serif;overflow-y:auto";
    document.body.appendChild(box);
  }

  function showAlb(a) {
    act = a; box.style.display = "flex";
    const trs = a.tr.map(x => `<div style="background:#191114;border:1px solid #2e171d;padding:7px 10px;border-radius:6px;font-size:12px;margin-top:5px">${x}</div>`).join("");
    box.innerHTML = `<div style="display:flex;justify-content:space-between"><div><div style="font-size:10px;color:#c92a3e;font-weight:700">СПЛИН • ${a.y}</div><h2 style="font-size:20px;color:#fff">${a.n}</h2></div><button id="clsAlb" style="background:#1c1417;color:#aaa;border:1px solid #301c21;padding:4px 9px;border-radius:6px;cursor:pointer">✕</button></div><div style="background:#160f12;border-left:2px solid #c92a3e;padding:10px;font-size:13px;line-height:1.45">${a.d}</div><div><div style="font-size:10px;color:#7a6c70;font-weight:700">ТРЕКИ</div>${trs}</div><a href="https://spotify.com{encodeURIComponent("Сплин " + a.n)}" target="_blank" style="margin-top:auto;background:#c92a3e;color:#fff;text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Открыть в Spotify ↗</a>`;
    document.getElementById("clsAlb").onclick = () => { box.style.display = "none"; act = null; };
  }

  let sd = 1998; function rnd() { sd = (sd * 1664525 + 1013904223) % 4294967296; return sd / 4294967296; }
  const BG = new Array();
  for (let i = 0; i < 240; i++) {
    const ang = rnd() * 6.28, rad = Math.sqrt(rnd()) * 410, bx = Math.cos(ang) * rad * 1.15, by = Math.sin(ang) * rad * 0.85;
    if (ALB.some(a => Math.hypot(bx - a.x, by - a.y0) < a.rx + 25)) continue;
    BG.push({ bx: bx, by: by, x: bx, y: by, vx: 0, vy: 0, rx: 10 + rnd() * 6, ry: 6 + rnd() * 4, a: rnd() * 6.28, c: rnd() < 0.5 ? "#24090f" : "#330d16", p: rnd() * 6.28 });
  }

  vc.addEventListener("mousedown", e => { drag = true; moved = false; lx = e.clientX; ly = e.clientY; });
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; if (drag) { vox += e.clientX - lx; voy += e.clientY - ly; lx = e.clientX; ly = e.clientY; moved = true; } });
  window.addEventListener("mouseup", () => { if (drag && !moved && hov) showAlb(hov); drag = false; });
  vc.addEventListener("wheel", e => { e.preventDefault(); vsc = Math.min(2.2, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9))); }, { passive: false });

  function seed2D(x, y, rx, ry, a, fill, str, lw, line) {
    vx.save(); vx.translate(x, y); vx.rotate(a);
    vx.beginPath(); vx.moveTo(-rx, 0); vx.lineTo(-rx * 0.45, -ry * 0.9); vx.lineTo(rx * 0.48, -ry * 0.88);
    vx.lineTo(rx, 0); vx.lineTo(rx * 0.48, ry * 0.88); vx.lineTo(-rx * 0.45, ry * 0.9); vx.closePath();
    vx.fillStyle = fill; vx.fill();
    if (str) { vx.strokeStyle = str; vx.lineWidth = lw || 1; vx.stroke(); }
    if (line) { vx.beginPath(); vx.moveTo(-rx * 0.5, -ry * 0.15); vx.lineTo(rx * 0.35, -ry * 0.35); vx.strokeStyle = "rgba(255,255,255,0.3)"; vx.lineWidth = 1.3; vx.stroke(); }
    vx.restore();
  }

  function renderSpleen() {
    t += 0.018; vx.fillStyle = "#0a0809"; vx.fillRect(0, 0, vc.width, vc.height);
    vx.save(); vx.translate(vc.width / 2 + vox, vc.height / 2 + voy); vx.scale(vsc, vsc);
    const wx = (mx - (vc.width / 2 + vox)) / vsc, wy = (my - (vc.height / 2 + voy)) / vsc;
    hov = ALB.find(a => Math.hypot(wx - a.x, wy - a.y0) <= a.rx + 10);
    vc.style.cursor = hov ? "pointer" : "grab";

    for (let i = 0; i < BG.length; i++) {
      const s = BG[i], tx = s.bx + Math.cos(t + s.p) * 1.3, ty = s.by + Math.sin(t + s.p) * 1.3;
      const dx = s.x - wx, dy = s.y - wy, d = Math.hypot(dx, dy);
      if (d < 68 && d > 0.1) { const f = (1 - d / 68) * 3.2; s.vx += (dx / d) * f; s.vy += (dy / d) * f; }
      s.vx = (s.vx + (tx - s.x) * 0.08) * 0.8; s.vy = (s.vy + (ty - s.y) * 0.08) * 0.8;
      s.x += s.vx; s.y += s.vy;
      seed2D(s.x, s.y, s.rx, s.ry, s.a, s.c, "#140408", 1, false);
    }

    vx.beginPath();
    ALB.forEach((a, i) => i === 0 ? vx.moveTo(a.x, a.y0) : vx.lineTo(a.x, a.y0));
    vx.strokeStyle = "rgba(201,42,62,0.22)"; vx.lineWidth = 1; vx.setLineDash(new Array(4, 6)); vx.stroke(); vx.setLineDash(new Array());

    ALB.forEach(a => {
      const hi = (hov && hov.id === a.id) || (act && act.id === a.id), k = hi ? 1.14 : 1;
      if (hi) { vx.beginPath(); vx.arc(a.x, a.y0, a.rx + 13, 0, 6.28); vx.strokeStyle = "rgba(224,49,71,0.45)"; vx.lineWidth = 1; vx.stroke(); }
      seed2D(a.x, a.y0, a.rx * k, a.ry * k, a.a, hi ? "#d62839" : "#9e1929", hi ? "#ffccd2" : "#e0485a", hi ? 1.6 : 1.1, true);
      vx.font = "600 11.5px sans-serif"; vx.textAlign = "center"; vx.fillStyle = hi ? "#fff" : "#d4c8cb";
      vx.fillText(a.n, a.x, a.y0 + a.ry * k + 15);
      vx.font = "600 9.5px monospace"; vx.fillStyle = "#c92a3e"; vx.fillText(a.y, a.x, a.y0 + a.ry * k + 27);
    });

    vx.restore(); requestAnimationFrame(renderSpleen);
  }
  renderSpleen();
}
