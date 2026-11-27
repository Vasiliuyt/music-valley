window.openSplinCollage = function() {
  let colView = document.getElementById("splinCollageView");
  if (!colView) {
    colView = document.createElement("div");
    colView.id = "splinCollageView";
    colView.style.cssText = "position:fixed;inset:0;z-index:200;background:radial-gradient(circle at 50% 45%,#171821 0%,#07080b 85%);display:flex;align-items:center;justify-content:center;overflow:hidden";
    document.body.appendChild(colView);
  }
  colView.style.display = "flex";
  colView.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:220;display:flex;gap:10px;align-items:center;background:rgba(15,16,22,0.9);border:1px solid rgba(255,255,255,0.12);padding:8px 14px;border-radius:10px'><button id='closeCol' style='background:transparent;color:#fff;border:none;font-size:12.5px;font-weight:600;cursor:pointer'>← Назад</button><span style='color:rgba(255,255,255,0.2)'>|</span><span style='color:#9aa4b8;font-size:12px'>Картина I: Петербург • Сплин (наводи на образы)</span></div>";

  document.getElementById("closeCol").onclick = function() {
    colView.style.display = "none";
  };

  const tip = document.createElement("div");
  tip.style.cssText = "position:fixed;pointer-events:none;background:rgba(12,13,18,0.96);border:1px solid rgba(255,255,255,0.25);color:#fff;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:600;z-index:250;display:none;white-space:nowrap;box-shadow:0 10px 28px rgba(0,0,0,0.8)";
  colView.appendChild(tip);

  const canvasBox = document.createElement("div");
  canvasBox.style.cssText = "position:relative;width:min(88vh,88vw);height:min(88vh,88vw)";
  colView.appendChild(canvasBox);

  // 1. СЛОЙ ОСНОВЫ: Человек-дерево и земля («Реверсивная хроника событий», 2004)
  const treeLayer = document.createElement("div");
  treeLayer.style.cssText = "position:absolute;inset:0;cursor:pointer;transition:filter 0.25s ease";
  canvasBox.appendChild(treeLayer);

  // 2. СЛОЙ ПЛОДОВ: Алый гранат в кроне дерева («Гранатовый альбом», 1998)
  const granatLayer = document.createElement("div");
  granatLayer.style.cssText = "position:absolute;top:14%;left:54%;width:21%;height:21%;cursor:pointer;transition:transform 0.3s cubic-bezier(.22,1,.36,1),filter 0.3s ease;z-index:10";
  canvasBox.appendChild(granatLayer);

  // 3. СЛОЙ ПУТНИКОВ: Человечки, идущие по земле мимо дерева («Коллекционер оружия», 1996)
  const walkersLayer = document.createElement("div");
  walkersLayer.style.cssText = "position:absolute;bottom:6%;left:5%;width:90%;height:34%;z-index:12;pointer-events:none";
  canvasBox.appendChild(walkersLayer);

  function bindHover(el, title, sub, glowColor) {
    el.onmouseenter = function() {
      el.style.filter = "drop-shadow(0 0 22px " + glowColor + ")";
      tip.innerHTML = "<div style='color:#fff'>" + title + "</div><div style='font-size:10.5px;color:#9aa4b8;margin-top:2px'>" + sub + "</div>";
      tip.style.display = "block";
    };
    el.onmousemove = function(e) {
      tip.style.left = (e.clientX + 16) + "px";
      tip.style.top = (e.clientY - 16) + "px";
    };
    el.onmouseleave = function() {
      el.style.filter = "none";
      tip.style.display = "none";
    };
  }

  // Загружаем дерево («Реверсивная хроника событий»)
  fetch("revers.svg?v=8").then(function(r) { return r.text(); }).then(function(txt) {
    treeLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = treeLayer.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block";
    grp.setAttribute("fill", "#cfd6e6");
    bindHover(treeLayer, "Реверсивная хроника событий (2004)", "«Романс» • «Мы сидели и курили»", "rgba(160,185,230,0.7)");
  });

  // Загружаем гранат в крону («Гранатовый альбом»)
  fetch("granat.svg?v=8").then(function(r) { return r.text(); }).then(function(txt) {
    granatLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = granatLayer.querySelector("svg");
    if (!svg) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    const paths = Array.from(svg.querySelectorAll("path"));
    paths.forEach(function(p, i) { p.style.fill = i === 0 ? "#b82328" : "#ff4248"; });
    bindHover(granatLayer, "Гранатовый альбом (1998)", "«Орбит без сахара» • «Выхода нет»", "rgba(255,70,80,0.9)");
    granatLayer.addEventListener("mouseenter", function() { granatLayer.style.transform = "scale(1.14) rotate(-6deg)"; });
    granatLayer.addEventListener("mouseleave", function() { granatLayer.style.transform = "scale(1) rotate(0deg)"; });
  });

  // Загружаем путников на линию земли («Коллекционер оружия»)
  fetch("kollekcioner.svg?v=8").then(function(r) { return r.text(); }).then(function(txt) {
    walkersLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = walkersLayer.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.setAttribute("fill", "#ffffff");

    const paths = Array.from(grp.querySelectorAll("path"));
    paths.forEach(function(p) {
      p.style.fill = "#ffffff";
      p.style.pointerEvents = "auto";
      p.style.cursor = "pointer";
      p.style.transformBox = "fill-box";
      p.style.transformOrigin = "bottom center";
      p.style.transition = "transform 0.25s cubic-bezier(.22,1,.36,1), filter 0.25s ease";
      bindHover(p, "Коллекционер оружия (1996)", "«Будь моей тенью» • Записан при поддержке БГ", "rgba(255,220,140,0.85)");
      p.addEventListener("mouseenter", function() { p.style.transform = "scale(1.12)"; });
      p.addEventListener("mouseleave", function() { p.style.transform = "scale(1)"; });
    });
  });
};
