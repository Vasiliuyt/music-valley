{
  const host = document.getElementById("vinylView");
  const oldCv = document.getElementById("vinylCv");
  if (oldCv) oldCv.style.display = "none";

  let stage = document.getElementById("granatStage");
  if (!stage) {
    stage = document.createElement("div");
    stage.id = "granatStage";
    stage.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:grab;background:#080607";
    host.appendChild(stage);
  }

  let vox = 0, voy = 0, vsc = 1, drag = false, moved = false, lx = 0, ly = 0, act = null;

  // Все 16 студийных альбомов «Сплина» (1994–2020) с полными треклистами
  const ALBUMS = new Array(
    { id: "dust", title: "Пыльная быль", year: "1994",
      desc: "Дебютный студийный альбом, записанный по ночам на студии Санкт-Петербургского театра «Буфф».",
      tracks: new Array("Жертва талого льда","Сказка","Алкоголь","Серебряные реки","Твоё разбитое пенсне","Мне сказали слово","Под сурдинку","Гроза","Война","Пыльная быль","Бонни и Клайд","Рыба без трусов") },
    { id: "kol", title: "Коллекционер оружия", year: "1996",
      desc: "Второй альбом, записанный при поддержке Бориса Гребенщикова и музыкантов «Аквариума».",
      tracks: new Array("Будь моей тенью","Любовь идёт по проводам","Чёрный цвет солнца","Самовар","Жертва талого льда","Что ты будешь делать?","Рыба без трусов","Странная песня","Иди через лес","Куда летит мой самолёт?") },
    { id: "lan", title: "Фонарь под глазом", year: "1997",
      desc: "Третий альбом: акустическая меланхолия, флейта Яна Николенко и нервный петербургский рок.",
      tracks: new Array("Бонни и Клайд","Англо-русский словарь","Молитва","Моя любовь","Три цвета","Невский проспект","Спи в моей голове","Приходи","За стеной","Праздник","Частушки","Давай, лама!") },
    { id: "grn", title: "Гранатовый альбом", year: "1998",
      desc: "Четвёртый студийный альбом, ставший главным стадионным прорывом группы в конце 90-х.",
      tracks: new Array("Весь этот бред","Достань гранату","Орбит без сахара","Приходи","Свет горел всю ночь","Люся сидит дома","Бог устал нас любить","Катись, колесо!","Выхода нет","Коктейли третьей мировой","Джим","Мария и Хуана","Подводная лодка") },
    { id: "alt", title: "Альтависта", year: "1999",
      desc: "Пятый студийный альбом — жёсткий, психоделический и экспериментальный разворот после стадионных хитов.",
      tracks: new Array("Альтависта","Молоко и мёд","Пил-курил","Терпсихора","Далеко домой","Абсент","Добрых дел мастер","Мотоциклетная цепь","Сумасшедший автобус","Алкоголь","Встретимся завтра") },
    { id: "k25", title: "25-й кадр", year: "2001",
      desc: "Шестой студийный альбом с плотным гитарно-электронным звуком и главными хитами начала 2000-х.",
      tracks: new Array("Линия жизни","Звезда рок-н-ролла","Всего хорошего","Моё сердце","Рики-Тики-Тави","Феллини","Остаёмся зимовать","Тебе это снится","Совсем другой","Пластмассовая жизнь","Пой мне ещё","Ленинград-Amsterdam","Fine") },
    { id: "new", title: "Новые люди", year: "2003",
      desc: "Седьмой студийный альбом — нервный хроникёрский взгляд на меняющийся город и эпоху.",
      tracks: new Array("Новые люди","Время, назад!","Гандбол","Сломано всё","Девятиэтажный дом","Блокада","Валдай","Йог спокоен","Северо-Запад","РЭП (Нервное сердце)","Альтависта (live)") },
    { id: "rev", title: "Реверсивная хроника событий", year: "2004",
      desc: "Восьмой студийный альбом — мрачный, минималистичный релиз, где впервые вышел легендарный «Романс».",
      tracks: new Array("Океан","Семь восьмых","Шато Марго","Мы сидели и курили","Сиануквиль","Человек и дерево","Бериллий","Тем, кто раньше нас","Паровоз","Урок географии","Романс","Люди на холме","Голос за кадром") },
    { id: "spl", title: "Раздвоение личности", year: "2007",
      desc: "Девятый студийный альбом из 17 песен на стыке романса, психоделии и тяжёлого арт-рока.",
      tracks: new Array("Мелькнула чья-то тень","Скажи","Лабиринт","Волна","Мама мия","Королева красоты","Сухари и сушки","Мобильный","Праздник","Император","Бетховен","Маяк","Пряник","До встречи","Прочь из моей головы","Сын","Лепесток") },
    { id: "sig", title: "Сигнал из космоса", year: "2009",
      desc: "Десятый студийный альбом с духовой секцией, камерной лирикой и космической образностью.",
      tracks: new Array("Настройка звука","Дыши легко","Добро пожаловать","Без тормозов","Корабль ждёт","Чёрный цвет солнца","Вниз головой","Человек не спал","Ковчег","Больше никакого рок-н-ролла","Вальс","Письмо","Зелёная песня","Камень","3007") },
    { id: "obm", title: "Обман зрения", year: "2012",
      desc: "Одиннадцатый студийный альбом, записанный в Петербурге на собственной студии группы.",
      tracks: new Array("Увертюра","Летела жизнь","Чёрная «Волга»","Лестница","Страшная тайна","Петербургская свадьба","Дочь самурая","Фибоначчи","В мире иллюзий","Праздник","Конец прекрасной эпохи","Солнце взойдёт","Волшебное слово","Чудак") },
    { id: "res1", title: "Резонанс. Часть 1", year: "2014",
      desc: "Двенадцатый студийный альбом — первая часть масштабного философского цикла.",
      tracks: new Array("Валс","Мороз по коже","Мысль","Рай в шалаше","Всё наоборот","Пожар","Горизонт событий","Среди зимы","Оркестр","Танцуй!","Старый дом","Ай лов ю","Снег","Шахматы","Песня на одном аккорде") },
    { id: "res2", title: "Резонанс. Часть 2", year: "2014",
      desc: "Тринадцатый студийный альбом — вторая, более камерная и лирическая часть дилогии «Резонанс».",
      tracks: new Array("Куда летит мой самолёт? (версия)","Двусмысленный","Среди зимы (акустика)","Полная луна","Песня на одном аккорде","Разговор","Нефть","Помолчим немного","Свет","Будь моей тенью (версия)","Финал") },
    { id: "key", title: "Ключ к шифру", year: "2016",
      desc: "Четырнадцатый студийный альбом с акцентом на электронику, трип-хоп-биты и поэтические шифры.",
      tracks: new Array("Медный грош","Пирамиды","Нам, мудрецам","Храм","Окраины","Кит","Она была так прекрасна","Джа играет джаз","Реквием","Земля уходит из-под ног","Тревога","Небесный хор","Путь на восток","Череп и кости","Деньги") },
    { id: "vst", title: "Встречная полоса", year: "2018",
      desc: "Пятнадцатый студийный альбом, записанный в Петербурге на студии «Добролёт».",
      tracks: new Array("На заре","Шаман","Тепло родного дома","Волк","Когда пройдёт сто лет","Булгаковский марш","Чей-то ребёнок","Испанская инквизиция","Встречная полоса","Яблоко","Шпионы") },
    { id: "vir", title: "Вира и майна", year: "2020",
      desc: "Шестнадцатый студийный альбом группы, вышедший в декабре 2020 года.",
      tracks: new Array("Передайте это Гарри Поттеру, если вдруг его встретите","Кесарь","За семью печатями","Вира и майна","Призрак","Кофе","Джин","Воздушный шар","Фокусник","Гарри","Атом") }
  );
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
          <div style="font-size:10px;letter-spacing:1.3px;color:#e02e31;font-weight:700">СПЛИН • ${a.year}</div>
          <h2 style="font-size:20px;color:#fff;margin-top:2px;line-height:1.25">${a.title}</h2>
        </div>
        <button id="clsAlb" style="background:#1d1215;color:#b5a5a9;border:1px solid #361a22;padding:5px 10px;border-radius:6px;cursor:pointer;font-size:13px">✕</button>
      </div>
      <div style="background:#170e11;border-left:2px solid #e02e31;padding:10px 12px;font-size:12.5px;line-height:1.45;color:#d4c8cb">${a.desc}</div>
      <div style="overflow-y:auto;padding-right:4px">
        <div style="font-size:10px;letter-spacing:1px;color:#857075;font-weight:700;margin-bottom:4px">ПОЛНЫЙ ТРЕКЛИСТ (${a.tracks.length})</div>
        ${trs}
      </div>
      <a href="https://spotify.com{encodeURIComponent("Сплин " + a.title)}" target="_blank" style="margin-top:auto;background:#e02e31;color:#fff;text-align:center;padding:11px;border-radius:8px;text-decoration:none;font-weight:600;font-size:13px">Слушать в Spotify ↗</a>
    `;
    document.getElementById("clsAlb").onclick = () => {
      box.style.display = "none";
      act = null;
    };
  }

  const wrap = document.createElement("div");
  wrap.style.cssText = "position:relative;width:min(82vh,82vw);height:min(82vh,82vw);transform-origin:center center";
  stage.appendChild(wrap);

  const tip = document.createElement("div");
  tip.style.cssText = "position:fixed;pointer-events:none;background:rgba(16,10,12,0.96);border:1px solid #e02e31;color:#fff;padding:6px 11px;border-radius:7px;font-size:12px;font-weight:600;z-index:130;display:none;white-space:nowrap;box-shadow:0 8px 24px rgba(0,0,0,0.75)";
  document.body.appendChild(tip);

  fetch("granat.svg")
    .then(r => r.text())
    .then(svgText => {
      const cleanSvg = svgText.replace(/<\?xml[\s\S]*?\?>/i, "").replace(/<!DOCTYPE[\s\S]*?>/i, "");
      wrap.innerHTML = cleanSvg;
      const svgEl = wrap.querySelector("svg");
      if (!svgEl) return;

      svgEl.style.width = "100%";
      svgEl.style.height = "100%";
      svgEl.style.display = "block";
      svgEl.style.overflow = "visible";

      const allPaths = Array.from(svgEl.querySelectorAll("path"));
      if (allPaths.length > 1) {
        allPaths.style.fill = "#b82328";
        allPaths.style.pointerEvents = "none";
      }

      // Берём только настоящие крупные зёрна (исключаем микро-артефакт в самом конце)
      const seedPaths = allPaths.slice(1, allPaths.length - 1);
      seedPaths.sort((p1, p2) => {
        const b1 = p1.getBBox(), b2 = p2.getBBox();
        return (b2.y - b1.y) * 0.6 + (b1.x - b2.x) * 0.4;
      });

      const step = Math.max(1, Math.floor(seedPaths.length / ALBUMS.length));
      let albIdx = 0;

      seedPaths.forEach((p, idx) => {
        p.style.transition = "fill 0.2s ease, filter 0.2s ease";

        if (idx % step === 0 && albIdx < ALBUMS.length) {
          const alb = ALBUMS[albIdx++];
          p.style.fill = "#e63238";
          p.style.cursor = "pointer";

          p.addEventListener("mouseenter", () => {
            p.style.fill = "#ff6b70";
            p.style.filter = "drop-shadow(0 0 18px rgba(255, 80, 90, 0.9))";
            tip.textContent = alb.title + " • " + alb.year;
            tip.style.display = "block";
          });

          p.addEventListener("mousemove", e => {
            tip.style.left = (e.clientX + 14) + "px";
            tip.style.top = (e.clientY - 14) + "px";
          });

          p.addEventListener("mouseleave", () => {
            p.style.fill = "#e63238";
            p.style.filter = "none";
            tip.style.display = "none";
          });

          p.addEventListener("click", e => {
            e.stopPropagation();
            showAlb(alb);
          });
        } else {
          p.style.fill = "#9e1c22";
          p.addEventListener("mouseenter", () => { p.style.fill = "#bd242b"; });
          p.addEventListener("mouseleave", () => { p.style.fill = "#9e1c22"; });
        }
      });
    });

  function updTransform() {
    wrap.style.transform = `translate(${vox}px, ${voy}px) scale(${vsc})`;
  }

  stage.addEventListener("mousedown", e => {
    drag = true; moved = false; lx = e.clientX; ly = e.clientY;
    stage.style.cursor = "grabbing";
  });
  window.addEventListener("mousemove", e => {
    if (!drag) return;
    vox += e.clientX - lx; voy += e.clientY - ly; lx = e.clientX; ly = e.clientY;
    moved = true; updTransform();
  });
  window.addEventListener("mouseup", () => { drag = false; stage.style.cursor = "grab"; });
  stage.addEventListener("wheel", e => {
    e.preventDefault();
    vsc = Math.min(2.6, Math.max(0.6, vsc * (e.deltaY < 0 ? 1.1 : 0.9)));
    updTransform();
  }, { passive: false });
}
