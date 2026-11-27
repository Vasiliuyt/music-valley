window.openSplinCollage = function() {
  let colView = document.getElementById("splinCollageView");
  if (!colView) {
    colView = document.createElement("div");
    colView.id = "splinCollageView";
    colView.style.cssText = "position:fixed;inset:0;z-index:200;background:radial-gradient(circle at 50% 45%,#15161d 0%,#07080b 85%);display:flex;align-items:center;justify-content:center;overflow:hidden";
    document.body.appendChild(colView);
  }
  colView.style.display = "flex";
  colView.innerHTML = "<div style='position:fixed;top:20px;left:20px;z-index:220;display:flex;gap:10px;align-items:center;background:rgba(15,16,22,0.9);border:1px solid rgba(255,255,255,0.12);padding:8px 14px;border-radius:10px'><button id='closeCol' style='background:transparent;color:#fff;border:none;font-size:12.5px;font-weight:600;cursor:pointer'>← Назад</button><span style='color:rgba(255,255,255,0.2)'>|</span><span style='color:#9aa4b8;font-size:12px'>Картина I: Петербург • Сплин</span></div>";

  document.getElementById("closeCol").onclick = function() {
    colView.style.display = "none";
  };

  const tip = document.createElement("div");
  tip.style.cssText = "position:fixed;pointer-events:none;background:rgba(12,13,18,0.96);border:1px solid rgba(255,255,255,0.22);color:#fff;padding:7px 12px;border-radius:8px;font-size:12px;font-weight:600;z-index:250;display:none;white-space:nowrap;box-shadow:0 10px 28px rgba(0,0,0,0.8)";
  colView.appendChild(tip);

  const canvasBox = document.createElement("div");
  canvasBox.style.cssText = "position:relative;width:min(90vh,90vw);height:min(90vh,90vw)";
  colView.appendChild(canvasBox);

  // 1. ОСНОВА: Человек-дерево и дуга земли («Реверсивная хроника событий», 2004)
  const treeLayer = document.createElement("div");
  treeLayer.style.cssText = "position:absolute;inset:0;cursor:pointer;transition:opacity 0.25s ease";
  canvasBox.appendChild(treeLayer);

  // 2. ПЛОД НА ВЕТВЯХ: Алый гранат в глубине кроны («Гранатовый альбом», 1998)
  const granatLayer = document.createElement("div");
  granatLayer.style.cssText = "position:absolute;top:21%;left:51%;width:16.5%;height:16.5%;cursor:pointer;transform-origin:center center;transition:transform 0.3s cubic-bezier(.22,1,.36,1);z-index:10";
  canvasBox.appendChild(granatLayer);

  // 3. ПУТНИКИ ПО ДУГЕ ЗЕМЛИ: Человечки крупнее и выстроены вдоль кривой («Коллекционер оружия», 1996)
  const walkersLayer = document.createElement("div");
  walkersLayer.style.cssText = "position:absolute;bottom:9.5%;left:2%;width:96%;height:41%;z-index:12;pointer-events:none";
  canvasBox.appendChild(walkersLayer);

  function bindTip(el, title, sub) {
    el.addEventListener("mouseenter", function() {
      tip.innerHTML = "<div style='color:#fff'>" + title + "</div><div style='font-size:10.5px;color:#9aa4b8;margin-top:2px'>" + sub + "</div>";
      tip.style.display = "block";
    });
    el.addEventListener("mousemove", function(e) {
      tip.style.left = (e.clientX + 16) + "px";
      tip.style.top = (e.clientY - 16) + "px";
    });
    el.addEventListener("mouseleave", function() {
      tip.style.display = "none";
    });
  }

  // Загружаем человека-дерево и землю
  fetch("revers.svg?v=9").then(function(r) { return r.text(); }).then(function(txt) {
    treeLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = treeLayer.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block";
    grp.setAttribute("fill", "#d4dbe8");
    bindTip(treeLayer, "Реверсивная хроника событий (2004)", "«Романс» • «Мы сидели и курили»");
    treeLayer.addEventListener("mouseenter", function() { grp.setAttribute("fill", "#ffffff"); });
    treeLayer.addEventListener("mouseleave", function() { grp.setAttribute("fill", "#d4dbe8"); });
  });

  // Загружаем гранат в крону дерева (без яркого ореола — только мягкий живой отклик)
  fetch("granat.svg?v=9").then(function(r) { return r.text(); }).then(function(txt) {
    granatLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = granatLayer.querySelector("svg");
    if (!svg) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    const paths = Array.from(svg.querySelectorAll("path"));
    paths.forEach(function(p, i) {
      p.style.fill = i === 0 ? "#a81e23" : "#e6393f";
      p.style.transition = "fill 0.25s ease";
    });
    bindTip(granatLayer, "Гранатовый альбом (1998)", "«Орбит без сахара» • «Выхода нет»");
    granatLayer.addEventListener("mouseenter", function() {
      granatLayer.style.transform = "scale(1.09) rotate(-5deg)";
      paths.forEach(function(p, i) { p.style.fill = i === 0 ? "#c4252b" : "#ff5258"; });
    });
    granatLayer.addEventListener("mouseleave", function() {
      granatLayer.style.transform = "scale(1) rotate(0deg)";
      paths.forEach(function(p, i) { p.style.fill = i === 0 ? "#a81e23" : "#e6393f"; });
    });
  });

  // Загружаем путников и сажаем каждого на кривую дуги земли
  fetch("kollekcioner.svg?v=9").then(function(r) { return r.text(); }).then(function(txt) {
    walkersLayer.innerHTML = txt.slice(txt.indexOf("<svg"));
    const svg = walkersLayer.querySelector("svg");
    const grp = svg ? svg.querySelector("g") : null;
    if (!svg || !grp) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    grp.setAttribute("fill", "#ffffff");

    const paths = Array.from(grp.querySelectorAll("path"));
    const sorted = paths.map(function(p) {
      const b = p.getBBox();
      return { el: p, cx: b.x + b.width * 0.5 };
    }).sort(function(a, b) { return a.cx - b.cx; });

    sorted.forEach(function(item) {
      const p = item.el;
      // Нормализованная позиция по горизонтали от -1 (левый край) до +1 (правый край)
      const nx = (item.cx - 3000) / 2800;
      // Параболический изгиб дуги земли: крайние путники опускаются по склону холма, центральные идут по вершине
      const arcDropY = -(nx * nx) * 440 + 180;
      const slopeAngle = nx * 9.5;
      const baseTransform = "translate(0px, " + arcDropY.toFixed(1) + "px) rotate(" + slopeAngle.toFixed(1) + "deg)";

      p.style.fill = "#eceff5";
      p.style.pointerEvents = "auto";
      p.style.cursor = "pointer";
      p.style.transformBox = "fill-box";
      p.style.transformOrigin = "bottom center";
      p.style.transform = baseTransform;
      p.style.transition = "transform 0.25s cubic-bezier(.22,1,.36,1), fill 0.2s ease";

      bindTip(p, "Коллекционер оружия (1996)", "«Будь моей тенью» • Записан при поддержке БГ");
      p.addEventListener("mouseenter", function() {
        p.style.fill = "#ffffff";
        p.style.transform = baseTransform + " scale(1.08)";
      });
      p.addEventListener("mouseleave", function() {
        p.style.fill = "#eceff5";
        p.style.transform = baseTransform;
      });
    });
  });
};
