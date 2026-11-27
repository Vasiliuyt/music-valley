// ============================================================================
// БАЗА ДАННЫХ "МУЗЫКАЛЬНАЯ ДОЛИНА"
// Чтобы добавить нового артиста, просто вставь новый блок перед закрывающей ];
// ============================================================================

const SCENES = {
  classic: { name: "Академическая база", color: "#fcc419" },
  roots:   { name: "Корни и сэмплы 60–70-х", color: "#ff922b" },
  bristol: { name: "Бристоль и трип-хоп 90-х", color: "#5c7cfa" },
  hiphop:  { name: "Инструментальный хип-хоп", color: "#20c997" }
};

const LINK_TYPES = {
  sample:   { name: "Прямой сэмпл / мелодия", color: "#ffd43b" },
  producer: { name: "Общий продюсер / студия", color: "#4dabf7" },
  crew:     { name: "Одна тусовка / город", color: "#69db7c" }
};

const NODES = [
  {
    id: "tchaikovsky",
    name: "П. И. Чайковский",
    year: 1876,
    scene: "classic",
    card300: "Воткинск, 1865 | Романтизм, классическая музыка, балет, симфония. Пётр Ильич Чайковский (композитор, дирижёр — до 1893).",
    facts: [
      "В 1876 году написал балет «Лебединое озеро» (op. 20), премьера которого прошла в Большом театре в феврале 1877 года.",
      "Главная тема гобоя и арфы из «Сцены (Moderato)» (Акт II, № 10) через 93 года стала основой бельгийского хита «Daydream», а затем — сэмплом для Portishead и Tricky."
    ],
    tracks: [
      { title: "Лебединое озеро: Сцена (Акт II, № 10)", release: "Балет, 1876" },
      { title: "Струнный квартет № 1: Andante cantabile", release: "Op. 11, 1871" }
    ],
    spotifyEmbed: "https://spotify.com"
  },
  {
    id: "wallace",
    name: "The Wallace Collection",
    year: 1969,
    scene: "roots",
    card300: "Брюссель, 1968 | Барокко-поп, психоделический рок. Состав: Сильвен Ванхольме, Фредди Нихоул, Рэймонд Винсент, Жак Намот, Кристиан Янссенс, Марк Эру.",
    facts: [
      "Скрипачи группы Рэймонд Винсент и Жак Намот работали в Бельгийском национальном оркестре и хорошо знали партитуру Чайковского.",
      "В 1969 году на студии Abbey Road в Лондоне записали песню «Daydream» (альбом «Laughing Cavalier»), переложив тему из «Лебединого озера» на рок-ритм."
    ],
    tracks: [
      { title: "Daydream", release: "Альбом Laughing Cavalier, 1969" }
    ]
  },
  {
    id: "hayes",
    name: "Айзек Хейз",
    year: 1971,
    scene: "roots",
    card300: "Ковингтон, 1964 | Соул, фанк, психоделический соул, саундтрек. Айзек Ли Хейз-младший (вокал, клавишные, композитор — до 2008).",
    facts: [
      "В ноябре 1971 года выпустил двойной альбом «Black Moses» на лейбле Stax Records.",
      "В открывающем треке «Ike's Rap II» переиграл гармонию и мелодию бельгийского хита «Daydream» в замедленном темпе под свой речитатив."
    ],
    tracks: [
      { title: "Ike's Rap II", release: "Альбом Black Moses, 1971" }
    ]
  },
  {
    id: "massive",
    name: "Massive Attack",
    year: 1988,
    scene: "bristol",
    card300: "Бристоль, 1988 | Трип-хоп, даб, электроника, арт-рок. Состав: Роберт «3D» Дель Ная (вокал, клавишные), Грант «Daddy G» Маршалл (вокал), Хорас Энди (вокал).",
    facts: [
      "Выросли из бристольской диджейской саундсистемы The Wild Bunch (1983–1989). Дебютный альбом «Blue Lines» (1991) заложил основы бристольского саунда.",
      "На третьем альбоме «Mezzanine» (1998) перешли к мрачному гитарному звучанию: трек «Angel» построен на замедленном сэмпле The Incredible Bongo Band «Last Bongo in Belgium» (1973), а «Teardrop» — на сэмпле Леса Макканна «Sometimes I Cry» (1971) с вокалом Элизабет Фрейзер."
    ],
    tracks: [
      { title: "Angel", release: "Альбом Mezzanine, 1998" },
      { title: "Teardrop", release: "Альбом Mezzanine, 1998" },
      { title: "Unfinished Sympathy", release: "Альбом Blue Lines, 1991" }
    ]
  },
  {
    id: "portishead",
    name: "Portishead",
    year: 1991,
    scene: "bristol",
    card300: "Бристоль, 1991 | Трип-хоп, даунтемпо, экспериментальный рок. Состав: Бет Гиббонс (вокал), Джефф Бэрроу (ударные, клавишные, сэмплы), Адриан Атли (гитара).",
    facts: [
      "Джефф Бэрроу работал студийным ассистентом на записи дебютного альбома Massive Attack «Blue Lines» (1991) в Бристоле.",
      "В августе 1994 года выпустили дебютный альбом «Dummy»: главный хит «Glory Box» построен на прямом виниловом сэмпле из «Ike's Rap II» (1971) Айзека Хейза."
    ],
    tracks: [
      { title: "Glory Box", release: "Альбом Dummy, 1994" },
      { title: "Sour Times", release: "Альбом Dummy, 1994" },
      { title: "Roads", release: "Альбом Dummy, 1994" }
    ]
  },
  {
    id: "tricky",
    name: "Tricky",
    year: 1995,
    scene: "bristol",
    card300: "Бристоль, 1991 | Трип-хоп, экспериментальный хип-хоп, электроника, постпанк. Эдриан Николас Мэтьюс Тоус (вокал, клавишные, сэмплы, продакшн).",
    facts: [
      "Участвовал в первых двух альбомах Massive Attack («Blue Lines», 1991 и «Protection», 1994), после чего ушёл в сольную карьеру.",
      "На дебютном альбоме «Maxinquaye» (февраль 1995) использовал тот же сэмпл Айзека Хейза «Ike's Rap II» в треке «Hell Is Round the Corner», а для сингла «Ponderosa» засемплировал индийского певца Джагджита Сингха."
    ],
    tracks: [
      { title: "Hell Is Round the Corner", release: "Альбом Maxinquaye, 1995" },
      { title: "Ponderosa", release: "Альбом Maxinquaye, 1995" },
      { title: "Overcome", release: "Альбом Maxinquaye, 1995" }
    ]
  },
  {
    id: "bjork",
    name: "Björk",
    year: 1995,
    scene: "bristol",
    card300: "Рейкьявик, 1977 | Арт-поп, электроника, трип-хоп, авангард. Бьорк Гвюдмюндсдоттир (вокал, клавишные, композитор, продакшн).",
    facts: [
      "На альбомах «Debut» (1993) и «Post» (июнь 1995) работала с бристольским продюсером Нелли Хупером (сооснователем The Wild Bunch и продюсером Massive Attack).",
      "В 1995 году записала с Tricky два трека для своего альбома «Post» («Enjoy» и «Headphones») и спела на его проекте Nearly God (1996)."
    ],
    tracks: [
      { title: "Possibly Maybe", release: "Альбом Post, 1995" },
      { title: "Army of Me", release: "Альбом Post, 1995" },
      { title: "I Miss You (Dobie's Rub)", release: "Альбом Telegram, 1996" }
    ]
  },
  {
    id: "djshadow",
    name: "DJ Shadow",
    year: 1996,
    scene: "hiphop",
    card300: "Дэвис, 1991 | Инструментальный хип-хоп, трип-хоп, тёрнтейблизм, электроника. Джошуа Пол Дэвис (сэмплы, вертушки, ударные, продакшн).",
    facts: [
      "В рецензии журнала Mixmag (июнь 1994) на его сингл «In/Flux» музыкальный журналист Энди Пембертон впервые ввёл в оборот термин «трип-хоп».",
      "В сентябре 1996 года выпустил дебютный альбом «Endtroducing.....» на лейбле Mo' Wax — первую в Книге рекордов Гиннесса пластинку, на 100% собранную из виниловых сэмплов."
    ],
    tracks: [
      { title: "Building Steam with a Grain of Salt", release: "Альбом Endtroducing....., 1996" },
      { title: "The Number Song", release: "Альбом Endtroducing....., 1996" },
      { title: "Changeling / Transmission 1", release: "Альбом Endtroducing....., 1996" }
    ]
  },
  {
    id: "unkle",
    name: "UNKLE",
    year: 1998,
    scene: "hiphop",
    card300: "Лондон, 1992 | Трип-хоп, электроника, альтернативный рок, инструментальный хип-хоп. Основатель: Джеймс Лавель (продакшн; в разные годы — DJ Shadow, Ричард Файл).",
    facts: [
      "Дебютный студийный альбом «Psyence Fiction» (август 1998) был полностью спродюсирован дуэтом Джеймса Лавеля и DJ Shadow.",
      "В записи пластинки приняли участие Том Йорк (Radiohead), Ричард Эшкрофт (The Verve), Майк Ди (Beastie Boys) и Джейсон Ньюстед (Metallica)."
    ],
    tracks: [
      { title: "Rabbit in Your Headlights (feat. Thom Yorke)", release: "Альбом Psyence Fiction, 1998" },
      { title: "Lonely Soul (feat. Richard Ashcroft)", release: "Альбом Psyence Fiction, 1998" }
    ]
  },
  {
    id: "gorillaz",
    name: "Gorillaz",
    year: 2001,
    scene: "hiphop",
    card300: "Лондон, 1998 | Альтернативный рок, трип-хоп, хип-хоп, электроника. Создатели: Деймон Албарн (вокал, клавишные), Джейми Хьюлетт (визуал).",
    facts: [
      "Продюсером дебютного альбома «Gorillaz» (март 2001) стал калифорнийский продюсер Dan the Automator — близкий соратник DJ Shadow по объединению Quannum Projects и проекту Deltron 3030 (2000).",
      "Именно продюсерская школа калифорнийского андеграундного хип-хопа определила замедленный трип-хоп-грув ранних синглов «Clint Eastwood» и «Tomorrow Comes Today»."
    ],
    tracks: [
      { title: "Clint Eastwood", release: "Альбом Gorillaz, 2001" },
      { title: "Tomorrow Comes Today", release: "Альбом Gorillaz, 2001" }
    ]
  }
];

const LINKS = [
  { source: "tchaikovsky", target: "wallace", type: "sample",   label: "Тема «Лебединого озера» (1876 → 1969)" },
  { source: "wallace",     target: "hayes",   type: "sample",   label: "Переработка «Daydream» в «Ike's Rap II»" },
  { source: "hayes",       target: "portishead", type: "sample", label: "Сэмпл «Ike's Rap II» → «Glory Box»" },
  { source: "hayes",       target: "tricky",  type: "sample",   label: "Тот же сэмпл → «Hell Is Round the Corner»" },
  { source: "massive",     target: "portishead", type: "crew",  label: "Бристоль, ассистент на «Blue Lines»" },
  { source: "massive",     target: "tricky",  type: "crew",     label: "Выходцы из саундсистемы The Wild Bunch" },
  { source: "tricky",      target: "bjork",   type: "producer", label: "Совместная запись для альбома «Post»" },
  { source: "massive",     target: "bjork",   type: "producer", label: "Общий продюсер Нелли Хупер" },
  { source: "massive",     target: "djshadow", type: "crew",    label: "Рождение термина «трип-хоп» (1994)" },
  { source: "djshadow",    target: "unkle",   type: "producer", label: "Совместный альбом «Psyence Fiction»" },
  { source: "djshadow",    target: "gorillaz", type: "producer", label: "Общий круг (Dan the Automator)" }
];

