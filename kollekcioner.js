window.launchKollekcionerScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#121014;border:1px solid #2b2533;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='inSc' style='background:#d4a359;color:#0b0a0d;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме (1996)</button></div>";

  let rafId = 0;

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

  fetch("kollekcioner.svg?v=5").then(function(r) { return r.text(); }).then(function(txt) {
    sWrap.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = sWrap.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.removeAttribute("fill");

    const paths = Array.from(grp.querySelectorAll("path"));
    const frames = paths.map(function(p) {
      const b = p.getBBox();
      return { el: p, cx: b.x + b.width * 0.5, d: p.getAttribute("d") };
    });

    // Сортируем 8 фаз шага слева направо
    frames.sort(function(a, b) { return a.cx - b.cx; });

    // Создаём 3 идущих друг за другом кино-персонажа, каждый проигрывает все 8 фаз шага по кругу
    const palette = new Array("#e6dfd3", "#d4a359", "#c9bfa8");
    const actors = new Array();

    for (let k = 0; k < 3; k++) {
      const actorPath = document.createElementNS("http://w3.org", "path");
      actorPath.style.fill = palette.at(k);
      actorPath.style.cursor = "pointer";
      actorPath.style.transition = "filter 0.2s ease";
      actorPath.onmouseenter = function() { actorPath.style.filter = "drop-shadow(0 0 22px rgba(242,184,92,0.85))"; };
      actorPath.onmouseleave = function() { actorPath.style.filter = "none"; };
      actorPath.onclick = function() { showAlb(alb, true); };
      grp.appendChild(actorPath);
      actors.push({ el: actorPath, offsetX: k * 2100, phaseOffset: k * 2.6 });
    }

    // Скрываем исходные статичные контуры
    frames.forEach(function(f) { f.el.style.display = "none"; });

    const t0 = performance.now();
    const fps = 9.5; // скорость смены фаз шага (кадров в секунду)

    function cinemaLoop(now) {
      const t = (now - t0) / 1000;

      for (let k = 0; k < actors.length; k++) {
        const act = actors.at(k);
        const frameFloat = t * fps + act.phaseOffset;
        const idx = Math.floor(frameFloat) % frames.length;
        const curFrame = frames.at(idx);

        // Ставим текущую фазу шага и плавно ведем персонажа через сцену
        act.el.setAttribute("d", curFrame.d);
        const walkPos = ((t * 580 + act.offsetX) % 6600) - 600;
        const dx = walkPos - curFrame.cx;
        act.el.setAttribute("transform", "translate(" + dx.toFixed(1) + ", 0)");
      }

      rafId = requestAnimationFrame(cinemaLoop);
    }

    rafId = requestAnimationFrame(cinemaLoop);
  });
};
