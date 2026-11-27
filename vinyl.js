const host = document.getElementById("vinylView");
const oldCv = document.getElementById("vinylCv");
if (oldCv) oldCv.style.display = "none";

const stage = document.createElement("div");
stage.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:grab;background:#080607;transition:opacity .5s";
host.appendChild(stage);

const albScene = document.createElement("div");
albScene.style.cssText = "position:fixed;inset:0;z-index:90;opacity:0;pointer-events:none;transition:opacity .5s;background:#0b0c10;display:flex;align-items:center;justify-content:center;overflow:hidden";
host.appendChild(albScene);

let vox = 0, voy = 0, vsc = 1, drag = false, lx = 0, ly = 0, mx = -9999, my = -9999;

const ALB = new Array(
  { t: "Пыльная быль", y: "1994", e: "«Жертва талого льда»", s: "Дебют, записанный по ночам в театре «Буфф»." },
  { t: "Коллекционер оружия", y: "1996", e: "«Будь моей тенью»", s: "Московский дебют при поддержке БГ." },
  { t: "Фонарь под глазом", y: "1997", e: "«Англо-русский словарь»", s: "Переход к нервному гитарному саунду с флейтой." },
  { t: "Гранатовый альбом", y: "1998", e: "«Орбит без сахара» • «Выхода нет»", s: "Главный стадионный прорыв конца 90-х." },
  { t: "Альтависта", y: "1999", e: "«Молоко и мёд»", s: "Тяжёлый психоделический разворот." },
  { t: "25-й кадр", y: "2001", e: "«Линия жизни» • «Феллини»", s: "Возвращение к мелодизму и тур с «БИ-2»." },
  { t: "Новые люди", y: "2003", e: "«Новые люди» • «Время, назад!»", s: "Нервный альбом-наблюдение за Петербургом." },
  { t: "Реверсивная хроника событий", y: "2004", svg: "revers.svg", e: "«Романс» • «Мы сидели и курили»", s: "Камерный минимализм, где вышел «Романс»." },
  { t: "Раздвоение личности", y: "2007", e: "«Маяк» • «Скажи»", s: "Двойной альбом и стихи Маяковского." },
  { t: "Сигнал из космоса", y: "2009", e: "«Вниз головой»", s: "Светлый альбом с духовой секцией." },
  { t: "Обман зрения", y: "2012", e: "«Конец прекрасной эпохи»", s: "Песни на стихи Бродского и Башлачёва." },
  { t: "Резонанс", y: "2014", e: "«Рай в шалаше» • «Оркестр»", s: "Двухчастный философский цикл." },
  { t: "Ключ к шифру", y: "2016", e: "«Храм» • «Окраины»", s: "Электронно-гитарный альбом с трип-хоп-битами." },
  { t: "Встречная полоса", y: "2018", e: "«Булгаковский марш»", s: "Записан на «Добролёте» с отсылками к Булгакову." },
  { t: "Вира и майна", y: "2020", e: "«За семью печатями»", s: "Блюз-рок и зрелая меланхолия." }
);
const box = document.createElement("div");
box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:340px;background:#120b0d;border:1px solid #381820;border-radius:12px;padding:20px;z-index:130;display:none;flex-direction:column;gap:12px;color:#ede6e8;font-family:sans-serif";
document.body.appendChild(box);

function showAlb(a, dark) {
  box.style.display = "flex";
  const ac = dark ? "#8fa3c7" : "#e02e31";
  const q = encodeURIComponent("Сплин " + a.t);
  box.innerHTML = "<div style='display:flex;justify-content:space-between'><div><div style='font-size:10px;color:" + ac + ";font-weight:700'>СПЛИН • " + a.y + "</div><h2 style='font-size:20px;color:#fff'>" + a.t + "</h2></div><button id='clsB' style='background:#222;color:#fff;border:none;padding:4px 9px;border-radius:6px;cursor:pointer'>✕</button></div><div style='background:rgba(255,255,255,.04);padding:10px;border-radius:8px'><div style='font-size:9px;color:" + ac + ";font-weight:700'>ТОЧКА ВХОДА</div><div style='font-size:13px;font-weight:600;color:#fff;margin-top:3px'>" + a.e + "</div></div><div style='border-left:2px solid " + ac + ";padding-left:10px;font-size:12.5px;line-height:1.45;color:#ccc'>" + a.s + "</div><div style='margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px'><a href='https://yandex.ru" + q + "' target='_blank' style='background:#ffcc00;color:#000;text-align:center;padding:9px;border-radius:7px;text-decoration:none;font-weight:700;font-size:12px'>Яндекс Музыка</a><a href='https://vk.com" + q + "' target='_blank' style='background:#222;color:#fff;text-align:center;padding:9px;border-radius:7px;text-decoration:none;font-size:12px'>VK Музыка</a></div>";
  document.getElementById("clsB").onclick = function() { box.style.display = "none"; };
}

let leafItems = new Array(), sTick = 0, sWrap = null, timers = new Array();

function openScene(alb) {
  if (window.launchReversScene) window.launchReversScene(alb, albScene, stage, box, showAlb);
}
const wrap = document.createElement("div");
wrap.style.cssText = "position:relative;width:min(82vh,82vw);height:min(82vh,82vw);transform-origin:center center";
stage.appendChild(wrap);

const tip = document.createElement("div");
tip.style.cssText = "position:fixed;pointer-events:none;background:#100a0c;border:1px solid #e02e31;color:#fff;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:600;z-index:130;display:none";
document.body.appendChild(tip);

const seeds = new Array();

fetch("granat.svg").then(function(r) { return r.text(); }).then(function(txt) {
  wrap.innerHTML = txt.slice(txt.indexOf("<svg"));
  const svg = wrap.querySelector("svg");
  if (!svg) return;
  svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
  const all = Array.from(svg.querySelectorAll("path"));
  const shell = all.shift();
  if (shell) { shell.style.fill = "#b82328"; shell.style.pointerEvents = "none"; }

  const sPaths = all.filter(function(p) { const b = p.getBBox(); return b.width > 80 && b.height > 80; }).sort(function(p1, p2) {
    const b1 = p1.getBBox(), b2 = p2.getBBox(); return (b2.y - b1.y) * 0.6 + (b1.x - b2.x) * 0.4;
  });

  const step = Math.max(1, Math.floor(sPaths.length / ALB.length));
  let ai = 0;
  sPaths.forEach(function(p, idx) {
    const b = p.getBBox();
    seeds.push({ el: p, cx: (b.x + b.width * 0.5) * 0.1, cy: 350 - (b.y + b.height * 0.5) * 0.1, dx: 0, dy: 0, vx: 0, vy: 0 });
    p.style.transition = "fill .2s,filter .2s";
    if (idx % step === 0 && ai < ALB.length) {
      const a = ALB.at(ai++);
      p.style.fill = a.svg ? "#ff4d54" : "#eb363c"; p.style.cursor = "pointer";
      p.onmouseenter = function() { p.style.fill = "#ff787d"; p.style.filter = "drop-shadow(0 0 18px rgba(255,95,105,.9))"; tip.textContent = a.t + " • " + a.y + (a.svg ? " ▶" : ""); tip.style.display = "block"; };
      p.onmousemove = function(e) { tip.style.left = (e.clientX + 14) + "px"; tip.style.top = (e.clientY - 14) + "px"; };
      p.onmouseleave = function() { p.style.fill = a.svg ? "#ff4d54" : "#eb363c"; p.style.filter = "none"; tip.style.display = "none"; };
      p.onclick = function(e) { e.stopPropagation(); tip.style.display = "none"; a.svg ? openScene(a) : showAlb(a, false); };
    } else {
      p.style.fill = "#9e1c22";
      p.onmouseenter = function() { p.style.fill = "#c4252c"; };
      p.onmouseleave = function() { p.style.fill = "#9e1c22"; };
    }
  });
});

function loopAll() {
  if (stage.style.pointerEvents !== "none" && seeds.length > 0) {
    const rc = wrap.getBoundingClientRect();
    if (rc.width > 0) {
      const sx = ((mx - rc.left) / rc.width) * 350, sy = ((my - rc.top) / rc.height) * 350;
      for (let i = 0; i < seeds.length; i++) {
        const s = seeds.at(i), dx = s.cx - sx, dy = s.cy - sy, d = Math.hypot(dx, dy);
        let tx = 0, ty = 0;
        if (d < 46 && d > 0.1) { const f = (1 - d / 46) * 42; tx = (dx / d) * f; ty = -(dy / d) * f; }
        s.vx = (s.vx + (tx - s.dx) * 0.16) * 0.72; s.vy = (s.vy + (ty - s.dy) * 0.16) * 0.72;
        s.dx += s.vx; s.dy += s.vy;
        s.el.style.transform = (Math.abs(s.dx) > 0.05 || Math.abs(s.dy) > 0.05) ? "translate(" + s.dx.toFixed(2) + "px," + s.dy.toFixed(2) + "px)" : "";
      }
    }
  }
  sTick += 0.03;
  if (albScene.style.pointerEvents === "auto" && leafItems.length > 0 && sWrap) {
    const rc = sWrap.getBoundingClientRect();
    const sx = rc.width > 0 ? ((mx - rc.left) / rc.width) * 600 : -9999, sy = rc.height > 0 ? ((my - rc.top) / rc.height) * 592 : -9999;
    for (let i = 0; i < leafItems.length; i++) {
      const l = leafItems.at(i); if (!l.ready) continue;
      const wx = Math.sin(sTick + l.ph) * 7, wy = Math.cos(sTick * 0.8 + l.ph) * 4;
      const dx = l.cx - sx, dy = l.cy - sy, d = Math.hypot(dx, dy);
      let px = 0, py = 0;
      if (d < 60 && d > 0.1) { const f = (1 - d / 60) * 45; px = (dx / d) * f; py = -(dy / d) * f; }
      l.vx = (l.vx + (wx + px - l.dx) * 0.14) * 0.76; l.vy = (l.vy + (wy + py - l.dy) * 0.14) * 0.76;
      l.dx += l.vx; l.dy += l.vy;
      l.el.style.transform = "translate(" + l.dx.toFixed(2) + "px," + l.dy.toFixed(2) + "px)";
    }
  }
  requestAnimationFrame(loopAll);
}
loopAll();

stage.onmousedown = function(e) { drag = true; lx = e.clientX; ly = e.clientY; stage.style.cursor = "grabbing"; };
window.addEventListener("mousemove", function(e) { mx = e.clientX; my = e.clientY; if (!drag) return; vox += e.clientX - lx; voy += e.clientY - ly; lx = e.clientX; ly = e.clientY; wrap.style.transform = "translate(" + vox + "px," + voy + "px) scale(" + vsc + ")"; });
window.addEventListener("mouseup", function() { drag = false; stage.style.cursor = "grab"; });
stage.onwheel = function(e) { e.preventDefault(); vsc = Math.min(2.6, Math.max(0.6, vsc * (e.deltaY < 0 ? 1.1 : 0.9))); wrap.style.transform = "translate(" + vox + "px," + voy + "px) scale(" + vsc + ")"; };
