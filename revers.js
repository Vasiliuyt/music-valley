window.launchReversScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#111318;border:1px solid #252934;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='rpSc' style='background:#222630;color:#ccc;border:none;padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer'>↻ Повторить</button><button id='inSc' style='background:#8fa3c7;color:#08090c;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме</button></div>";

  let rafId = 0;

  document.getElementById("bkGr").onclick = function() {
    cancelAnimationFrame(rafId);
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

    const origPaths = Array.from(grp.querySelectorAll("path"));
    const items = new Array();

    origPaths.forEach(function(orig) {
      const parts = (orig.getAttribute("d") || "").split("M");
      for (let i = 1; i < parts.length; i++) {
        const ch = "M" + parts.at(i).trim();
        if (ch.length < 8) continue;
        const p = document.createElementNS("http://w3.org", "path");
        p.setAttribute("d", ch);
        p.setAttribute("pathLength", "100");
        p.setAttribute("stroke-dasharray", "100");
        p.setAttribute("stroke-dashoffset", "100");
        p.setAttribute("stroke-width", "6");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("stroke-linejoin", "round");
        p.setAttribute("fill-opacity", "0");
        grp.appendChild(p);

        const b = p.getBBox();
        const cx = (b.x + b.width * 0.5) * 0.1;
        const cy = 592 - (b.y + b.height * 0.5) * 0.1;
        const w = b.width * 0.1, h = b.height * 0.1;

        let delay = 0, dur = 0.8, col = "#d8dde8";
        if (w > 220 && cy > 415) {
          delay = 0.05; dur = 1.0; col = "#b8c1d4"; // 1. Земля
        } else if ((h > 130 && cy > 230) || (w < 18 && h < 18 && Math.hypot(cx - 302, cy - 276) < 25)) {
          delay = 0.85; dur = 1.2; col = "#ffffff"; // 2. Человечек и глаз
        } else {
          const dist = Math.hypot(cx - 296, cy - 275);
          delay = 1.7 + Math.min(2.4, dist / 95);    // 3. Листья от головы наружу
          dur = 0.75;
          col = "#cfd6e6";
        }

        p.setAttribute("stroke", col);
        p.setAttribute("fill", col);
        items.push({ el: p, delay: delay, dur: dur });
      }
      orig.remove();
    });

    function playFrames() {
      cancelAnimationFrame(rafId);
      const t0 = performance.now();

      function tick(now) {
        const el = (now - t0) / 1000;
        let active = false;

        for (let i = 0; i < items.length; i++) {
          const it = items.at(i);
          if (el <= it.delay) {
            it.el.setAttribute("stroke-dashoffset", "100");
            it.el.setAttribute("fill-opacity", "0");
            active = true;
          } else {
            const p = Math.min(1, (el - it.delay) / it.dur);
            const ease = 1 - Math.pow(1 - p, 2.4);
            it.el.setAttribute("stroke-dashoffset", (100 * (1 - ease)).toFixed(1));
            it.el.setAttribute("fill-opacity", ease.toFixed(2));
            if (p < 1) active = true;
          }
        }

        if (active) rafId = requestAnimationFrame(tick);
      }

      rafId = requestAnimationFrame(tick);
    }

    document.getElementById("rpSc").onclick = playFrames;
    playFrames();
  });
};
