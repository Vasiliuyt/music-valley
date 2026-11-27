{
  const vc = document.getElementById("vinylCv"), vx = vc.getContext("2d");
  let vox = 0, voy = 15, vsc = 1, drag = false, moved = false, lx = 0, ly = 0, mx = -9999, my = -9999, t = 0, hov = null, act = null;
  function rsz() { vc.width = innerWidth; vc.height = innerHeight; }
  window.addEventListener("resize", rsz); rsz();

  // Полная дискография студийных альбомов «Сплина» с полными треклистами
  const ALB = new Array(
    { id: "dust", n: "Пыльная быль", y: "1994", x: -125, y0: -55, rx: 14, ry: 9, a: -0.5,
      d: "Дебютный студийный альбом, записанный по ночам на студии Санкт-Петербургского театра «Буфф».",
      tr: new Array("Жертва талого льда","Сказка","Алкоголь","Серебряные реки","Твоё разбитое пенсне","Мне сказали слово","Под сурдинку","Гроза","Война","Пыльная быль","Бонни и Клайд","Рыба без трусов") },
    { id: "kol", n: "Коллекционер оружия", y: "1996", x: -145, y0: 5, rx: 14, ry: 9, a: -0.2,
      d: "Второй альбом, записанный в Москве при поддержке Бориса Гребенщикова и музыкантов «Аквариума».",
      tr: new Array("Будь моей тенью","Любовь идёт по проводам","Чёрный цвет солнца","Самовар","Жертва талого льда","Что ты будешь делать?","Рыба без трусов","Странная песня","Иди через лес","Куда летит мой самолёт?") },
    { id: "lan", n: "Фонарь под глазом", y: "1997", x: -115, y0: 65, rx: 15, ry: 9.5, a: 0.4,
      d: "Третий студийный альбом: акустическая меланхолия, флейта Яна Николенко и нервный петербургский рок.",
      tr: new Array("Бонни и Клайд","Англо-русский словарь","Молитва","Моя любовь","Три цвета","Невский проспект","Спи в моей голове","Приходи","За стеной","Праздник","Частушки","Давай, лама!") },
    { id: "grn", n: "Гранатовый альбом", y: "1998", x: -65, y0: -10, rx: 17, ry: 11, a: -0.35,
      d: "Четвёртый студийный альбом, ставший главным прорывом группы на стадионный уровень.",
      tr: new Array("Весь этот бред","Достань гранату","Орбит без сахара","Приходи","Свет горел всю ночь","Люся сидит дома","Бог устал нас любить","Катись, колесо!","Выхода нет","Коктейли третьей мировой","Джим","Мария и Хуана","Подводная лодка") },
    { id: "alt", n: "Альтависта", y: "1999", x: 68, y0: -60, rx: 15, ry: 9.5, a: 0.45,
      d: "Пятый студийный альбом — резкий, психоделический и экспериментальный разворот после стадионных хитов.",
      tr: new Array("Альтависта","Молоко и мёд","Пил-курил","Терпсихора","Далеко домой","Абсент","Добрых дел мастер","Мотоциклетная цепь","Сумасшедший автобус","Алкоголь","Встретимся завтра") },
    { id: "k25", n: "25-й кадр", y: "2001", x: 118, y0: -5, rx: 16, ry: 10, a: -0.3,
      d: "Шестой студийный альбом с плотным гитарно-электронным звуком и главными радиохитами начала 2000-х.",
      tr: new Array("Линия жизни","Звезда рок-н-ролла","Всего хорошего","Моё сердце","Рики-Тики-Тави","Феллини","Остаёмся зимовать","Тебе это снится","Совсем другой","Пластмассовая жизнь","Пой мне ещё","Ленинград-Amsterdam","Fine") },
    { id: "new", n: "Новые люди", y: "2003", x: 110, y0: 60, rx: 15, ry: 9.5, a: 0.55,
      d: "Седьмой студийный альбом — нервный хроникёрский взгляд на меняющийся город и эпоху.",
      tr: new Array("Новые люди","Время, назад!","Гандбол","Сломано всё","Девятиэтажный дом","Блокада","Валдай","Йог спокоен","Северо-Запад","РЭП (Нервное сердце)","Альтависта (live)") },
    { id: "rev", n: "Реверсивная хроника событий", y: "2004", x: 55, y0: 45, rx: 14, ry: 9, a: -0.6,
      d: "Восьмой студийный альбом — мрачный, минималистичный и инструментально-шумовой эксперимент.",
      tr: new Array("Океан","Семь восьмых","Шато Марго","Мы сидели и курили","Сиануквиль","Человек и дерево","Бериллий","Тем, кто раньше нас","Паровоз","Урок географии","Романс","Люди на холме","Голос за кадром") },
    { id: "spl", n: "Раздвоение личности", y: "2007", x: -35, y0: 120, rx: 15, ry: 9.5, a: 0.25,
      d: "Девятый студийный альбом из 17 композиций на стыке романса, психоделии и тяжёлого арт-рока.",
      tr: new Array("Мелькнула чья-то тень","Скажи","Лабиринт","Волна","Мама мия","Королева красоты","Сухари и сушки","Мобильный","Праздник","Император","Бетховен","Маяк","Пряник","До встречи","Прочь из моей головы","Сын","Лепесток") },
    { id: "sig", n: "Сигнал из космоса", y: "2009", x: 35, y0: 125, rx: 14, ry: 9, a: -0.3,
      d: "Десятый студийный альбом с духовой секцией, камерной лирикой и космической образностью.",
      tr: new Array("Настройка звука","Дыши легко","Добро пожаловать","Без тормозов","Корабль ждёт","Чёрный цвет солнца","Вниз головой","Человек не спал","Ковчег","Больше никакого рок-н-ролла","Вальс","Письмо","Зелёная песня","Камень","3007") },
    { id: "obm", n: "Обман зрения", y: "2012", x: -75, y0: 155, rx: 14, ry: 9, a: 0.5,
      d: "Одиннадцатый студийный альбом, записанный в Петербурге на собственной студии группы.",
      tr: new Array("Увертюра","Летела жизнь","Чёрная «Волга»","Лестница","Страшная тайна","Петербургская свадьба","Дочь самурая","Фибоначчи","В мире иллюзий","Праздник","Конец прекрасной эпохи","Солнце взойдёт","Волшебное слово","Чудак") },
    { id: "res", n: "Резонанс. Часть 1 и 2", y: "2014", x: 5, y0: 168, rx: 15, ry: 9.5, a: -0.15,
      d: "Двенадцатый и тринадцатый студийные альбомы — масштабный двухчастный философский цикл.",
      tr: new Array("Валс","Мороз по коже","Мысль","Рай в шалаше","Всё наоборот","Пожар","Горизонт событий","Среди зимы","Оркестр","Танцуй!","Старый дом","Ай лов ю","Снег","Шахматы","Песня на одном аккорде") },
    { id: "key", n: "Ключ к шифру", y: "2016", x: 75, y0: 152, rx: 14, ry: 9, a: 0.4,
      d: "Четырнадцатый студийный альбом с акцентом на электронику, трип-хоп-биты и поэтические шифры.",
      tr: new Array("Медный грош","Пирамиды","Нам, мудрецам","Храм","Окраины","Кит","Она была так прекрасна","Джа играет джаз","Реквием","Земля уходит из-под ног","Тревога","Небесный хор","Путь на восток","Череп и кости","Деньги") },
    { id: "vst", n: "Встречная полоса", y: "2018", x: -72, y0: 35, rx: 14, ry: 9, a: -0.65,
      d: "Пятнадцатый студийный альбом, записанный на петербургской студии «Добролёт».",
      tr: new Array("На заре","Шаман","Тепло родного дома","Волк","Когда пройдёт сто лет","Булгаковский марш","Чей-то ребёнок","Испанская инквизиция","Встречная полоса","Яблоко","Шпионы") },
    { id: "vir", n: "Вира и майна", y: "2020", x: 75, y0: 95, rx: 14, ry: 9, a: -0.45,
      d: "Шестнадцатый студийный альбом группы, вышедший в декабре 2020 года.",
      tr: new Array("Передайте это Гарри Поттеру, если вдруг его встретите","Кесарь","За семью печатями","Вира и майна","Призрак","Кофе","Джин","Воздушный шар","Фокусник","Гарри","Атом") }
  );
  let box = document.getElementById("albBox");
  if (!box) {
    box = document.createElement("div"); box.id = "albBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:370px;max-width:calc(100vw - 40px);background:#110b0d;border:1px solid #33161e;border-radius:12px;padding:22px;z-index:120;display:none;flex-direction:column;gap:12px;color:#e6e2e3;font-family:-apple-system,sans-serif;overflow-y:auto";
    document.body.appendChild(box);
  }

  function showAlb(a) {
    act = a; box.style.display = "flex";
    const trs = a.tr.map((x, idx) => `<div style="background:#181013;border:1px solid #2b141b;padding:7px 10px;border-radius:6px;font-size:12px;margin-top:4px;display:flex;gap:8px"><span style="color:#7a5c64;font-family:monospace">${String(idx+1).padStart(2,"0")}</span><span>${x}</span></div>`).join("");
    box.innerHTML = `<div style="display:flex;justify-content:space-between;align-items:flex-start"><div><div style="font-size:10px;letter-spacing:1.2px;color:#d62839;font-weight:700">СПЛИН • ${a.y}</div><h2 style="font-size:20px;color:#fff;margin-top:2px">${a.n}</h2></div><button id="clsAlb" style="background:#1c1215;color:#aaa;border:1px solid #301a20;padding:5px 10px;border-radius:6px;cursor:pointer">✕</button></div><div style="background:#160e11;border-left:2px solid #d62839;padding:10px 12px;font-size:12.5px;line-height:1.45;color:#cfc4c7">${a.d}</div><div style="overflow-y:auto;padding-right:4px"><div style="font-size:10px;letter-spacing:1px;color:#7a686d;font-weight:700;margin-bottom:4px">ПОЛНЫЙ ТРЕКЛИСТ (${a.tr.length})</div>${trs}</div><a href="https://spotify.com{encodeURIComponent("Сплин " + a.n)}" target="_blank" style="margin-top:auto;background:#d62839;color:#fff;text-align:center;padding:11px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Слушать в Spotify ↗</a>`;
    document.getElementById("clsAlb").onclick = () => { box.style.display = "none"; act = null; };
  }

  // Фоновые зёрна строго внутри 3 долек разрезанного граната (как на референсе)
  let sd = 1998; function rnd() { sd = (sd * 1664525 + 1013904223) % 4294967296; return sd / 4294967296; }
  const BG = new Array();
  const LOBES = new Array(
    { cx: -92, cy: 5, rx: 68, ry: 112, rot: -0.18 },  // Левая долька
    { cx: 92,  cy: 5, rx: 68, ry: 112, rot: 0.18 },   // Правая долька
    { cx: 0,   cy: 132, rx: 95, ry: 56, rot: 0 }      // Нижняя долька
  );

  LOBES.forEach(lb => {
    for (let i = 0; i < 42; i++) {
      const ang = rnd() * 6.28, rad = Math.sqrt(rnd()) * 0.86;
      const lx0 = Math.cos(ang) * lb.rx * rad, ly0 = Math.sin(ang) * lb.ry * rad;
      const bx = lb.cx + lx0 * Math.cos(lb.rot) - ly0 * Math.sin(lb.rot);
      const by = lb.cy + lx0 * Math.sin(lb.rot) + ly0 * Math.cos(lb.rot);
      if (ALB.some(a => Math.hypot(bx - a.x, by - a.y0) < a.rx + 12)) continue;
      BG.push({ bx: bx, by: by, x: bx, y: by, vx: 0, vy: 0, rx: 10 + rnd() * 3.5, ry: 6 + rnd() * 2.5, a: rnd() * 6.28, p: rnd() * 6.28 });
    }
  });

  vc.addEventListener("mousedown", e => { drag = true; moved = false; lx = e.clientX; ly = e.clientY; });
  window.addEventListener("mousemove", e => { mx = e.clientX; my = e.clientY; if (drag) { vox += e.clientX - lx; voy += e.clientY - ly; lx = e.clientX; ly = e.clientY; moved = true; } });
  window.addEventListener("mouseup", () => { if (drag && !moved && hov) showAlb(hov); drag = false; });
  vc.addEventListener("wheel", e => { e.preventDefault(); vsc = Math.min(2.2, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9))); }, { passive: false });

  // Отрисовка художественного контура граната в разрезе (линогравюра с короной и дольками)
  function drawPomegranateShell() {
    vx.save();
    vx.lineCap = "round";
    vx.lineJoin = "round";

    // Внешний силуэт плода с короной сверху и хвостиком снизу
    vx.beginPath();
    vx.moveTo(-42, -165);
    vx.quadraticCurveTo(-55, -205, -72, -225); // левый зубец короны
    vx.quadraticCurveTo(-35, -208, -22, -182);
    vx.quadraticCurveTo(-10, -222, 0, -245);   // центральный пик короны
    vx.quadraticCurveTo(10, -222, 22, -182);
    vx.quadraticCurveTo(35, -208, 72, -225);   // правый зубец короны
    vx.quadraticCurveTo(55, -205, 42, -165);

    // Правый округлый бок
    vx.bezierCurveTo(175, -145, 225, -20, 195, 115);
    vx.bezierCurveTo(172, 195, 85, 228, 16, 232);
    vx.lineTo(0, 248); // нижний носик
    vx.lineTo(-16, 232);
    // Левый округлый бок
    vx.bezierCurveTo(-85, 228, -172, 195, -195, 115);
    vx.bezierCurveTo(-225, -20, -175, -145, -42, -165);
    vx.closePath();

    vx.fillStyle = "#12090c";
    vx.fill();
    vx.strokeStyle = "#8c1d2e";
    vx.lineWidth = 4.5;
    vx.stroke();

    // Внутренняя стенка кожуры (двойной контур гравюры)
    vx.beginPath();
    vx.ellipse(0, 32, 178, 185, 0, 0, Math.PI * 2);
    vx.strokeStyle = "rgba(140, 29, 46, 0.35)";
    vx.lineWidth = 2;
    vx.stroke();

    // Штрихи в короне как на референсе
    vx.strokeStyle = "#8c1d2e";
    vx.lineWidth = 2.5;
    vx.beginPath(); vx.moveTo(-12, -172); vx.lineTo(-16, -202); vx.stroke();
    vx.beginPath(); vx.moveTo(0, -170); vx.lineTo(0, -210); vx.stroke();
    vx.beginPath(); vx.moveTo(12, -172); vx.lineTo(16, -202); vx.stroke();

    // Контуры 3 внутренних перегородок-долек
    LOBES.forEach(lb => {
      vx.save();
      vx.translate(lb.cx, lb.cy);
      vx.rotate(lb.rot);
      vx.beginPath();
      vx.ellipse(0, 0, lb.rx + 8, lb.ry + 8, 0, 0, Math.PI * 2);
      vx.fillStyle = "#0b0608";
      vx.fill();
      vx.strokeStyle = "#7a1928";
      vx.lineWidth = 3;
      vx.stroke();
      vx.restore();
    });

    vx.restore();
  }

  function smoothSeed2D(x, y, rx, ry, a, fill, str, lw, isAlbum, isHi) {
    vx.save(); vx.translate(x, y); vx.rotate(a);
    vx.beginPath();
    vx.moveTo(-rx, 0);
    vx.bezierCurveTo(-rx * 0.88, -ry * 1.05, rx * 0.35, -ry * 1.15, rx, 0);
    vx.bezierCurveTo(rx * 0.35, ry * 1.15, -rx * 0.88, ry * 1.05, -rx, 0);
    vx.closePath();
    vx.fillStyle = fill; vx.fill();
    if (str) { vx.strokeStyle = str; vx.lineWidth = lw || 1; vx.stroke(); }

    // Внутренний плоский блик-штрих как на линогравюре
    vx.beginPath();
    vx.arc(-rx * 0.12, -ry * 0.1, rx * 0.45, -2.5, -0.7);
    vx.strokeStyle = isHi ? "rgba(255, 235, 238, 0.85)" : (isAlbum ? "rgba(255, 180, 190, 0.42)" : "rgba(220, 120, 135, 0.16)");
    vx.lineWidth = isHi ? 1.8 : (isAlbum ? 1.4 : 1);
    vx.stroke();
    vx.restore();
  }

  function renderSpleen() {
    t += 0.022;
    vx.fillStyle = "#080607";
    vx.fillRect(0, 0, vc.width, vc.height);

    vx.save();
    vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
    vx.scale(vsc, vsc);

    // Точные мировые координаты курсора (исправлено!)
    const wx = (mx - (vc.width / 2 + vox)) / vsc;
    const wy = (my - (vc.height / 2 + voy)) / vsc;

    hov = ALB.find(a => Math.hypot(wx - a.x, wy - a.y0) <= a.rx + 8);
    vc.style.cursor = hov ? "pointer" : (drag ? "grabbing" : "grab");

    // 1. Рисуем гравюру разрезанного граната
    drawPomegranateShell();

    // 2. Фоновые зёрна внутри долек — отталкиваются точно от курсора (wx, wy)
    for (let i = 0; i < BG.length; i++) {
      const s = BG[i];
      const tx = s.bx + Math.cos(t + s.p) * 1.1;
      const ty = s.by + Math.sin(t + s.p) * 1.1;
      const dx = s.x - wx, dy = s.y - wy, d = Math.hypot(dx, dy);
      if (d < 55 && d > 0.1) {
        const f = (1 - d / 55) * 3.4;
        s.vx += (dx / d) * f;
        s.vy += (dy / d) * f;
      }
      s.vx = (s.vx + (tx - s.x) * 0.1) * 0.78;
      s.vy = (s.vy + (ty - s.y) * 0.1) * 0.78;
      s.x += s.vx;
      s.y += s.vy;
      smoothSeed2D(s.x, s.y, s.rx, s.ry, s.a, "#4d101b", "#22050a", 1, false, false);
    }

    // 3. Зёрна-альбомы: чуть ярче и живее фоновых, но без вывесок до наведения
    ALB.forEach((a, idx) => {
      const hi = (hov && hov.id === a.id) || (act && act.id === a.id);
      const pulse = 1 + Math.sin(t * 1.6 + idx) * 0.04;
      const k = hi ? 1.2 : pulse;
      const fill = hi ? "#e02b40" : "#801828";
      const stroke = hi ? "#ffd6dc" : "#b8283b";
      smoothSeed2D(a.x, a.y0, a.rx * k, a.ry * k, a.a, fill, stroke, hi ? 1.6 : 1.1, true, hi);

      if (hi) {
        vx.font = "600 12px -apple-system, sans-serif";
        vx.textAlign = "center";
        vx.fillStyle = "#ffffff";
        vx.fillText(a.n + " • " + a.y, a.x, a.y0 - a.ry * k - 10);
      }
    });

    vx.restore();
    requestAnimationFrame(renderSpleen);
  }
  renderSpleen();
}
