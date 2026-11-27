window.launchKollekcionerScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#121014;border:1px solid #2b2533;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='inSc' style='background:#d4a359;color:#0b0a0d;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме (1996)</button></div>";

  let rafId = 0, hoveredIdx = -1;

  document.getElementById("bkGr").onclick = function() {
    cancelAnimationFrame(rafId);
    albScene.style.opacity = "0"; albScene.style.pointerEvents = "none";
    stage.style.opacity = "1"; stage.style.pointerEvents = "auto";
    box.style.display = "none"; if (tb) tb.style.display = "block";
  };
  document.getElementById("inSc").onclick = function() { showAlb(alb, true); };

  const sWrap = document.createElement("div");
  sWrap.style.cssText = "position:relative;width:min(88vh,88vw);height:min(88vh,88vw)";
  albScene.appendChild(sWrap);

  fetch("kollekcioner.svg?v=4").then(function(r) { return r.text(); }).then(function(txt) {
    sWrap.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = sWrap.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.removeAttribute("fill");

    const paths = Array.from(grp.querySelectorAll("path"));
    const palette = new Array("#e6dfd3", "#d4a359", "#c9bfa8", "#e0c389", "#b8ad96", "#d9b166", "#ded6c5", "#cfa663");

    const walkers = paths.map(function(p) {
      const b = p.getBBox();
      return { el: p, cx: b.x + b.width * 0.5, baseCol: "#e6dfd3", phase: 0 };
    });

    walkers.sort(function(a, b) { return a.cx - b.cx; });

    walkers.forEach(function(w, idx) {
      const col = palette.at(idx % palette.length);
      w.baseCol = col;
      w.phase = idx * 0.85;
      w.el.style.fill = col;
      w.el.style.transformBox = "fill-box";
      w.el.style.transformOrigin = "bottom center";
      w.el.style.cursor = "pointer";
      w.el.style.transition = "fill 0.2s ease, filter 0.2s ease";

      w.el.onmouseenter = function() {
        hoveredIdx = idx;
        w.el.style.fill = "#ffd07b";
        w.el.style.filter = "drop-shadow(0 0 22px rgba(242,184,92,0.85))";
      };
      w.el.onmouseleave = function() {
        hoveredIdx = -1;
        w.el.style.fill = w.baseCol;
        w.el.style.filter = "none";
      };
      w.el.onclick = function() { showAlb(alb, true); };
    });

    const t0 = performance.now();
    const span = 6800;

    function walkLoop(now) {
      const t = (now - t0) / 1000;
      const march = (t * 420) % span;

      for (let i = 0; i < walkers.length; i++) {
        const w = walkers.at(i);
        const isHov = (hoveredIdx === i);

        // Непрерывный шаг слева направо с плавным переносом в начало колонны
        let shiftX = march;
        if (w.cx + shiftX > 6400) shiftX -= span;

        // Физика шага: подпрыгивание на каждом шаге, наклон корпуса вперёд и пружина коленей
        const stepCycle = t * 5.2 + w.phase;
        const bounce = Math.abs(Math.sin(stepCycle)) * -85;
        const lean = 4.5 + Math.sin(stepCycle * 2) * 2.8;
        const squashY = 1 + Math.abs(Math.sin(stepCycle)) * 0.045;
        const squashX = 1 - Math.abs(Math.sin(stepCycle)) * 0.025;
        const sc = isHov ? 1.07 : 1;

        w.el.style.transform =
          "translate(" + shiftX.toFixed(1) + "px, " + (bounce + (isHov ? -50 : 0)).toFixed(1) + "px) " +
          "rotate(" + lean.toFixed(2) + "deg) " +
          "scale(" + (squashX * sc).toFixed(3) + ", " + (squashY * sc).toFixed(3) + ")";
      }

      rafId = requestAnimationFrame(walkLoop);
    }

    rafId = requestAnimationFrame(walkLoop);
  });
};
