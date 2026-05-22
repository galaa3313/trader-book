// All lesson, book, glossary, cheatsheet, and SVG data for Trading 101

export const lessons: any[] = [
  {
    id: 'intro', title: 'Арилжаа гэж юу вэ?', icon: '📈', level: 'Анхан шат',
    steps: [
      { title: 'Арилжааны үндэс', content: 'Арилжаа (Trading) гэдэг нь санхүүгийн хөрөнгө — хувьцаа, валют, түүхий эд, крипто валют зэргийг — үнийн өөрчлөлтөөс ашиг олох зорилгоор худалдан авах, зарах үйл ажиллагаа юм.\n\nУрт хугацааны хөрөнгө оруулалтаас (investing) ялгаатай нь арилжаачид богино хугацаанд (минут, цаг, өдөр) ашиг олохыг зорьдог.' },
      { title: 'Арилжааны төрлүүд', content: '🏢 Хувьцаа (Stocks) — Компанийн өмчийн хэсэг\n\n💱 Форекс (Forex) — Валютын хос (USD/EUR гэх мэт)\n\n₿ Крипто валют — Bitcoin, Ethereum болон бусад\n\n🛢️ Түүхий эд (Commodities) — Алт, нефть, хий\n\n📊 Индекс — Зах зээлийн ерөнхий үзүүлэлт (S&P 500 гэх мэт)' },
      { title: 'Арилжааны стилиуд', content: '⚡ Скальпинг — Минут тутамд олон арилжаа\n\n📅 Day Trading — Нэг өдрийн дотор\n\n📆 Swing Trading — Хэдэн өдөр, долоо хоног\n\n🎯 Position Trading — Сар, жил\n\nАнхлан суралцагчдад Swing эсвэл Position trading-ийг санал болгодог.' }
    ],
    quiz: [
      { q: 'Арилжаа ба хөрөнгө оруулалтын гол ялгаа юу вэ?', options: ['Хугацаа', 'Мөнгөний хэмжээ', 'Брокер', 'Ялгаа байхгүй'], correct: 0 },
      { q: 'Анхлан суралцагчдад аль арилжааны стиль илүү тохиромжтой вэ?', options: ['Скальпинг', 'Day Trading', 'Swing Trading', 'Бүгд адил'], correct: 2 }
    ]
  },
  {
    id: 'market', title: 'Зах зээл хэрхэн ажилладаг', icon: '🌐', level: 'Анхан шат',
    steps: [
      { title: 'Эрэлт ба нийлүүлэлт', content: 'Зах зээл дээрх үнэ нь эрэлт ба нийлүүлэлтийн харьцаагаар тогтдог.\n\n📈 Худалдан авагч их → Үнэ өснө\n📉 Худалдагч их → Үнэ буурна\n\nЭнэ бол санхүүгийн зах зээлийн хамгийн үндсэн зарчим.' },
      { title: 'Бирж ба брокер', content: '🏛️ Бирж (Exchange) — Худалдаа хийдэг газар (NYSE, NASDAQ, Binance гэх мэт)\n\n🤝 Брокер (Broker) — Танд биржид хандах зуучлагч\n\nТа шууд биржтэй харьцдаггүй — брокерээр дамжуулан захиалга өгдөг.' },
      { title: 'Захиалгын төрлүүд', content: '⚡ Market Order — Одоогийн үнээр шууд гүйцэтгэх\n\n🎯 Limit Order — Тодорхой үнээр л худалдан авах/зарах\n\n🛡️ Stop Loss — Алдагдлыг хязгаарлах захиалга\n\n💰 Take Profit — Ашиг тогтоох захиалга' }
    ],
    quiz: [
      { q: 'Худалдан авагч олон болоход үнэ юу болох вэ?', options: ['Буурна', 'Өснө', 'Өөрчлөгдөхгүй', 'Зогсоно'], correct: 1 },
      { q: 'Алдагдлыг хязгаарлахад ямар захиалга хэрэглэх вэ?', options: ['Market Order', 'Limit Order', 'Stop Loss', 'Take Profit'], correct: 2 }
    ]
  },
  {
    id: 'terms', title: 'Үндсэн нэр томьёо', icon: '📚', level: 'Анхан шат',
    steps: [
      { title: 'Bid, Ask, Spread', content: '💰 Bid — Худалдан авагчдын санал болгож буй үнэ\n\n💵 Ask — Худалдагчдын шаардаж буй үнэ\n\n📏 Spread — Bid ба Ask-ийн зөрүү\n\nSpread бага байх тусам арилжаачдад ашигтай.' },
      { title: 'Pip, Lot, Leverage', content: '📍 Pip — Үнийн хамгийн бага өөрчлөлт (форекст 0.0001)\n\n📦 Lot — Арилжааны хэмжээ (Standard lot = 100,000 нэгж)\n\n⚡ Leverage — Хөшүүрэг (1:100 гэвэл 1$-аар 100$-ын арилжаа)\n\n⚠️ АНХААР: Leverage нь алдагдлыг ч ӨСГӨНӨ! Анхлан суралцагч 1:10-аас илүүг хэрэглэх ёсгүй.' },
      { title: 'Long, Short, Margin', content: '⬆️ Long (Buy) — Үнэ өснө гэж бодон худалдан авах\n\n⬇️ Short (Sell) — Үнэ буурна гэж бодон зарах\n\n💼 Margin — Барьцаа мөнгө\n\n📞 Margin Call — Алдагдал их болж margin хүрэлцэхгүй болбол брокер позицыг хаах.' }
    ],
    quiz: [
      { q: 'Spread гэж юу вэ?', options: ['Ашиг', 'Bid ба Ask-ийн зөрүү', 'Хураамж', 'Leverage'], correct: 1 },
      { q: 'Үнэ буурна гэж бодон ямар арилжаа хийх вэ?', options: ['Long', 'Short', 'Buy', 'Hold'], correct: 1 }
    ]
  },
  {
    id: 'analysis', title: 'Техник vs Фундаменталь анализ', icon: '🔍', level: 'Анхан шат',
    steps: [
      { title: 'Техник анализ', content: '📊 Үнийн графикийг судалж, ирээдүйн хөдөлгөөнийг таамаглах арга.\n\nҮндсэн хэрэгслүүд:\n• Trend lines\n• Support & Resistance\n• Indicators (RSI, MACD, MA)\n• Candlestick patterns\n\n"Үнэ бүх зүйлийг тусгадаг" зарчим дээр тулгуурладаг.' },
      { title: 'Фундаменталь анализ', content: '📰 Компани, эдийн засаг, зах зээлийн жинхэнэ үнэ цэнийг судлах арга.\n\n• Санхүүгийн тайлан\n• Орлого, ашгийн өсөлт\n• GDP, инфляци\n• Төв банкны бодлого\n• Геополитик' },
      { title: 'Аль нь дээр вэ?', content: '🤝 Хоёулаа чухал!\n\n⏱️ Богино хугацаанд → Техник анализ\n📅 Урт хугацаанд → Фундаменталь анализ\n\nТом арилжаачид хоёуланг нь хослуулан ашигладаг.' }
    ],
    quiz: [
      { q: 'Техник анализ юунд тулгуурладаг вэ?', options: ['Мэдээ', 'Үнийн график', 'Санхүүгийн тайлан', 'Засгийн газар'], correct: 1 },
      { q: 'Урт хугацааны хөрөнгө оруулагчид аль аргыг илүү хэрэглэдэг вэ?', options: ['Техник', 'Фундаменталь', 'Аль нь ч биш', 'Хоёуланг адил'], correct: 1 }
    ]
  },
  {
    id: 'risk', title: 'Эрсдэлийн менежмент ⭐', icon: '🛡️', level: 'Анхан шат',
    steps: [
      { title: 'Хамгийн чухал хичээл', content: '⚠️ Энэ бол арилжаачны амжилтын ХАМГИЙН ЧУХАЛ хүчин зүйл.\n\n90% арилжаачид мөнгөө алддаг шалтгаан нь стратеги муу биш, харин эрсдэлийн менежмент муу байдагт оршино.' },
      { title: '1-2% дүрэм', content: '📐 Алтан дүрэм: Нэг арилжаанд бүхэл данснаасаа 1-2%-иас илүү эрсдэлд оруулж болохгүй.\n\nЖишээ: 1000$ → нэг арилжаанд 10-20$.\n\nЯагаад? 10 удаа алдсан ч данс зөвхөн 10% буурна.' },
      { title: 'Risk/Reward харьцаа', content: '⚖️ R:R хамгийн багадаа 1:2 байх ёстой:\n• Эрсдэл: 10$\n• Ашиг: 20$+\n\nЭнэ нь 50%-иас бага амжилттай байсан ч ашигтай байх боломж олгоно!' },
      { title: 'Stop Loss заавал!', content: '🛑 Stop Loss-гүй арилжаа = Тоглоомын газар.\n\nҮргэлж арилжаа нээхээсээ ӨМНӨ:\n1. Stop Loss-оо тогтоо\n2. Take Profit-оо тогтоо\n3. Position size-аа тооцоол\n4. R:R харьцаагаа шалга' }
    ],
    quiz: [
      { q: 'Нэг арилжаанд хэдэн хувийг эрсдэлд оруулах нь зөв вэ?', options: ['10%', '5%', '1-2%', '20%'], correct: 2 },
      { q: 'Хамгийн бага R:R харьцаа хэд байх ёстой вэ?', options: ['1:1', '1:2', '2:1', '1:0.5'], correct: 1 },
      { q: 'Арилжаа нээхээсээ өмнө юу хийх ёстой вэ?', options: ['Найдвар', 'Stop Loss тогтоох', 'Их мөнгө хийх', 'Хүлээх'], correct: 1 }
    ]
  },
  {
    id: 'psychology', title: 'Сэтгэл зүйн бэлтгэл', icon: '🧠', level: 'Анхан шат',
    steps: [
      { title: 'Сэтгэл хөдлөл — гол дайсан', content: '😰 Айдас (Fear)\n🤑 Шунал (Greed)\n😤 Уур (Revenge trading)\n🎉 Их зориг (Overconfidence)\n\nЭдгээр сэтгэл хөдлөлийг таних ба хянах нь амжилтын түлхүүр.' },
      { title: 'Арилжааны төлөвлөгөө', content: '📋 Сайн төлөвлөгөө = Сайн арилжаа\n\n• Хэзээ орох вэ?\n• Хэзээ гарах вэ?\n• Хэр их эрсдэлд орох вэ?\n• Ямар хэрэгсэл арилжаалах вэ?' },
      { title: 'Журнал хөтлөх', content: '📖 Арилжааны журнал заавал хөтлөх:\n• Огноо, цаг\n• Юу арилжаалсан\n• Яагаад орсон\n• Үр дүн\n• Сэтгэл хөдлөл\n• Сургамж' }
    ],
    quiz: [
      { q: 'Алдагдлыг нөхөхийн тулд илүү эрсдэл авах нь юу гэж нэрлэгддэг вэ?', options: ['Fear trading', 'Revenge trading', 'Smart trading', 'Pro trading'], correct: 1 },
      { q: 'Арилжааны журнал юунд хэрэгтэй вэ?', options: ['Зөвхөн ашиг тэмдэглэх', 'Алдаагаа олж засах', 'Татвар', 'Хэрэггүй'], correct: 1 }
    ]
  },
  {
    id: 'candle-basics', title: 'Лаан график (Candlestick)', icon: '🕯️', level: 'Дунд шат',
    steps: [
      { title: 'Лааны түүх', content: '🇯🇵 Японы цагаан будааны арилжаачин Мунэхиса Хомма 1700-аад оны эхээр лаан графикийг үүсгэсэн.\n\nТэрээр зах зээлд эрэлт нийлүүлэлтээс гадна арилжаачдын СЭТГЭЛ ХӨДЛӨЛ үнэд нөлөөлдөг гэдгийг анх ойлгосон.\n\n1980-аад онд Steve Nison лаан графикийг Барууны ертөнцөд танилцуулсан.' },
      { title: 'Лааны бүтэц', content: '🕯️ Нэг лаа 4 үнийг харуулдаг:\n• Open — нээлтийн үнэ\n• Close — хаалтын үнэ\n• High — дээд үнэ\n• Low — доод үнэ\n\n🟢 Бух (Bullish) лаа: Close > Open (үнэ өссөн)\n🔴 Баавгай (Bearish) лаа: Close < Open (үнэ буурсан)' },
      { title: 'Биеийн хэмжээ', content: '🟩 Урт бие = Хүчтэй худалдан авалт/зарах дарамт\n\n🟫 Богино бие = Бага идэвх, тодорхой бус байдал\n\n📐 Урт дээд сүүл = Худалдан авагчид өсгөсөн боловч худалдагчид буцааж унагасан\n\n📐 Урт доод сүүл = Худалдагчид унагасан боловч худалдан авагчид өсгөсөн' }
    ],
    quiz: [
      { q: 'Бух (bullish) лаанд юу үнэн бэ?', options: ['Open > Close', 'Close > Open', 'High = Low', 'Сүүлгүй'], correct: 1 },
      { q: 'Лааны "real body" гэж юу вэ?', options: ['Сүүл', 'Open ба Close хоорондын хэсэг', 'Дээд цэг', 'Доод цэг'], correct: 1 }
    ]
  },
  {
    id: 'candle-patterns', title: 'Үндсэн лааны паттернууд', icon: '📊', level: 'Дунд шат',
    steps: [
      { title: 'Pin Bar (Hammer / Shooting Star)', content: '🔨 Pin Bar — Урт сүүл, богино биетэй лаа\n\n📈 Hammer (Алх) — Урт доод сүүл, уналтын ёроолд үүсэх → Өсөлтийн дохио\n\n📉 Shooting Star — Урт дээд сүүл, өсөлтийн оройд үүсэх → Уналтын дохио\n\n💡 Сүүл нь биеийнхээ 2 дахин урт байх ёстой!' },
      { title: 'Engulfing Bar', content: '🌀 Engulfing — 2 лаа, хоёр дахь нь эхнийхээ бүрэн "залгидаг"\n\n🟢 Bullish Engulfing — Уналтын дараа том ногоон лаа улааныг залгина → Өсөлт эхэлнэ\n\n🔴 Bearish Engulfing — Өсөлтийн дараа том улаан лаа ногоонг залгина → Уналт эхэлнэ\n\n⭐ Хүчтэй reversal дохио — гол түвшинд (support/resistance) үүсэх ёстой.' },
      { title: 'Doji', content: '✚ Doji — Open ≈ Close (бараг тэнцүү)\n\nЗах зээл шийдвэр гаргаж чадахгүй байна гэсэн үг.\n\n🐉 Dragonfly Doji — Урт доод сүүл → Өсөлтийн дохио\n\n🪦 Gravestone Doji — Урт дээд сүүл → Уналтын дохио' },
      { title: 'Inside Bar (Harami)', content: '👶 Harami / Inside Bar — Бяцхан лаа том лааны дотор бүрэн оршино\n\nЗах зээл "амарч" байна гэсэн үг — consolidation.\n\n📊 Хэрэглээ:\n• Тренд хүчтэй үед → Continuation (үргэлжлэх)\n• Орой/ёроолд → Reversal (эргэх)\n\n💥 Inside Bar False Breakout — Хамгийн хүчтэй setup-уудын нэг!' },
      { title: 'Morning / Evening Star', content: '⭐ 3 лаатай паттерн\n\n🌅 Morning Star (Уналтын ёроолд):\n1. Том улаан лаа\n2. Бяцхан лаа\n3. Том ногоон лаа\n→ Өсөлтийн хүчтэй reversal\n\n🌆 Evening Star (Өсөлтийн оройд):\n1. Том ногоон лаа\n2. Бяцхан лаа\n3. Том улаан лаа\n→ Уналтын хүчтэй reversal' }
    ],
    quiz: [
      { q: 'Hammer паттерн ямар дохио өгдөг вэ?', options: ['Уналт үргэлжилнэ', 'Өсөлт эхэлнэ', 'Хажуугийн хөдөлгөөн', 'Юу ч үгүй'], correct: 1 },
      { q: 'Bearish Engulfing хаана үүсэх нь хамгийн хүчтэй вэ?', options: ['Уналтын дунд', 'Өсөлтийн оройд', 'Тэгш зах зээлд', 'Хаана ч хамаагүй'], correct: 1 },
      { q: 'Inside Bar юуг илэрхийлдэг вэ?', options: ['Хүчтэй тренд', 'Consolidation/амрах үе', 'Уналт', 'Өсөлт'], correct: 1 }
    ]
  },
  {
    id: 'elliott-intro', title: 'Элиотын давалгааны үндэс', icon: '🌊', level: 'Ахисан шат',
    steps: [
      { title: 'Онолын үүсэл', content: '👨‍🏫 Ральф Нельсон Элиот 1930-аад онд 75 жилийн зах зээлийн өгөгдлийг судалж, зах зээл санамсаргүй биш — давтамжтай хөдөлддөг гэдгийг нээсэн.\n\nҮнийн хөдөлгөөн нь олон нийтийн сэтгэл зүйгээс үүсэх "давалгаа" (wave)-аар явагддаг.\n\n💡 Гол санаа: Хэрэв энэ давталтыг таньж чадвал — ирээдүйг таамаглаж болно!' },
      { title: 'Үндсэн 8 давалгаа', content: '🌊 Зах зээлийн нэг бүтэн мөчлөг = 8 давалгаа\n\n📈 Импульс (1-5): Трендийн дагуу\n• 1, 3, 5 — трендийн дагуу\n• 2, 4 — засварын\n\n📉 Засвар (A-B-C): Трендийн эсрэг\n• A, C — эсрэг чиглэлд\n• B — дагуу чиглэлд\n\n⭐ Wave 3 = ХАМГИЙН ХҮЧТЭЙ, ашгийн хамгийн их боломж!' },
      { title: 'Фракталь шинж', content: '🔬 Фракталь — Том зүйл нь ижил төстэй жижиг хэсгүүдээс тогтдог.\n\nЭлиотын давалгаа фракталь:\n• Сарын чарт дээрх 1 давалгаа → Долоо хоногт 5 давалгаа\n• Долоо хоногийн 5 давалгаа → Өдөрт 21 давалгаа\n\n💡 Үүнээс л ямар ч цаг хугацаанд (timeframe) Elliott Wave хэрэглэж болно!' }
    ],
    quiz: [
      { q: 'Зах зээлийн нэг бүтэн мөчлөг хэдэн давалгаатай вэ?', options: ['5', '8', '13', '21'], correct: 1 },
      { q: 'Хамгийн хүчтэй, ашгийн боломж хамгийн их давалгаа аль нь вэ?', options: ['Wave 1', 'Wave 2', 'Wave 3', 'Wave 5'], correct: 2 }
    ]
  },
  {
    id: 'elliott-rules', title: 'Элиотын 3 үндсэн дүрэм', icon: '📐', level: 'Ахисан шат',
    steps: [
      { title: '1-р дүрэм: Wave 2', content: '🚫 Wave 2 нь Wave 1-ийн ЭХЛЭЛИЙН цэгээс ХЭЗЭЭ Ч доош ороогүй.\n\nЖишээ: Wave 1 = $100-аас $120 хүртэл өссөн бол\nWave 2 нь $100-аас доошлох ёсгүй.\n\nХэрэв доош орвол → Энэ Wave 1 биш, өөр давалгаа байна гэсэн үг.\n\n💡 Stop Loss-аа Wave 1-ийн эхлэлд тавьдаг учир.' },
      { title: '2-р дүрэм: Wave 3', content: '🚫 Wave 3 нь Wave 1, 5-аас ХАМГИЙН БОГИНО байж БОЛОХГҮЙ.\n\nWave 3 нь ихэвчлэн хамгийн урт байдаг.\n\nХамгийн багадаа Wave 1-тэй тэнцүү, эсвэл түүнээс урт байх ёстой.\n\n📏 Тренд хүчтэй үед Wave 3 нь Wave 1-ээс 1.618 эсвэл 2.618 дахин урт байдаг.' },
      { title: '3-р дүрэм: Wave 4', content: '🚫 Wave 4 нь Wave 1-ийн МУЖ руу орохгүй.\n\nӨөрөөр хэлбэл, Wave 4 нь Wave 1-ийн оройноос доошилж болохгүй.\n\n⚠️ Зөвхөн Diagonal pattern дээр л Wave 4 нь Wave 1-ийн муж руу ордог.' },
      { title: 'Дүрэм зөрчигдвөл', content: '⚠️ Энэ 3 дүрмийн АЛЬ НЭГ нь зөрчигдвөл — таны давалгааны тоолол БУРУУ.\n\nТэгвэл та өөр хувилбараар тоолох хэрэгтэй.\n\n💡 Сайн арилжаачин үргэлж 2-3 хувилбартай байж, нэгийгээ зөрчигдвөл нөгөөг ашигладаг.' }
    ],
    quiz: [
      { q: 'Wave 2 хаашаа ороход тоолол буруу болох вэ?', options: ['Wave 1-ийн дунд', 'Wave 1-ийн эхлэлээс доош', 'Wave 1-ийн дээр', 'Хаашаа ч'], correct: 1 },
      { q: 'Wave 3 ямар байж БОЛОХГҮЙ вэ?', options: ['Хамгийн урт', 'Хамгийн богино', 'Дунд', 'Эгц'], correct: 1 },
      { q: 'Wave 4 хаашаа орох ёсгүй вэ?', options: ['Wave 3-ийн муж', 'Wave 1-ийн муж', 'Wave 2-ийн муж', 'Хаашаа ч'], correct: 1 }
    ]
  },
  {
    id: 'fibonacci', title: 'Фибоначчи тоо', icon: '🔢', level: 'Ахисан шат',
    steps: [
      { title: 'Фибоначчи дараалал', content: '🧮 12-р зууны Италийн математикч Леонардо Фибоначчи нээсэн:\n\n0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144...\n\nГурав дахь тоо = өмнөх 2 тооны нийлбэр.\n\n🌿 Энэ дараалал байгальд тааралддаг — цэцгийн дэлбээ, нялцгай биетийн хясаа, галактикийн эргүүлэг г.м.' },
      { title: 'Алтан харьцаа', content: '✨ Фибоначчи тоонуудыг харьцуулахад:\n\n• 21/34 = 0.618\n• 34/55 = 0.618\n→ 0.618 = АЛТАН ХАРЬЦАА (Golden Ratio)\n\n• 21/55 = 0.382\n• Урвуу нь = 1.618, 2.618, 4.236\n\n🎯 Эдгээр тоон дээр зах зээл хариу үйлдэл үзүүлдэг!' },
      { title: 'Retracement түвшинүүд', content: '📉 Үнэ буцах нийтлэг түвшинүүд:\n\n• 23.6%\n• 38.2% — Wave 4-ийн нийтлэг\n• 50% — Дундаж\n• 61.8% — АЛТАН харьцаа, Wave 2-ийн нийтлэг\n• 78.6% — Гүн засвар\n\n💡 Wave 2 нь ихэвчлэн Wave 1-ийн 50-61.8% руу буцдаг.' },
      { title: 'Extension түвшинүүд', content: '📈 Wave 3, 5-ийн ирэх боломжит таргетууд:\n\n• 100% — Wave 1-тэй тэнцүү\n• 127.2%\n• 138.2%\n• 161.8% — Wave 3-ийн нийтлэг таргет\n• 261.8% — Wave 3 хүчтэй сунгагдсан\n\n🎯 Wave 3 ихэвчлэн Wave 1-ийн 161.8% хүртэл явдаг!' }
    ],
    quiz: [
      { q: 'Алтан харьцаа гэж юу вэ?', options: ['0.382', '0.5', '0.618', '1.0'], correct: 2 },
      { q: 'Wave 3-ийн нийтлэг таргет хэд вэ?', options: ['100%', '127.2%', '161.8%', '261.8%'], correct: 2 },
      { q: 'Wave 2 ихэвчлэн Wave 1-ийн хэдэн хувь руу буцах вэ?', options: ['23.6%', '38.2%', '50-61.8%', '100%'], correct: 2 }
    ]
  },
  {
    id: 'elliott-correction', title: 'Засварын давалгаа (ABC)', icon: '🔄', level: 'Ахисан шат',
    steps: [
      { title: '3 төрлийн засвар', content: '🌊 Засварын давалгаа гэдэг нь импульс 5 давалгааны дараа ирэх А-В-С 3 давалгаа.\n\n3 үндсэн төрөл:\n\n1️⃣ Zigzag — Хурц, эгц засвар\n2️⃣ Flat — Хажуу тийш засвар\n3️⃣ Triangle — Гурвалжин\n\n⭐ Wave B нь "Bull trap"!\nWave C нь "Killer wave".' },
      { title: 'Zigzag', content: '⚡ Zigzag — Хурц хэлбэрийн засвар\n\nБүтэц: 5-3-5\n• Wave A — 5 жижиг давалгаа\n• Wave B — 3 давалгаа (буцах)\n• Wave C — 5 жижиг давалгаа\n\nWave B нь A-ийн 50-79% руу буцдаг.\nWave C нь A-тай ТЭНЦҮҮ эсвэл 1.618 дахин урт байдаг.\n\n📍 Ихэвчлэн Wave 2 дээр тохиолддог.' },
      { title: 'Flat', content: '➡️ Flat — Хажуу тийш засвар\n\nБүтэц: 3-3-5\n\n3 хувилбар:\n• Regular Flat — B нь A-ийн 100%\n• Irregular/Expanded — B нь A-аас давна\n• Running Flat — Тренд маш хүчтэй\n\n📍 Ихэвчлэн Wave 4 дээр тохиолддог.' },
      { title: 'Triangle', content: '🔺 Triangle — 5 давалгаатай засвар\n\nБүтэц: A-B-C-D-E (бүгд 3-3-3-3-3)\n\n4 төрөл:\n• Symmetrical (агшиж)\n• Ascending (өсөж)\n• Descending (буурч)\n• Reverse symmetrical (өргөсөж)\n\n📍 Зөвхөн Wave 4 эсвэл Wave B дээр тохиолддог.\n\n💡 Triangle-ийн дараа үргэлж сүүлчийн "thrust" ирдэг!' }
    ],
    quiz: [
      { q: 'Zigzag-ийн бүтэц юу вэ?', options: ['3-3-5', '5-3-5', '3-3-3-3-3', '5-5-5'], correct: 1 },
      { q: 'Triangle хэдэн давалгаатай вэ?', options: ['3', '5', '8', '13'], correct: 1 },
      { q: 'Wave B-г юу гэж нэрлэдэг вэ?', options: ['Killer wave', 'Bull trap', 'Diagonal', 'Impulse'], correct: 1 }
    ]
  }
];

export const books: any[] = [
  {
    id: 'candlestick-bible',
    title: 'The Candlestick Trading Bible',
    author: 'Munehisa Homma уламжлал',
    icon: '🕯️',
    description: 'Лаан график паттернууд болон price action арилжааны бүрэн гарын авлага',
    chapters: [
      { title: '1-р бүлэг: Танилцуулга', content: 'The Candlestick Trading Bible нь түүхэн дэх хамгийн хүчирхэг арилжааны системүүдийн нэг юм. Үүнийг Японы цагаан будааны арилжаачин Мунэхиса Хомма зохион бүтээсэн.\n\nХомма бол түүхэн дэх хамгийн амжилттай арилжаачин гэж тооцогддог. Тэр өөрийн үед "Зах зээлийн бурхан" хэмээх алдартай байсан бөгөөд түүний нээлт өнөөгийн валютаар $10 тэрбум гаруй мөнгийг түүнд авчирсан.\n\nЛаан графикийг сурах нь шинэ хэл сурахтай адил юм. Хэрэв та лаан графикийг хэрхэн уншихаа мэдэхгүй бол зах зээлийг хэзээ ч арилжаалж чадахгүй.\n\nЯпоны лаан график нь санхүүгийн зах зээлийн ХЭЛ юм.' },
      { title: '2-р бүлэг: Лааны түүх', content: 'Лаан график нь Барууны ертөнцийн ижил төстэй зүйлсээс хамаагүй эртээ үүссэн. Япончууд 17-р зуунаас чарт ашиглаж байсан бол АНУ-д хамгийн анхны мэдэгдэж буй чартууд 19-р зууны сүүлчээр гарч ирсэн.\n\nЦагаан будааны арилжаа Японд 1654 онд тогтоогдсон бөгөөд алт, мөнгө, рапсын тос удалгүй дагалдсан.\n\nМунэхиса Хомма 1700-аад оны эхээр төрсөн. Тэрээр эрэлт нийлүүлэлтийн үндсэн динамикийг ойлгосноос гадна сэтгэл хөдлөл нь үнийг тогтооход чухал үүрэг гүйцэтгэдэг гэдгийг ялгаж танисан.\n\n1980-аад оны сүүлээр Steve Nison лаан графикийг сонирхож эхэлсэн.' },
      { title: '3-р бүлэг: Лаа гэж юу вэ?', image: 'candle-anatomy', content: 'Японы лаан график нь сонгосон цаг хугацааны нээлтийн (Open), дээд (High), доод (Low), хаалтын (Close) үнийг ашиглан үүсдэг.\n\n🟢 ӨСӨЛТИЙН ЛАА: Хаалт нь нээлтээс ДЭЭР бол лаа bullish гэж нэрлэгддэг.\n\n🔴 УНАЛТЫН ЛАА: Хаалт нь нээлтээс ДООР бол лаа bearish гэж нэрлэгддэг.\n\n📐 ЛААНЫ БҮРДЭЛ ХЭСГҮҮД:\n• Real body — нээлт ба хаалтын хооронд\n• Upper shadow (дээд сүүл)\n• Lower shadow (доод сүүл)\n\n📏 БИЕИЙН ХЭМЖЭЭ:\n• Урт бие → Хүчтэй худалдан авалт/зарах дарамт\n• Богино бие → Бага идэвх\n\n📍 СҮҮЛНИЙ УТГА:\n• Урт сүүл → Тухайн чигт тэлэлт хийсэн боловч буцсан\n• Богино сүүл → Үндсэн худалдаа Open-Close орчимд төвлөрсөн' },
      { title: '4-р бүлэг: Engulfing Bar', image: 'engulfing', content: 'Engulfing bar нь нэрнийхээ дагуу өмнөх лааг бүрэн "залгидаг" үед үүсдэг.\n\n🔴 BEARISH ENGULFING:\n• 2 биеэс бүрдэнэ\n• Эхний бие 2 дахиасаа жижиг\n• 2 дахь нь эхнийхээ бүрэн залгидаг\n• Өсөлтийн оройд үүсэхэд хүчтэй REVERSAL\n\n🟢 BULLISH ENGULFING:\n• Эхний жижиг улаан лаа\n• 2 дахь том ногоон лаа эхнийхээ залгидаг\n• Уналтын ёроолд үүсэхэд маш хүчтэй reversal\n\n💡 ЧУХАЛ: Зөвхөн engulfing pattern дээр үндэслэн арилжаа битгий хий — support/resistance, тренд, MA-тай хослуул.' },
      { title: '5-р бүлэг: Doji паттерн', image: 'doji', content: 'Doji бол хамгийн чухал Японы лаан график паттернуудын нэг.\n\n📊 Doji-н онцлог:\n• Open ≈ Close\n• Trend-ийн ОРОЙ эсвэл ЁРООЛД маш чухал!\n\n🐉 DRAGONFLY DOJI:\n• Урт ДООД сүүл\n• Уналтын ёроолд → Өсөлтийн дохио\n\n🪦 GRAVESTONE DOJI:\n• Урт ДЭЭД сүүл\n• Өсөлтийн оройд → Уналтын дохио\n\n💡 ХЭРЭГЛЭЭ: Trend-ийн орой/ёроолд үүсвэл — өмнөх trend хүчээ алдаж байгаагийн дохио.' },
      { title: '6-р бүлэг: Pin Bar', image: 'pin-bar', content: 'Pin bar нь price action арилжаачдын хамгийн их хайдаг паттернуудын нэг.\n\nЛаа нь маш ЖИЖИГ real body, УРТ сүүлтэй байдаг. Сүүл нь real body-ноос ядаж 2 ДАХИН УРТ байх ёстой.\n\n🔨 HAMMER (Bullish Pin Bar):\n• Урт ДООД сүүл\n• Жижиг бие дээд хэсэгт\n• УНАЛТЫН ЁРООЛД\n\n💫 SHOOTING STAR (Bearish):\n• Урт ДЭЭД сүүл\n• Жижиг бие доод хэсэгт\n• ӨСӨЛТИЙН ОРОЙД\n\n📋 ЧАНАРЫН ШАЛГУУР:\n1. Bigger timeframes (4H, Daily)\n2. Trend-тэй ижил чигт\n3. Гол түвшинд үүсэх\n4. Урт сүүл — биегийн 2-3 дахин урт\n\n💡 АРИЛЖААНЫ ТАКТИК:\n• Stop Loss — Урт сүүлний ард\n• Target — Дараагийн support/resistance' },
      { title: '7-р бүлэг: Inside Bar', image: 'inside-bar', content: 'Harami ("жирэмсэн") паттерн нь reversal болон continuation паттерн юм.\n\n• Эхний том лаа = "Эх лаа"\n• 2 дахь жижиг лаа = "Хүүхэд"\n\n📊 ХОЁР ХУВИЛБАР:\n1️⃣ REVERSAL: Орой/ёроолд → эргэх\n2️⃣ CONTINUATION: Trend дунд → үргэлжлэх\n\n🧠 СЭТГЭЛ ЗҮЙ: Зах зээл "consolidation"-д орсныг харуулдаг.\n\n💥 INSIDE BAR FALSE BREAKOUT — хамгийн ХҮЧТЭЙ setup-уудын нэг!' },
      { title: '8-р бүлэг: Зах зээлийн бүтэц', image: 'trend-types', content: '📊 3 ТӨРЛИЙН ЗАХ ЗЭЭЛ:\n\n1️⃣ TRENDING — 30%:\n• Higher Highs + Higher Lows = Uptrend\n• Lower Highs + Lower Lows = Downtrend\n\n2️⃣ RANGING — 60%:\n• Хэвтээ support/resistance хооронд\n• Support руу → Авах, Resistance руу → Зарах\n\n3️⃣ CHOPPY — 10%:\n• Чиглэлгүй, шуугиантай\n• ХЭРЭГЛЭХГҮЙ\n\n💡 SUPPORT & RESISTANCE: Breakout болсны дараа resistance → support болж хувирдаг.' },
      { title: '9-р бүлэг: Multiple Timeframe', image: 'support-resistance', content: 'Top down analysis — том timeframe-ээс жижиг рүү шилждэг.\n\n📋 ЦАГИЙН БЭЛТГЭЛ:\n\n1️⃣ Position Trader: Daily/Weekly\n2️⃣ Swing Trader: 1H/Daily\n3️⃣ Day Trader: 15M/1H\n\n📐 ШИНЖИЛГЭЭНИЙ АЛХАМ:\n\nАлхам 1: ТОМ ЧАРТ — Trend, S/R, structure\nАлхам 2: ДУНД ЧАРТ — Зон, setup\nАлхам 3: ЖИЖИГ ЧАРТ — Entry, confirmation\n\n🎯 АЛТАН ДҮРЭМ: Trade WITH the bigger timeframe trend.' }
    ]
  },
  {
    id: 'elliott-wave',
    title: 'Элиотын Давалгааны Онол',
    author: 'Ralph Nelson Elliott',
    icon: '🌊',
    description: 'Зах зээлийн давтамжит давалгаан хэлбэрийг таних бүрэн гарын авлага',
    chapters: [
      { title: '1-р бүлэг: Үүсэл', content: 'Ральф Нельсон Элиот 1930-аад оны үед 75 жилийн зах зээлийн өгөгдлийг анализ хийж байхдаа — зах зээл бүхэлдээ эмх замбараагүй хаос биш гэдгийг нээсэн.\n\n💡 ГОЛ НЭЭЛТ: Хөрөнгийн зах зээл тодорхой давтамжтай хөдөлдөг.\n\n🎯 МӨН ЧАНАР: Хэрэв давалгаалах хэв маягийг зөв тодорхойлж чадвал — үнийг ТААМАГЛАЖ болно.\n\n🔬 ФРАКТАЛЬ ШИНЖ: Сар, долоо хоног, өдөр, цаг, минутын чартанд адилхан илэрдэг.' },
      { title: '2-р бүлэг: 8 давалгаа', image: 'elliott-waves', content: '📈 ИМПУЛЬС (1-5):\n• 1, 3, 5 — ДЭЭШ\n• 2, 4 — ДООШ (засвар)\n\n📉 ЗАСВАР (A-B-C):\n• A, C — Доош\n• B — Дээш\n\n📊 WAVE 1: Шинэ trend-ийн эхлэл\n📊 WAVE 2: Эхний ЗАСВАР (50-61.8%)\n📊 WAVE 3: ⭐ ХАМГИЙН ХҮЧТЭЙ\n📊 WAVE 4: Дунд ЗАСВАР (38.2-50%)\n📊 WAVE 5: Эцсийн өсөлт\n\n🔄 ЗАСВАРЫН ABC:\nA — Эхний эсрэг хөдөлгөөн\nB — "Bull trap"\nC — "Killer wave"' },
      { title: '3-р бүлэг: 3 үндсэн дүрэм', image: 'elliott-rules', content: '📐 1-Р ДҮРЭМ: WAVE 2\n"Wave 2 нь Wave 1-ийн ЭХЛЭЛЭЭС ХЭЗЭЭ Ч доош ородгүй."\n\n📐 2-Р ДҮРЭМ: WAVE 3\n"Wave 3 нь ХАМГИЙН БОГИНО байж болохгүй."\n• Wave 3 ≥ Wave 1\n• Ихэвчлэн Wave 1-ийн 1.618 дахин\n\n📐 3-Р ДҮРЭМ: WAVE 4\n"Wave 4 нь Wave 1-ийн муж руу орохгүй."\n⚠️ Зөвхөн Diagonal-д онцгой.\n\n🎯 ДҮРЭМ ЗӨРЧИГДВӨЛ:\n1. Тоолол буруу\n2. Өөр хувилбар хайх\n3. Stop Loss-оо цохиулах' },
      { title: '4-р бүлэг: Фибоначчи', image: 'fibonacci', content: '🔢 ФИБОНАЧЧИ ДАРААЛАЛ: 0,1,1,2,3,5,8,13,21,34,55,89,144...\n\n✨ АЛТАН ХАРЬЦАА: 0.618\n\n📉 RETRACEMENT:\nWave 2: 38.2%, 50%, 61.8% (НИЙТЛЭГ), 76.4%\nWave 4: 23.6%, 38.2% (НИЙТЛЭГ), 50%\n\n📈 EXTENSION:\nWave 3: 100%, 161.8% (НИЙТЛЭГ), 261.8%\nWave 5: 0.618×W1, 1.000×W1, 1.618×W1\nWave C: 0.618×A, 1.000×A (НИЙТЛЭГ), 1.618×A' },
      { title: '5-р бүлэг: Импульс', image: 'wave-3', content: '3 төрөл:\n\n1️⃣ IMPULSE: Үндсэн 5-3-5-3-5\n2️⃣ LEADING DIAGONAL: Шинэ trend-ийн эхлэлд\n3️⃣ ENDING DIAGONAL: Trend-ийн төгсгөлд, wedge хэлбэртэй\n\n📊 EXTENSIONS:\n• Wave 3 extension (60%) — нийтлэг\n• Wave 5 extension (20%)\n• Wave 1 extension (20%)\n\n💡 АЛТАН ДҮРЭМ: Зөвхөн НЭГ давалгаа сунгагддаг.\n\n📐 СТРАТЕГИ:\n• Wave 1 → Хүлээх\n• Wave 2 → Орох (Fib 50-61.8%)\n• Wave 3 → Долоо хоногоор барих ⭐\n• Wave 4 → Дахин орох боломж\n• Wave 5 → Ашиг авах' },
      { title: '6-р бүлэг: Засвар', image: 'corrective-waves', content: '📊 3 ҮНДСЭН ТӨРӨЛ:\n\n1️⃣ ZIGZAG (5-3-5):\n• Хурц, эгц\n• Wave B = A-ийн 50-79%\n• Wave C = A эсвэл 1.618×A\n• Wave 2 дээр\n\n2️⃣ FLAT (3-3-5):\n• Regular: B = A-ийн 100%\n• Irregular/Expanded: B > A\n• Running: маш хүчтэй trend\n• Wave 4 дээр\n\n3️⃣ TRIANGLE (3-3-3-3-3):\n• Symmetrical, Ascending, Descending, Reverse\n• Wave 4, Wave B-д\n• 💥 Дараа нь "Thrust"\n\n🌀 ЦОГЦ:\n• DOUBLE THREE: W-X-Y\n• TRIPLE THREE: W-X-Y-X-Z' },
      { title: '7-р бүлэг: Trend-ийн төгсгөл', content: '6 төрлийн арга:\n\n📐 1. CHANNEL ТЕХНИК:\nWave 1, 3-ийн оройг хол, Wave 2-оос параллель → Wave 5 төгсөх цэг.\n\n📐 2. FIBONACCI EXTENSION:\n• Wave 1-тэй тэнцүү\n• 0.618×W1\n• 1.618×W1\n\n📐 3. AWESOME OSCILLATOR DIVERGENCE:\nWave 3 — хамгийн өндөр oscillator\nWave 5 — divergence → reversal\n\n📐 4. УРВУУ ЧАРТ ПАТТЕРН:\n• Rising/Falling Wedge\n• Head & Shoulders\n• Double/Triple Top\n\n📐 5. ФИБОНАЧЧИ EMA: 8, 13, 21, 34\n\n📐 6. ЯПОНЫ УРВУУ ЛААНУУД:\n• Pin bar, Engulfing, Doji, Star\n\n💡 3-6 нэгэн зэрэг → баттай арилжаа.' },
      { title: '8-р бүлэг: Trading Map', content: '📍 ENTRY 1: Wave 2 ёроол (Fib 50-61.8%)\n• 3 lot\n• Stop Loss: Wave 1-ийн эхлэл\n\n📍 ENTRY 2: Wave 3 эхлэл (subwave 1-ээс дээш)\n• Нэмж 4 lot\n• Stop Loss-ыг шилжүүлэх\n\n📍 ENTRY 3: Wave 4 ёроол (Fib 38.2-50%)\n• Wave 3 хүчнээс хамаарч 2 lot\n\n📍 ENTRY 4: Wave 5 (subwave 4)\n\n💰 АШИГ АВАХ:\n• PROFIT 1: Wave 1 төгсгөл — 2 lot\n• PROFIT 2: Wave 3 target (1.618) — 7 lot\n• PROFIT 3: Wave 5 target — бүгд хаах\n\n🛡️ ЭРСДЭЛ: Position бүрд 1-2%, хувилбартай.' }
    ]
  }
];

export const svgImages: Record<string, string> = {
  'candle-anatomy': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Лааны бүтэц</text><g><text x="90" y="55" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">🟢 Bullish</text><line x1="90" y1="65" x2="90" y2="100" stroke="#10b981" stroke-width="2"/><rect x="70" y="100" width="40" height="100" fill="#10b981"/><line x1="90" y1="200" x2="90" y2="240" stroke="#10b981" stroke-width="2"/><text x="160" y="78" fill="#1A2238" font-size="11">High</text><text x="160" y="108" fill="#1A2238" font-size="11">Close</text><text x="160" y="208" fill="#1A2238" font-size="11">Open</text><text x="160" y="245" fill="#1A2238" font-size="11">Low</text></g><g><text x="290" y="55" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">🔴 Bearish</text><line x1="290" y1="65" x2="290" y2="90" stroke="#ef4444" stroke-width="2"/><rect x="270" y="90" width="40" height="110" fill="#ef4444"/><line x1="290" y1="200" x2="290" y2="240" stroke="#ef4444" stroke-width="2"/><text x="320" y="78" fill="#1A2238" font-size="11">High</text><text x="320" y="98" fill="#1A2238" font-size="11">Open</text><text x="320" y="208" fill="#1A2238" font-size="11">Close</text><text x="320" y="245" fill="#1A2238" font-size="11">Low</text></g></svg>`,
  'pin-bar': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Pin Bar</text><g><text x="90" y="55" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">🔨 Hammer</text><line x1="90" y1="85" x2="90" y2="100" stroke="#10b981" stroke-width="2"/><rect x="78" y="100" width="24" height="20" fill="#10b981"/><line x1="90" y1="120" x2="90" y2="220" stroke="#10b981" stroke-width="2"/><text x="135" y="170" fill="#1A2238" font-size="11">Урт доод</text><text x="90" y="260" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">↑ Өсөлт</text></g><g><text x="290" y="55" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">⭐ Shooting Star</text><line x1="290" y1="85" x2="290" y2="180" stroke="#ef4444" stroke-width="2"/><text x="240" y="130" text-anchor="end" fill="#1A2238" font-size="11">Урт дээд</text><rect x="278" y="180" width="24" height="20" fill="#ef4444"/><line x1="290" y1="200" x2="290" y2="215" stroke="#ef4444" stroke-width="2"/><text x="290" y="260" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600">↓ Уналт</text></g></svg>`,
  'engulfing': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Engulfing Bar</text><g><text x="90" y="55" text-anchor="middle" fill="#10b981" font-size="12" font-weight="600">🟢 Bullish</text><line x1="65" y1="80" x2="65" y2="100" stroke="#ef4444" stroke-width="2"/><rect x="55" y="100" width="20" height="40" fill="#ef4444"/><line x1="105" y1="80" x2="105" y2="95" stroke="#10b981" stroke-width="2"/><rect x="85" y="95" width="40" height="80" fill="#10b981"/><text x="90" y="220" text-anchor="middle" fill="#1A2238" font-size="10">"залгидаг"</text><text x="90" y="260" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">↑ Reversal Up</text></g><g><text x="290" y="55" text-anchor="middle" fill="#ef4444" font-size="12" font-weight="600">🔴 Bearish</text><line x1="265" y1="100" x2="265" y2="115" stroke="#10b981" stroke-width="2"/><rect x="255" y="115" width="20" height="35" fill="#10b981"/><line x1="305" y1="80" x2="305" y2="100" stroke="#ef4444" stroke-width="2"/><rect x="285" y="100" width="40" height="85" fill="#ef4444"/><text x="290" y="220" text-anchor="middle" fill="#1A2238" font-size="10">"залгидаг"</text><text x="290" y="260" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600">↓ Reversal Down</text></g></svg>`,
  'doji': `<svg viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Doji</text><g><text x="65" y="55" text-anchor="middle" fill="#1A2238" font-size="11" font-weight="600">Standard</text><line x1="65" y1="70" x2="65" y2="180" stroke="#1A2238" stroke-width="1.5"/><line x1="50" y1="125" x2="80" y2="125" stroke="#1A2238" stroke-width="3"/></g><g><text x="155" y="55" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">🐉 Dragonfly</text><line x1="140" y1="80" x2="170" y2="80" stroke="#10b981" stroke-width="3"/><line x1="155" y1="80" x2="155" y2="180" stroke="#10b981" stroke-width="1.5"/><text x="155" y="210" text-anchor="middle" fill="#10b981" font-size="10">↑ Bullish</text></g><g><text x="245" y="55" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600">🪦 Gravestone</text><line x1="245" y1="80" x2="245" y2="180" stroke="#ef4444" stroke-width="1.5"/><line x1="230" y1="180" x2="260" y2="180" stroke="#ef4444" stroke-width="3"/><text x="245" y="210" text-anchor="middle" fill="#ef4444" font-size="10">↓ Bearish</text></g><g><text x="335" y="55" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="600">Long-legged</text><line x1="335" y1="70" x2="335" y2="190" stroke="#a78bfa" stroke-width="1.5"/><line x1="320" y1="130" x2="350" y2="130" stroke="#a78bfa" stroke-width="3"/></g></svg>`,
  'inside-bar': `<svg viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Inside Bar (Harami)</text><g><text x="120" y="55" text-anchor="middle" fill="#1A2238" font-size="12" font-weight="600">Эх лаа</text><rect x="100" y="85" width="40" height="120" fill="#10b981"/></g><g><text x="240" y="55" text-anchor="middle" fill="#1A2238" font-size="12" font-weight="600">Inside Bar</text><rect x="220" y="85" width="40" height="120" fill="#10b981" opacity="0.2"/><rect x="260" y="125" width="20" height="40" fill="#1A2238"/></g></svg>`,
  'trend-types': `<svg viewBox="0 0 380 260" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">3 төрлийн зах зээл</text><g><text x="80" y="60" text-anchor="middle" fill="#10b981" font-size="11" font-weight="600">Uptrend</text><polyline points="30,140 50,120 65,130 85,90 100,100 120,70 135,80" fill="none" stroke="#10b981" stroke-width="2"/><text x="80" y="170" text-anchor="middle" fill="#1A2238" font-size="9">HH + HL</text></g><g><text x="190" y="60" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600">Downtrend</text><polyline points="140,80 160,100 175,90 195,120 210,110 230,140 245,130" fill="none" stroke="#ef4444" stroke-width="2"/><text x="190" y="170" text-anchor="middle" fill="#1A2238" font-size="9">LH + LL</text></g><g><text x="305" y="60" text-anchor="middle" fill="#1A2238" font-size="11" font-weight="600">Range</text><polyline points="260,130 275,95 290,130 310,95 325,130 345,95" fill="none" stroke="#1A2238" stroke-width="2"/><text x="305" y="170" text-anchor="middle" fill="#1A2238" font-size="9">Sideways</text></g></svg>`,
  'support-resistance': `<svg viewBox="0 0 380 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Support & Resistance</text><line x1="40" y1="60" x2="340" y2="60" stroke="#ef4444" stroke-width="1.5" stroke-dasharray="4,3"/><text x="350" y="64" fill="#ef4444" font-size="10">R</text><line x1="40" y1="170" x2="340" y2="170" stroke="#10b981" stroke-width="1.5" stroke-dasharray="4,3"/><text x="350" y="174" fill="#10b981" font-size="10">S</text><polyline points="50,150 80,75 110,140 140,65 170,155 200,70 230,160 260,85 290,165 320,75" fill="none" stroke="#5B8DFF" stroke-width="2"/></svg>`,
  'elliott-waves': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Эллиотын 8 давалгаа</text><polyline points="30,210 70,170 50,200 130,80 100,140 200,40 170,90 250,140 280,90 330,180" fill="none" stroke="#5B8DFF" stroke-width="2"/><g font-size="11" font-weight="700"><circle cx="70" cy="170" r="10" fill="#10b981"/><text x="70" y="174" text-anchor="middle" fill="white">1</text><circle cx="50" cy="200" r="10" fill="#ef4444"/><text x="50" y="204" text-anchor="middle" fill="white">2</text><circle cx="130" cy="80" r="11" fill="#10b981" stroke="#1A2238" stroke-width="2"/><text x="130" y="84" text-anchor="middle" fill="white">3</text><circle cx="100" cy="140" r="10" fill="#ef4444"/><text x="100" y="144" text-anchor="middle" fill="white">4</text><circle cx="200" cy="40" r="10" fill="#10b981"/><text x="200" y="44" text-anchor="middle" fill="white">5</text><circle cx="170" cy="90" r="10" fill="#a78bfa"/><text x="170" y="94" text-anchor="middle" fill="white">A</text><circle cx="250" cy="140" r="10" fill="#a78bfa"/><text x="250" y="144" text-anchor="middle" fill="white">B</text><circle cx="330" cy="180" r="10" fill="#a78bfa"/><text x="330" y="184" text-anchor="middle" fill="white">C</text></g></svg>`,
  'elliott-rules': `<svg viewBox="0 0 380 320" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">3 үндсэн дүрэм</text><g><rect x="20" y="45" width="340" height="80" rx="8" fill="#F0F3F8" stroke="#10b981" stroke-width="1"/><text x="35" y="65" fill="#10b981" font-size="11" font-weight="700">Дүрэм 1: Wave 2</text><text x="35" y="82" fill="#1A2238" font-size="10">Wave 1-ийн ЭХЛЭЛЭЭС доош ороход</text><text x="35" y="96" fill="#1A2238" font-size="10">тоолол БУРУУ.</text></g><g><rect x="20" y="135" width="340" height="80" rx="8" fill="#F0F3F8" stroke="#5B8DFF" stroke-width="1"/><text x="35" y="155" fill="#5B8DFF" font-size="11" font-weight="700">Дүрэм 2: Wave 3</text><text x="35" y="172" fill="#1A2238" font-size="10">ХАМГИЙН БОГИНО байж болохгүй.</text></g><g><rect x="20" y="225" width="340" height="80" rx="8" fill="#F0F3F8" stroke="#ef4444" stroke-width="1"/><text x="35" y="245" fill="#ef4444" font-size="11" font-weight="700">Дүрэм 3: Wave 4</text><text x="35" y="262" fill="#1A2238" font-size="10">Wave 1-ийн МУЖ руу орохгүй.</text></g></svg>`,
  'fibonacci': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Fibonacci Retracement</text><line x1="50" y1="220" x2="200" y2="60" stroke="#10b981" stroke-width="2"/><g font-size="9"><line x1="50" y1="121" x2="340" y2="121" stroke="#10b981" stroke-width="1" stroke-dasharray="3,2"/><text x="345" y="124" fill="#10b981" font-weight="600">0.618 ⭐</text><line x1="50" y1="140" x2="340" y2="140" stroke="#5B8DFF" stroke-width="0.5" stroke-dasharray="2,2"/><text x="345" y="143" fill="#5B8DFF">0.500</text><line x1="50" y1="159" x2="340" y2="159" stroke="#a78bfa" stroke-width="0.5" stroke-dasharray="2,2"/><text x="345" y="162" fill="#a78bfa">0.382</text></g><polyline points="200,60 250,121 280,90 310,140" fill="none" stroke="#1A2238" stroke-width="2"/></svg>`,
  'corrective-waves': `<svg viewBox="0 0 380 280" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="600">Засварын 3 төрөл</text><g><text x="65" y="55" text-anchor="middle" fill="#ef4444" font-size="11" font-weight="600">Zigzag 5-3-5</text><polyline points="30,90 50,150 65,115 85,180" fill="none" stroke="#ef4444" stroke-width="2"/></g><g><text x="190" y="55" text-anchor="middle" fill="#1A2238" font-size="11" font-weight="600">Flat 3-3-5</text><polyline points="155,90 175,150 195,90 215,150" fill="none" stroke="#1A2238" stroke-width="2"/></g><g><text x="320" y="55" text-anchor="middle" fill="#a78bfa" font-size="11" font-weight="600">Triangle</text><polyline points="285,90 305,160 320,105 335,150 350,120" fill="none" stroke="#a78bfa" stroke-width="2"/></g></svg>`,
  'wave-3': `<svg viewBox="0 0 380 240" xmlns="http://www.w3.org/2000/svg" style="width:100%;height:auto"><text x="190" y="25" text-anchor="middle" fill="#1A2238" font-size="13" font-weight="700">⭐ Wave 3 — Хамгийн ашигтай</text><polyline points="30,200 60,170 50,190 180,50 150,120 230,30 210,70 280,110 310,75 350,150" fill="none" stroke="#1A2238" stroke-width="1.5"/><line x1="50" y1="190" x2="180" y2="50" stroke="#5B8DFF" stroke-width="3"/><g font-size="10" font-weight="700"><circle cx="60" cy="170" r="8" fill="#10b981"/><text x="60" y="173" text-anchor="middle" fill="white">1</text><circle cx="180" cy="50" r="11" fill="#5B8DFF" stroke="white" stroke-width="2"/><text x="180" y="54" text-anchor="middle" fill="white">3</text><circle cx="230" cy="30" r="8" fill="#10b981"/><text x="230" y="33" text-anchor="middle" fill="white">5</text></g></svg>`
};

export const cheatsheet: any[] = [
  { icon: '🛡️', title: 'Эрсдэлийн дүрэм', accent: 'red', items: [
    '1 арилжаанд макс 1-2% эрсдэл',
    'R:R хамгийн багадаа 1:2',
    'Stop Loss ЗААВАЛ тогтоох',
    'Анхан үед 1:10 leverage хүртэл',
    '10 дараалсан алдагдалд бэлэн бай',
    'Daily loss limit — 5-6%',
  ]},
  { icon: '🕯️', title: 'Хүчтэй паттернууд', accent: 'green', items: [
    'Bullish/Bearish Engulfing',
    'Pin Bar (Hammer / Shooting Star)',
    'Morning / Evening Star',
    'Inside Bar False Breakout',
    'Doji at trend extreme',
    'Three White Soldiers / Black Crows',
  ]},
  { icon: '📐', title: 'Fibonacci түвшинүүд', accent: 'violet', items: [
    'Retracement: 38.2% / 50% / 61.8%',
    'Wave 2 → 50-61.8% (нийтлэг)',
    'Wave 4 → 38.2% (нийтлэг)',
    'Wave 3 target → 161.8%',
    'Wave 5 target → 100% of Wave 1',
    'Extension max: 261.8% / 423.6%',
  ]},
  { icon: '🌊', title: 'Elliott 3 дүрэм', accent: 'cyan', items: [
    'Wave 2 < Wave 1 эхлэлийн цэг',
    'Wave 3 хамгийн богино биш',
    'Wave 4 ≠ Wave 1 муж руу орох',
    'Зөвхөн нэг давалгаа сунгагдана',
    'Хувилбар бүрд Stop Loss',
    'Top Down: Daily → 4H → 1H',
  ]},
  { icon: '📊', title: 'Захиалгын төрөл', accent: 'cyan', items: [
    'Market — одоогийн үнээр',
    'Limit — тогтсон үнээр',
    'Stop — breakout level',
    'Stop Loss — алдагдал хязгаар',
    'Take Profit — ашиг тогтоох',
    'Trailing Stop — дагах stop',
  ]},
  { icon: '⏰', title: 'Зах зээлийн цаг (UTC)', accent: 'amber', items: [
    'Sydney: 21:00 – 06:00',
    'Tokyo: 23:00 – 08:00',
    'London: 07:00 – 16:00 ⭐',
    'New York: 12:00 – 21:00 ⭐',
    'London + NY overlap: 12:00 – 16:00 🔥',
    'Crypto: 24/7',
  ]},
  { icon: '🎯', title: 'Position Size томьёо', accent: 'cyan', items: [
    'Risk $ = Account × Risk%',
    'Size = Risk $ ÷ (Entry − SL)',
    'Pip Value × Pips = Risk',
    'Lot хэмжээ: 100k/10k/1k нэгж',
    '1 standard lot EURUSD = $10/pip',
    'XAUUSD: 1 lot = $1/pip',
  ]},
  { icon: '🧠', title: 'Сэтгэл зүйн алдаа', accent: 'red', items: [
    'FOMO — алдсан нь хойноос гүйх',
    'Revenge trading — өс хонзонгийн арилжаа',
    'Overtrading — хэт олон position',
    'Cherry-picking — Stop Loss-оо хөдөлгөх',
    'Overconfidence — ялалтын дараа том risk',
    'Analysis paralysis — хэт олон indicator',
  ]},
  { icon: '✅', title: 'Pre-trade checklist', accent: 'green', items: [
    '✓ Том timeframe trend?',
    '✓ S/R эсвэл key level дээр уу?',
    '✓ Pattern confirmation бий юу?',
    '✓ Stop Loss тогтсон уу?',
    '✓ R:R ≥ 1:2 уу?',
    '✓ Position size зөв уу?',
    '✓ Сэтгэл хөдлөл стресс байгаа юу?',
  ]},
];

export const glossary: any[] = [
  { term: 'Bid', def: 'Худалдан авагчдын санал болгож буй хамгийн өндөр үнэ' },
  { term: 'Ask', def: 'Худалдагчдын шаардаж буй хамгийн бага үнэ' },
  { term: 'Spread', def: 'Bid ба Ask-ийн хоорондох зөрүү. Бага байх тусам ашигтай' },
  { term: 'Pip', def: 'Үнийн хамгийн бага өөрчлөлтийн нэгж (форекст 0.0001)' },
  { term: 'Pipette', def: 'Pip-ийн 1/10. 5 оронтой үнэт цаасны хувьд' },
  { term: 'Lot', def: 'Арилжааны хэмжээний нэгж. Standard lot = 100,000 нэгж' },
  { term: 'Mini Lot', def: '10,000 нэгжтэй жижиг лот (0.1 standard lot)' },
  { term: 'Micro Lot', def: '1,000 нэгжтэй маш жижиг лот (0.01 standard lot)' },
  { term: 'Leverage', def: 'Хөшүүрэг — өөрийн хөрөнгөөс илүү хэмжээгээр арилжаа хийх боломж' },
  { term: 'Margin', def: 'Leverage арилжаа нээхэд шаардлагатай барьцаа мөнгө' },
  { term: 'Free Margin', def: 'Шинэ арилжаа нээх боломжтой үлдсэн margin' },
  { term: 'Margin Call', def: 'Margin level хүрэлцэхгүй болоход брокер position-ыг хаах анхааруулга' },
  { term: 'Long', def: 'Үнэ өснө гэж найдан худалдан авах position' },
  { term: 'Short', def: 'Үнэ буурна гэж найдан зарах position' },
  { term: 'Stop Loss', def: 'Тодорхой үнэд хүрвэл арилжааг автоматаар хааж алдагдлыг хязгаарлах захиалга' },
  { term: 'Take Profit', def: 'Тодорхой үнэд хүрвэл ашгийг тогтоон арилжааг хаах захиалга' },
  { term: 'Trailing Stop', def: 'Үнэ дагаж шилждэг Stop Loss — ашгийг хамгаална' },
  { term: 'Market Order', def: 'Одоогийн үнээр шууд гүйцэтгэх захиалга' },
  { term: 'Limit Order', def: 'Тодорхой үнэд хүрэх үед автоматаар гүйцэтгэх захиалга' },
  { term: 'Stop Order', def: 'Breakout түвшин эвдэгдвэл идэвхждэг захиалга' },
  { term: 'Volatility', def: 'Үнийн хэлбэлзлийн хэмжээ. Их volatility = их эрсдэл/боломж' },
  { term: 'Liquidity', def: 'Хөрөнгийг хурдан худалдан авах/зарах боломж' },
  { term: 'Slippage', def: 'Захиалгын үнэ ба бодит гүйцэтгэлийн үнийн зөрүү' },
  { term: 'Bull Market', def: 'Үнэ өсөж буй зах зээл (бух)' },
  { term: 'Bear Market', def: 'Үнэ буурч буй зах зээл (баавгай)' },
  { term: 'Support', def: 'Үнэ буурахад зогсох төлөвтэй түвшин' },
  { term: 'Resistance', def: 'Үнэ өсөхөд зогсох төлөвтэй түвшин' },
  { term: 'Breakout', def: 'Үнэ S/R түвшинг сэтэлж гарах нь' },
  { term: 'Fakeout', def: 'Худал breakout — үнэ түвшинг сэтэлсэн мэт болоод буцдаг' },
  { term: 'Candlestick', def: 'Лааны хэлбэртэй үнийн графикийн загвар. Open, High, Low, Close үнийг харуулна' },
  { term: 'Pin Bar', def: 'Урт сүүл, жижиг биетэй лаа. Reversal дохио өгдөг' },
  { term: 'Hammer', def: 'Bullish pin bar. Урт доод сүүл, уналтын ёроолд үүснэ' },
  { term: 'Shooting Star', def: 'Bearish pin bar. Урт дээд сүүл, өсөлтийн оройд үүснэ' },
  { term: 'Engulfing Bar', def: '2 лаа — 2 дахь нь эхнийхээ бүрэн залгидаг. Хүчтэй reversal дохио' },
  { term: 'Doji', def: 'Open ≈ Close. Шийдвэргүй байдал, тэгш байдлын дохио' },
  { term: 'Dragonfly Doji', def: 'Урт доод сүүлтэй Doji. Bullish дохио' },
  { term: 'Gravestone Doji', def: 'Урт дээд сүүлтэй Doji. Bearish дохио' },
  { term: 'Inside Bar', def: 'Harami гэгдэх. Жижиг лаа том лааны дотор. Consolidation' },
  { term: 'Outside Bar', def: 'Эхний лааны high/low хоёуланг нь давсан том лаа. Engulfing-тэй ойролцоо' },
  { term: 'Morning Star', def: '3 лаатай bullish reversal паттерн' },
  { term: 'Evening Star', def: '3 лаатай bearish reversal паттерн' },
  { term: 'Three White Soldiers', def: '3 дараалсан хүчтэй ногоон лаа. Bullish continuation' },
  { term: 'Three Black Crows', def: '3 дараалсан хүчтэй улаан лаа. Bearish continuation' },
  { term: 'Tweezer Top', def: 'Дээд цэг тэнцүү 2 лаа. Bearish reversal' },
  { term: 'Tweezer Bottom', def: 'Доод цэг тэнцүү 2 лаа. Bullish reversal' },
  { term: 'Elliott Wave', def: 'Зах зээлийн давтамжит давалгаан хэв шинж. 5 импульс + 3 засвар = 8 давалгаа' },
  { term: 'Impulse Wave', def: 'Тренд дагуух 1-3-5 давалгаа' },
  { term: 'Corrective Wave', def: 'Тренд эсрэг A-B-C 3 давалгаа' },
  { term: 'Wave 3', def: 'Элиотын хамгийн хүчтэй, урт давалгаа. Ашгийн хамгийн их боломж' },
  { term: 'Zigzag', def: 'Хурц 5-3-5 бүтэцтэй засварын давалгаа' },
  { term: 'Flat', def: '3-3-5 хажуу тийш засварын давалгаа' },
  { term: 'Triangle', def: 'A-B-C-D-E 5 давалгаатай хажуу тийш засвар. Зөвхөн Wave 4, B-д' },
  { term: 'Diagonal', def: 'Trend line дотор хөдлөх 5-3-5-3-5 эсвэл 3-3-3-3-3 импульс' },
  { term: 'Fibonacci', def: 'Леонардо Фибоначчигийн нээсэн математик дараалал. 0,1,1,2,3,5,8,13,21,34...' },
  { term: 'Golden Ratio', def: 'Алтан харьцаа = 0.618 (эсвэл 1.618). Элиот ашигладаг гол харьцаа' },
  { term: 'Retracement', def: 'Үнэ буцах түвшин. Нийтлэг: 38.2%, 50%, 61.8%' },
  { term: 'Extension', def: 'Импульс давалгааны target түвшин. 100%, 161.8%, 261.8%' },
  { term: 'Bull Trap', def: 'Wave B-ийн нэр томьёо. Худалдан авагчдыг хууртаж зарж авдаг' },
  { term: 'Killer Wave', def: 'Wave C-ийн нэр томьёо. Long position-уудыг устгадаг' },
  { term: 'Trend Line', def: 'Тренд харуулсан зураас. 2+ цэг холбогдсон шугам' },
  { term: 'Channel', def: 'Хоёр параллель trend line хооронд хөдлөх үнийн коридор' },
  { term: 'Head & Shoulders', def: '3 оргилтой reversal паттерн. Дунд оргил хамгийн өндөр' },
  { term: 'Double Top', def: '2 тэгш оргилтой reversal паттерн. Bearish дохио' },
  { term: 'Double Bottom', def: '2 тэгш ёроолтой reversal паттерн. Bullish дохио' },
  { term: 'Cup & Handle', def: 'Аяга, бариултай хэлбэрийн bullish continuation паттерн' },
  { term: 'Wedge', def: 'Шаантаг хэлбэрийн паттерн. Rising/Falling гэсэн хоёр төрөл' },
  { term: 'Flag', def: 'Хурц хөдөлгөөний дараах жижиг channel. Continuation' },
  { term: 'Pennant', def: 'Гурвалжин хэлбэрийн жижиг continuation паттерн' },
  { term: 'RSI', def: 'Relative Strength Index — Хөрөнгө хэт их худалдан авагдсан/зарагдсан эсэхийг харуулах индикатор (0-100)' },
  { term: 'MACD', def: 'Moving Average Convergence Divergence — Трендийг харуулах индикатор' },
  { term: 'Moving Average', def: 'Хөдөлгөөнт дундаж — үнийн дундаж шугам. SMA, EMA гэсэн төрөлтэй' },
  { term: 'SMA', def: 'Simple Moving Average — энгийн дундаж' },
  { term: 'EMA', def: 'Exponential Moving Average — сүүлийн үнэт илүү жинтэй дундаж' },
  { term: 'Bollinger Bands', def: 'Үнийн volatility-г харуулах 3 шугам. Дундаж + 2 стандарт хазайлт' },
  { term: 'Stochastic', def: 'Хэт их худалдан авагдсан/зарагдсан байдлыг харуулах индикатор' },
  { term: 'Volume', def: 'Тухайн хугацаанд хийгдсэн арилжааны хэмжээ' },
  { term: 'OBV', def: 'On-Balance Volume — Volume-ын урсгалыг үнийн чигтэй харьцуулах индикатор' },
  { term: 'ATR', def: 'Average True Range — Volatility-ыг хэмжих индикатор. Stop Loss тооцооход чухал' },
  { term: 'Drawdown', def: 'Дансны хамгийн дээд цэгээс хамгийн доод цэг хүртэлх уналт' },
  { term: 'Equity', def: 'Нийт данс — нээлттэй position-уудын зөрчилтэй ашиг/алдагдал нэмэгдсэн' },
  { term: 'Balance', def: 'Хаагдсан арилжаануудаас үлдсэн данс' },
  { term: 'FOMO', def: 'Fear Of Missing Out — Боломжийг алдах айдас. Хамгийн нийтлэг сэтгэл зүйн алдаа' },
  { term: 'Revenge Trading', def: 'Алдагдлыг хурдан нөхөхийн тулд хийдэг хайхрамжгүй арилжаа' },
  { term: 'Overtrading', def: 'Хэт олон арилжаа хийх — стратегиэс хазайх' },
  { term: 'Confluence', def: 'Олон техник дохио нэг цэгт нийлэх. Хүчтэй setup-ыг илэрхийлнэ' },
  { term: 'False Breakout', def: 'Худал давалт. Үнэ түвшинг сэтэлсэн мэт болоод буцдаг. Stop hunt-ын дохио' },
  { term: 'Stop Hunt', def: 'Том тоглогчид жижиг арилжаачдын Stop Loss-уудыг "цохих" хөдөлгөөн' },
  { term: 'Liquidity Pool', def: 'Олон stop loss/limit order төвлөрсөн бүс. Том тоглогчид зорьдог' },
  { term: 'Smart Money', def: 'Том институт, банкууд — зах зээлийг хөдөлгөдөг тоглогчид' },
  { term: 'Order Block', def: 'Smart Money институтуудын том захиалга үлдсэн үнийн бүс' },
  { term: 'Fair Value Gap', def: '3 лаагийн дунд гарсан хоосон зай. Үнэ нь хожим буцаж "дүүргэдэг"' },
  { term: 'Backtest', def: 'Түүхэн өгөгдөл дээр стратегиа шалгах' },
  { term: 'Forward Test', def: 'Demo дансан дээр бодит цаг хугацаанд стратеги шалгах' },
  { term: 'Edge', def: 'Стратегийн математик давуу тал — урт хугацаанд ашигтай байх боломж' },
  { term: 'Win Rate', def: 'Амжилттай арилжааны хувь — нийт-ээс' },
  { term: 'Expectancy', def: 'Нэг арилжаанаас хүлээгдэх дундаж ашиг (Win% × AvgWin) − (Loss% × AvgLoss)' },
  { term: 'Sharpe Ratio', def: 'Эрсдэлд тохирсон ашгийн хэмжүүр. Их = илүү сайн' },
  { term: 'CFD', def: 'Contract For Difference — үнийн зөрүүгээр арилжаалах деривативын төрөл' },
  { term: 'Swap', def: 'Position-ыг шөнө дамжуулан хадгалахад төлдөг хүү' },
  { term: 'Funding Rate', def: 'Crypto perpetual contract-д long/short хооронд төлөгддөг хүү' },
];
