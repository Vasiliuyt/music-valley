window.launchKollekcionerScene = function(alb, albScene, stage, box, showAlb) {
  box.style.display = "none";
  const tb = document.getElementById("topBox");
  if (tb) tb.style.display = "none";
  stage.style.opacity = "0"; stage.style.pointerEvents = "none";
  albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";

  albScene.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:#121014;border:1px solid #2b2533;padding:8px 12px;border-radius:10px'><button id='bkGr' style='background:transparent;color:#fff;border:none;font-size:12px;font-weight:600;cursor:pointer'>← Назад к гранату</button><button id='inSc' style='background:#ffffff;color:#0b0a0d;border:none;padding:5px 10px;border-radius:6px;font-size:11px;font-weight:700;cursor:pointer'>Об альбоме (1996)</button></div>";

  document.getElementById("bkGr").onclick = function() {
    albScene.style.opacity = "0"; albScene.style.pointerEvents = "none";
    stage.style.opacity = "1"; stage.style.pointerEvents = "auto";
    box.style.display = "none"; if (tb) tb.style.display = "block";
  };
  document.getElementById("inSc").onclick = function() { showAlb(alb, true); };

  const sWrap = document.createElement("div");
  sWrap.style.cssText = "position:relative;width:92vw;height:88vh;display:flex;align-items:center;justify-content:center";
  albScene.appendChild(sWrap);

  fetch("kollekcioner.svg?v=8").then(function(r) { return r.text(); }).then(function(txt) {
    sWrap.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = sWrap.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;

    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.setAttribute("fill", "#ffffff");

    const paths = Array.from(grp.querySelectorAll("path"));
    paths.forEach(function(p) {
      p.style.fill = "#ffffff";
      p.style.cursor = "pointer";
      p.style.transformBox = "fill-box";
      p.style.transformOrigin = "center center";
      p.style.transition = "transform 0.25s cubic-bezier(.22,1,.36,1), opacity 0.25s ease, filter 0.25s ease";

      p.onmouseenter = function() {
        paths.forEach(function(other) {
          if (other !== p) other.style.opacity = "0.45";
        });
        p.style.opacity = "1";
        p.style.transform = "scale(1.07)";
        p.style.filter = "drop-shadow(0 0 22px rgba(255,255,255,0.75))";
      };

      p.onmouseleave = function() {
        paths.forEach(function(other) {
          other.style.opacity = "1";
        });
        p.style.transform = "scale(1)";
        p.style.filter = "none";
      };

      p.onclick = function() {
        showAlb(alb, true);
      };
    });
  });
};
