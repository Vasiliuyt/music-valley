{
  const host = document.getElementById("vinylView");
  const oldCv = document.getElementById("vinylCv");
  if (oldCv) oldCv.style.display = "none";

  const stage = document.createElement("div");
  stage.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:grab;background:#080607;transition:opacity .5s,transform .5s";
  host.appendChild(stage);

  const albScene = document.createElement("div");
  albScene.style.cssText = "position:fixed;inset:0;z-index:90;opacity:0;pointer-events:none;transition:opacity .5s;background:radial-gradient(circle at 50% 45%,#15171c 0%,#08090c 82%);display:flex;align-items:center;justify-content:center;overflow:hidden";
  host.appendChild(albScene);

  let vox = 0, voy = 0, vsc = 1, drag = false, lx = 0, ly = 0, mx = -9999, my = -9999;

  const ALB = new Array(
    { id: "dust", t: "Пыльная быль", y: "1994", e: "«Жертва талого льда» • «Рыба без трусов»", s: "Записан по ночам в студии питерского театра «Буфф». Дух ленинградских квартирников, флейта и поэтический абсурд.", l: "Александр Башлачёв • «Аквариум» • Ленинградский рок-клуб" },
    { id: "kol", t: "Коллекционер оружия", y: "1996", e: "«Будь моей тенью» • «Любовь идёт по проводам»", s: "Московский дебют при поддержке Бориса Гребенщикова и музыкантов «Аквариума».", l: "Борис Гребенщиков • «Аквариум» • Студия «Мелодия»" },
    { id: "lan", t: "Фонарь под глазом", y: "1997", e: "«Англо-русский словарь» • «Моя любовь»", s: "Переход к нервному гитарному саунду с фирменной флейтой Яна Николенко.", l: "Ян Николенко • Питерский арт-рок 90-х" },
    { id: "grn", t: "Гранатовый альбом", y: "1998", e: "«Орбит без сахара» • «Выхода нет»", s: "Главный стадионный прорыв конца 90-х: гранжевые риффы и формулы эпохи.", l: "Русский гранж 90-х • «Брат-2»" },
    { id: "alt", t: "Альтависта", y: "1999", e: "«Молоко и мёд» • «Пил-курил»", s: "Тяжёлый психоделический разворот на стыке постпанка и индастриала.", l: "Постпанк • Трип-хоп конца 90-х" },
    { id: "k25", t: "25-й кадр", y: "2001", e: "«Линия жизни» • «Моё сердце» • «Феллини»", s: "Возвращение к мелодизму и совместный тур «Феллини» с «БИ-2».", l: "«БИ-2» • Саундтрек нулевых" },
    { id: "new", t: "Новые люди", y: "2003", e: "«Новые люди» • «Время, назад!»", s: "Нервный минималистичный альбом-наблюдение за меняющимся Петербургом.", l: "Новая городская волна • Постпанк 2000-х" },
    { id: "rev", t: "Реверсивная хроника событий", y: "2004", svg: "revers.svg", e: "«Романс» • «Мы сидели и курили»", s: "Камерный минималистичный альбом-дневник, где впервые вышел культовый акустический «Романс».", l: "Русский городской романс • Акустический минимализм" },
    { id: "spl", t: "Раздвоение личности", y: "2007", e: "«Маяк» (стихи Маяковского) • «Скажи»", s: "Двойной альбом из 17 песен: арт-рок и прямой диалог с поэзией Владимира Маяковского.", l: "Владимир Маяковский • Серебряный век" },
    { id: "sig", t: "Сигнал из космоса", y: "2009", e: "«Вниз головой» • «Письмо»", s: "Светлый альбом с духовой секцией и космической образностью.", l: "Петербургская инди-сцена конца нулевых" },
    { id: "obm", t: "Обман зрения", y: "2012", e: "«Конец прекрасной эпохи» • «Петербургская свадьба»", s: "Песни на стихи Иосифа Бродского и Александра Башлачёва.", l: "Иосиф Бродский • Александр Башлачёв" },
    { id: "res", t: "Резонанс. Часть 1 и 2", y: "2014", e: "«Рай в шалаше» • «Оркестр» • «Танцуй!»", s: "Масштабный двухчастный философский цикл с оркестровыми аранжировками.", l: "Камерный оркестровый рок" },
    { id: "key", t: "Ключ к шифру", y: "2016", e: "«Храм» • «Окраины» • «Кит»", s: "Электронно-гитарный альбом с ломаными трип-хоп-битами.", l: "Бристольский трип-хоп • Portishead" },
    { id: "vst", t: "Встречная полоса", y: "2018", e: "«Булгаковский марш» • «Шаман»", s: "Записан на студии «Добролёт» с аллюзиями на «Мастера и Маргариту».", l: "Студия «Добролёт» • Михаил Булгаков" },
    { id: "vir", t: "Вира и майна", y: "2020", e: "«Передайте это Гарри Поттеру...» • «За семью печатями»", s: "Пластинка эпохи локдауна: блюз-рок и зрелая питерская меланхолия.", l: "Блюз-рок • Современная питерская сцена" }
  );

  const box = document.createElement("div");
  box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:370px;max-width:calc(100vw - 40px);background:#120b0d;border:1px solid #381820;border-radius:12px;padding:20px;z-index:130;display:none;flex-direction:column;gap:12px;color:#ede6e8;font-family:sans-serif;overflow-y:auto";
  document.body.appendChild(box);

  function showAlb(a, dark) {
    box.style.display = "flex";
    const ac = dark ? "#8fa3c7" : "#e02e31";
    box.style.background = dark ? "#101216" : "#120b0d";
    box.style.borderColor = dark ? "#262b36" : "#381820";
    const q = encodeURIComponent("Сплин " + a.t);
    box.innerHTML = `<div style="display:flex;justify-content:space-between"><div><div style="font-size:10px;color:${ac};font-weight:700">СПЛИН • ${a.y}</div><h2 style="font-size:20px;color:#fff;margin-top:2px">${a.t}</h2></div><button id="clsB" style="background:rgba(255,255,255,.08);color:#bbb;border:none;padding:5px 10px;border-radius:6px;cursor:pointer">✕</button></div><div style="background:rgba(255,255,255,.03);border:1px solid rgba(255,255,255,.08);padding:10px;border-radius:8px"><div style="font-size:9.5px;color:${ac};font-weight:700;margin-bottom:3px">ТОЧКА ВХОДА</div><div style="font-size:13px;font-weight:600;color:#fff">${a.e}</div></div><div style="background:rgba(255,255,255,.025);border-left:2px solid ${ac};padding:10px;font-size:12.5px;line-height:1.48;color:#d6d8de">${a.s}</div><div style="background:rgba(255,255,255,.025);border:1px solid rgba(255,255,255,.07);padding:9px;border-radius:8px;font-size:12px;color:#b8bec9"><b style="font-size:10px;color:#7c8291;display:block;margin-bottom:2px">НИТОЧКИ СВЯЗЕЙ</b>${a.l}</div><div style="margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px"><a href="https://yandex.ru{q}" target="_blank" style="background:#ffcc00;color:#000;text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12px">Яндекс Музыка ↗</a><a href="https://vk.com{q}" target="_blank" style="background:rgba(255,255,255,.08);color:#fff;text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:600;font-size:12px">VK Музыка ↗</a><a href="https://youtube.com{encodeURIComponent("Сплин " + a.t + " клип")}" target="_blank" style="grid-column:1/-1;background:${ac};color:${dark?"#08090c":"#fff"};text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12.5px">Клипы и лайвы ↗</a></div>`;
    document.getElementById("clsB").onclick = () => { box.style.display = "none"; };
  }
  let leafItems = new Array(), sTick = 0, sWrap = null, timers = new Array();

  function clearSceneTimers() {
    while (timers.length > 0) clearTimeout(timers.pop());
  }

  function openScene(alb) {
    box.style.display = "none";
    const tb = document.getElementById("topBox");
    if (tb) tb.style.display = "none";
    stage.style.opacity = "0"; stage.style.pointerEvents = "none";
    albScene.style.opacity = "1"; albScene.style.pointerEvents = "auto";
    albScene.innerHTML = `<div style="position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;background:rgba(13,15,20,.9);border:1px solid rgba(255,255,255,.1);padding:8px 12px;border-radius:10px"><button id="bkGr" style="background:transparent;color:#fff;border:none;font-size:12.5px;font-weight:600;cursor:pointer">← Назад к гранату</button><button id="rpSc" style="background:rgba(255,255,255,.08);color:#ccc;border:none;padding:5px 9px;border-radius:6px;font-size:11.5px;cursor:pointer">↻ Повторить</button><button id="inSc" style="background:#8fa3c7;color:#08090c;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer">Об альбоме</button></div>`;
    document.getElementById("bkGr").onclick = () => {
      clearSceneTimers();
      albScene.style.opacity = "0"; albScene.style.pointerEvents = "none";
      stage.style.opacity = "1"; stage.style.pointerEvents = "auto";
      box.style.display = "none"; if (tb) tb.style.display = "block";
    };
    document.getElementById("inSc").onclick = () => showAlb(alb, true);

    sWrap = document.createElement("div");
    sWrap.style.cssText = "position:relative;width:min(84vh,84vw);height:min(84vh,84vw)";
    albScene.appendChild(sWrap);
    leafItems = new Array();

    fetch(alb.svg).then(r => r.text()).then(txt => {
      sWrap.innerHTML = txt.replace(/<\?xml[\s\S]*?\?>/i, "").replace(/<!DOCTYPE[\s\S]*?>/i, "");
      const svg = sWrap.querySelector("svg");
      const grp = svg ? svg.querySelector("g") : null;
      if (!svg || !grp) return;

      svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
      grp.setAttribute("fill", "#d8dde8");

      const rawPaths = Array.from(grp.querySelectorAll("path"));
      const subElements = new Array();
      rawPaths.forEach(orig => {
        const dStr = orig.getAttribute("d") || "";
        const parts = dStr.split("M");
        for (let i = 1; i < parts.length; i++) {
          const ch = "M" + parts.at(i).trim();
          if (ch.length < 10) continue;
          const p = document.createElementNS("http://www.w3.org/2000/svg", "path");
          p.setAttribute("d", ch);
          grp.appendChild(p);
          subElements.push(p);
        }
        orig.remove();
      });

      const groundEls = new Array();
      const bodyEls = new Array();

      subElements.forEach((p, idx) => {
        const b = p.getBBox();
        const cx = (b.x + b.width * 0.5) * 0.1;
        const cy = 592 - (b.y + b.height * 0.5) * 0.1;
        const w = b.width * 0.1;
        const h = b.height * 0.1;

        if (w > 220 && cy > 415) {
          p.style.fill = "#b8c1d4";
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "center center";
          groundEls.push(p);
        } else if (h > 130 && cy > 230) {
          p.style.fill = "#ffffff";
          p.style.cursor = "pointer";
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "bottom center";
          p.onclick = () => showAlb(alb, true);
          bodyEls.push(p);
        } else {
          p.style.fill = idx % 2 === 0 ? "#d2d8e6" : "#9aa4b8";
          p.style.transformBox = "fill-box";
          p.style.transformOrigin = "center center";
          const distFromHead = Math.hypot(cx - 296, cy - 275);
          leafItems.push({ el: p, cx: cx, cy: cy, dist: distFromHead, ph: idx * 0.37, dx: 0, dy: 0, vx: 0, vy: 0, ready: false });
        }
      });

      leafItems.sort((a, b) => a.dist - b.dist);

      function playVectorBloom() {
        clearSceneTimers();

        groundEls.forEach(p => {
          p.style.transition = "none";
          p.style.opacity = "0";
          p.style.transform = "scaleX(0.05)";
        });
        bodyEls.forEach(p => {
          p.style.transition = "none";
          p.style.opacity = "0";
          p.style.transform = "scaleY(0.02)";
        });
        leafItems.forEach(l => {
          l.ready = false;
          l.dx = 0; l.dy = 0; l.vx = 0; l.vy = 0;
          l.el.style.transition = "none";
          l.el.style.opacity = "0";
          l.el.style.transform = "scale(0)";
        });

        requestAnimationFrame(() => requestAnimationFrame(() => {
          groundEls.forEach(p => {
            p.style.transition = "transform 0.85s cubic-bezier(0.22,1,0.36,1), opacity 0.4s ease";
            p.style.opacity = "1";
            p.style.transform = "scaleX(1)";
          });

          bodyEls.forEach(p => {
            p.style.transition = "transform 1.05s cubic-bezier(0.22,1,0.36,1) 0.65s, opacity 0.45s ease 0.65s";
            p.style.opacity = "1";
            p.style.transform = "scaleY(1)";
          });

          const totalLeaves = Math.max(1, leafItems.length);
          leafItems.forEach((l, i) => {
            const delay = 1.45 + (i / totalLeaves) * 1.45;
            l.el.style.transition = `transform 0.48s cubic-bezier(0.34,1.56,0.64,1) ${delay.toFixed(2)}s, opacity 0.35s ease ${delay.toFixed(2)}s`;
            l.el.style.opacity = "1";
            l.el.style.transform = "scale(1)";

            const tm = setTimeout(() => {
              l.el.style.transition = "none";
              l.ready = true;
            }, (delay + 0.52) * 1000);
            timers.push(tm);
          });
        }));
      }

      document.getElementById("rpSc").onclick = playVectorBloom;
      playVectorBloom();
    });
  }

  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:min(82vh,82vw);height:min(82vh,82vw);transform-origin:center center";
  stage.appendChild(wrap);

  const tip = document.createElement("div");
  tip.style.cssText = "position:fixed;pointer-events:none;background:rgba(16,10,12,.96);border:1px solid #e02e31;color:#fff;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:600;z-index:130;display:none";
  document.body.appendChild(tip);

  const seeds = new Array();

  fetch("granat.svg").then(r => r.text()).then(txt => {
    wrap.innerHTML = txt.replace(/<\?xml[\s\S]*?\?>/i, "").replace(/<!DOCTYPE[\s\S]*?>/i, "");
    const svg = wrap.querySelector("svg");
    if (!svg) return;
    svg.style.cssText = "width:100%;height:100%;display:block;overflow:visible";
    const all = Array.from(svg.querySelectorAll("path"));
    const shell = all.shift();
    if (shell) { shell.style.fill = "#b82328"; shell.style.pointerEvents = "none"; }

    const sPaths = all.filter(p => { const b = p.getBBox(); return b.width > 80 && b.height > 80; }).sort((p1, p2) => {
      const b1 = p1.getBBox(), b2 = p2.getBBox(); return (b2.y - b1.y) * 0.6 + (b1.x - b2.x) * 0.4;
    });

    const step = Math.max(1, Math.floor(sPaths.length / ALB.length));
    let ai = 0;
    sPaths.forEach((p, idx) => {
      const b = p.getBBox();
      seeds.push({ el: p, cx: (b.x + b.width * 0.5) * 0.1, cy: 350 - (b.y + b.height * 0.5) * 0.1, dx: 0, dy: 0, vx: 0, vy: 0 });
      p.style.transition = "fill .2s,filter .2s";
      if (idx % step === 0 && ai < ALB.length) {
        const a = ALB.at(ai++);
        p.style.fill = a.svg ? "#ff4d54" : "#eb363c"; p.style.cursor = "pointer";
        p.onmouseenter = () => { p.style.fill = "#ff787d"; p.style.filter = "drop-shadow(0 0 18px rgba(255,95,105,.9))"; tip.textContent = a.t + " • " + a.y + (a.svg ? " ▶" : ""); tip.style.display = "block"; };
        p.onmousemove = e => { tip.style.left = (e.clientX + 14) + "px"; tip.style.top = (e.clientY - 14) + "px"; };
        p.onmouseleave = () => { p.style.fill = a.svg ? "#ff4d54" : "#eb363c"; p.style.filter = "none"; tip.style.display = "none"; };
        p.onclick = e => { e.stopPropagation(); tip.style.display = "none"; a.svg ? openScene(a) : showAlb(a, false); };
      } else {
        p.style.fill = "#9e1c22";
        p.onmouseenter = () => { p.style.fill = "#c4252c"; };
        p.onmouseleave = () => { p.style.fill = "#9e1c22"; };
      }
    });
  });

  function loopAll() {
    if (stage.style.pointerEvents !== "none" && seeds.length > 0) {
      const rc = wrap.getBoundingClientRect();
      if (rc.width > 0) {
        const sx = ((mx - rc.left) / rc.width) * 350, sy = ((my - rc.top) / rc.height) * 350;
        for (let i = 0; i < seeds.length; i++) {
          const s = seeds.at(i), dx = s.cx - sx, dy = s.cy - sy, d = Math.hypot(dx, dy);
          let tx = 0, ty = 0;
          if (d < 46 && d > 0.1) { const f = (1 - d / 46) * 42; tx = (dx / d) * f; ty = -(dy / d) * f; }
          s.vx = (s.vx + (tx - s.dx) * 0.16) * 0.72; s.vy = (s.vy + (ty - s.dy) * 0.16) * 0.72;
          s.dx += s.vx; s.dy += s.vy;
          s.el.style.transform = (Math.abs(s.dx) > 0.05 || Math.abs(s.dy) > 0.05) ? `translate(${s.dx.toFixed(2)}px,${s.dy.toFixed(2)}px)` : "";
        }
      }
    }
    sTick += 0.03;
    if (albScene.style.pointerEvents === "auto" && leafItems.length > 0 && sWrap) {
      const rc = sWrap.getBoundingClientRect();
      const sx = rc.width > 0 ? ((mx - rc.left) / rc.width) * 600 : -9999, sy = rc.height > 0 ? ((my - rc.top) / rc.height) * 592 : -9999;
      for (let i = 0; i < leafItems.length; i++) {
        const l = leafItems.at(i); if (!l.ready) continue;
        const wx = Math.sin(sTick + l.ph) * 7, wy = Math.cos(sTick * 0.8 + l.ph) * 4;
        const dx = l.cx - sx, dy = l.cy - sy, d = Math.hypot(dx, dy);
        let px = 0, py = 0;
        if (d < 60 && d > 0.1) { const f = (1 - d / 60) * 45; px = (dx / d) * f; py = -(dy / d) * f; }
