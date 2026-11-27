const SCENES = {
  classic: { name: "Академическая база", color: "#c4a35a" },
  roots:   { name: "Корни 60–70-х", color: "#b87a56" },
  bristol: { name: "Бристоль 90-х", color: "#7b8eb8" },
  hiphop:  { name: "Хип-хоп / Альтернатива", color: "#6fa396" }
};

const NODES = [
  { id: "tchaikovsky", name: "П. И. Чайковский", year: 1876, scene: "classic",
    card300: "Воткинск, 1865 | Романтизм, классическая музыка, балет, симфония. Пётр Ильич Чайковский (композитор — до 1893).",
    facts: ["В 1876 году написал балет «Лебединое озеро» (op. 20), премьера прошла в Большом театре в феврале 1877 года.", "Тема гобоя и арфы из «Сцены» (Акт II, № 10) через 93 года стала основой хита «Daydream», а затем сэмплом для Portishead и Tricky."],
    tracks: [{ title: "Лебединое озеро: Сцена (Акт II, № 10)", release: "Балет, 1876" }] },
  { id: "wallace", name: "The Wallace Collection", year: 1969, scene: "roots",
    card300: "Брюссель, 1968 | Барокко-поп, психоделик-рок. Сильвен Ванхольме, Рэймонд Винсент, Жак Намот и др.",
    facts: ["Скрипачи группы Рэймонд Винсент и Жак Намот играли в Бельгийском национальном оркестре.", "В 1969 году на студии Abbey Road записали песню «Daydream», переложив тему из «Лебединого озера» на рок-ритм."],
    tracks: [{ title: "Daydream", release: "Альбом Laughing Cavalier, 1969" }] },
  { id: "hayes", name: "Айзек Хейз", year: 1971, scene: "roots",
    card300: "Ковингтон, 1964 | Соул, фанк, саундтрек. Айзек Ли Хейз-младший (вокал, клавишные — до 2008).",
    facts: ["В ноябре 1971 года выпустил двойной альбом «Black Moses» на лейбле Stax Records.", "В треке «Ike's Rap II» переиграл мелодию бельгийского хита «Daydream» в замедленном темпе под свой речитатив."],
    tracks: [{ title: "Ike's Rap II", release: "Альбом Black Moses, 1971" }] },
  { id: "massive", name: "Massive Attack", year: 1988, scene: "bristol",
    card300: "Бристоль, 1988 | Трип-хоп, даб, электроника. Роберт «3D» Дель Ная, Грант «Daddy G» Маршалл, Хорас Энди.",
    facts: ["Выросли из бристольской саундсистемы The Wild Bunch (1983–1989) и дружеского круга уличного художника Бэнкси.", "В альбоме «Mezzanine» (1998) построили «Angel» на сэмпле The Incredible Bongo Band (1973), а «Teardrop» — на сэмпле Леса Макканна (1971) с вокалом Элизабет Фрейзер."],
    tracks: [{ title: "Angel", release: "Альбом Mezzanine, 1998" }, { title: "Teardrop", release: "Альбом Mezzanine, 1998" }, { title: "Unfinished Sympathy", release: "Альбом Blue Lines, 1991" }] },
  { id: "portishead", name: "Portishead", year: 1991, scene: "bristol",
    card300: "Бристоль, 1991 | Трип-хоп, даунтемпо. Бет Гиббонс (вокал), Джефф Бэрроу (ударные, сэмплы), Адриан Атли (гитара).",
    facts: ["Джефф Бэрроу работал студийным ассистентом на записи дебютного альбома Massive Attack «Blue Lines» (1991).", "В августе 1994 года выпустили альбом «Dummy»: хит «Glory Box» построен на прямом сэмпле из «Ike's Rap II» (1971) Айзека Хейза."],
    tracks: [{ title: "Glory Box", release: "Альбом Dummy, 1994" }, { title: "Sour Times", release: "Альбом Dummy, 1994" }, { title: "Roads", release: "Альбом Dummy, 1994" }] },
  { id: "tricky", name: "Tricky", year: 1995, scene: "bristol",
    card300: "Бристоль, 1991 | Трип-хоп, экспериментальный хип-хоп. Эдриан Николас Мэтьюс Тоус (вокал, продакшн).",
    facts: ["Участвовал в первых двух альбомах Massive Attack (1991 и 1994), после чего ушёл в сольную карьеру.", "На дебютном альбоме «Maxinquaye» (1995) использовал тот же сэмпл Айзека Хейза в «Hell Is Round the Corner», а для «Ponderosa» засемплировал индийского певца Джагджита Сингха."],
    tracks: [{ title: "Hell Is Round the Corner", release: "Альбом Maxinquaye, 1995" }, { title: "Ponderosa", release: "Альбом Maxinquaye, 1995" }] },
  { id: "bjork", name: "Björk", year: 1995, scene: "bristol",
    card300: "Рейкьявик, 1977 | Арт-поп, электроника, трип-хоп. Бьорк Гвюдмюндсдоттир (вокал, клавишные, продакшн).",
    facts: ["На альбомах «Debut» (1993) и «Post» (1995) работала с бристольским продюсером Нелли Хупером из The Wild Bunch.", "В 1995 году записала с Tricky треки «Enjoy» и «Headphones» для своего альбома «Post»."],
    tracks: [{ title: "Possibly Maybe", release: "Альбом Post, 1995" }, { title: "Army of Me", release: "Альбом Post, 1995" }] },
  { id: "djshadow", name: "DJ Shadow", year: 1996, scene: "hiphop",
    card300: "Дэвис, 1991 | Инструментальный хип-хоп, трип-хоп, тёрнтейблизм. Джошуа Пол Дэвис (сэмплы, вертушки).",
    facts: ["В рецензии журнала Mixmag (июнь 1994) на его сингл «In/Flux» впервые появился термин «трип-хоп».", "В сентябре 1996 года выпустил альбом «Endtroducing.....» — первую в Книге рекордов Гиннесса пластинку, на 100% собранную из сэмплов."],
    tracks: [{ title: "Building Steam with a Grain of Salt", release: "Альбом Endtroducing....., 1996" }, { title: "The Number Song", release: "Альбом Endtroducing....., 1996" }] },
  { id: "unkle", name: "UNKLE", year: 1998, scene: "hiphop",
    card300: "Лондон, 1992 | Трип-хоп, электроника, альтернативный рок. Основатель: Джеймс Лавель (продакшн).",
    facts: ["Дебютный альбом «Psyence Fiction» (1998) был полностью спродюсирован дуэтом Джеймса Лавеля и DJ Shadow.", "В записи приняли участие Том Йорк (Radiohead) и Ричард Эшкрофт (The Verve)."],
    tracks: [{ title: "Rabbit in Your Headlights", release: "Альбом Psyence Fiction, 1998" }] },
  { id: "gorillaz", name: "Gorillaz", year: 2001, scene: "hiphop",
    card300: "Лондон, 1998 | Альтернативный рок, трип-хоп, хип-хоп. Деймон Албарн (вокал), Джейми Хьюлетт (визуал).",
    facts: ["Продюсером дебютного альбома «Gorillaz» (2001) стал Dan the Automator — близкий соратник DJ Shadow по калифорнийской сцене.", "Калифорнийская школа хип-хопа определила трип-хоп-грув ранних хитов «Clint Eastwood» и «Tomorrow Comes Today»."],
    tracks: [{ title: "Clint Eastwood", release: "Альбом Gorillaz, 2001" }] }
];

const LINKS = [
  { source: "tchaikovsky", target: "wallace", label: "Тема «Лебединого озера» (1876 → 1969)" },
  { source: "wallace", target: "hayes", label: "Переработка «Daydream» в «Ike's Rap II»" },
  { source: "hayes", target: "portishead", label: "Сэмпл «Ike's Rap II» → «Glory Box»" },
  { source: "hayes", target: "tricky", label: "Тот же сэмпл → «Hell Is Round the Corner»" },
  { source: "massive", target: "portishead", label: "Бристоль, ассистент на «Blue Lines»" },
  { source: "massive", target: "tricky", label: "Выходцы из The Wild Bunch" },
  { source: "tricky", target: "bjork", label: "Совместная запись для альбома «Post»" },
  { source: "massive", target: "bjork", label: "Общий продюсер Нелли Хупер" },
  { source: "massive", target: "djshadow", label: "Рождение термина «трип-хоп» (1994)" },
  { source: "djshadow", target: "unkle", label: "Альбом «Psyence Fiction» (1998)" },
  { source: "djshadow", target: "gorillaz", label: "Общий круг (Dan the Automator)" }
];

const TOUR_IDS = ["tchaikovsky", "wallace", "hayes", "portishead", "tricky", "massive", "bjork", "djshadow", "unkle", "gorillaz"];
