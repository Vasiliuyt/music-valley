{
  const vc = document.getElementById("vinylCv"), vx = vc.getContext("2d");
  let vox = 0, voy = 0, vsc = 1, drag = false, moved = false, lx = 0, ly = 0, mx = -999, my = -999, t = 0, hov = null, act = null;
  function rsz() { vc.width = innerWidth; vc.height = innerHeight; }
  window.addEventListener("resize", rsz); rsz();

  const ALB = new Array(
    { id: "dust", n: "Пыльная быль", y: "1994", x: -210, y0: -105, rx: 16, ry: 10, a: -0.4, d: "Дебютный альбом, записанный по ночам в петербургском театре «Буфф».", tr: new Array("Жертва талого льда", "Рыба без трусов", "Сказка") },
    { id: "lan", n: "Фонарь под глазом", y: "1997", x: -105, y0: 115, rx: 16, ry: 10, a: 0.5, d: "Прорывной альбом с флейтой, акустической меланхолией и нервом Питера.", tr: new Array("Англо-русский словарь", "Бонни и Клайд", "Частушки") },
    { id: "grn", n: "Гранатовый альбом", y: "1998", x: 0, y0: -10, rx: 18, ry: 11, a: -0.2, d: "Главный стадионный рывок конца 90-х с жёстким гитарным саундом.", tr: new Array("Орбит без сахара", "Выхода нет", "Весь этот бред") },
    { id: "alt", n: "Альтависта", y: "1999", x: 115, y0: -130, rx: 16, ry: 10, a: 0.35, d: "Тяжёлый, психоделический поворот после успеха «Гранатового альбома».", tr: new Array("Молоко и мёд", "Альтависта", "Пил-курил") },
    { id: "k25", n: "25-й кадр", y: "2001", x: 145, y0: 90, rx: 17, ry: 10.5, a: -0.55, d: "Один из самых плотных по хитам альбомов 2000-х в обновлённом составе.", tr: new Array("Линия жизни", "Моё сердце", "Остаёмся зимовать", "Феллини") },
    { id: "new", n: "Новые люди", y: "2003", x: -10, y0: 175, rx: 16, ry: 10, a: 0.25, d: "Минималистичный и нервный альбом-наблюдение за меняющимся городом.", tr: new Array("Новые люди", "Время, назад!", "Гандбол") },
    { id: "spl", n: "Раздвоение личности", y: "2007", x: 245, y0: -25, rx: 16, ry: 10, a: 0.65, d: "Двойной концептуальный альбом на стыке арт-рока и психоделии.", tr: new Array("Скажи", "Маяк", "Мама мия") },
    { id: "res", n: "Резонанс", y: "2014", x: -245, y0: 40, rx: 16, ry: 10, a: -0.7, d: "Двухчастный философский цикл зрелого «Сплина».", tr: new Array("Рай в шалаше", "Оркестр", "Танцуй!") }
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
  for (let i = 0; i < 420; i++) {
    const ang = rnd() * 6.28, rad = Math.sqrt(rnd()) * 460, bx = Math.cos(ang) * rad * 1.25, by = Math.sin(ang) * rad * 0.88;
    if (ALB.some(a => Math.hypot(bx - a.x, by - a.y0) < a.rx + 18)) continue;
    BG.push({ bx: bx, by: by, x: bx, y: by, vx: 0, vy: 0, rx: 12 + rnd() * 6, ry: 7.5 + rnd() * 4, a: rnd() * 6.28, c: rnd() < 0.5 ? "#380d17" : "#4a111f", p: rnd() * 6.28 });
  }

  vc.addEventListener("mousedown", e => { drag = true; moved = false; lx = e.clientX; ly = e.clientY; });
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; if (drag) { vox += e.clientX - lx; voy += e.clientY - ly; lx = e.clientX; ly = e.clientY; moved = true; } });
  window.addEventListener("mouseup", () => { if (drag && !moved && hov) showAlb(hov); drag = false; });
  vc.addEventListener("wheel", e => { e.preventDefault(); vsc = Math.min(2.2, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9))); }, { passive: false });

  // Гладкая органическая форма зерна граната (без углов и без градиентов)
  function smoothSeed2D(x, y, rx, ry, a, fill, str, lw, active) {
    vx.save(); vx.translate(x, y); vx.rotate(a);
    vx.beginPath();
    vx.moveTo(-rx, 0);
    vx.bezierCurveTo(-rx * 0.9, -ry * 1.05, rx * 0.35, -ry * 1.15, rx, 0);
    vx.bezierCurveTo(rx * 0.35, ry * 1.15, -rx * 0.9, ry * 1.05, -rx, 0);
    vx.closePath();
    vx.fillStyle = fill; vx.fill();
    if (str) { vx.strokeStyle = str; vx.lineWidth = lw || 1; vx.stroke(); }

    // Тонкий плоский блик-дуга внутри каждого зерна
    vx.beginPath();
    vx.arc(-rx * 0.15, -ry * 0.12, rx * 0.48, -2.5, -0.7);
    vx.strokeStyle = active ? "rgba(255, 220, 225, 0.55)" : "rgba(255, 130, 150, 0.14)";
    vx.lineWidth = active ? 1.5 : 1.1;
    vx.stroke();
    vx.restore();
  }

  function renderSpleen() {
    t += 0.018; vx.fillStyle = "#080607"; vx.fillRect(0, 0, vc.width, vc.height);
    vx.save(); vx.translate(vc.width / 2 + vox, vc.height / 2 + voy); vx.scale(vsc, vsc);
    const wx = (mx - (vc.width / 2 + vox)) / vsc, wy = (my - (vc.height / 2 + voy)) / vsc;
    hov = ALB.find(a => Math.hypot(wx - a.x, wy - a.y0) <= a.rx + 10);
    vc.style.cursor = hov ? "pointer" : "grab";

    // Единый спокойный ковёр зёрен
    for (let i = 0; i < BG.length; i++) {
      const s = BG[i], tx = s.bx + Math.cos(t + s.p) * 1.2, ty = s.by + Math.sin(t + s.p) * 1.2;
      const dx = s.x - wx, dy = s.y - my, d = Math.hypot(dx, dy);
      if (d < 65 && d > 0.1) { const f = (1 - d / 65) * 3; s.vx += (dx / d) * f; s.vy += (dy / d) * f; }
      s.vx = (s.vx + (tx - s.x) * 0.08) * 0.8; s.vy = (s.vy + (ty - s.y) * 0.08) * 0.8;
      s.x += s.vx; s.y += s.vy;
      smoothSeed2D(s.x, s.y, s.rx, s.ry, s.a, s.c, "#1a050a", 1, false);
    }

    // Зёрна-альбомы: в покое сливаются с общим ковром, загораются ТОЛЬКО при наведении или выборе!
    ALB.forEach(a => {
      const hi = (hov && hov.id === a.id) || (act && act.id === a.id);
      const k = hi ? 1.18 : 1;
      const fill = hi ? "#c92a3e" : "#44101c";
      const stroke = hi ? "#ffccd2" : "#1a050a";
      smoothSeed2D(a.x, a.y0, a.rx * k, a.ry * k, a.a, fill, stroke, hi ? 1.5 : 1, hi);

      if (hi) {
        vx.font = "600 12px -apple-system, sans-serif";
        vx.textAlign = "center";
        vx.fillStyle = "#ffffff";
        vx.fillText(a.n + " (" + a.y + ")", a.x, a.y0 - a.ry * k - 10);
      }
    });

    vx.restore(); requestAnimationFrame(renderSpleen);
  }
  renderSpleen();
}
