window.launchKollekcionerScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#121014;border:1px solid #2b2533;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='rpSc' style='background:#231f2b;color:#ccc;border:none;padding:5px 9px;border-radius:6px;font-size:11px;cursor:pointer'>↻ Повторить выход</button><button id='inSc' style='background:#d4a359;color:#0b0a0d;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме (1996)</button></div>";

  let timers = new Array(), rafId = 0, hoveredIdx = -1;
  function clearTimers() {
    while (timers.length > 0) clearTimeout(timers.pop());
    cancelAnimationFrame(rafId);
  }

  document.getElementById("bkGr").onclick = function() {
    clearTimers();
    albScene.style.opacity = "0"; albScene.style.pointerEvents = "none";
    stage.style.opacity = "1"; stage.style.pointerEvents = "auto";
    box.style.display = "none"; if (tb) tb.style.display = "block";
  };
  document.getElementById("inSc").onclick = function() { showAlb(alb, true); };

  const sWrap = document.createElement("div");
  sWrap.style.cssText = "position:relative;width:min(86vh,86vw);height:min(86vh,86vw)";
  albScene.appendChild(sWrap);

  fetch("kollekcioner.svg?v=3").then(function(r) { return r.text(); }).then(function(txt) {
    sWrap.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = sWrap.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.removeAttribute("fill");

    const paths = Array.from(grp.querySelectorAll("path"));
    const palette = new Array("#e6dfd3", "#d4a359", "#c9bfa8", "#e0c389", "#b8ad96", "#d9b166", "#ded6c5", "#cfa663");

    const dancers = paths.map(function(p) {
      const b = p.getBBox();
      return { el: p, cx: b.x + b.width * 0.5, ready: false, baseCol: "#e6dfd3", phase: 0 };
    });

    // Сортируем все 8 фигур строго слева направо
    dancers.sort(function(a, b) { return a.cx - b.cx; });

    dancers.forEach(function(d, idx) {
      const col = palette.at(idx % palette.length);
      d.baseCol = col;
      d.phase = idx * 0.85;
      d.el.style.fill = col;
      d.el.style.transformBox = "fill-box";
      d.el.style.transformOrigin = "bottom center";
      d.el.style.cursor = "pointer";

      d.el.onmouseenter = function() {
        hoveredIdx = idx;
        d.el.style.fill = "#ffd07b";
        d.el.style.filter = "drop-shadow(0 0 22px rgba(242,184,92,0.85))";
      };
      d.el.onmouseleave = function() {
        hoveredIdx = -1;
        d.el.style.fill = d.baseCol;
        d.el.style.filter = "none";
      };
      d.el.onclick = function() { showAlb(alb, true); };
    });

    function startDanceLoop() {
      const t0 = performance.now();
      function loop(now) {
        const t = (now - t0) / 1000;
        for (let i = 0; i < dancers.length; i++) {
          const d = dancers.at(i);
          if (!d.ready) continue;
          const isHov = (hoveredIdx === i);
          const sway = Math.sin(t * 2.4 + d.phase) * 2.2;
          const bob = Math.abs(Math.cos(t * 2.4 + d.phase)) * -35;
          const lift = isHov ? -95 : bob;
          const sc = isHov ? 1.05 : 1;
          d.el.style.transform = "translateY(" + lift.toFixed(1) + "px) rotate(" + sway.toFixed(2) + "deg) scale(" + sc + ")";
        }
        rafId = requestAnimationFrame(loop);
      }
      rafId = requestAnimationFrame(loop);
    }

    function playEntrance() {
      clearTimers();
      dancers.forEach(function(d) {
        d.ready = false;
        d.el.style.transition = "none";
        d.el.style.opacity = "0";
        d.el.style.transform = "translateY(260px) scale(0.92)";
      });

      setTimeout(function() {
        dancers.forEach(function(d, idx) {
          const delay = idx * 0.22;
          timers.push(setTimeout(function() {
            d.el.style.transition = "opacity 0.6s ease, transform 0.75s cubic-bezier(.22,1.25,.36,1), fill 0.2s ease, filter 0.2s ease";
            d.el.style.opacity = "1";
            d.el.style.transform = "translateY(0px) scale(1)";
            timers.push(setTimeout(function() {
              d.el.style.transition = "fill 0.2s ease, filter 0.2s ease";
              d.ready = true;
            }, 760));
          }, delay * 1000));
        });
        startDanceLoop();
      }, 40);
    }

    document.getElementById("rpSc").onclick = playEntrance;
    playEntrance();
  });
};
