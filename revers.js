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

    // Собираем ВСЕ пути (и основной контур, и глаз) и разрезаем каждый на отдельные штрихи
    const origPaths = Array.from(grp.querySelectorAll("path"));
    const allSubs = new Array();

    origPaths.forEach(function(orig) {
      const parts = (orig.getAttribute("d") || "").split("M");
      for (let i = 1; i < parts.length; i++) {
        const ch = "M" + parts.at(i).trim();
        if (ch.length < 8) continue;
        const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
        p.setAttribute("d", ch);
        grp.appendChild(p);
        const b = p.getBBox();
        const cx = (b.x + b.width * 0.5) * 0.1;
        const cy = 592 - (b.y + b.height * 0.5) * 0.1;
        const len = Math.max(10, p.getTotalLength());
        allSubs.push({ el: p, cx: cx, cy: cy, w: b.width * 0.1, h: b.height * 0.1, len: len });
      }
      orig.remove();
    });

    // Сортируем все элементы по очереди прорисовки:
    // 1. Земля (самый низ) -> 2. Человечек и глаз (центр) -> 3. Листья от головы наружу
    const ground = new Array(), human = new Array(), crown = new Array();
    allSubs.forEach(function(it) {
      if (it.w > 220 && it.cy > 415) {
        ground.push(it);
      } else if ((it.h > 130 && it.cy > 230) || (it.w < 18 && it.h < 18 && Math.hypot(it.cx - 302, it.cy - 276) < 25)) {
        human.push(it);
      } else {
        it.dist = Math.hypot(it.cx - 296, it.cy - 275);
        crown.push(it);
      }
    });
    crown.sort(function(a, b) { return a.dist - b.dist; });

    function resetAll(list, strokeCol, fillCol) {
      list.forEach(function(it) {
        it.el.style.transition = "none";
        it.el.style.stroke = strokeCol;
        it.el.style.strokeWidth = "4.5";
        it.el.style.strokeLinecap = "round";
        it.el.style.strokeLinejoin = "round";
        it.el.style.fill = fillCol;
        it.el.style.fillOpacity = "0";
        it.el.style.strokeDasharray = it.len;
        it.el.style.strokeDashoffset = it.len;
      });
    }

    function animateGroup(list, startSec, spanSec, durSec) {
      const n = Math.max(1, list.length);
      list.forEach(function(it, idx) {
        const delay = startSec + (idx / n) * spanSec;
        timers.push(setTimeout(function() {
          it.el.style.transition = "stroke-dashoffset " + durSec + "s cubic-bezier(.25,.8,.25,1), fill-opacity .45s ease " + (durSec * 0.75).toFixed(2) + "s";
          it.el.style.strokeDashoffset = "0";
          it.el.style.fillOpacity = "1";
        }, delay * 1000));
      });
    }

    function playLineDraw() {
      clearTimers();
      // Сбрасываем ВСЁ в невидимое состояние до старта
      resetAll(ground, "#b8c1d4", "#b8c1d4");
      resetAll(human, "#ffffff", "#ffffff");
      resetAll(crown, "#cfd6e6", "#d8dde8");

      // Запускаем пошаговую прорисовку контуров
      setTimeout(function() {
        animateGroup(ground, 0.05, 0.1, 1.0);
        animateGroup(human, 0.85, 0.25, 1.35);
        animateGroup(crown, 1.85, 2.2, 0.85);
      }, 40);
    }

    document.getElementById("rpSc").onclick = playLineDraw;
    playLineDraw();
  });
};
