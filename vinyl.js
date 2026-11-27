{
  const host = document.getElementById("vinylView");
  const oldCv = document.getElementById("vinylCv");
  if (oldCv) oldCv.style.display = "none";

  // 1. ЭКРАН ГРАНАТА (Сцена «Сплин»)
  let stage = document.getElementById("granatStage");
  if (!stage) {
    stage = document.createElement("div");
    stage.id = "granatStage";
    stage.style.cssText = "position:fixed;inset:0;display:flex;align-items:center;justify-content:center;overflow:hidden;cursor:grab;background:#080607;transition:opacity 0.55s ease, transform 0.55s ease";
    host.appendChild(stage);
  }

  // 2. ОТДЕЛЬНОЕ ОКНО СЦЕНЫ АЛЬБОМА (например, «Реверсивная хроника событий»)
  let albScene = document.getElementById("albumSceneView");
  if (!albScene) {
    albScene = document.createElement("div");
    albScene.id = "albumSceneView";
    albScene.style.cssText = "position:fixed;inset:0;z-index:90;opacity:0;pointer-events:none;transition:opacity 0.6s ease;background:radial-gradient(circle at 50% 45%,#15171c 0%,#08090c 82%);display:flex;align-items:center;justify-content:center;overflow:hidden";
    host.appendChild(albScene);
  }

  let vox = 0, voy = 0, vsc = 1, drag = false, moved = false, lx = 0, ly = 0, act = null;
  let mouseX = -9999, mouseY = -9999;

  const ALBUMS = new Array(
    {
      id: "dust", title: "Пыльная быль", year: "1994",
      entry: "«Жертва талого льда» • «Рыба без трусов»",
      story: "Записан по ночам в студии питерского театра «Буфф» на деньги от озвучки рекламы. Внутри — дух ленинградских квартирников, флейта и поэтический абсурд.",
      links: "Связи: Александр Башлачёв • «Аквариум» • Ленинградский рок-клуб",
      tracks: new Array("Жертва талого льда","Сказка","Алкоголь","Серебряные реки","Твоё разбитое пенсне","Мне сказали слово","Под сурдинку","Гроза","Война","Пыльная быль","Бонни и Клайд","Рыба без трусов")
    },
    {
      id: "kol", title: "Коллекционер оружия", year: "1996",
      entry: "«Будь моей тенью» • «Любовь идёт по проводам»",
      story: "Московский дебют группы: Борис Гребенщиков высоко оценил демо-кассету, а музыканты «Аквариума» помогли с записью и выходом на большую сцену.",
      links: "Связи: Борис Гребенщиков • «Аквариум» • Студия «Мелодия»",
      tracks: new Array("Будь моей тенью","Любовь идёт по проводам","Чёрный цвет солнца","Самовар","Жертва талого льда","Что ты будешь делать?","Рыба без трусов","Странная песня","Иди через лес","Куда летит мой самолёт?")
    },
    {
      id: "lan", title: "Фонарь под глазом", year: "1997",
      entry: "«Англо-русский словарь» • «Моя любовь»",
      story: "Альбом-переход от камерного фолк-рока к нервному гитарному саунду с фирменной флейтой Яна Николенко и петербургской меланхолией.",
      links: "Связи: Ян Николенко («Эдипов комплекс») • Питерский арт-рок 90-х",
      tracks: new Array("Бонни и Клайд","Англо-русский словарь","Молитва","Моя любовь","Три цвета","Невский проспект","Спи в моей голове","Приходи","За стеной","Праздник","Частушки","Давай, лама!")
    },
    {
      id: "grn", title: "Гранатовый альбом", year: "1998",
      entry: "«Орбит без сахара» • «Выхода нет»",
      story: "Главный стадионный прорыв конца 90-х. Жёсткие гранжевые риффы и точные формулы эпохи сделали «Сплин» хедлайнером рок-фестивалей.",
      links: "Связи: Русский гранж 90-х • «Брат-2» • Стадионный рок",
      tracks: new Array("Весь этот бред","Достань гранату","Орбит без сахара","Приходи","Свет горел всю ночь","Люся сидит дома","Бог устал нас любить","Катись, колесо!","Выхода нет","Коктейли третьей мировой","Джим","Мария и Хуана","Подводная лодка")
    },
    {
      id: "alt", title: "Альтависта", year: "1999",
      entry: "«Молоко и мёд» • «Пил-курил»",
      story: "Резкий, тяжёлый и психоделический поворот: вместо ожидаемых радиохитов группа записала плотный, мрачный альбом на стыке постпанка и индастриала.",
      links: "Связи: Постпанк • Трип-хоп • Экспериментальный рок конца 90-х",
      tracks: new Array("Альтависта","Молоко и мёд","Пил-курил","Терпсихора","Далеко домой","Абсент","Добрых дел мастер","Мотоциклетная цепь","Сумасшедший автобус","Алкоголь","Встретимся завтра")
    },
    {
      id: "k25", title: "25-й кадр", year: "2001",
      entry: "«Линия жизни» • «Моё сердце» • «Феллини»",
      story: "Возвращение к мелодизму в обновлённом составе. Совместный тур и трек «Феллини» с «БИ-2» закрепили новый звук русского рока нулевых.",
      links: "Связи: «БИ-2» (тур «Феллини») • Саундтрек нулевых",
      tracks: new Array("Линия жизни","Звезда рок-н-ролла","Всего хорошего","Моё сердце","Рики-Тики-Тави","Феллини","Остаёмся зимовать","Тебе это снится","Совсем другой","Пластмассовая жизнь","Пой мне ещё","Ленинград-Amsterdam","Fine")
    },
    {
      id: "new", title: "Новые люди", year: "2003",
      entry: "«Новые люди» • «Время, назад!» • «Гандбол»",
      story: "Нервный, минималистичный альбом-наблюдение за меняющимся Петербургом и ускоряющимся ритмом нового века.",
      links: "Связи: Новая городская волна • Постпанк 2000-х",
      tracks: new Array("Новые люди","Время, назад!","Гандбол","Сломано всё","Девятиэтажный дом","Блокада","Валдай","Йог спокоен","Северо-Запад","РЭП (Нервное сердце)","Альтависта (live)")
    },
    {
      id: "rev", title: "Реверсивная хроника событий", year: "2004",
      svgFile: "revers.svg",
      entry: "«Романс» • «Мы сидели и курили» • «Шато Марго»",
      story: "Минималистичный, почти камерный альбом-дневник. Именно здесь вышел культовый акустический «Романс», ставший визитной карточкой Васильева.",
      links: "Связи: Русский городской романс • Акустический минимализм",
      tracks: new Array("Океан","Семь восьмых","Шато Марго","Мы сидели и курили","Сиануквиль","Человек и дерево","Бериллий","Тем, кто раньше нас","Паровоз","Урок географии","Романс","Люди на холме","Голос за кадром")
    },
    {
      id: "spl", title: "Раздвоение личности", year: "2007",
      entry: "«Маяк» (на стихи Маяковского) • «Скажи»",
      story: "Двойная концептуальная пластинка из 17 треков: от психоделического арт-рока до прямого диалога с поэзией Владимира Маяковского («Лиличка!»).",
      links: "Связи: Владимир Маяковский • Серебряный век в русском роке",
      tracks: new Array("Мелькнула чья-то тень","Скажи","Лабиринт","Волна","Мама мия","Королева красоты","Сухари и сушки","Мобильный","Праздник","Император","Бетховен","Маяк","Пряник","До встречи","Прочь из моей головы","Сын","Лепесток")
    },
    {
      id: "sig", title: "Сигнал из космоса", year: "2009",
      entry: "«Вниз головой» • «Письмо»",
      story: "Тёплый, светлый альбом с духовой секцией, аккордеоном и космической образностью, записанный на собственной студии группы в Петербурге.",
      links: "Связи: Духовая эстетика • Петербургская инди-сцена конца нулевых",
      tracks: new Array("Настройка звука","Дыши легко","Добро пожаловать","Без тормозов","Корабль ждёт","Чёрный цвет солнца","Вниз головой","Человек не спал","Ковчег","Больше никакого рок-н-ролла","Вальс","Письмо","Зелёная песня","Камень","3007")
    },
    {
      id: "obm", title: "Обман зрения", year: "2012",
      entry: "«Конец прекрасной эпохи» • «Петербургская свадьба»",
      story: "Пластинка, пронизанная ленинградской поэзией: песня «Конец прекрасной эпохи» написана на стихи Иосифа Бродского, а «Петербургская свадьба» — Александра Башлачёва.",
      links: "Связи: Иосиф Бродский • Александр Башлачёв • Ленинградский текст",
      tracks: new Array("Увертюра","Летела жизнь","Чёрная «Волга»","Лестница","Страшная тайна","Петербургская свадьба","Дочь самурая","Фибоначчи","В мире иллюзий","Праздник","Конец прекрасной эпохи","Солнце взойдёт","Волшебное слово","Чудак")
    },
    {
      id: "res1", title: "Резонанс. Часть 1", year: "2014",
      entry: "«Рай в шалаше» • «Оркестр»",
      story: "Первая часть масштабного двухчастного цикла: философские притчи, оркестровые аранжировки и отстранённый взгляд на мир.",
      links: "Связи: Камерный оркестровый рок • Поэтический цикл",
      tracks: new Array("Валс","Мороз по коже","Мысль","Рай в шалаше","Всё наоборот","Пожар","Горизонт событий","Среди зимы","Оркестр","Танцуй!","Старый дом","Ай лов ю","Снег","Шахматы","Песня на одном аккорде")
    },
    {
      id: "res2", title: "Резонанс. Часть 2", year: "2014",
      entry: "«Танцуй!» • «Песня на одном аккорде»",
      story: "Вторая, более тихая и медитативная глава «Резонанса» с минималистичными балладами и переосмыслением ранних песен.",
      links: "Связи: Акустический минимализм • «Пыльная быль» (переклички)",
      tracks: new Array("Куда летит мой самолёт? (версия)","Двусмысленный","Среди зимы (акустика)","Полная луна","Песня на одном аккорде","Разговор","Нефть","Помолчим немного","Свет","Будь моей тенью (версия)","Финал")
    },
    {
      id: "key", title: "Ключ к шифру", year: "2016",
      entry: "«Храм» • «Окраины» • «Кит»",
      story: "Мрачный, электронно-гитарный альбом с ломаными трип-хоп-битами, тревожной атмосферой и мистическими шифрами.",
      links: "Связи: Бристольский трип-хоп • Portishead • Электронный постпанк",
      tracks: new Array("Медный грош","Пирамиды","Нам, мудрецам","Храм","Окраины","Кит","Она была так прекрасна","Джа играет джаз","Реквием","Земля уходит из-под ног","Тревога","Небесный хор","Путь на восток","Череп и кости","Деньги")
    },
    {
      id: "vst", title: "Встречная полоса", year: "2018",
      entry: "«Булгаковский марш» • «Шаман»",
      story: "Записан на легендарной питерской студии «Добролёт». Внутри — литературные аллюзии на «Мастера и Маргариту» и тяжёлый гитарный грув.",
      links: "Связи: Студия «Добролёт» • Михаил Булгаков • Питерский андеграунд",
      tracks: new Array("На заре","Шаман","Тепло родного дома","Волк","Когда пройдёт сто лет","Булгаковский марш","Чей-то ребёнок","Испанская инквизиция","Встречная полоса","Яблоко","Шпионы")
    },
    {
      id: "vir", title: "Вира и майна", year: "2020",
  let box = document.getElementById("albBox");
  if (!box) {
    box = document.createElement("div");
    box.id = "albBox";
    box.style.cssText = "position:fixed;top:20px;right:20px;bottom:20px;width:390px;max-width:calc(100vw - 40px);background:#120b0d;border:1px solid #381820;border-radius:12px;padding:22px;z-index:130;display:none;flex-direction:column;gap:13px;color:#ede6e8;font-family:-apple-system,BlinkMacSystemFont,sans-serif;overflow-y:auto;box-shadow:-16px 0 50px rgba(0,0,0,0.85)";
    document.body.appendChild(box);
  }

  function showAlb(a, isDarkTheme) {
    act = a;
    box.style.display = "flex";
    const accent = isDarkTheme ? "#8fa3c7" : "#e02e31";
    box.style.background = isDarkTheme ? "#101216" : "#120b0d";
    box.style.borderColor = isDarkTheme ? "#262b36" : "#381820";

    const q = encodeURIComponent("Сплин " + a.title);
    const yaUrl = "https://yandex.ru" + q;
    const vkUrl = "https://vk.com" + q;
    const ytUrl = "https://youtube.com" + encodeURIComponent("Сплин " + a.title + " клип live");

    const trs = a.tracks.map((x, idx) =>
      `<div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.06);padding:6px 10px;border-radius:5px;font-size:11.5px;margin-top:4px;display:flex;gap:8px;align-items:center">
        <span style="color:#7c8291;font-family:monospace;font-size:10.5px">${String(idx + 1).padStart(2, "0")}</span>
        <span>${x}</span>
      </div>`
    ).join("");

    box.innerHTML = `
      <div style="display:flex;justify-content:space-between;align-items:flex-start;gap:8px">
        <div>
          <div style="font-size:10px;letter-spacing:1.3px;color:${accent};font-weight:700">СПЛИН • ${a.year}</div>
          <h2 style="font-size:21px;color:#fff;margin-top:2px;line-height:1.25">${a.title}</h2>
        </div>
        <button id="clsAlb" style="background:rgba(255,255,255,0.07);color:#b5b9c4;border:1px solid rgba(255,255,255,0.12);padding:5px 10px;border-radius:6px;cursor:pointer;font-size:13px">✕</button>
      </div>

      <div style="background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.08);padding:10px 12px;border-radius:8px">
        <div style="font-size:9.5px;letter-spacing:1px;color:${accent};font-weight:700;margin-bottom:4px">ТОЧКА ВХОДА</div>
        <div style="font-size:13px;font-weight:600;color:#fff">${a.entry}</div>
      </div>

      <div style="background:rgba(255,255,255,0.025);border-left:2px solid ${accent};padding:10px 12px;font-size:12.5px;line-height:1.5;color:#d6d8de">${a.story}</div>

      <div style="background:rgba(255,255,255,0.025);border:1px solid rgba(255,255,255,0.07);padding:9px 12px;border-radius:8px;font-size:12px;color:#b8bec9">
        <span style="color:#7c8291;font-weight:700;font-size:10px;display:block;margin-bottom:3px;letter-spacing:0.8px">НИТОЧКИ СВЯЗЕЙ</span>
        ${a.links}
      </div>

      <details style="background:rgba(0,0,0,0.25);border:1px solid rgba(255,255,255,0.07);border-radius:8px;padding:8px 10px">
        <summary style="cursor:pointer;font-size:11px;font-weight:700;letter-spacing:0.8px;color:#9da3b0;user-select:none">ТРЕКЛИСТ АЛЬБОМА (${a.tracks.length}) ▾</summary>
        <div style="margin-top:6px;max-height:210px;overflow-y:auto;padding-right:2px">${trs}</div>
      </details>

      <div style="margin-top:auto;display:grid;grid-template-columns:1fr 1fr;gap:8px">
        <a href="${yaUrl}" target="_blank" style="background:#ffcc00;color:#000;text-align:center;padding:10px 8px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12px">Яндекс Музыка ↗</a>
        <a href="${vkUrl}" target="_blank" style="background:rgba(255,255,255,0.08);color:#fff;border:1px solid rgba(255,255,255,0.14);text-align:center;padding:10px 8px;border-radius:8px;text-decoration:none;font-weight:600;font-size:12px">VK Музыка ↗</a>
        <a href="${ytUrl}" target="_blank" style="grid-column:1 / -1;background:${accent};color:${isDarkTheme ? "#08090c" : "#fff"};text-align:center;padding:10px;border-radius:8px;text-decoration:none;font-weight:700;font-size:12.5px">Клипы и лайвы эпохи ↗</a>
      </div>
    `;
    document.getElementById("clsAlb").onclick = () => {
      box.style.display = "none";
      act = null;
    };
  }

  let sceneLeaves = new Array();
  let sceneTick = 0;
  let sceneWrap = null;

  function closeAlbumScene() {
    albScene.style.opacity = "0";
    albScene.style.pointerEvents = "none";
    stage.style.opacity = "1";
    stage.style.transform = "scale(1)";
    stage.style.pointerEvents = "auto";
    box.style.display = "none";
    const topBox = document.getElementById("topBox");
    if (topBox) topBox.style.display = "block";
  }

  function openAlbumScene(alb) {
    box.style.display = "none";
    const topBox = document.getElementById("topBox");
    if (topBox) topBox.style.display = "none";

    stage.style.opacity = "0";
    stage.style.transform = "scale(1.12)";
    stage.style.pointerEvents = "none";

    albScene.style.opacity = "1";
    albScene.style.pointerEvents = "auto";
    albScene.innerHTML = "";
    sceneLeaves = new Array();

    const navBar = document.createElement("div");
    navBar.style.cssText = "position:fixed;top:20px;left:20px;z-index:115;display:flex;gap:8px;align-items:center;background:rgba(13,15,20,0.88);border:1px solid rgba(255,255,255,0.1);padding:8px 12px;border-radius:10px";
    navBar.innerHTML = `
      <button id="backToGranat" style="background:transparent;color:#e6e8ee;border:none;font-size:12.5px;font-weight:600;cursor:pointer">← Назад к гранату</button>
      <span style="color:rgba(255,255,255,0.15)">|</span>
      <button id="replayRevers" style="background:rgba(255,255,255,0.08);color:#cfd4e0;border:none;padding:5px 9px;border-radius:6px;font-size:11.5px;cursor:pointer">↻ Повторить</button>
      <button id="infoRevers" style="background:#8fa3c7;color:#08090c;border:none;padding:5px 10px;border-radius:6px;font-size:11.5px;font-weight:700;cursor:pointer">Об альбоме</button>
    `;
    albScene.appendChild(navBar);

    document.getElementById("backToGranat").onclick = closeAlbumScene;
    document.getElementById("infoRevers").onclick = () => showAlb(alb, true);

    sceneWrap = document.createElement("div");
    sceneWrap.style.cssText = "position:relative;width:min(82vh,82vw);height:min(82vh,82vw)";
    albScene.appendChild(sceneWrap);

    fetch(alb.svgFile)
      .then(r => r.text())
      .then(svgText => {
        const cleanSvg = svgText.replace(/<\?xml[\s\S]*?\?>/i, "").replace(/<!DOCTYPE[\s\S]*?>/i, "");
        sceneWrap.innerHTML = cleanSvg;
        const svgEl = sceneWrap.querySelector("svg");
        if (!svgEl) return;

        svgEl.style.width = "100%";
        svgEl.style.height = "100%";
        svgEl.style.display = "block";
        svgEl.style.overflow = "visible";

        const allPaths = Array.from(svgEl.querySelectorAll("path"));
        const items = allPaths.map(p => {
          const b = p.getBBox();
          return { el: p, b: b, area: b.width * b.height };
        });
        items.sort((a, b) => b.area - a.area);

        const baseList = new Array();
        const humanList = new Array();

        const mainTree = items.shift();
        if (mainTree) {
          mainTree.el.style.fill = "#c8cedb";
          baseList.push(mainTree.el);
        }

        items.forEach((it, idx) => {
          const cx = (it.b.x + it.b.width * 0.5) * 0.1;
          const cy = 592 - (it.b.y + it.b.height * 0.5) * 0.1;

          if (it.area > 35000 && it.b.height > 260) {
            it.el.style.fill = "#ffffff";
            it.el.style.cursor = "pointer";
            it.el.addEventListener("mouseenter", () => {
              it.el.style.filter = "drop-shadow(0 0 18px rgba(143, 163, 199, 0.95))";
            });
            it.el.addEventListener("mouseleave", () => {
              it.el.style.filter = "none";
            });
            it.el.addEventListener("click", e => {
              e.stopPropagation();
              showAlb(alb, true);
            });
            humanList.push(it.el);
          } else {
            it.el.style.fill = idx % 2 === 0 ? "#9aa4b8" : "#788299";
            sceneLeaves.push({
              el: it.el, cx: cx, cy: cy, phase: idx * 0.45,
              dx: 0, dy: 0, vx: 0, vy: 0, ready: false
            });
          }
        });

        sceneLeaves.sort((a, b) => a.cx - b.cx);

        function playSequence() {
          baseList.forEach(p => {
            p.style.transition = "none";
            p.style.opacity = "0";
            p.style.transform = "translateY(16px)";
          });
          humanList.forEach(p => {
            p.style.transition = "none";
            p.style.opacity = "0";
            p.style.transform = "translateY(20px) scale(0.96)";
          });
          sceneLeaves.forEach(l => {
            l.el.style.transition = "none";
            l.el.style.opacity = "0";
            l.ready = false;
          });

          requestAnimationFrame(() => {
            requestAnimationFrame(() => {
              baseList.forEach(p => {
                p.style.transition = "opacity 0.9s ease, transform 0.9s cubic-bezier(0.22,1,0.36,1)";
                p.style.opacity = "1";
                p.style.transform = "translateY(0px)";
              });
              humanList.forEach(p => {
                p.style.transition = "opacity 1.1s ease 0.7s, transform 1.1s cubic-bezier(0.22,1,0.36,1) 0.7s, filter 0.25s ease";
                p.style.opacity = "1";
                p.style.transform = "translateY(0px) scale(1)";
              });
              sceneLeaves.forEach((l, i) => {
                const delay = 1.2 + (i / Math.max(1, sceneLeaves.length)) * 1.15;
                l.el.style.transition = `opacity 0.65s ease ${delay.toFixed(2)}s`;
                l.el.style.opacity = "1";
