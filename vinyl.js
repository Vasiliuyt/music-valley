{
  const vc = document.getElementById("vinylCv");
  const vx = vc.getContext("2d");

  let vox = 0, voy = 10, vsc = 1, drag = false, moved = false;
  let lx = 0, ly = 0, mx = -9999, my = -9999, tick = 0;
  let hov = null, act = null;

  function resizeCanvas() {
    vc.width = window.innerWidth;
    vc.height = window.innerHeight;
  }
  window.addEventListener("resize", resizeCanvas);
  resizeCanvas();

  // ПОЛНАЯ СТУДИЙНАЯ ДИСКОГРАФИЯ ГРУППЫ «СПЛИН» (16 АЛЬБОМОВ, 1994–2020)
  // Координаты (x, y0) расставлены вручную внутри трёх долек граната без единого пересечения!
  const ALBUMS = new Array(
    // --- ЛЕВАЯ ДОЛЬКА ГРАНАТА (Ранний и классический период 1994–2001) ---
    {
      id: "dust", title: "Пыльная быль", year: "1994",
      x: -102, y0: -52, rx: 14, ry: 9, ang: -0.45,
      desc: "Дебютный студийный альбом, записанный по ночам на студии Санкт-Петербургского театра «Буфф».",
      tracks: new Array(
        "Жертва талого льда", "Сказка", "Алкоголь", "Серебряные реки",
        "Твоё разбитое пенсне", "Мне сказали слово", "Под сурдинку",
        "Гроза", "Война", "Пыльная быль", "Бонни и Клайд", "Рыба без трусов"
      )
    },
    {
      id: "kol", title: "Коллекционер оружия", year: "1996",
      x: -138, y0: -15, rx: 14, ry: 9, ang: -0.15,
      desc: "Второй студийный альбом, записанный при поддержке Бориса Гребенщикова и музыкантов «Аквариума».",
      tracks: new Array(
        "Будь моей тенью", "Любовь идёт по проводам", "Чёрный цвет солнца",
        "Самовар", "Жертва талого льда", "Что ты будешь делать?",
        "Рыба без трусов", "Странная песня", "Иди через лес", "Куда летит мой самолёт?"
      )
    },
    {
      id: "lan", title: "Фонарь под глазом", year: "1997",
      x: -72, y0: -18, rx: 14.5, ry: 9.2, ang: 0.35,
      desc: "Третий альбом: акустическая меланхолия, флейта Яна Николенко и нервный петербургский рок.",
      tracks: new Array(
        "Бонни и Клайд", "Англо-русский словарь", "Молитва", "Моя любовь",
        "Три цвета", "Невский проспект", "Спи в моей голове", "Приходи",
        "За стеной", "Праздник", "Частушки", "Давай, лама!"
      )
    },
    {
      id: "grn", title: "Гранатовый альбом", year: "1998",
      x: -115, y0: 28, rx: 16.5, ry: 10.5, ang: -0.25,
      desc: "Четвёртый студийный альбом, ставший главным стадионным прорывом группы в конце 90-х.",
      tracks: new Array(
        "Весь этот бред", "Достань гранату", "Орбит без сахара", "Приходи",
        "Свет горел всю ночь", "Люся сидит дома", "Бог устал нас любить",
        "Катись, колесо!", "Выхода нет", "Коктейли третьей мировой",
        "Джим", "Мария и Хуана", "Подводная лодка"
      )
    },
    {
      id: "alt", title: "Альтависта", year: "1999",
      x: -64, y0: 42, rx: 14.5, ry: 9.2, ang: 0.48,
      desc: "Пятый студийный альбом — жёсткий, психоделический и экспериментальный разворот после стадионных хитов.",
      tracks: new Array(
        "Альтависта", "Молоко и мёд", "Пил-курил", "Терпсихора",
        "Далеко домой", "Абсент", "Добрых дел мастер", "Мотоциклетная цепь",
        "Сумасшедший автобус", "Алкоголь", "Встретимся завтра"
      )
    },
    {
      id: "k25", title: "25-й кадр", year: "2001",
      x: -98, y0: 76, rx: 15.5, ry: 9.8, ang: -0.35,
      desc: "Шестой студийный альбом с плотным гитарно-электронным звуком и главными хитами начала 2000-х.",
      tracks: new Array(
        "Линия жизни", "Звезда рок-н-ролла", "Всего хорошего", "Моё сердце",
        "Рики-Тики-Тави", "Феллини", "Остаёмся зимовать", "Тебе это снится",
        "Совсем другой", "Пластмассовая жизнь", "Пой мне ещё",
        "Ленинград-Amsterdam", "Fine"
      )
    },

    // --- ПРАВАЯ ДОЛЬКА ГРАНАТА (2003–2012, включая «Романс» и «Обман зрения») ---
    {
      id: "new", title: "Новые люди", year: "2003",
      x: 96, y0: -52, rx: 14.5, ry: 9.2, ang: 0.42,
      desc: "Седьмой студийный альбом — нервный хроникёрский взгляд на меняющийся город и эпоху.",
      tracks: new Array(
        "Новые люди", "Время, назад!", "Гандбол", "Сломано всё",
        "Девятиэтажный дом", "Блокада", "Валдай", "Йог спокоен",
        "Северо-Запад", "РЭП (Нервное сердце)", "Альтависта (live)"
      )
    },
    {
      id: "rev", title: "Реверсивная хроника событий", year: "2004",
      x: 132, y0: -12, rx: 15.5, ry: 9.8, ang: -0.28,
      desc: "Восьмой студийный альбом — мрачный, минималистичный релиз, где впервые вышел легендарный «Романс».",
      tracks: new Array(
        "Океан", "Семь восьмых", "Шато Марго", "Мы сидели и курили",
        "Сиануквиль", "Человек и дерево", "Бериллий", "Тем, кто раньше нас",
        "Паровоз", "Урок географии", "Романс", "Люди на холме", "Голос за кадром"
      )
    },
    {
      id: "spl", title: "Раздвоение личности", year: "2007",
      x: 68, y0: -14, rx: 14.5, ry: 9.2, ang: 0.3,
      desc: "Девятый студийный альбом из 17 песен на стыке романса, психоделии и тяжёлого арт-рока.",
      tracks: new Array(
        "Мелькнула чья-то тень", "Скажи", "Лабиринт", "Волна", "Мама мия",
        "Королева красоты", "Сухари и сушки", "Мобильный", "Праздник",
        "Император", "Бетховен", "Маяк", "Пряник", "До встречи",
        "Прочь из моей головы", "Сын", "Лепесток"
      )
    },
    {
      id: "sig", title: "Сигнал из космоса", year: "2009",
      x: 112, y0: 32, rx: 14.5, ry: 9.2, ang: 0.5,
      desc: "Десятый студийный альбом с духовой секцией, камерной лирикой и космической образностью.",
      tracks: new Array(
        "Настройка звука", "Дыши легко", "Добро пожаловать", "Без тормозов",
        "Корабль ждёт", "Чёрный цвет солнца", "Вниз головой", "Человек не спал",
        "Ковчег", "Больше никакого рок-н-ролла", "Вальс", "Письмо",
        "Зелёная песня", "Камень", "3007"
      )
    },
    {
      id: "obm", title: "Обман зрения", year: "2012",
      x: 64, y0: 44, rx: 15, ry: 9.5, ang: -0.42,
      desc: "Одиннадцатый студийный альбом, записанный в Петербурге на собственной студии группы.",
      tracks: new Array(
        "Увертюра", "Летела жизнь", "Чёрная «Волга»", "Лестница",
        "Страшная тайна", "Петербургская свадьба", "Дочь самурая",
        "Фибоначчи", "В мире иллюзий", "Праздник", "Конец прекрасной эпохи",
        "Солнце взойдёт", "Волшебное слово", "Чудак"
      )
    },
    {
      id: "res1", title: "Резонанс. Часть 1", year: "2014",
      x: 96, y0: 78, rx: 14.5, ry: 9.2, ang: -0.2,
      desc: "Двенадцатый студийный альбом — первая часть масштабного философского цикла.",
      tracks: new Array(
        "Валс", "Мороз по коже", "Мысль", "Рай в шалаше", "Всё наоборот",
        "Пожар", "Горизонт событий", "Среди зимы", "Оркестр", "Танцуй!",
        "Старый дом", "Ай лов ю", "Снег", "Шахматы", "Песня на одном аккорде"
      )
    },

    // --- НИЖНЯЯ ДОЛЬКА ГРАНАТА (2014–2020) ---
    {
      id: "res2", title: "Резонанс. Часть 2", year: "2014",
      x: -56, y0: 138, rx: 14.5, ry: 9.2, ang: -0.32,
      desc: "Тринадцатый студийный альбом — вторая, более камерная и лирическая часть дилогии «Резонанс».",
      tracks: new Array(
        "Куда летит мой самолёт? (версия)", "Двусмысленный", "Среди зимы (акустика)",
        "Полная луна", "Песня на одном аккорде", "Разговор", "Нефть",
        "Помолчим немного", "Свет", "Будь моей тенью (версия)", "Финал"
      )
    },
    {
      id: "key", title: "Ключ к шифру", year: "2016",
      x: -16, y0: 158, rx: 15, ry: 9.5, ang: 0.22,
      desc: "Четырнадцатый студийный альбом с акцентом на электронику, трип-хоп-биты и поэтические шифры.",
      tracks: new Array(
        "Медный грош", "Пирамиды", "Нам, мудрецам", "Храм", "Окраины",
        "Кит", "Она была так прекрасна", "Джа играет джаз", "Реквием",
        "Земля уходит из-под ног", "Тревога", "Небесный хор",
        "Путь на восток", "Череп и кости", "Деньги"
      )
    },
    {
      id: "vst", title: "Встречная полоса", year: "2018",
      x: 24, y0: 136, rx: 14.5, ry: 9.2, ang: -0.45,
      desc: "Пятнадцатый студийный альбом, записанный в Петербурге на студии «Добролёт».",
      tracks: new Array(
        "На заре", "Шаман", "Тепло родного дома", "Волк",
        "Когда пройдёт сто лет", "Булгаковский марш", "Чей-то ребёнок",
        "Испанская инквизиция", "Встречная полоса", "Яблоко", "Шпионы"
      )
    },
    {
      id: "vir", title: "Вира и майна", year: "2020",
      x: 58, y0: 156, rx: 14.5, ry: 9.2, ang: 0.35,
      desc: "Шестнадцатый студийный альбом группы, вышедший в декабре 2020 года.",
      tracks: new Array(
        "Передайте это Гарри Поттеру, если вдруг его встретите", "Кесарь",
        "За семью печатями", "Вира и майна", "Призрак", "Кофе",
        "Джин", "Воздушный шар", "Фокусник", "Гарри", "Атом"
      )
    }
  );
  // Боковая панель альбома с полным треклистом
  let box = document.getElementById("albBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "albBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:380px;max-width:calc(100vw - 40px);background:#120b0d;border:1px solid #381820;border-radius:12px;padding:22px;z-index:120;display:none;flex-direction:column;gap:12px;color:#ede6e8;font-family:-apple-system,BlinkMacSystemFont,sans-serif;overflow-y:auto;box-shadow:-16px 0 50px rgba(0,0,0,0.85)";
    document.body.appendChild(box);
  }

  function showAlb(a) {
    act = a;
    box.style.display = "flex";
    const trs = a.tracks.map((x, idx) =>
      `<div style="background:#191013;border:1px solid #2e151c;padding:7px 10px;border-radius:6px;font-size:12px;margin-top:4px;display:flex;gap:8px;align-items:center">
        <span style="color:#8c5864;font-family:monospace;font-size:11px">${String(idx + 1).padStart(2, "0")}</span>
        <span>${x}</span>
      </div>`
    ).join("");

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div>
          <div style="font-size:10px;letter-spacing:1.3px;color:#d62839;font-weight:700">СПЛИН • ${a.year}</div>
          <h2 style="font-size:20px;color:#fff;margin-top:2px;line-height:1.25">${a.title}</h2>
        </div>
        <button id="clsAlb" style="background:#1d1215;color:#b5a5a9;border:1px solid #361a22;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:13px">✕</button>
      </div>
      <div style="background:#170e11;border-left:2px solid #d62839;padding:10px 12px;font-size:12.5px;line-height:1.45;color:#d4c8cb">${a.desc}</div>
      <div style="overflow-y:auto;padding-right:4px">
        <div style="font-size:10px;letter-spacing:1px;color:#857075;font-weight:700;margin-bottom:4px">ПОЛНЫЙ ТРЕКЛИСТ (${a.tracks.length})</div>
        ${trs}
      </div>
      <a href="https://spotify.com{encodeURIComponent("Сплин " + a.title)}" target="_blank" style="margin-top:auto;background:#d62839;color:#fff;text-align:center;padding:11px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Слушать в Spotify ↗</a>
    `;
    document.getElementById("clsAlb").onclick = () => {
      box.style.display = "none";
      act = null;
    };
  }

  // ПУТИ ДОЛЕК ГРАНАТА (органические формы кривыми Безье как на референсе линогравюры)
  function traceLeftLobe(c) {
    c.beginPath();
    c.moveTo(-48, -108);
    c.bezierCurveTo(-118, -112, -172, -55, -168, 22);
    c.bezierCurveTo(-165, 88, -112, 118, -46, 102);
    c.bezierCurveTo(-18, 94, -14, 38, -18, -15);
    c.bezierCurveTo(-22, -68, -24, -105, -48, -108);
    c.closePath();
  }

  function traceRightLobe(c) {
    c.beginPath();
    c.moveTo(48, -108);
    c.bezierCurveTo(118, -112, 172, -55, 168, 22);
    c.bezierCurveTo(165, 88, 112, 118, 46, 102);
    c.bezierCurveTo(18, 94, 14, 38, 18, -15);
    c.bezierCurveTo(22, -68, 24, -105, 48, -108);
    c.closePath();
  }

  function traceBottomLobe(c) {
    c.beginPath();
    c.moveTo(-36, 114);
    c.bezierCurveTo(-12, 105, 12, 105, 36, 114);
    c.bezierCurveTo(84, 128, 98, 165, 62, 184);
    c.bezierCurveTo(26, 198, -26, 198, -62, 184);
    c.bezierCurveTo(-98, 165, -84, 128, -36, 114);
    c.closePath();
  }

  // Генерируем фоновые зёрна строго внутри 3 долек с проверкой дистанции (НИ ОДНО НЕ СЛИПАЕТСЯ!)
  let sd = 2004;
  function rnd() {
    sd = (sd * 1664525 + 1013904223) % 4294967296;
    return sd / 4294967296;
  }

  const BG_SEEDS = new Array();
  const lobeFns = new Array(traceLeftLobe, traceRightLobe, traceBottomLobe);

  // Используем временный контекст для точной проверки попадания точки внутрь кривой Безье
  lobeFns.forEach(fn => {
    fn(vx);
    for (let attempt = 0; attempt < 900; attempt++) {
      const bx = -165 + rnd() * 330;
      const by = -105 + rnd() * 300;
      if (!vx.isPointInPath(bx, by)) continue;

      // Проверяем, чтобы зерно не подходило слишком близко к зёрнам-альбомам
      let ok = true;
      for (let i = 0; i < ALBUMS.length; i++) {
        if (Math.hypot(bx - ALBUMS[i].x, by - ALBUMS[i].y0) < 28) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      // Проверяем, чтобы фоновые зёрна не налезали друг на друга
      for (let i = 0; i < BG_SEEDS.length; i++) {
        if (Math.hypot(bx - BG_SEEDS[i].bx, by - BG_SEEDS[i].by) < 22) {
          ok = false;
          break;
        }
      }
      if (!ok) continue;

      BG_SEEDS.push({
        bx: bx, by: by, x: bx, y: by, vx: 0, vy: 0,
        rx: 10.5 + rnd() * 2.5,
        ry: 6.5 + rnd() * 1.8,
        ang: rnd() * Math.PI * 2,
        phase: rnd() * Math.PI * 2
      });
    }
  });
  vc.addEventListener("mousedown", e => {
    drag = true;
    moved = false;
    lx = e.clientX;
    ly = e.clientY;
  });
  window.addEventListener("mousemove", e => {
    mx = e.clientX;
    my = e.clientY;
    if (drag) {
      vox += e.clientX - lx;
      voy += e.clientY - ly;
      lx = e.clientX;
      ly = e.clientY;
      moved = true;
    }
  });
  window.addEventListener("mouseup", () => {
    if (drag && !moved && hov) showAlb(hov);
    drag = false;
  });
  vc.addEventListener("wheel", e => {
    e.preventDefault();
    vsc = Math.min(2.3, Math.max(0.65, vsc * (e.deltaY < 0 ? 1.1 : 0.9)));
  }, { passive: false });

  // ОТРИСОВКА ЛИНОГРАВЮРЫ ГРАНАТА КАК НА ПЕРВОМ РЕФЕРЕНСЕ (image_4H12EE.png)
  function drawLinocutPomegranate() {
    vx.save();
    vx.lineCap = "round";
    vx.lineJoin = "round";

    const ink = "#8e1c2e";
    const inkSoft = "rgba(142, 28, 46, 0.45)";

    // 1. Внешний силуэт плода с пышной 5-лепестковой короной и нижним хвостиком
    vx.beginPath();
    vx.moveTo(-36, -158);
    // Левый крайний лепесток короны
    vx.quadraticCurveTo(-56, -198, -88, -214);
    vx.quadraticCurveTo(-54, -206, -34, -182);
    // Левый средний зубец
    vx.quadraticCurveTo(-30, -208, -24, -222);
    vx.quadraticCurveTo(-15, -200, -10, -184);
    // Центральный высокий пик короны
    vx.quadraticCurveTo(-5, -225, 0, -252);
    vx.quadraticCurveTo(5, -225, 10, -184);
    // Правый средний зубец
    vx.quadraticCurveTo(15, -200, 24, -222);
    vx.quadraticCurveTo(30, -208, 34, -182);
    // Правый крайний лепесток короны
    vx.quadraticCurveTo(54, -206, 88, -214);
    vx.quadraticCurveTo(56, -198, 36, -158);

    // Правый округлый силуэт плода
    vx.bezierCurveTo(148, -142, 212, -45, 196, 82);
    vx.bezierCurveTo(182, 178, 102, 214, 18, 218);
    // Нижний хвостик-чашелистик
    vx.quadraticCurveTo(8, 232, 0, 242);
    vx.quadraticCurveTo(-8, 232, -18, 218);
    // Левый округлый силуэт плода
    vx.bezierCurveTo(-102, 214, -182, 178, -196, 82);
    vx.bezierCurveTo(-212, -45, -148, -142, -36, -158);
    vx.closePath();

    vx.fillStyle = "#10080a";
    vx.fill();
    vx.strokeStyle = ink;
    vx.lineWidth = 6;
    vx.stroke();

    // 2. Внутренний двойной контур кожуры (эффект резьбы по линолеуму)
    vx.beginPath();
    vx.moveTo(-34, -138);
    vx.bezierCurveTo(132, -126, 190, -38, 176, 76);
    vx.bezierCurveTo(164, 162, 92, 196, 16, 200);
    vx.quadraticCurveTo(0, 208, -16, 200);
    vx.bezierCurveTo(-92, 196, -164, 162, -176, 76);
    vx.bezierCurveTo(-190, -38, -132, -126, -34, -138);
    vx.closePath();
    vx.strokeStyle = ink;
    vx.lineWidth = 3.2;
    vx.stroke();

    // 3. Декоративные штрихи-насечки в короне и вдоль кожуры как на референсе
    vx.strokeStyle = ink;
    vx.lineWidth = 2.4;
    const crownStrokes = new Array(
      new Array(-18, -164, -22, -192),
      new Array(-8,  -162, -9,  -204),
      new Array(0,   -160, 0,   -216),
      new Array(8,   -162, 9,   -204),
      new Array(18,  -164, 22,  -192)
    );
    crownStrokes.forEach(s => {
      vx.beginPath();
      vx.moveTo(s[0], s[1]);
      vx.lineTo(s[2], s[3]);
      vx.stroke();
    });

    // Тонкие дуговые штрихи текстуры внутри мякоти кожуры
    vx.strokeStyle = inkSoft;
    vx.lineWidth = 1.8;
    vx.beginPath(); vx.arc(0, 32, 184, 2.35, 3.65); vx.stroke();
    vx.beginPath(); vx.arc(0, 32, 184, -0.5, 0.8); vx.stroke();
    vx.beginPath(); vx.arc(0, 32, 184, 1.15, 1.95); vx.stroke();

    // 4. Три органические перегородки-дольки (двойная линия резьбы)
    const lobes = new Array(traceLeftLobe, traceRightLobe, traceBottomLobe);
    lobes.forEach(fn => {
      fn(vx);
      vx.fillStyle = "#090507";
      vx.fill();
      vx.strokeStyle = ink;
      vx.lineWidth = 3.6;
      vx.stroke();
    });

    vx.restore();
  }

  // Отрисовка зерна в стиле гравюры (плоский рубин + чёткий внутренний блик-пятнышко как на референсе)
  function drawLinocutSeed(x, y, rx, ry, ang, fillCol, strokeCol, lw, spotAlpha) {
    vx.save();
    vx.translate(x, y);
    vx.rotate(ang);

    vx.beginPath();
    vx.moveTo(-rx, 0);
    vx.bezierCurveTo(-rx * 0.85, -ry * 1.05, rx * 0.4, -ry * 1.12, rx, 0);
    vx.bezierCurveTo(rx * 0.4, ry * 1.12, -rx * 0.85, ry * 1.05, -rx, 0);
    vx.closePath();

    vx.fillStyle = fillCol;
    vx.fill();

    if (strokeCol) {
      vx.strokeStyle = strokeCol;
      vx.lineWidth = lw || 1.2;
      vx.stroke();
    }

    // Светлое внутреннее пятнышко-семечко как на обоих референсах
    vx.fillStyle = "rgba(255, 225, 230, " + spotAlpha + ")";
    vx.beginPath();
    vx.ellipse(-rx * 0.15, -ry * 0.12, rx * 0.34, ry * 0.24, -0.2, 0, Math.PI * 2);
    vx.fill();

    vx.restore();
  }

  function renderSpleen() {
    tick += 0.02;
    vx.fillStyle = "#080607";
    vx.fillRect(0, 0, vc.width, vc.height);

    vx.save();
    vx.translate(vc.width / 2 + vox, vc.height / 2 + voy);
    vx.scale(vsc, vsc);

    const wx = (mx - (vc.width / 2 + vox)) / vsc;
    const wy = (my - (vc.height / 2 + voy)) / vsc;

    hov = ALBUMS.find(a => Math.hypot(wx - a.x, wy - a.y0) <= a.rx + 8);
    vc.style.cursor = hov ? "pointer" : (drag ? "grabbing" : "grab");

    // 1. Гравюра разрезанного граната
    drawLinocutPomegranate();

    // 2. Фоновые зёрна внутри долек с живым откликом ровно под курсором
    for (let i = 0; i < BG_SEEDS.length; i++) {
      const s = BG_SEEDS[i];
      const tx = s.bx + Math.cos(tick + s.phase) * 0.9;
      const ty = s.by + Math.sin(tick + s.phase) * 0.9;
      const dx = s.x - wx, dy = s.y - wy, d = Math.hypot(dx, dy);

      if (d < 48 && d > 0.1) {
        const f = (1 - d / 48) * 2.8;
        s.vx += (dx / d) * f;
        s.vy += (dy / d) * f;
      }
      s.vx = (s.vx + (tx - s.x) * 0.12) * 0.76;
      s.vy = (s.vy + (ty - s.y) * 0.12) * 0.76;
      s.x += s.vx;
      s.y += s.vy;

      drawLinocutSeed(s.x, s.y, s.rx, s.ry, s.ang, "#5c111e", "#2b060d", 1.2, 0.18);
    }

    // 3. Зёрна-альбомы (чуть богаче по цвету и обводке, но без горящих вывесок до наведения)
    ALBUMS.forEach((a, idx) => {
      const hi = (hov && hov.id === a.id) || (act && act.id === a.id);
      const pulse = 1 + Math.sin(tick * 1.5 + idx) * 0.035;
      const k = hi ? 1.18 : pulse;

      const fill = hi ? "#e02b40" : "#8f192b";
      const stroke = hi ? "#ffe3e7" : "#c93247";
      const spot = hi ? 0.65 : 0.34;

      drawLinocutSeed(a.x, a.y0, a.rx * k, a.ry * k, a.ang, fill, stroke, hi ? 1.8 : 1.3, spot);

      if (hi) {
        vx.font = "600 12px -apple-system, BlinkMacSystemFont, sans-serif";
        vx.textAlign = "center";
        vx.fillStyle = "#ffffff";
        vx.fillText(a.title + " • " + a.year, a.x, a.y0 - a.ry * k - 10);
      }
    });

    vx.restore();
    requestAnimationFrame(renderSpleen);
  }

  renderSpleen();
}
