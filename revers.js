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
    const leafList = new Array();

    function tokenizePath(str) {
      const out = new Array();
      let buf = "";
      for (let k = 0; k < str.length; k++) {
        const ch = str.charAt(k);
        const isLetter = (ch >= "A" && ch <= "Z") || (ch >= "a" && ch <= "z");
        if (isLetter && ch !== "e" && ch !== "E") {
          if (buf.length > 0) { out.push(buf); buf = ""; }
          out.push(ch);
        } else if (ch === "-" && buf.length > 0 && buf.charAt(buf.length - 1) !== "e" && buf.charAt(buf.length - 1) !== "E") {
          out.push(buf);
          buf = "-";
        } else if (ch === " " || ch === "," || ch === "\n" || ch === "\r" || ch === "\t") {
          if (buf.length > 0) { out.push(buf); buf = ""; }
        } else {
          buf += ch;
        }
      }
      if (buf.length > 0) out.push(buf);
      return out;
    }

    function extractAllSubPaths(dStr) {
      const tokens = tokenizePath(dStr);
      const res = new Array();
      let cur = new Array();
      let cx = 0, cy = 0, sx = 0, sy = 0, cmd = "", i = 0;

      while (i < tokens.length) {
        const t = tokens.at(i);
        if (t.length === 1 && ((t >= "A" && t <= "Z") || (t >= "a" && t <= "z"))) {
          cmd = t;
          i++;
          if (cmd === "Z" || cmd === "z") {
            cx = sx; cy = sy;
            cur.push("z");
          }
          continue;
        }
        if (cmd === "M" || cmd === "m") {
          if (cur.length > 0) { res.push(cur.join(" ")); cur = new Array(); }
          const x = parseFloat(tokens.at(i)), y = parseFloat(tokens.at(i + 1));
          i += 2;
          if (isNaN(x) || isNaN(y)) break;
          cx = (cmd === "M") ? x : cx + x;
          cy = (cmd === "M") ? y : cy + y;
          sx = cx; sy = cy;
          cur.push("M" + cx + " " + cy);
          cmd = (cmd === "M") ? "L" : "l";
        } else if (cmd === "L" || cmd === "l") {
          const x = parseFloat(tokens.at(i)), y = parseFloat(tokens.at(i + 1));
          i += 2;
          if (isNaN(x) || isNaN(y)) break;
          cx = (cmd === "L") ? x : cx + x;
          cy = (cmd === "L") ? y : cy + y;
          cur.push("L" + cx + " " + cy);
        } else if (cmd === "C" || cmd === "c") {
          const x1 = parseFloat(tokens.at(i)), y1 = parseFloat(tokens.at(i + 1));
          const x2 = parseFloat(tokens.at(i + 2)), y2 = parseFloat(tokens.at(i + 3));
          const x = parseFloat(tokens.at(i + 4)), y = parseFloat(tokens.at(i + 5));
          i += 6;
          if (isNaN(x1) || isNaN(y)) break;
          const ax1 = (cmd === "C") ? x1 : cx + x1, ay1 = (cmd === "C") ? y1 : cy + y1;
          const ax2 = (cmd === "C") ? x2 : cx + x2, ay2 = (cmd === "C") ? y2 : cy + y2;
          cx = (cmd === "C") ? x : cx + x;
          cy = (cmd === "C") ? y : cy + y;
          cur.push("C" + ax1 + " " + ay1 + " " + ax2 + " " + ay2 + " " + cx + " " + cy);
        } else {
          i++;
        }
      }
      if (cur.length > 0) res.push(cur.join(" "));
      return res;
    }

    // 1. Вытаскиваем каждый отдельный листик и глаз изнутри монолита как самостоятельный вектор!
    origPaths.forEach(function(orig) {
      const subs = extractAllSubPaths(orig.getAttribute("d") || "");
      subs.forEach(function(dSub) {
        if (dSub.length < 10) return;
        const p = document.createElementNS("http://w3.org", "path");
        p.setAttribute("d", dSub);
        grp.appendChild(p);
        const b = p.getBBox();
        const w = b.width * 0.1, h = b.height * 0.1;
        // Пропускаем гигантский внешний каркас — оставляем все отдельные листья и глаз!
        if (w > 250 || h > 250) {
          p.remove();
          return;
        }
        const cx = (b.x + b.width * 0.5) * 0.1;
        const cy = 592 - (b.y + b.height * 0.5) * 0.1;
        const len = Math.max(8, p.getTotalLength());
        const isEye = (w < 16 && h < 16 && Math.hypot(cx - 302, cy - 276) < 25);
        const dist = Math.hypot(cx - 296, cy - 275);

        p.setAttribute("stroke", isEye ? "#ffffff" : "#cfd6e6");
        p.setAttribute("fill", isEye ? "#ffffff" : "#9aa4b8");
        p.setAttribute("stroke-width", "6");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("stroke-dasharray", len.toFixed(1));
        p.setAttribute("stroke-dashoffset", len.toFixed(1));
        p.setAttribute("fill-opacity", "0");

        leafList.push({
          el: p,
          len: len,
          delay: isEye ? 1.15 : (1.55 + Math.min(2.4, dist / 95)),
          dur: isEye ? 0.5 : 0.75
        });
      });
      orig.remove();
    });

    // 2. Добавляем чистые векторные линии земли и силуэта ствола-человечка в том же масштабе (0..6000 x 0..5920)
    function makeStemPath(dStr, col, sw, delay, dur) {
      const p = document.createElementNS("http://w3.org", "path");
      p.setAttribute("d", dStr);
      p.setAttribute("fill", "none");
      p.setAttribute("stroke", col);
      p.setAttribute("stroke-width", sw);
      p.setAttribute("stroke-linecap", "round");
      p.setAttribute("stroke-linejoin", "round");
      grp.insertBefore(p, grp.firstChild);
      const len = Math.max(20, p.getTotalLength());
      p.setAttribute("stroke-dasharray", len.toFixed(1));
      p.setAttribute("stroke-dashoffset", len.toFixed(1));
      leafList.push({ el: p, len: len, delay: delay, dur: dur, isLine: true });
    }

    // Дуга земли (прорисовывается первой)
    makeStemPath("M480 780 Q2960 1580 5480 820", "#b8c1d4", "34", 0.05, 1.05);
    // Контур человечка снизу вверх (левая и правая линии тела)
    makeStemPath("M2820 1240 L2820 2580 Q2820 2980 2960 3180", "#ffffff", "32", 0.75, 1.0);
    makeStemPath("M3110 1240 L3110 2580 Q3110 2980 2960 3180", "#ffffff", "32", 0.75, 1.0);

    function playFrames() {
      cancelAnimationFrame(rafId);
      const t0 = performance.now();

      function tick(now) {
        const el = (now - t0) / 1000;
        let active = false;

        for (let i = 0; i < leafList.length; i++) {
          const it = leafList.at(i);
          if (el <= it.delay) {
            it.el.setAttribute("stroke-dashoffset", it.len.toFixed(1));
            if (!it.isLine) it.el.setAttribute("fill-opacity", "0");
            active = true;
          } else {
            const p = Math.min(1, (el - it.delay) / it.dur);
            const ease = 1 - Math.pow(1 - p, 2.4);
            it.el.setAttribute("stroke-dashoffset", (it.len * (1 - ease)).toFixed(1));
            if (!it.isLine) it.el.setAttribute("fill-opacity", ease.toFixed(2));
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
