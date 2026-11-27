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

    function splitSubPaths(dStr) {
      const clean = dStr
        .replace(/([MmLlCcZz])/g, " $1 ")
        .replace(/([0-9])-/g, "$1 -")
        .replace(/,/g, " ")
        .trim();
      const tokens = clean.split(/\s+/);

      const res = new Array();
      let cur = new Array();
      let cx = 0, cy = 0, sx = 0, sy = 0, cmd = "", i = 0;

      function isCmd(tok) {
        return tok === "M" || tok === "m" || tok === "L" || tok === "l" || tok === "C" || tok === "c" || tok === "Z" || tok === "z";
      }

      while (i < tokens.length) {
        const t = tokens.at(i);
        if (isCmd(t)) {
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

    origPaths.forEach(function(orig) {
      const subs = splitSubPaths(orig.getAttribute("d") || "");
      subs.forEach(function(dSub) {
        if (dSub.length < 10) return;
        const p = document.createElementNS("http://w3.org", "path");
        p.setAttribute("d", dSub);
        grp.appendChild(p);

        const len = Math.max(10, p.getTotalLength());
        const b = p.getBBox();
        const cx = (b.x + b.width * 0.5) * 0.1;
        const cy = 592 - (b.y + b.height * 0.5) * 0.1;
        const w = b.width * 0.1, h = b.height * 0.1;

        p.setAttribute("stroke-dasharray", len.toFixed(1));
        p.setAttribute("stroke-dashoffset", len.toFixed(1));
        p.setAttribute("stroke-width", "6");
        p.setAttribute("stroke-linecap", "round");
        p.setAttribute("stroke-linejoin", "round");
        p.setAttribute("fill-opacity", "0");

        let delay = 0, dur = 0.85, col = "#d8dde8";
        if (w > 220 && cy > 415) {
          delay = 0.05; dur = 1.05; col = "#b8c1d4";
        } else if ((h > 130 && cy > 230) || (w < 18 && h < 18 && Math.hypot(cx - 302, cy - 276) < 25)) {
          delay = 0.85; dur = 1.25; col = "#ffffff";
        } else {
          const dist = Math.hypot(cx - 296, cy - 275);
          delay = 1.75 + Math.min(2.3, dist / 95);
          dur = 0.75;
          col = "#cfd6e6";
        }

        p.setAttribute("stroke", col);
        p.setAttribute("fill", col);
        items.push({ el: p, len: len, delay: delay, dur: dur });
      });
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
            it.el.setAttribute("stroke-dashoffset", it.len.toFixed(1));
            it.el.setAttribute("fill-opacity", "0");
            active = true;
          } else {
            const p = Math.min(1, (el - it.delay) / it.dur);
            const ease = 1 - Math.pow(1 - p, 2.4);
            it.el.setAttribute("stroke-dashoffset", (it.len * (1 - ease)).toFixed(1));
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
