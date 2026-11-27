window.launchReversScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#111318;border:1px solid #252934;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='rpSc' style='background:#222630;color:#ccc;border:none;padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer'>↻ Повторить</button><button id='inSc' style='background:#8fa3c7;color:#08090c;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме</button></div>";

  let timers = new Array();
  function clearTimers() { while (timers.length > 0) clearTimeout(timers.pop()); }

  document.getElementById("bkGr").onclick = function() {
    clearTimers();
    albScene.style.opacity = "0"; albScene.style.pointerEvents = "none";
    stage.style.opacity = "1"; stage.style.pointerEvents = "auto";
    box.style.display = "none"; if (tb) tb.style.display = "block";
  };
  document.getElementById("inSc").onclick = function() { showAlb(alb, true); };

  const sWrap = document.createElement("div");
  sWrap.style.cssText = "position:relative;width:min(82vh,82vw);height:min(82vh,82vw)";
  albScene.appendChild(sWrap);

  fetch(alb.svg).then(function(r) { return r.text(); }).then(function(txt) {
    sWrap.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = sWrap.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.removeAttribute("fill");

    const orig = grp.querySelector("path");
    const parts = (orig ? orig.getAttribute("d") : "").split("M");
    const allSubs = new Array();

    for (let i = 1; i < parts.length; i++) {
      const ch = "M" + parts.at(i).trim();
      if (ch.length < 10) continue;
      const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
      p.setAttribute("d", ch);
      grp.appendChild(p);
      const b = p.getBBox();
      const cx = (b.x + b.width * 0.5) * 0.1;
      const cy = 592 - (b.y + b.height * 0.5) * 0.1;
      const len = p.getTotalLength();
      allSubs.push({ el: p, cx: cx, cy: cy, w: b.width * 0.1, h: b.height * 0.1, len: len });
    }
    if (orig) orig.remove();

    // Разделяем контуры: 1) Земля, 2) Человечек, 3) Каждый отдельный лист кроны
    const ground = new Array(), human = new Array(), crown = new Array();
    allSubs.forEach(function(it) {
      if (it.w > 220 && it.cy > 415) ground.push(it);
      else if (it.h > 130 && it.cy > 230) human.push(it);
      else {
        it.dist = Math.hypot(it.cx - 296, it.cy - 275);
        crown.push(it);
      }
    });
    crown.sort(function(a, b) { return a.dist - b.dist; });

    function drawStroke(list, baseDelay, stepSpan, drawDur, strokeCol, fillCol) {
      const n = Math.max(1, list.length);
      list.forEach(function(it, idx) {
        const d = baseDelay + (idx / n) * stepSpan;
        it.el.style.transition = "none";
        it.el.style.stroke = strokeCol;
        it.el.style.strokeWidth = "14";
        it.el.style.strokeLinecap = "round";
        it.el.style.fill = fillCol;
        it.el.style.fillOpacity = "0";
        it.el.style.strokeDasharray = it.len;
        it.el.style.strokeDashoffset = it.len;

        timers.push(setTimeout(function() {
          it.el.style.transition = "stroke-dashoffset " + drawDur + "s cubic-bezier(.25,.8,.25,1), fill-opacity .45s ease " + (drawDur * 0.65).toFixed(2) + "s";
          it.el.style.strokeDashoffset = "0";
          it.el.style.fillOpacity = "1";
        }, d * 1000));
      });
    }

    function playLineDraw() {
      clearTimers();
      // 1. Прорисовывается линия земли (0.0с)
      drawStroke(ground, 0.05, 0.1, 0.95, "#b8c1d4", "#b8c1d4");
      // 2. Вырисовывается силуэт человечка (0.7с)
      drawStroke(human, 0.75, 0.15, 1.15, "#ffffff", "#ffffff");
      // 3. Волна от головы к краям кроны: каждый листочек прорисовывается своим контуром! (1.5с)
      drawStroke(crown, 1.55, 1.85, 0.75, "#cfd6e6", "#d8dde8");
    }

    document.getElementById("rpSc").onclick = playLineDraw;
    playLineDraw();
  });
};
