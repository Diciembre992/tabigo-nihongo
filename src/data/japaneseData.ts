export interface MoraPitch {
  mora: string;
  high: boolean;
}

export type LearningLevelId = 'intro' | 'nivel-1' | 'nivel-2' | 'nivel-3';

export interface VocabItem {
  id: string;
  level: LearningLevelId;
  category: 'cortesia' | 'restaurante' | 'transporte' | 'compras' | 'emergencia';
  japanese: string;
  kana: string;
  katakana: string;
  romaji: string;
  esPhonetic: string; // Guía adaptada al oído hispanohablante
  meaning: string;
  literal?: string;
  pitchPattern: MoraPitch[];
  mnemonic: string;
  culturalTip: string;
  usageContext: string;
}

export interface WritingChar {
  id: string;
  level?: LearningLevelId;
  char: string;
  type: 'hiragana' | 'katakana' | 'kanji-calle';
  romaji: string;
  esPhonetic: string;
  meaning: string;
  mnemonic: string;
  realWorldSign?: string; // Ejemplo en letreros de Japón
  exampleWord: {
    jp: string;
    romaji: string;
    es: string;
  };
  strokes: string[]; // SVG path data (viewBox 0 0 100 100) for guided tracing
}

export interface DialogueStep {
  staffJp: string;
  staffKana: string;
  staffRomaji: string;
  staffEs: string;
  contextNote: string;
  options: {
    jp: string;
    kana: string;
    romaji: string;
    esPhonetic: string;
    esMeaning: string;
    isCorrect: boolean;
    feedback: string;
  }[];
}

export interface TravelScenario {
  id: string;
  level?: LearningLevelId;
  title: string;
  jpTitle: string;
  location: string;
  difficulty: 'Nivel 0 · Intro' | 'Nivel 1 · Básico' | 'Nivel 2 · Intermedio' | 'Nivel 3 · Avanzado' | 'Básico' | 'Esencial' | 'Práctico';
  stampName: string;
  stampKanji: string;
  description: string;
  steps: DialogueStep[];
}

export interface BuilderWord {
  id: string;
  jp: string;
  kana: string;
  romaji: string;
  esPhonetic: string;
  es: string;
  category: 'lugar' | 'comida' | 'objeto' | 'transporte';
  icon: string;
}

export interface BuilderPattern {
  id: string;
  labelEs: string;
  intent: string;
  suffixJp: string;
  suffixKana: string;
  suffixRomaji: string;
  suffixPhonetic: string;
  allowedCategories: ('lugar' | 'comida' | 'objeto' | 'transporte')[];
  explanation: string;
  politeness: string;
}

export const VOCAB_ITEMS: VocabItem[] = [
  // =========================================================================
  // NIVEL 0 · INTRODUCTORIO (7 Expresiones de Supervivencia Inmediata)
  // =========================================================================
  {
    id: 'sumimasen',
    level: 'intro',
    category: 'cortesia',
    japanese: 'すみません',
    kana: 'すみません',
    katakana: 'スミマセン',
    romaji: 'Sumimasen',
    esPhonetic: 'Su-mi-ma-sén',
    meaning: 'Disculpe / Perdón / Gracias (por la molestia)',
    literal: 'No termina (mi deuda contigo)',
    pitchPattern: [
      { mora: 'す', high: false },
      { mora: 'み', high: true },
      { mora: 'ま', high: true },
      { mora: 'せ', high: true },
      { mora: 'ん', high: false },
    ],
    mnemonic: 'Imagina que pisas sin querer a alguien y le dices: "SU MIrada MAs SENsible me disculpe" → SU-MI-MA-SEN.',
    culturalTip: 'La palabra #1 de Japón. Úsala para llamar al camarero, pedir paso en el tren, disculparte o agradecer cuando alguien hace un esfuerzo por ti.',
    usageContext: 'Al entrar a un local o antes de hacer una pregunta en la calle.'
  },
  {
    id: 'arigatou',
    level: 'intro',
    category: 'cortesia',
    japanese: 'ありがとうございます',
    kana: 'ありがとうございます',
    katakana: 'アリガトウゴザイマス',
    romaji: 'Arigatō gozaimasu',
    esPhonetic: 'A-ri-ga-too go-zai-más',
    meaning: 'Muchas gracias (formal)',
    literal: 'Es difícil que exista (algo tan valioso)',
    pitchPattern: [
      { mora: 'あ', high: false },
      { mora: 'り', high: true },
      { mora: 'が', high: false },
      { mora: 'と', high: false },
      { mora: 'う', high: false },
      { mora: 'ご', high: false },
      { mora: 'ざ', high: true },
      { mora: 'い', high: true },
      { mora: 'ま', high: true },
      { mora: 'す', high: false },
    ],
    mnemonic: 'Piensa en acariciar a un gato agradecido: "A RIco GATO le GOZA Y MÁS" → ARI-GATO GOZAI-MAS.',
    culturalTip: 'La "u" final de "masu" casi no se pronuncia (suena "mas"). La "r" siempre es suave como en "cara", nunca fuerte como en "perro".',
    usageContext: 'Al recibir tu cambio, comida o ayuda de cualquier desconocido.'
  },
  {
    id: 'onegaishimasu',
    level: 'intro',
    category: 'cortesia',
    japanese: 'お願いします',
    kana: 'おねがいします',
    katakana: 'オネガイシマス',
    romaji: 'Onegaishimasu',
    esPhonetic: 'O-ne-gai-shi-más',
    meaning: 'Por favor (al pedir o encargar algo)',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'ね', high: true },
      { mora: 'が', high: true },
      { mora: 'い', high: true },
      { mora: 'し', high: true },
      { mora: 'ま', high: true },
      { mora: 'す', high: false },
    ],
    mnemonic: 'Pides algo con tanta educación que nadie puede negarse: "O NEGARSE jamás, SÍ MÁS por favor" → O-NE-GAI-SHI-MAS.',
    culturalTip: 'Puedes señalar cualquier cosa en un menú y decir "Kore, onegaishimasu" (Esto, por favor) y sonarás súper educado.',
    usageContext: 'En tiendas, restaurantes, hoteles y taxis.'
  },
  {
    id: 'konnichiwa',
    level: 'intro',
    category: 'cortesia',
    japanese: 'こんにちは',
    kana: 'こんにちは',
    katakana: 'コンニチワ',
    romaji: 'Konnichiwa',
    esPhonetic: 'Kon-ni-chi-uá',
    meaning: 'Hola / Buenas tardes (10:00 a 18:00)',
    pitchPattern: [
      { mora: 'こ', high: false },
      { mora: 'ん', high: true },
      { mora: 'に', high: true },
      { mora: 'ち', high: true },
      { mora: 'は', high: true },
    ],
    mnemonic: 'Saludas a tu amigo en la calle: "¡CON NICHI WA (va) todo genial hoy!" → KON-NI-CHI-WA.',
    culturalTip: 'Aunque el último signo es は (ha), como partícula al final de este saludo se pronuncia siempre "wa". Haz una pausa brevísima en la doble "nn".',
    usageContext: 'Saludo general durante el día.'
  },
  {
    id: 'ohayou',
    level: 'intro',
    category: 'cortesia',
    japanese: 'おはようございます',
    kana: 'おはようございます',
    katakana: 'オハヨウゴザイマス',
    romaji: 'Ohayō gozaimasu',
    esPhonetic: 'O-ja-yoo go-zai-más',
    meaning: 'Buenos días (formal)',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'は', high: true },
      { mora: 'よ', high: true },
      { mora: 'う', high: true },
      { mora: 'ご', high: false },
      { mora: 'ざ', high: true },
      { mora: 'い', high: true },
      { mora: 'ま', high: true },
      { mora: 'す', high: false },
    ],
    mnemonic: 'Te despiertas por la mañana con energía: "¡OH, YA YO despierto! ¡GOZA Y MÁS!" → O-HA-YO GOZAI-MAS.',
    culturalTip: 'La "h" suena como una "j" muy suave y aspirada (como "hello" en inglés). La "ō" es una "o" alargada el doble de tiempo.',
    usageContext: 'En la recepción del hotel o ryokan por la mañana.'
  },
  {
    id: 'kore-kudasai',
    level: 'intro',
    category: 'restaurante',
    japanese: 'これをください',
    kana: 'これをください',
    katakana: 'コレヲクダサイ',
    romaji: 'Kore o kudasai',
    esPhonetic: 'Ko-re o ku-da-sái',
    meaning: 'Me da esto, por favor',
    pitchPattern: [
      { mora: 'こ', high: false },
      { mora: 'れ', high: true },
      { mora: 'を', high: true },
      { mora: 'く', high: false },
      { mora: 'だ', high: true },
      { mora: 'さ', high: true },
      { mora: 'い', high: true },
    ],
    mnemonic: 'Tienes tanta hambre que señalas el plato y dices: "¡CORRE O CUIDA si hay, dámelo ya!" → KORE O KU-DA-SAI.',
    culturalTip: 'Tu comodín definitivo en Japón. Señala la vitrina de platos de plástico (sampuru) o la foto del menú y di esta frase.',
    usageContext: 'Al pedir comida o comprar en mostradores.'
  },
  {
    id: 'eki-doko',
    level: 'intro',
    category: 'transporte',
    japanese: '駅はどこですか？',
    kana: 'えきはどこですか',
    katakana: 'エキハドコデスカ',
    romaji: 'Eki wa doko desu ka?',
    esPhonetic: 'É-ki ua dó-ko des-ká',
    meaning: '¿Dónde está la estación de tren?',
    pitchPattern: [
      { mora: 'え', high: true },
      { mora: 'き', high: false },
      { mora: 'は', high: false },
      { mora: 'ど', high: true },
      { mora: 'こ', high: false },
      { mora: 'で', high: false },
      { mora: 'す', high: false },
      { mora: 'か', high: true },
    ],
    mnemonic: 'Buscas la estación marcada con una EQUIS (E-KI) y preguntas: "¿Dónde la COLOCO (DO-KO)?" → EKI WA DOKO DESU KA.',
    culturalTip: 'Puedes cambiar "Eki" (estación) por "Toire" (baño), "Konbini" (tienda 24h) o "Deguchi" (salida).',
    usageContext: 'Al orientarte en la calle o dentro de estaciones gigantes.'
  },

  // =========================================================================
  // NIVEL 1 · BÁSICO (7 Expresiones de Restaurante, Compras y Cortesía en Mesa)
  // =========================================================================
  {
    id: 'okaikei',
    level: 'nivel-1',
    category: 'restaurante',
    japanese: 'お会計お願いします',
    kana: 'おかいけいおねがいします',
    katakana: 'オカイケイオネガイシマス',
    romaji: 'O-kaikei onegaishimasu',
    esPhonetic: 'O-kai-kei o-ne-gai-shi-más',
    meaning: 'La cuenta, por favor',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'か', high: true },
      { mora: 'い', high: true },
      { mora: 'け', high: true },
      { mora: 'い', high: true },
    ],
    mnemonic: 'Al terminar de cenar dices: "¡OKAY, QUÉ bien comimos! La cuenta por favor" → O-KAI-KEI.',
    culturalTip: 'Puedes acompañar la frase cruzando los dos dedos índices formando una "X" (gesto tradicional japonés para pedir la cuenta).',
    usageContext: 'Al terminar de comer en un restaurante o izakaya.'
  },
  {
    id: 'omizu',
    level: 'nivel-1',
    category: 'restaurante',
    japanese: 'お水をください',
    kana: 'おみずをください',
    katakana: 'オミズヲクダサイ',
    romaji: 'O-mizu o kudasai',
    esPhonetic: 'O-mi-dzu o ku-da-sái',
    meaning: 'Agua, por favor',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'み', high: true },
      { mora: 'ず', high: true },
      { mora: 'を', high: true },
    ],
    mnemonic: 'Piensa en pedir agua fría: "¡OH, MI ZUmo no, prefiero agua (O-MI-ZU)!" → O-MIZU O KUDASAI.',
    culturalTip: 'El agua en los restaurantes de Japón es siempre gratuita y potable. El prefijo "O-" hace que "mizu" (agua) suene educado.',
    usageContext: 'Durante cualquier comida.'
  },
  {
    id: 'oishii',
    level: 'nivel-1',
    category: 'restaurante',
    japanese: 'おいしいです！',
    kana: 'おいしいです',
    katakana: 'オイシイデス',
    romaji: 'Oishii desu!',
    esPhonetic: 'Oi-shíi des',
    meaning: '¡Está delicioso!',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'い', high: true },
      { mora: 'し', high: true },
      { mora: 'い', high: true },
      { mora: 'で', high: true },
      { mora: 'す', high: false },
    ],
    mnemonic: 'Pruebas un bocado increíble y exclamas: "¡HOY SÍ que está rico!" → OI-SHII DES.',
    culturalTip: 'Decírselo al chef de ramen o sushi al salir le sacará una enorme sonrisa garantizada.',
    usageContext: 'Mientras comes o al pagar en un restaurante pequeño.'
  },
  {
    id: 'osusume',
    level: 'nivel-1',
    category: 'restaurante',
    japanese: 'おすすめは何ですか？',
    kana: 'おすすめはなんですか',
    katakana: 'オススメハナンデスカ',
    romaji: 'Osusume wa nan desu ka?',
    esPhonetic: 'O-su-su-me ua nan des-ká',
    meaning: '¿Cuál es la recomendación de la casa?',
    pitchPattern: [
      { mora: 'お', high: false },
      { mora: 'す', high: true },
      { mora: 'す', high: true },
      { mora: 'め', high: true },
      { mora: 'は', high: true },
      { mora: 'な', high: true },
      { mora: 'ん', high: false },
      { mora: 'で', high: false },
      { mora: 'す', high: false },
      { mora: 'か', high: true },
    ],
    mnemonic: 'Le preguntas al chef: "O SU SÚper MEnú recomendado, ¿cuál es?" → O-SU-SU-ME.',
    culturalTip: 'En Japón "ka" al final funciona como el signo de interrogación hablado (¿?). Ideal cuando el menú solo está en japonés.',
    usageContext: 'En izakayas, barras de sushi o cafeterías.'
  },
  {
    id: 'ikura-desuka',
    level: 'nivel-1',
    category: 'compras',
    japanese: 'これはいくらですか？',
    kana: 'これはいくらですか',
    katakana: 'コレハイクラデスカ',
    romaji: 'Kore wa ikura desu ka?',
    esPhonetic: 'Ko-re ua í-ku-ra des-ká',
    meaning: '¿Cuánto cuesta esto?',
    pitchPattern: [
      { mora: 'こ', high: false },
      { mora: 'れ', high: true },
      { mora: 'は', high: true },
      { mora: 'い', high: true },
      { mora: 'く', high: false },
      { mora: 'ら', high: false },
      { mora: 'で', high: false },
      { mora: 'す', high: false },
      { mora: 'か', high: true },
    ],
    mnemonic: 'Al ver un precio caro preguntas: "¿Y CURA qué enfermedad con ese precio?" → I-KU-RA (¿Cuánto cuesta?).',
    culturalTip: 'Útil en mercadillos tradicionales (como Nishiki en Kioto o Ameyoko en Tokio) o puestos callejeros.',
    usageContext: 'De compras o en puestos de comida.'
  },
  {
    id: 'fukuro-iranai',
    level: 'nivel-1',
    category: 'compras',
    japanese: '袋はいりません',
    kana: 'ふくろはいりません',
    katakana: 'フクロハイリマセン',
    romaji: 'Fukuro wa irimasen',
    esPhonetic: 'Fu-ku-ro ua i-ri-ma-sén',
    meaning: 'No necesito bolsa',
    pitchPattern: [
      { mora: 'ふ', high: false },
      { mora: 'く', high: true },
      { mora: 'ろ', high: false },
      { mora: 'は', high: false },
      { mora: 'い', high: false },
      { mora: 'り', high: true },
      { mora: 'ま', high: true },
      { mora: 'せ', high: true },
      { mora: 'ん', high: false },
    ],
    mnemonic: 'Imagina una bolsa oscura en el FUTURO: "En el FU-KU-RO (bolsa) ya no usamos plástico, IRI-MASEN (no hace falta)".',
    culturalTip: 'En todos los Konbini te preguntarán "¿Fukuro wa?" (¿Bolsa?). Si no necesitas, di "Fukuro wa irimasen" o "Daijōbu desu".',
    usageContext: 'En la caja de cualquier 7-Eleven, Lawson o FamilyMart.'
  },
  {
    id: 'itadakimasu',
    level: 'nivel-1',
    category: 'restaurante',
    japanese: 'いただきます',
    kana: 'いただきます',
    katakana: 'イタダキマス',
    romaji: 'Itadakimasu',
    esPhonetic: 'I-ta-da-ki-más',
    meaning: '¡Buen provecho! (Antes de empezar a comer)',
    pitchPattern: [
      { mora: 'い', high: false },
      { mora: 'た', high: true },
      { mora: 'だ', high: true },
      { mora: 'き', high: true },
      { mora: 'ま', high: true },
      { mora: 'す', high: false },
    ],
    mnemonic: 'Antes de comer el plato frente a ti dices: "¡Y TAn rico que está De AQUÍ MÁS!" → I-TA-DA-KI-MAS.',
    culturalTip: 'Se dice juntando ligeramente las palmas antes de tomar los palillos. Significa literalmente "Recibo humildemente esta comida".',
    usageContext: 'Justo antes del primer bocado.'
  },

  // =========================================================================
  // NIVEL 2 · INTERMEDIO (7 Expresiones de Trenes, Pagos, Fotos y Servicios)
  // =========================================================================
  {
    id: 'kono-densha',
    level: 'nivel-2',
    category: 'transporte',
    japanese: 'この電車は東京に行きますか？',
    kana: 'このでんしゃはとうきょうにいきますか',
    katakana: 'コノデンシャハトウキョウニイキマスカ',
    romaji: 'Kono densha wa Tōkyō ni ikimasu ka?',
    esPhonetic: 'Ko-no dén-sha ua Too-kyoo ni i-ki-mas-ká',
    meaning: '¿Este tren va a Tokio?',
    pitchPattern: [
      { mora: 'こ', high: false },
      { mora: 'の', high: true },
      { mora: 'で', high: true },
      { mora: 'ん', high: true },
      { mora: 'しゃ', high: true },
      { mora: 'は', high: true },
    ],
    mnemonic: 'En la hora punta el tren va tan lleno y DENSO que piensas: "DEN-SHA = tren denso". E "Ikimasu" = "Y aquí vamos más".',
    culturalTip: 'Cambia "Tōkyō" por tu destino (Kyōto, Shibuya, Shinjuku, Narita). Te salvará de subirte a un expreso que no para en tu estación.',
    usageContext: 'En el andén antes de que cierren las puertas del tren.'
  },
  {
    id: 'kippu',
    level: 'nivel-2',
    category: 'transporte',
    japanese: 'チャージをお願いします',
    kana: 'ちゃーじをおねがいします',
    katakana: 'チャージヲオネガイシマス',
    romaji: 'Chāji o onegaishimasu',
    esPhonetic: 'Cháa-yi o o-ne-gai-shi-más',
    meaning: 'Quiero recargar saldo (en la tarjeta Suica/Pasmo), por favor',
    pitchPattern: [
      { mora: 'ちゃ', high: true },
      { mora: 'ー', high: false },
      { mora: 'じ', high: false },
      { mora: 'を', high: false },
    ],
    mnemonic: 'Viene directo del inglés "CHARGE" (cargar batería/saldo) pronunciado a la japonesa: "CHÁA-YI".',
    culturalTip: 'En Japón "recargar" la tarjeta de transporte IC (Suica, Pasmo, Icoca) se dice "Chāji" (del inglés Charge).',
    usageContext: 'En cajas de 7-Eleven o ventanillas de estación.'
  },
  {
    id: 'kaado-de',
    level: 'nivel-2',
    category: 'compras',
    japanese: 'カードでお願いします',
    kana: 'かーどでおねがいします',
    katakana: 'カードデオネガイシマス',
    romaji: 'Kādo de onegaishimasu',
    esPhonetic: 'Káa-do de o-ne-gai-shi-más',
    meaning: 'Pago con tarjeta, por favor',
    pitchPattern: [
      { mora: 'か', high: true },
      { mora: 'ー', high: false },
      { mora: 'ど', high: false },
      { mora: 'で', high: false },
    ],
    mnemonic: '"KĀDO" suena igual que "CARD" (tarjeta en inglés) + "DE" (con): "¡Con CARD DE crédito, por favor!".',
    culturalTip: 'La partícula "de" indica el medio con el que pagas: "Kādo de" (con tarjeta), "Suica de" (con Suica), "Genkin de" (en efectivo).',
    usageContext: 'En el momento de pagar en caja.'
  },
  {
    id: 'shashin-totte',
    level: 'nivel-2',
    category: 'cortesia',
    japanese: '写真を撮ってもいいですか？',
    kana: 'しゃしんをとってもいいですか',
    katakana: 'シャシンヲトッテモイイデスカ',
    romaji: 'Shashin o totte mo ii desu ka?',
    esPhonetic: 'Sha-shín o tót-te mo íi des-ká',
    meaning: '¿Puedo tomar una foto?',
    pitchPattern: [
      { mora: 'しゃ', high: false },
      { mora: 'し', high: true },
      { mora: 'ん', high: true },
      { mora: 'を', high: true },
      { mora: 'と', high: true },
      { mora: 'っ', high: false },
      { mora: 'て', high: false },
    ],
    mnemonic: 'El obturador de la cámara suena "SHA-SHIN" (Foto) y preguntas si "TOmarla TE parece bien (TOTTE MO II)".',
    culturalTip: 'Muchos santuarios, museos y tiendas artesanales agradecen muchísimo que preguntes antes de hacer fotos.',
    usageContext: 'En templos, mercados e interiores de locales.'
  },
  {
    id: 'menzei-dekimasu',
    level: 'nivel-2',
    category: 'compras',
    japanese: '免税できますか？',
    kana: 'めんぜいできますか',
    katakana: 'メンゼイデキマスカ',
    romaji: 'Menzei dekimasu ka?',
    esPhonetic: 'Mén-dzei de-ki-mas-ká',
    meaning: '¿Hacen descuento Tax-Free (libre de impuestos)?',
    pitchPattern: [
      { mora: 'め', high: false },
      { mora: 'ん', high: true },
      { mora: 'ぜ', high: true },
      { mora: 'い', high: true },
      { mora: 'で', high: false },
      { mora: 'き', high: true },
    ],
    mnemonic: '"MEN-ZEI" = "MENos impuestos (Tax-Free)" + "DE-KI-MAS-KA" (¿se puede hacer?).',
    culturalTip: 'En compras superiores a 5.500 yenes en tiendas con cartel "Tax-Free (免税)", muestra tu pasaporte físico para ahorrarte el 10%.',
    usageContext: 'En grandes almacenes, Don Quijote, tiendas de electrónica o ropa.'
  },
  {
    id: 'betsubetsu',
    level: 'nivel-2',
    category: 'restaurante',
    japanese: '別々でお願いします',
    kana: 'べつべつでおねがいします',
    katakana: 'ベツベツデオネガイシマス',
    romaji: 'Betsubetsu de onegaishimasu',
    esPhonetic: 'Bé-tzu-bé-tzu de o-ne-gai-shi-más',
    meaning: 'La cuenta por separado, por favor',
    pitchPattern: [
      { mora: 'べ', high: false },
      { mora: 'つ', high: true },
      { mora: 'べ', high: true },
      { mora: 'つ', high: true },
      { mora: 'で', high: false },
    ],
    mnemonic: 'Cada amigo paga su parte: "VES TÚ, VES TÚ (BE-TSU BE-TSU) cada uno su cuenta".',
    culturalTip: 'Si vais en grupo y queréis pagar cada uno lo suyo en caja, decid "Betsubetsu de onegaishimasu".',
    usageContext: 'En la caja registradora al pagar con amigos.'
  },
  {
    id: 'nimotsu-azukatte',
    level: 'nivel-2',
    category: 'transporte',
    japanese: '荷物を預かってもらえますか？',
    kana: 'にもつをあずかってもらえますか',
    katakana: 'ニモツヲアズカッテモラエマスカ',
    romaji: 'Nimotsu o azukatte moraemasu ka?',
    esPhonetic: 'Ni-mó-tzu o a-dzu-kát-te mo-ra-e-mas-ká',
    meaning: '¿Me pueden guardar el equipaje / maletas?',
    pitchPattern: [
      { mora: 'に', high: true },
      { mora: 'も', high: false },
      { mora: 'つ', high: false },
      { mora: 'を', high: false },
    ],
    mnemonic: 'Tus maletas pesan tanto que dices: "NI MODO (NI-MO-TSU), que las guarden en recepción".',
    culturalTip: 'En casi todos los hoteles de Japón puedes dejar tus maletas gratis antes del check-in o después del check-out usando esta frase.',
    usageContext: 'En la recepción del hotel al llegar temprano.'
  },

  // =========================================================================
  // NIVEL 3 · AVANZADO (7 Expresiones de Conversación Natural, Reservas y Ayuda)
  // =========================================================================
  {
    id: 'gochisousama',
    level: 'nivel-3',
    category: 'restaurante',
    japanese: 'ごちそうさまでした',
    kana: 'ごちそうさまでした',
    katakana: 'ゴチソウサマデシタ',
    romaji: 'Gochisōsama deshita',
    esPhonetic: 'Go-chi-sóo-sa-ma désh-ta',
    meaning: 'Muchas gracias por la comida (al terminar o salir del local)',
    pitchPattern: [
      { mora: 'ご', high: false },
      { mora: 'ち', high: true },
      { mora: 'そ', high: true },
      { mora: 'う', high: true },
      { mora: 'さ', high: false },
      { mora: 'ま', high: false },
    ],
    mnemonic: 'El chef cocinó tan rápido y bien que dices: "¡GOZÓ y HIZO un festín, SAMA (GO-CHI-SŌ-SAMA)!".',
    culturalTip: 'Expresión cultural imprescindible al levantarte de la mesa o salir de un restaurante. Reconoce todo el esfuerzo de quienes prepararon la comida.',
    usageContext: 'Al salir de cualquier restaurante, cafetería o izakaya.'
  },
  {
    id: 'yoyaku-shita',
    level: 'nivel-3',
    category: 'restaurante',
    japanese: '予約したマリオです',
    kana: 'よやくしたまりおです',
    katakana: 'ヨヤクシタマリオデス',
    romaji: 'Yoyaku shita [Nombre] desu',
    esPhonetic: 'Yo-yá-ku shi-ta [tu nombre] des',
    meaning: 'Soy [Nombre], tengo una reserva',
    pitchPattern: [
      { mora: 'よ', high: false },
      { mora: 'や', high: true },
      { mora: 'く', high: true },
      { mora: 'し', high: false },
      { mora: 'た', high: true },
    ],
    mnemonic: 'Al llegar al hotel o restaurante dices: "¡YO YA CUmplí (YO-YA-KU) con hacer mi reserva!".',
    culturalTip: 'Gramaticalmente "Yoyaku shita" (que reservó) va ANTES de tu nombre para modificarlo ("El [Nombre] que hizo reserva").',
    usageContext: 'Al hacer check-in en hoteles, ryokan o restaurantes con reserva.'
  },
  {
    id: 'nihongo-sukoshi',
    level: 'nivel-3',
    category: 'emergencia',
    japanese: '日本語が少ししか話せません',
    kana: 'にほんごがすこししかはなせません',
    katakana: 'ニホンゴガスコシシカハナセマセン',
    romaji: 'Nihongo ga sukoshi shika hanasemasen',
    esPhonetic: 'Ni-jon-go ga su-kó-shi shi-ka ja-na-se-ma-sén',
    meaning: 'Solo hablo un poquito de japonés',
    pitchPattern: [
      { mora: 'に', high: false },
      { mora: 'ほ', high: true },
      { mora: 'ん', high: true },
      { mora: 'ご', high: true },
      { mora: 'が', high: true },
    ],
    mnemonic: '"SU-KO-SHI" (un poquito) suena a "SU COCHEcito pequeño". Dices: "De japonés (Nihongo), solo un SU-KO-SHI".',
    culturalTip: 'La estructura gramatical "sukoshi shika + verbo negativo" significa "no hablo más que un poquito".',
    usageContext: 'Cuando una conversación se vuelve demasiado rápida.'
  },
  {
    id: 'tasukete',
    level: 'nivel-3',
    category: 'emergencia',
    japanese: '手伝っていただけますか？',
    kana: 'てつだっていただけますか',
    katakana: 'テツダッテイタダケマスカ',
    romaji: 'Tetsudatte itadakemasu ka?',
    esPhonetic: 'Te-tzu-dát-te i-ta-da-ke-mas-ká',
    meaning: '¿Me podría ayudar un momento, por favor?',
    pitchPattern: [
      { mora: 'て', high: false },
      { mora: 'つ', high: true },
      { mora: 'だ', high: true },
      { mora: 'っ', high: false },
      { mora: 'て', high: false },
    ],
    mnemonic: 'Es tan difícil usar la máquina de billetes que "TE SUDArá la frente (TE-TSU-DATTE)" si no pides ayuda.',
    culturalTip: 'Usa la forma ultra-cortés "~te itadakemasu ka" (¿recibiría el favor de ayudarme?). Infalible en estaciones.',
    usageContext: 'Cuando necesitas ayuda práctica de un empleado o transeúnte.'
  },
  {
    id: 'mou-ichido-yukkuri',
    level: 'nivel-3',
    category: 'emergencia',
    japanese: 'もう一度ゆっくりお願いします',
    kana: 'もういちどゆっくりおねがいします',
    katakana: 'モウイチドユックリオネガイシマス',
    romaji: 'Mō ichido yukkuri onegaishimasu',
    esPhonetic: 'Móo i-chi-dó yúk-ku-ri o-ne-gai-shi-más',
    meaning: 'Una vez más y despacio, por favor',
    pitchPattern: [
      { mora: 'も', high: false },
      { mora: 'う', high: true },
      { mora: 'い', high: false },
      { mora: 'ち', high: true },
      { mora: 'ど', high: true },
    ],
    mnemonic: '"MŌ ICHI-DO" (una vez más) + "YUKKURI" (despacito, con calma).',
    culturalTip: 'Cuando no entiendas una indicación en la calle o en recepción, esta frase hará que te lo repitan vocalizando despacio.',
    usageContext: 'Al escuchar indicaciones rápidas en japonés.'
  },
  {
    id: 'michi-ni-mayotta',
    level: 'nivel-3',
    category: 'emergencia',
    japanese: 'すみません、道に迷いました',
    kana: 'すみません、みちにまよいました',
    katakana: 'スミマセン、ミチニマヨイマシタ',
    romaji: 'Sumimasen, michi ni mayoimashita',
    esPhonetic: 'Su-mi-ma-sén, mí-chi ni ma-yoi-másh-ta',
    meaning: 'Disculpe, me he perdido en el camino',
    pitchPattern: [
      { mora: 'み', high: false },
      { mora: 'ち', high: true },
      { mora: 'に', high: true },
      { mora: 'ま', high: false },
      { mora: 'よ', high: true },
    ],
    mnemonic: 'En el camino ("MI-CHI") te dio un "MAYO (MAYO-IMASHITA)" de confusión porque te perdiste.',
    culturalTip: 'Si dices esto mostrando Google Maps en tu móvil, cualquier japonés se detendrá e incluso caminará contigo hasta llevarte al sitio.',
    usageContext: 'En callejones o grandes estaciones subterráneas.'
  },
  {
    id: 'totemo-tanoshikatta',
    level: 'nivel-3',
    category: 'cortesia',
    japanese: 'とても楽しかったです！また来ます',
    kana: 'とてもたのしかったです！またきます',
    katakana: 'トテモタノシカッタデス！マタキマス',
    romaji: 'Totemo tanoshikatta desu! Mata kimasu',
    esPhonetic: 'To-té-mo ta-no-shi-kát-ta des! Má-ta ki-más',
    meaning: '¡Fue muy divertido / Lo pasé genial! ¡Volveré otra vez!',
    pitchPattern: [
      { mora: 'た', high: false },
      { mora: 'の', high: true },
      { mora: 'し', high: true },
      { mora: 'か', high: true },
      { mora: 'っ', high: false },
      { mora: 'た', high: false },
    ],
    mnemonic: '"TANOSHIKATTA" (fue divertido, pasado de Tanoshii) + "MATA KIMASU" (volveré a venir).',
    culturalTip: 'Decir esto al despedirte de tu guía, anfitrión de ryokan o bar local crea una conexión inolvidable.',
    usageContext: 'Al despedirte de un lugar o experiencia especial.'
  }
];

export const WRITING_CHARS: WritingChar[] = [
  // HIRAGANA ESENCIAL
  {
    id: 'hira-a',
    char: 'あ',
    type: 'hiragana',
    romaji: 'a',
    esPhonetic: 'a (igual que en español)',
    meaning: 'Vocal A',
    mnemonic: 'Parece una "A" con una barriga redondeada abajo. Se traza en 3 pasos: línea horizontal, vertical curva y el lazo final.',
    exampleWord: { jp: 'ありがとう', romaji: 'Arigatō', es: 'Gracias' },
    strokes: [
      'M 25 32 Q 50 30 75 28',
      'M 48 14 Q 44 50 46 84',
      'M 64 42 C 55 72 24 82 24 64 C 24 46 66 42 74 62 C 80 76 66 88 55 88'
    ]
  },
  {
    id: 'hira-i',
    char: 'い',
    type: 'hiragana',
    romaji: 'i',
    esPhonetic: 'i (igual que en español)',
    meaning: 'Vocal I',
    mnemonic: 'Dos trazos verticales curvos que parecen dos anguilas nadando juntas (I-i).',
    exampleWord: { jp: 'いくら', romaji: 'Ikura', es: '¿Cuánto cuesta?' },
    strokes: [
      'M 30 24 Q 26 58 34 78 L 42 66',
      'M 68 28 Q 74 52 72 72'
    ]
  },
  {
    id: 'hira-u',
    char: 'う',
    type: 'hiragana',
    romaji: 'u',
    esPhonetic: 'u suave (sin redondear tanto los labios)',
    meaning: 'Vocal U',
    mnemonic: 'Un pequeño sombrero arriba y una "U" tumbada hacia la izquierda.',
    exampleWord: { jp: 'うまい', romaji: 'Umai', es: 'Riquísimo' },
    strokes: [
      'M 38 18 Q 52 22 62 26',
      'M 28 44 C 52 34 74 44 68 64 C 64 78 46 86 34 88'
    ]
  },
  {
    id: 'hira-e',
    char: 'え',
    type: 'hiragana',
    romaji: 'e',
    esPhonetic: 'e (clara como en español)',
    meaning: 'Vocal E',
    mnemonic: 'Parece un corredor exótico ("E") dando un gran paso hacia adelante.',
    exampleWord: { jp: 'えき', romaji: 'Eki', es: 'Estación' },
    strokes: [
      'M 42 16 Q 54 20 62 24',
      'M 26 42 L 68 38 L 30 78 Q 48 62 56 76 Q 64 86 78 84'
    ]
  },
  {
    id: 'hira-o',
    char: 'お',
    type: 'hiragana',
    romaji: 'o',
    esPhonetic: 'o (clara y breve)',
    meaning: 'Vocal O',
    mnemonic: 'Un hoyo de golf con la pelota ("O") redonda abajo y una tilde flotando a la derecha.',
    exampleWord: { jp: 'おちゃ', romaji: 'Ocha', es: 'Té verde' },
    strokes: [
      'M 24 36 Q 44 34 62 32',
      'M 42 16 L 42 76 C 42 86 24 80 26 68 C 28 54 62 52 68 68 C 72 80 60 88 50 88',
      'M 72 28 Q 80 34 84 42'
    ]
  },
  {
    id: 'hira-su',
    char: 'す',
    type: 'hiragana',
    romaji: 'su',
    esPhonetic: 'su',
    meaning: 'Sílaba SU',
    mnemonic: 'Un rizo en forma de sacacorchos colgando de una barra horizontal (Su-mimasen, Su-shi).',
    exampleWord: { jp: 'すし', romaji: 'Sushi', es: 'Sushi' },
    strokes: [
      'M 20 34 Q 50 32 80 30',
      'M 54 16 L 54 58 C 54 70 36 70 36 58 C 36 46 56 46 56 62 C 56 78 46 88 38 92'
    ]
  },

  // KATAKANA DE SUPERVIVENCIA (MENÚS Y CARTELES)
  {
    id: 'kata-ra',
    char: 'ラ',
    type: 'katakana',
    romaji: 'ra',
    esPhonetic: 'ra (r suave como en "cara")',
    meaning: 'Katakana RA (de Ramen)',
    mnemonic: 'Si ves ラーメン en una cortina roja (noren) en la calle, ¡has encontrado un local de Ramen!',
    realWorldSign: 'ラーメン (Rāmen)',
    exampleWord: { jp: 'ラーメン', romaji: 'Rāmen', es: 'Ramen' },
    strokes: [
      'M 30 24 L 68 24',
      'M 24 46 L 74 46 C 70 68 54 82 32 88'
    ]
  },
  {
    id: 'kata-to',
    char: 'ト',
    type: 'katakana',
    romaji: 'to',
    esPhonetic: 'to',
    meaning: 'Katakana TO (de Toire - Baño)',
    mnemonic: 'Parece un tótem ("TO") con un brazo hacia la derecha. Es la primera letra de トイレ (Toire = Baño).',
    realWorldSign: 'トイレ (Toire - Baño)',
    exampleWord: { jp: 'トイレ', romaji: 'Toire', es: 'Baño / Aseo' },
    strokes: [
      'M 42 16 L 42 86',
      'M 42 46 Q 60 54 74 64'
    ]
  },
  {
    id: 'kata-ho',
    char: 'ホ',
    type: 'katakana',
    romaji: 'ho',
    esPhonetic: 'jo suave',
    meaning: 'Katakana HO (de Hoteru - Hotel)',
    mnemonic: 'Parece un árbol de Navidad o la fachada de un HO-tel con dos faroles a los lados.',
    realWorldSign: 'ホテル (Hoteru - Hotel)',
    exampleWord: { jp: 'ホテル', romaji: 'Hoteru', es: 'Hotel' },
    strokes: [
      'M 22 36 L 78 36',
      'M 50 16 L 50 86',
      'M 32 54 Q 24 66 20 74',
      'M 68 54 Q 76 66 80 74'
    ]
  },
  {
    id: 'kata-ko',
    char: 'コ',
    type: 'katakana',
    romaji: 'ko',
    esPhonetic: 'ko',
    meaning: 'Katakana KO (de Konbini y Kōhī)',
    mnemonic: 'Dos esquinas rectas como un "CO-rchete" cerrado a la derecha. Empieza コンビニ (Konbini) y コーヒー (Café).',
    realWorldSign: 'コーヒー (Kōhī - Café)',
    exampleWord: { jp: 'コンビニ', romaji: 'Konbini', es: 'Tienda 24h' },
    strokes: [
      'M 26 28 L 72 28 L 72 74',
      'M 26 74 L 72 74'
    ]
  },

  // KANJI DE CALLE (SUPERVIVENCIA VISUAL EN VIAJE)
  {
    id: 'kanji-iri',
    char: '入',
    type: 'kanji-calle',
    romaji: 'Iri / Hairu',
    esPhonetic: 'Í-ri (en 入口 Iriguchi)',
    meaning: 'ENTRADA (en estaciones y tiendas)',
    mnemonic: 'Dos piernas caminando hacia adentro bajo una tienda de campaña. Junto a 口 (boca/puerta) forma 入口 (Entrada).',
    realWorldSign: '入口 (Iriguchi - Entrada)',
    exampleWord: { jp: '入口', romaji: 'Iriguchi', es: 'Entrada' },
    strokes: [
      'M 52 34 C 44 58 32 76 18 86',
      'M 38 18 C 50 46 64 72 84 86'
    ]
  },
  {
    id: 'kanji-de',
    char: '出',
    type: 'kanji-calle',
    romaji: 'De / Deru',
    esPhonetic: 'Dé (en 出口 Deguchi)',
    meaning: 'SALIDA (carteles amarillos en el metro)',
    mnemonic: 'Dos montañas apiladas saliendo hacia afuera. En todas las estaciones verás carteles amarillos con 出口 (Deguchi = Salida).',
    realWorldSign: '出口 (Deguchi - Salida)',
    exampleWord: { jp: '出口', romaji: 'Deguchi', es: 'Salida' },
    strokes: [
      'M 50 14 L 50 84',
      'M 28 28 L 28 48 L 72 48 L 72 28',
      'M 24 62 L 24 84 L 76 84 L 76 62'
    ]
  },
  {
    id: 'kanji-kuchi',
    char: '口',
    type: 'kanji-calle',
    romaji: 'Kuchi / Guchi',
    esPhonetic: 'Ku-chi / Gu-chi',
    meaning: 'PUERTA / ACCESO / BOCA',
    mnemonic: 'Un cuadrado perfecto que representa una puerta o boca. Lo verás en 東口 (Salida Este), 西口 (Salida Oeste) y 非常口 (Salida de emergencia).',
    realWorldSign: '非常口 (Hijōguchi - Emergencia)',
    exampleWord: { jp: '北口', romaji: 'Kitaguchi', es: 'Salida Norte' },
    strokes: [
      'M 26 26 L 26 76',
      'M 26 26 L 74 26 L 74 76',
      'M 26 76 L 74 76'
    ]
  },
  {
    id: 'kanji-en',
    char: '円',
    type: 'kanji-calle',
    romaji: 'En',
    esPhonetic: 'Én (nunca digas "yen" con Y en japonés)',
    meaning: 'YENES (Moneda de Japón)',
    mnemonic: 'En japonés la moneda se pronuncia "EN" (sin la Y). 100円 = Hyaku-en, 1000円 = Sen-en.',
    realWorldSign: '500円 (500 Yenes)',
    exampleWord: { jp: '百円', romaji: 'Hyaku-en', es: '100 Yenes' },
    strokes: [
      'M 22 22 L 22 84',
      'M 22 22 L 78 22 L 78 84 L 68 78',
      'M 50 22 L 50 54',
      'M 22 54 L 78 54'
    ]
  },
  {
    id: 'kanji-otoko',
    char: '男',
    type: 'kanji-calle',
    romaji: 'Otoko / Dan',
    esPhonetic: 'O-to-kó',
    meaning: 'HOMBRE (Cortinas de baños / Onsen)',
    mnemonic: 'Arriba tiene un campo de arroz (田) y abajo el símbolo de fuerza (力). ¡Vital en baños de izakayas y aguas termales (Onsen) donde no hay dibujos, solo el kanji!',
    realWorldSign: '男ゆ (Baño de Hombres)',
    exampleWord: { jp: '男手洗', romaji: 'Otoko Tearai', es: 'Aseo caballeros' },
    strokes: [
      'M 28 16 L 28 48 L 72 48 L 72 16 Z',
      'M 50 16 L 50 48',
      'M 28 32 L 72 32',
      'M 24 62 L 76 62 L 68 88 L 56 82',
      'M 50 50 C 48 70 36 82 20 90'
    ]
  },
  {
    id: 'kanji-onna',
    char: '女',
    type: 'kanji-calle',
    romaji: 'Onna / Jo',
    esPhonetic: 'On-ná',
    meaning: 'MUJER (Cortinas de baños / Onsen)',
    mnemonic: 'Una bailarina tradicional con los brazos extendidos y las piernas cruzadas. Suelen ponerlo en cortinas rojas en los Onsen.',
    realWorldSign: '女ゆ (Baño de Mujeres)',
    exampleWord: { jp: '女手洗', romaji: 'Onna Tearai', es: 'Aseo damas' },
    strokes: [
      'M 50 16 L 32 58 L 72 78',
      'M 68 36 C 62 62 46 78 24 88',
      'M 18 42 L 82 42'
    ]
  }
];

export const TRAVEL_SCENARIOS: TravelScenario[] = [
  {
    id: 'konbini',
    level: 'intro',
    title: 'Nivel 0 · Compra en el Konbini',
    jpTitle: 'コンビニでの買い物',
    location: '7-Eleven / Lawson (Shibuya)',
    difficulty: 'Nivel 0 · Intro',
    stampName: 'Maestro del Konbini',
    stampKanji: '便',
    description: 'Llegas a un Konbini a por un bento y un onigiri. El empleado te hará las 3 preguntas clásicas que todo viajero escucha a diario.',
    steps: [
      {
        staffJp: 'いらっしゃいませ！お弁当は温めますか？',
        staffKana: 'いらっしゃいませ！おべんとうはあたためますか？',
        staffRomaji: 'Irasshaimase! O-bentō wa atatamemasu ka?',
        staffEs: '¡Bienvenido! ¿Le caliento la bandeja de comida (bento)?',
        contextNote: 'En Japón siempre preguntan "Atatamemasu ka?" (¿Lo caliento en el microondas?) cuando compras comida preparada.',
        options: [
          {
            jp: 'はい、お願いします',
            kana: 'はい、おねがいします',
            romaji: 'Hai, onegaishimasu',
            esPhonetic: 'Jái, o-ne-gai-shi-más',
            esMeaning: 'Sí, por favor',
            isCorrect: true,
            feedback: '¡Perfecto! Con "Hai, onegaishimasu" el empleado calentará tu bento al instante.'
          },
          {
            jp: 'トイレはどこですか',
            kana: 'といれはどこですか',
            romaji: 'Toire wa doko desu ka',
            esPhonetic: 'Tói-re ua dó-ko des-ká',
            esMeaning: '¿Dónde está el baño?',
            isCorrect: false,
            feedback: 'Eso significa "¿Dónde está el baño?". Para decir que sí quieres que lo calienten, usa "Hai, onegaishimasu".'
          }
        ]
      },
      {
        staffJp: 'レジ袋はご利用ですか？',
        staffKana: 'れじぶくろは ごりようですか？',
        staffRomaji: 'Reji-bukuro wa go-riyō desu ka?',
        staffEs: '¿Va a necesitar bolsa de plástico?',
        contextNote: 'La palabra clave que escucharás siempre es "Fukuro" o "Bukuro" (bolsa). Si llevas mochila, puedes decir que no necesitas.',
        options: [
          {
            jp: '袋はいりません、大丈夫です',
            kana: 'ふくろはいりません、だいじょうぶです',
            romaji: 'Fukuro wa irimasen, daijōbu desu',
            esPhonetic: 'Fu-ku-ro ua i-ri-ma-sén, dai-yoo-bu des',
            esMeaning: 'No necesito bolsa, está bien así',
            isCorrect: true,
            feedback: '¡Excelente! "Daijōbu desu" (Está bien / No hace falta) es súper natural y muy usado en Japón.'
          },
          {
            jp: 'お会計お願いします',
            kana: 'おかいけいおねがいします',
            romaji: 'O-kaikei onegaishimasu',
            esPhonetic: 'O-kai-kei o-ne-gai-shi-más',
            esMeaning: 'La cuenta, por favor',
            isCorrect: false,
            feedback: '"O-kaikei" se usa en restaurantes para pedir la cuenta en la mesa, no para responder si quieres bolsa.'
          }
        ]
      },
      {
        staffJp: '850円になります。お支払いはいかがなさいますか？',
        staffKana: 'はっぴゃくごじゅうえんになります。おしはらいはいかがなさいますか？',
        staffRomaji: 'Happyaku-gojū-en ni narimasu. O-shiharai wa ikaga nasaimasu ka?',
        staffEs: 'Son 850 yenes. ¿Cómo desea pagar?',
        contextNote: 'Puedes pagar con tu tarjeta de transporte ("Suica de"), tarjeta bancaria ("Kādo de") o efectivo ("Genkin de").',
        options: [
          {
            jp: 'カードでお願いします',
            kana: 'かーどでおねがいします',
            romaji: 'Kādo de onegaishimasu',
            esPhonetic: 'Káa-do de o-ne-gai-shi-más',
            esMeaning: 'Con tarjeta, por favor',
            isCorrect: true,
            feedback: '¡Misión completada! Acabas de superar con nota la experiencia diaria más común en Japón.'
          },
          {
            jp: 'おはようございます',
            kana: 'おはようございます',
            romaji: 'Ohayō gozaimasu',
            esPhonetic: 'O-ja-yoo go-zai-más',
            esMeaning: 'Buenos días',
            isCorrect: false,
            feedback: 'Eso es "Buenos días". Para indicar el método de pago di "[Método] + de onegaishimasu".'
          }
        ]
      }
    ]
  },
  {
    id: 'ramen-izakaya',
    level: 'nivel-1',
    title: 'Nivel 1 · Cena en Barra de Ramen',
    jpTitle: 'ラーメン屋での注文',
    location: 'Callejón Omoide Yokocho (Shinjuku)',
    difficulty: 'Nivel 1 · Básico',
    stampName: 'Gourmet de Callejón',
    stampKanji: '麺',
    description: 'Entras a un local tradicional con cortina noren. Debes indicar cuántos sois, pedir tu plato más agua, y despedirte agradeciendo al chef.',
    steps: [
      {
        staffJp: 'いらっしゃいませ！何名様ですか？',
        staffKana: 'いらっしゃいませ！なんめいさまですか？',
        staffRomaji: 'Irasshaimase! Nan-mei-sama desu ka?',
        staffEs: '¡Bienvenido! ¿Cuántas personas son?',
        contextNote: 'Siempre que entres a un restaurante olerás a caldo caliente y escucharás "Nan-mei-sama desu ka?" (¿Cuántos son?). Hitori = 1 persona, Futari = 2 personas.',
        options: [
          {
            jp: '二人です',
            kana: 'ふたりです',
            romaji: 'Futari desu',
            esPhonetic: 'Fu-tá-ri des',
            esMeaning: 'Somos dos personas',
            isCorrect: true,
            feedback: '¡Muy bien! Puedes levantar dos dedos mientras dices "Futari desu" (si vas solo, di "Hitori desu").'
          },
          {
            jp: 'これはいくらですか',
            kana: 'これはいくらですか',
            romaji: 'Kore wa ikura desu ka',
            esPhonetic: 'Ko-re ua í-ku-ra des-ká',
            esMeaning: '¿Cuánto cuesta esto?',
            isCorrect: false,
            feedback: 'Te están preguntando cuántas personas sois para asignarte mesa o barra.'
          }
        ]
      },
      {
        staffJp: 'こちらへどうぞ。ご注文はお決まりですか？',
        staffKana: 'こちらへどうぞ。ごちゅうもんはおきまりですか？',
        staffRomaji: 'Kochira e dōzo. Go-chūmon wa o-kimari desu ka?',
        staffEs: 'Por aquí, adelante. ¿Ya sabe qué va a pedir?',
        contextNote: 'Señalas en el menú el ramen especial y aprovechas para pedir un vaso de agua.',
        options: [
          {
            jp: 'これと、お水をください',
            kana: 'これと、おみずをください',
            romaji: 'Kore to, o-mizu o kudasai',
            esPhonetic: 'Kó-re to, o-mí-dzu o ku-da-sái',
            esMeaning: 'Esto y agua, por favor',
            isCorrect: true,
            feedback: '¡Brillante! La partícula "to" significa "y" para unir cosas (Esto + y + agua).'
          },
          {
            jp: '駅はどこですか',
            kana: 'えきはどこですか',
            romaji: 'Eki wa doko desu ka',
            esPhonetic: 'É-ki ua dó-ko des-ká',
            esMeaning: '¿Dónde está la estación?',
            isCorrect: false,
            feedback: 'El camarero espera tu pedido del menú. Usa "Kore o kudasai" (Esto, por favor).'
          }
        ]
      },
      {
        staffJp: 'ありがとうございました！またお越しくださいませ！',
        staffKana: 'ありがとうございました！またおこしくださいませ！',
        staffRomaji: 'Arigatō gozaimashita! Mata o-koshi kudasaimase!',
        staffEs: '¡Muchas gracias! ¡Esperamos verle de nuevo!',
        contextNote: 'Has terminado un ramen espectacular. Antes de cruzar la puerta quieres felicitar la comida y pedir la cuenta.',
        options: [
          {
            jp: 'おいしかったです！お会計お願いします',
            kana: 'おいしかったです！おかいけいおねがいします',
            romaji: 'Oishikatta desu! O-kaikei onegaishimasu',
            esPhonetic: 'Oi-shi-kát-ta des! O-kai-kei o-ne-gai-shi-más',
            esMeaning: '¡Estuvo delicioso! La cuenta, por favor',
            isCorrect: true,
            feedback: '¡Sublime! "Oishikatta desu" es el pasado de Oishii ("estuvo delicioso"). ¡El chef te dará las gracias con una gran reverencia!'
          },
          {
            jp: 'すみません、わかりません',
            kana: 'すみません、わかりません',
            romaji: 'Sumimasen, wakarimasen',
            esPhonetic: 'Su-mi-ma-sén, ua-ka-ri-ma-sén',
            esMeaning: 'Disculpe, no entiendo',
            isCorrect: false,
            feedback: 'Para felicitar la comida y pedir la cuenta usa "Oishikatta desu! O-kaikei onegaishimasu".'
          }
        ]
      }
    ]
  },
  {
    id: 'shinkansen-station',
    level: 'nivel-2',
    title: 'Nivel 2 · Rumbo a Kioto en Shinkansen',
    jpTitle: '新幹線のホーム探し',
    location: 'Estación de Tokio (Andén Shinkansen)',
    difficulty: 'Nivel 2 · Intermedio',
    stampName: 'Viajero del Shinkansen',
    stampKanji: '駅',
    description: 'La estación de Tokio es un laberinto subterráneo. Necesitas encontrar la entrada correcta, confirmar el tren y llegar a tu andén a tiempo.',
    steps: [
      {
        staffJp: 'はい、どうされましたか？',
        staffKana: 'はい、どうされましたか？',
        staffRomaji: 'Hai, dō saremashita ka?',
        staffEs: 'Sí, ¿en qué puedo ayudarle?',
        contextNote: 'Te acercas al empleado junto a los tornos (kaisatsu) porque buscas los trenes bala hacia Kioto.',
        options: [
          {
            jp: 'すみません、新幹線の乗り場はどこですか？',
            kana: 'すみません、しんかんせんののりばはどこですか？',
            romaji: 'Sumimasen, Shinkansen no noriba wa doko desu ka?',
            esPhonetic: 'Su-mi-ma-sén, Shin-kan-sén no no-ri-ba ua dó-ko des-ká',
            esMeaning: 'Disculpe, ¿dónde están los andenes del Shinkansen?',
            isCorrect: true,
            feedback: '¡Exacto! "Noriba" significa zona de embarque o andén.'
          },
          {
            jp: '袋はいりません',
            kana: 'ふくろはいりません',
            romaji: 'Fukuro wa irimasen',
            esPhonetic: 'Fu-ku-ro ua i-ri-ma-sén',
            esMeaning: 'No necesito bolsa',
            isCorrect: false,
            feedback: 'Esa frase es para el supermercado. En la estación pregunta "...wa doko desu ka?".'
          }
        ]
      },
      {
        staffJp: '新幹線はあちらの16番線ホームですよ。',
        staffKana: 'しんかんせんはあちらのじゅうろくばんせんほーむですよ。',
        staffRomaji: 'Shinkansen wa achira no jū-roku-bansen hōmu desu yo.',
        staffEs: 'El Shinkansen está por allí, en el andén número 16.',
        contextNote: 'Llegas al andén 16 y ves un tren con las puertas abiertas. Quieres confirmar con el revisor si este tren para en Kioto.',
        options: [
          {
            jp: 'この電車は京都に行きますか？',
            kana: 'このでんしゃはきょうとにいきますか？',
            romaji: 'Kono densha wa Kyōto ni ikimasu ka?',
            esPhonetic: 'Kó-no dén-sha ua Kyóo-to ni i-ki-mas-ká',
            esMeaning: '¿Este tren va a Kioto?',
            isCorrect: true,
            feedback: '¡Clave para no perderte! "Kono densha wa [Destino] ni ikimasu ka?" te confirma al instante si estás en el tren correcto.'
          },
          {
            jp: 'おすすめは何ですか？',
            kana: 'おすすめはなんですか？',
            romaji: 'Osusume wa nan desu ka?',
            esPhonetic: 'O-su-su-me ua nan des-ká',
            esMeaning: '¿Cuál es la recomendación?',
            isCorrect: false,
            feedback: 'Eso es para pedir recomendaciones en un restaurante. Pregunta si el tren va a Kioto.'
          }
        ]
      }
    ]
  },
  {
    id: 'ryokan-taxfree',
    level: 'nivel-3',
    title: 'Nivel 3 · Check-in en Ryokan y Tax-Free',
    jpTitle: '旅館のチェックインと免税',
    location: 'Ryokan Tradicional (Gion, Kioto)',
    difficulty: 'Nivel 3 · Avanzado',
    stampName: 'Huésped de Honor',
    stampKanji: '宿',
    description: 'Llegas a una posada tradicional en Kioto. Debes confirmar tu reserva, pedir que guarden tu equipaje y consultar un horario con gramática de Nivel 3.',
    steps: [
      {
        staffJp: 'いらっしゃいませ。ご宿泊のご予約はございますか？',
        staffKana: 'いらっしゃいませ。ごしゅくはくのごよやくはございますか？',
        staffRomaji: 'Irasshaimase. Go-shukuhaku no go-yoyaku wa gozaimasu ka?',
        staffEs: 'Bienvenido. ¿Tiene usted reserva de alojamiento?',
        contextNote: 'En la recepción de cualquier hotel o ryokan escucharás la palabra clave "Go-yoyaku" (reserva).',
        options: [
          {
            jp: 'はい、予約したマリオです。チェックインをお願いします',
            kana: 'はい、よやくしたまりおです。ちぇっくいんをおねがいします',
            romaji: 'Hai, yoyaku shita Mario desu. Chekku-in o onegaishimasu',
            esPhonetic: 'Jái, yo-yá-ku shi-ta Ma-ri-o des. Chék-ku-in o o-ne-gai-shi-más',
            esMeaning: 'Sí, soy Mario con reserva. El check-in, por favor',
            isCorrect: true,
            feedback: '¡Excelente! "Yoyaku shita [Nombre] desu" es la estructura gramatical perfecta para identificarte al llegar.'
          },
          {
            jp: '袋はいりません、大丈夫です',
            kana: 'ふくろはいりません、だいじょうぶです',
            romaji: 'Fukuro wa irimasen, daijōbu desu',
            esPhonetic: 'Fu-ku-ro ua i-ri-ma-sén',
            esMeaning: 'No necesito bolsa, está bien',
            isCorrect: false,
            feedback: 'Eso es para el Konbini. En el hotel confirma tu reserva diciendo "Hai, yoyaku shita [Nombre] desu".'
          }
        ]
      },
      {
        staffJp: 'お部屋の準備が15時からになります。お荷物はいかがいたしますか？',
        staffKana: 'おへやのじゅんびがじゅうごじからになります。おにもつはいかがいたしますか？',
        staffRomaji: 'O-heya no junbi ga jū-go-ji kara ni narimasu. O-nimotsu wa ikaga itashimasu ka?',
        staffEs: 'Su habitación estará lista a partir de las 15:00. ¿Qué desea hacer con su equipaje?',
        contextNote: 'Quieres salir a pasear por Kioto sin cargar las maletas, así que pides si te las pueden guardar.',
        options: [
          {
            jp: 'すみません、荷物を預かってもらえますか？',
            kana: 'すみません、にもつをあずかってもらえますか？',
            romaji: 'Sumimasen, nimotsu o azukatte moraemasu ka?',
            esPhonetic: 'Su-mi-ma-sén, ni-mó-tzu o a-dzu-kát-te mo-ra-e-mas-ká',
            esMeaning: 'Disculpe, ¿me pueden guardar el equipaje?',
            isCorrect: true,
            feedback: '¡Magistral! Con "Nimotsu o azukatte moraemasu ka?" guardarán tus maletas y las subirán a tu habitación.'
          },
          {
            jp: 'お会計お願いします',
            kana: 'おかいけいおねがいします',
            romaji: 'O-kaikei onegaishimasu',
            esPhonetic: 'O-kai-kei o-ne-gai-shi-más',
            esMeaning: 'La cuenta, por favor',
            isCorrect: false,
            feedback: 'Para dejar las maletas en consigna usa "Nimotsu o azukatte moraemasu ka?".'
          }
        ]
      },
      {
        staffJp: 'かしこまりました。大浴場（温泉）は夜24時までご利用いただけます。',
        staffKana: 'かしこまりました。だいよくじょう（おんせん）はよるにじゅうよじまでごりよういただけます。',
        staffRomaji: 'Kashikomarimashita. Daiyokujō (onsen) wa yoru nijū-yo-ji made go-riyō itadakemasu.',
        staffEs: 'Entendido. El gran baño termal (Onsen) se puede usar hasta las 24:00 de la noche.',
        contextNote: 'Antes de ir al jardín del ryokan quieres pedir permiso educadamente para tomar fotografías.',
        options: [
          {
            jp: 'ありがとうございます。ここで写真を撮ってもいいですか？',
            kana: 'ありがとうございます。ここでしゃしんをとってもいいですか？',
            romaji: 'Arigatō gozaimasu. Koko de shashin o totte mo ii desu ka?',
            esPhonetic: 'A-ri-ga-too go-zai-más. Kó-ko de sha-shín o tót-te mo íi des-ká',
            esMeaning: 'Muchas gracias. ¿Puedo tomar fotos aquí?',
            isCorrect: true,
            feedback: '¡Dominio total de Nivel 3! Has combinado agradecimiento, partícula de lugar で y permiso ~てもいいですか.'
          },
          {
            jp: 'この電車は東京に行きますか？',
            kana: 'このでんしゃはとうきょうにいきますか？',
            romaji: 'Kono densha wa Tōkyō ni ikimasu ka?',
            esPhonetic: 'Ko-no dén-sha ua Too-kyoo ni i-ki-mas-ká',
            esMeaning: '¿Este tren va a Tokio?',
            isCorrect: false,
            feedback: 'Estás dentro del Ryokan. Pregunta si puedes tomar fotos con "Koko de shashin o totte mo ii desu ka?".'
          }
        ]
      }
    ]
  }
];

export const BUILDER_WORDS: BuilderWord[] = [
  { id: 'toire', jp: 'トイレ', kana: 'といれ', romaji: 'Toire', esPhonetic: 'Tói-re', es: 'El baño / aseo', category: 'lugar', icon: '🚻' },
  { id: 'eki', jp: '駅', kana: 'えき', romaji: 'Eki', esPhonetic: 'É-ki', es: 'La estación de tren', category: 'lugar', icon: '🚉' },
  { id: 'deguchi', jp: '出口', kana: 'でぐち', romaji: 'Deguchi', esPhonetic: 'Dé-gu-chi', es: 'La salida', category: 'lugar', icon: '🚪' },
  { id: 'konbini', jp: 'コンビニ', kana: 'こんびに', romaji: 'Konbini', esPhonetic: 'Kon-bí-ni', es: 'Un Konbini (7-Eleven)', category: 'lugar', icon: '🏪' },
  { id: 'hoteru', jp: 'ホテル', kana: 'ほてる', romaji: 'Hoteru', esPhonetic: 'Jo-té-ru', es: 'El hotel', category: 'lugar', icon: '🏯' },
  { id: 'mizu', jp: 'お水', kana: 'おみず', romaji: 'O-mizu', esPhonetic: 'O-mí-dzu', es: 'Agua', category: 'comida', icon: '💧' },
  { id: 'ramen', jp: 'ラーメン', kana: 'らーめん', romaji: 'Rāmen', esPhonetic: 'Ráa-men', es: 'Ramen', category: 'comida', icon: '🍜' },
  { id: 'biiru', jp: 'ビール', kana: 'びーる', romaji: 'Bīru', esPhonetic: 'Bíi-ru', es: 'Una cerveza', category: 'comida', icon: '🍺' },
  { id: 'matcha', jp: '抹茶ラテ', kana: 'まっちゃらて', romaji: 'Matcha rate', esPhonetic: 'Mát-cha rá-te', es: 'Un Matcha Latte', category: 'comida', icon: '🍵' },
  { id: 'kore', jp: 'これ', kana: 'これ', romaji: 'Kore', esPhonetic: 'Kó-re', es: 'Esto (señalando)', category: 'objeto', icon: '👆' },
  { id: 'menyu', jp: '英語のメニュー', kana: 'えいごのめにゅー', romaji: 'Eigo no menyū', esPhonetic: 'Éi-go no me-nyúu', es: 'Menú en inglés', category: 'objeto', icon: '📖' },
  { id: 'wifi', jp: 'Wi-Fi', kana: 'わいふぁい', romaji: 'Waifai', esPhonetic: 'Uái-fai', es: 'Wi-Fi', category: 'objeto', icon: '📶' },
  { id: 'kyoto', jp: '京都', kana: 'きょうと', romaji: 'Kyōto', esPhonetic: 'Kyóo-to', es: 'Kioto', category: 'transporte', icon: '⛩️' },
  { id: 'shinjuku', jp: '新宿', kana: 'しんじゅく', romaji: 'Shinjuku', esPhonetic: 'Shin-yú-ku', es: 'Shinjuku', category: 'transporte', icon: '🏙️' },
  { id: 'kuko', jp: '空港', kana: 'くうこう', romaji: 'Kūkō', esPhonetic: 'Kúu-koo', es: 'El aeropuerto', category: 'transporte', icon: '✈️' }
];

export const BUILDER_PATTERNS: BuilderPattern[] = [
  {
    id: 'doko',
    labelEs: '¿Dónde está [...]?',
    intent: 'Preguntar ubicación',
    suffixJp: 'はどこですか？',
    suffixKana: 'はどこですか？',
    suffixRomaji: 'wa doko desu ka?',
    suffixPhonetic: 'ua dó-ko des-ká',
    allowedCategories: ['lugar', 'transporte', 'objeto'],
    explanation: 'La partícula は (pronunciada "ua") marca de qué estás hablando, y "doko desu ka" pregunta "¿dónde está?".',
    politeness: 'Cortés estándar (Desu/Masu)'
  },
  {
    id: 'kudasai',
    labelEs: 'Me da [...], por favor',
    intent: 'Pedir en restaurante o tienda',
    suffixJp: 'をください',
    suffixKana: 'をください',
    suffixRomaji: 'o kudasai',
    suffixPhonetic: 'o ku-da-sái',
    allowedCategories: ['comida', 'objeto'],
    explanation: 'La partícula を (se pronuncia "o") une el objeto con "kudasai" (deme por favor).',
    politeness: 'Cortés e infalible'
  },
  {
    id: 'arimasu',
    labelEs: '¿Tienen / Hay [...]?',
    intent: 'Consultar disponibilidad',
    suffixJp: 'はありますか？',
    suffixKana: 'はありますか？',
    suffixRomaji: 'wa arimasu ka?',
    suffixPhonetic: 'ua a-ri-mas-ká',
    allowedCategories: ['comida', 'objeto', 'lugar'],
    explanation: '"Arimasu ka?" significa "¿existe / tienen?" para objetos inanimados o servicios.',
    politeness: 'Cortés estándar'
  },
  {
    id: 'ikura',
    labelEs: '¿Cuánto cuesta [...]?',
    intent: 'Preguntar el precio',
    suffixJp: 'はいくらですか？',
    suffixKana: 'はいくらですか？',
    suffixRomaji: 'wa ikura desu ka?',
    suffixPhonetic: 'ua í-ku-ra des-ká',
    allowedCategories: ['comida', 'objeto'],
    explanation: '"Ikura" significa "¿cuánto cuesta?". Ideal para mercadillos o recuerdos.',
    politeness: 'Cortés estándar'
  },
  {
    id: 'ikitai',
    labelEs: 'Quiero ir a [...]',
    intent: 'En taxi o comprando billetes',
    suffixJp: 'に行きたいです',
    suffixKana: 'にいきたいです',
    suffixRomaji: 'ni ikitai desu',
    suffixPhonetic: 'ni i-ki-tái des',
    allowedCategories: ['lugar', 'transporte'],
    explanation: 'La partícula に ("ni") indica dirección o destino, e "ikitai desu" significa "quiero ir".',
    politeness: 'Cortés y directo'
  }
];

export interface KanaCell {
  hira: string;
  kata: string;
  romaji: string;
  esSound: string;
  exampleJp: string;
  exampleRomaji: string;
  exampleEs: string;
}

export interface KanaRow {
  id: string;
  rowLabel: string;
  consonantHint: string;
  group: 'gojuon' | 'dakuten';
  cells: (KanaCell | null)[];
}

export const KANA_TABLE_ROWS: KanaRow[] = [
  {
    id: 'row-v',
    rowLabel: 'Vocales',
    consonantHint: 'Sonidos puros (A · I · U · E · O)',
    group: 'gojuon',
    cells: [
      { hira: 'あ', kata: 'ア', romaji: 'a', esSound: 'a clara', exampleJp: 'あさ (朝)', exampleRomaji: 'Asa', exampleEs: 'Mañana' },
      { hira: 'い', kata: 'イ', romaji: 'i', esSound: 'i clara', exampleJp: 'いぬ (犬)', exampleRomaji: 'Inu', exampleEs: 'Perro' },
      { hira: 'う', kata: 'ウ', romaji: 'u', esSound: 'u suave (labios relajados)', exampleJp: 'うみ (海)', exampleRomaji: 'Umi', exampleEs: 'Mar' },
      { hira: 'え', kata: 'エ', romaji: 'e', esSound: 'e clara', exampleJp: 'えき (駅)', exampleRomaji: 'Eki', exampleEs: 'Estación' },
      { hira: 'お', kata: 'オ', romaji: 'o', esSound: 'o clara', exampleJp: 'おちゃ (お茶)', exampleRomaji: 'Ocha', exampleEs: 'Té verde' },
    ]
  },
  {
    id: 'row-k',
    rowLabel: 'Fila K',
    consonantHint: 'Sonido K como en "casa / kilo"',
    group: 'gojuon',
    cells: [
      { hira: 'か', kata: 'カ', romaji: 'ka', esSound: 'ka', exampleJp: 'かさ (傘)', exampleRomaji: 'Kasa', exampleEs: 'Paraguas' },
      { hira: 'き', kata: 'キ', romaji: 'ki', esSound: 'ki', exampleJp: 'きっぷ (切符)', exampleRomaji: 'Kippu', exampleEs: 'Billete' },
      { hira: 'く', kata: 'ク', romaji: 'ku', esSound: 'ku', exampleJp: 'くうこう (空港)', exampleRomaji: 'Kūkō', exampleEs: 'Aeropuerto' },
      { hira: 'け', kata: 'ケ', romaji: 'ke', esSound: 'ke', exampleJp: 'ケーキ', exampleRomaji: 'Kēki', exampleEs: 'Pastel' },
      { hira: 'こ', kata: 'コ', romaji: 'ko', esSound: 'ko', exampleJp: 'これ', exampleRomaji: 'Kore', exampleEs: 'Esto' },
    ]
  },
  {
    id: 'row-s',
    rowLabel: 'Fila S',
    consonantHint: '¡Ojo con SHI (suena "shhh")!',
    group: 'gojuon',
    cells: [
      { hira: 'さ', kata: 'サ', romaji: 'sa', esSound: 'sa', exampleJp: 'さくら (桜)', exampleRomaji: 'Sakura', exampleEs: 'Cerezo' },
      { hira: 'し', kata: 'シ', romaji: 'shi', esSound: 'shi (como "shhh")', exampleJp: 'すし (寿司)', exampleRomaji: 'Sushi', exampleEs: 'Sushi' },
      { hira: 'す', kata: 'ス', romaji: 'su', esSound: 'su', exampleJp: 'すみません', exampleRomaji: 'Sumimasen', exampleEs: 'Disculpe' },
      { hira: 'せ', kata: 'セ', romaji: 'se', esSound: 'se', exampleJp: 'せんえん (千円)', exampleRomaji: 'Sen-en', exampleEs: '1000 Yenes' },
      { hira: 'そ', kata: 'ソ', romaji: 'so', esSound: 'so', exampleJp: 'そば', exampleRomaji: 'Soba', exampleEs: 'Fideos Soba' },
    ]
  },
  {
    id: 'row-t',
    rowLabel: 'Fila T',
    consonantHint: '¡Ojo con CHI ("ch") y TSU ("tz")!',
    group: 'gojuon',
    cells: [
      { hira: 'た', kata: 'タ', romaji: 'ta', esSound: 'ta', exampleJp: 'タクシー', exampleRomaji: 'Takushī', exampleEs: 'Taxi' },
      { hira: 'ち', kata: 'チ', romaji: 'chi', esSound: 'chi (como en "chico")', exampleJp: 'ちかてつ (地下鉄)', exampleRomaji: 'Chikatetsu', exampleEs: 'Metro' },
      { hira: 'つ', kata: 'ツ', romaji: 'tsu', esSound: 'tzu (t + s juntas)', exampleJp: 'つぎ (次)', exampleRomaji: 'Tsugi', exampleEs: 'Siguiente' },
      { hira: 'て', kata: 'テ', romaji: 'te', esSound: 'te', exampleJp: 'てら (寺)', exampleRomaji: 'Tera', exampleEs: 'Templo budista' },
      { hira: 'と', kata: 'ト', romaji: 'to', esSound: 'to', exampleJp: 'トイレ', exampleRomaji: 'Toire', exampleEs: 'Baño' },
    ]
  },
  {
    id: 'row-n',
    rowLabel: 'Fila N',
    consonantHint: 'Sonido N igual que en español',
    group: 'gojuon',
    cells: [
      { hira: 'な', kata: 'ナ', romaji: 'na', esSound: 'na', exampleJp: 'なつ (夏)', exampleRomaji: 'Natsu', exampleEs: 'Verano' },
      { hira: 'に', kata: 'ニ', romaji: 'ni', esSound: 'ni', exampleJp: 'にほん (日本)', exampleRomaji: 'Nihon', exampleEs: 'Japón' },
      { hira: 'ぬ', kata: 'ヌ', romaji: 'nu', esSound: 'nu', exampleJp: 'ぬの (布)', exampleRomaji: 'Nuno', exampleEs: 'Tela' },
      { hira: 'ね', kata: 'ネ', romaji: 'ne', esSound: 'ne', exampleJp: 'ねこ (猫)', exampleRomaji: 'Neko', exampleEs: 'Gato' },
      { hira: 'の', kata: 'ノ', romaji: 'no', esSound: 'no', exampleJp: 'のりば (乗り場)', exampleRomaji: 'Noriba', exampleEs: 'Andén' },
    ]
  },
  {
    id: 'row-h',
    rowLabel: 'Fila H',
    consonantHint: 'H aspirada suave ("j" suave) y FU labial',
    group: 'gojuon',
    cells: [
      { hira: 'は', kata: 'ハ', romaji: 'ha', esSound: 'ja suave ("ua" si es partícula)', exampleJp: 'はし (箸)', exampleRomaji: 'Hashi', exampleEs: 'Palillos' },
      { hira: 'ひ', kata: 'ヒ', romaji: 'hi', esSound: 'ji suave', exampleJp: 'ひと (人)', exampleRomaji: 'Hito', exampleEs: 'Persona' },
      { hira: 'ふ', kata: 'フ', romaji: 'fu', esSound: 'fu soplado suave', exampleJp: 'ふじさん (富士山)', exampleRomaji: 'Fujisan', exampleEs: 'Monte Fuji' },
      { hira: 'へ', kata: 'ヘ', romaji: 'he', esSound: 'je suave ("e" si es partícula)', exampleJp: 'へや (部屋)', exampleRomaji: 'Heya', exampleEs: 'Habitación' },
      { hira: 'ほ', kata: 'ホ', romaji: 'ho', esSound: 'jo suave', exampleJp: 'ホテル', exampleRomaji: 'Hoteru', exampleEs: 'Hotel' },
    ]
  },
  {
    id: 'row-m',
    rowLabel: 'Fila M',
    consonantHint: 'Sonido M igual que en español',
    group: 'gojuon',
    cells: [
      { hira: 'ま', kata: 'マ', romaji: 'ma', esSound: 'ma', exampleJp: 'まっちゃ (抹茶)', exampleRomaji: 'Matcha', exampleEs: 'Té Matcha' },
      { hira: 'み', kata: 'ミ', romaji: 'mi', esSound: 'mi', exampleJp: 'みず (水)', exampleRomaji: 'Mizu', exampleEs: 'Agua' },
      { hira: 'む', kata: 'ム', romaji: 'mu', esSound: 'mu', exampleJp: 'むりょう (無料)', exampleRomaji: 'Muryō', exampleEs: 'Gratis' },
      { hira: 'め', kata: 'メ', romaji: 'me', esSound: 'me', exampleJp: 'メニュー', exampleRomaji: 'Menyū', exampleEs: 'Menú' },
      { hira: 'も', kata: 'モ', romaji: 'mo', esSound: 'mo', exampleJp: 'もみじ (紅葉)', exampleRomaji: 'Momiji', exampleEs: 'Arce otoñal' },
    ]
  },
  {
    id: 'row-y',
    rowLabel: 'Fila Y',
    consonantHint: 'Sonido Y suave como en "hielo"',
    group: 'gojuon',
    cells: [
      { hira: 'や', kata: 'ヤ', romaji: 'ya', esSound: 'ya', exampleJp: 'やま (山)', exampleRomaji: 'Yama', exampleEs: 'Montaña' },
      null,
      { hira: 'ゆ', kata: 'ユ', romaji: 'yu', esSound: 'yu', exampleJp: 'ゆ (湯)', exampleRomaji: 'Yu', exampleEs: 'Agua termal (Onsen)' },
      null,
      { hira: 'よ', kata: 'ヨ', romaji: 'yo', esSound: 'yo', exampleJp: 'よる (夜)', exampleRomaji: 'Yoru', exampleEs: 'Noche' },
    ]
  },
  {
    id: 'row-r',
    rowLabel: 'Fila R',
    consonantHint: 'R SIEMPRE suave como en "cara/pero"',
    group: 'gojuon',
    cells: [
      { hira: 'ら', kata: 'ラ', romaji: 'ra', esSound: 'ra suave (nunca "rra")', exampleJp: 'ラーメン', exampleRomaji: 'Rāmen', exampleEs: 'Ramen' },
      { hira: 'り', kata: 'リ', romaji: 'ri', esSound: 'ri suave', exampleJp: 'りょかん (旅館)', exampleRomaji: 'Ryokan', exampleEs: 'Posada japonesa' },
      { hira: 'る', kata: 'ル', romaji: 'ru', esSound: 'ru suave', exampleJp: 'ひる (昼)', exampleRomaji: 'Hiru', exampleEs: 'Mediodía' },
      { hira: 'れ', kata: 'レ', romaji: 're', esSound: 're suave', exampleJp: 'レジ', exampleRomaji: 'Reji', exampleEs: 'Caja registradora' },
      { hira: 'ろ', kata: 'ロ', romaji: 'ro', esSound: 'ro suave', exampleJp: 'ろく (六)', exampleRomaji: 'Roku', exampleEs: 'Seis (6)' },
    ]
  },
  {
    id: 'row-w',
    rowLabel: 'Fila W / N',
    consonantHint: 'WA ("ua"), WO ("o") y N final',
    group: 'gojuon',
    cells: [
      { hira: 'わ', kata: 'ワ', romaji: 'wa', esSound: 'ua (como en "agua")', exampleJp: 'わさび', exampleRomaji: 'Wasabi', exampleEs: 'Wasabi' },
      null,
      { hira: 'ん', kata: 'ン', romaji: 'n', esSound: 'n / m final de sílaba', exampleJp: 'しんかんせん', exampleRomaji: 'Shinkansen', exampleEs: 'Tren bala' },
      null,
      { hira: 'を', kata: 'ヲ', romaji: 'wo (o)', esSound: 'o (partícula de objeto)', exampleJp: 'みずを', exampleRomaji: 'Mizu o', exampleEs: 'Agua (objeto)' },
    ]
  },
  // DAKUTEN & HANDAKUTEN
  {
    id: 'row-g',
    rowLabel: 'Dakuten G (゛)',
    consonantHint: 'Fila K con comillas (゛) -> suena G suave (ga, gui, gu, gue, go)',
    group: 'dakuten',
    cells: [
      { hira: 'が', kata: 'ガ', romaji: 'ga', esSound: 'ga', exampleJp: 'がっこう', exampleRomaji: 'Gakkō', exampleEs: 'Escuela' },
      { hira: 'ぎ', kata: 'ギ', romaji: 'gi', esSound: 'gui (como en "guitarra")', exampleJp: 'ぎんこう (銀行)', exampleRomaji: 'Ginkō', exampleEs: 'Banco' },
      { hira: 'ぐ', kata: 'グ', romaji: 'gu', esSound: 'gu', exampleJp: 'でぐち (出口)', exampleRomaji: 'Deguchi', exampleEs: 'Salida' },
      { hira: 'げ', kata: 'ゲ', romaji: 'ge', esSound: 'gue (como en "guerra")', exampleJp: 'げんきん (現金)', exampleRomaji: 'Genkin', exampleEs: 'Efectivo' },
      { hira: 'ご', kata: 'ゴ', romaji: 'go', esSound: 'go', exampleJp: 'ごはん (ご飯)', exampleRomaji: 'Gohan', exampleEs: 'Arroz / Comida' },
    ]
  },
  {
    id: 'row-z',
    rowLabel: 'Dakuten Z/J (゛)',
    consonantHint: 'Fila S con comillas (゛) -> zumbido suave (dza, yi, dzu, dze, dzo)',
    group: 'dakuten',
    cells: [
      { hira: 'ざ', kata: 'ザ', romaji: 'za', esSound: 'dza suave', exampleJp: 'ざっし', exampleRomaji: 'Zasshi', exampleEs: 'Revista' },
      { hira: 'じ', kata: 'ジ', romaji: 'ji', esSound: 'yi / j inglesa suave', exampleJp: 'じかん (時間)', exampleRomaji: 'Jikan', exampleEs: 'Tiempo / Hora' },
      { hira: 'ず', kata: 'ズ', romaji: 'zu', esSound: 'dzu suave', exampleJp: 'みず (水)', exampleRomaji: 'Mizu', exampleEs: 'Agua' },
      { hira: 'ぜ', kata: 'ゼ', romaji: 'ze', esSound: 'dze suave', exampleJp: 'ぜんぶ (全部)', exampleRomaji: 'Zenbu', exampleEs: 'Todo' },
      { hira: 'ぞ', kata: 'ゾ', romaji: 'zo', esSound: 'dzo suave', exampleJp: 'どうぞ', exampleRomaji: 'Dōzo', exampleEs: 'Adelante / Aquí tiene' },
    ]
  },
  {
    id: 'row-d',
    rowLabel: 'Dakuten D (゛)',
    consonantHint: 'Fila T con comillas (゛) -> sonido D',
    group: 'dakuten',
    cells: [
      { hira: 'だ', kata: 'ダ', romaji: 'da', esSound: 'da', exampleJp: 'だいじょうぶ', exampleRomaji: 'Daijōbu', exampleEs: 'Está bien' },
      { hira: 'ぢ', kata: 'ヂ', romaji: 'ji (di)', esSound: 'yi suave', exampleJp: 'はなぢ', exampleRomaji: 'Hanaji', exampleEs: 'Sangrado nasal' },
      { hira: 'づ', kata: 'ヅ', romaji: 'zu (du)', esSound: 'dzu suave', exampleJp: 'つづく', exampleRomaji: 'Tsuzuku', exampleEs: 'Continuar' },
      { hira: 'で', kata: 'デ', romaji: 'de', esSound: 'de', exampleJp: 'でんしゃ (電車)', exampleRomaji: 'Densha', exampleEs: 'Tren' },
      { hira: 'ど', kata: 'ド', romaji: 'do', esSound: 'do', exampleJp: 'どこ', exampleRomaji: 'Doko', exampleEs: '¿Dónde?' },
    ]
  },
  {
    id: 'row-b',
    rowLabel: 'Dakuten B (゛)',
    consonantHint: 'Fila H con comillas (゛) -> sonido B',
    group: 'dakuten',
    cells: [
      { hira: 'ば', kata: 'バ', romaji: 'ba', esSound: 'ba', exampleJp: 'バス', exampleRomaji: 'Basu', exampleEs: 'Autobús' },
      { hira: 'び', kata: 'ビ', romaji: 'bi', esSound: 'bi', exampleJp: 'ビール', exampleRomaji: 'Bīru', exampleEs: 'Cerveza' },
      { hira: 'ぶ', kata: 'ブ', romaji: 'bu', esSound: 'bu', exampleJp: 'ぶたにく (豚肉)', exampleRomaji: 'Butaniku', exampleEs: 'Cerdo' },
      { hira: 'べ', kata: 'ベ', romaji: 'be', esSound: 'be', exampleJp: 'べんとう (弁当)', exampleRomaji: 'Bentō', exampleEs: 'Bandeja Bento' },
      { hira: 'ぼ', kata: 'ボ', romaji: 'bo', esSound: 'bo', exampleJp: 'ボタン', exampleRomaji: 'Botan', exampleEs: 'Botón' },
    ]
  },
  {
    id: 'row-p',
    rowLabel: 'Handakuten P (゜)',
    consonantHint: 'Fila H con circulito (゜) -> sonido P',
    group: 'dakuten',
    cells: [
      { hira: 'ぱ', kata: 'パ', romaji: 'pa', esSound: 'pa', exampleJp: 'パン', exampleRomaji: 'Pan', exampleEs: 'Pan' },
      { hira: 'ぴ', kata: 'ピ', romaji: 'pi', esSound: 'pi', exampleJp: 'ピザ', exampleRomaji: 'Piza', exampleEs: 'Pizza' },
      { hira: 'ぷ', kata: 'プ', romaji: 'pu', esSound: 'pu', exampleJp: 'てんぷら', exampleRomaji: 'Tenpura', exampleEs: 'Tempura' },
      { hira: 'ぺ', kata: 'ペ', romaji: 'pe', esSound: 'pe', exampleJp: 'ペン', exampleRomaji: 'Pen', exampleEs: 'Bolígrafo' },
      { hira: 'ぽ', kata: 'ポ', romaji: 'po', esSound: 'po', exampleJp: 'きっぷ', exampleRomaji: 'Kippu', exampleEs: 'Billete / Ticket' },
    ]
  }
];

export interface VisualCommonWord {
  id: string;
  level: LearningLevelId;
  category: 'comida' | 'transporte' | 'lugares' | 'objetos';
  es: string;
  kanji: string;
  hiragana: string;
  katakana: string;
  romaji: string;
  esPhonetic: string;
  usualForm: 'Kanji' | 'Hiragana' | 'Katakana';
  mnemonic: string;
  writingNote: string;
  svgType:
    | 'water'
    | 'ramen'
    | 'tea'
    | 'beer'
    | 'rice'
    | 'train'
    | 'station'
    | 'ticket'
    | 'airport'
    | 'torii'
    | 'hotel'
    | 'toilet'
    | 'konbini'
    | 'yen'
    | 'umbrella'
    | 'fuji';
}

export const VISUAL_COMMON_WORDS: VisualCommonWord[] = [
  // =========================================================================
  // NIVEL 0 · INTRODUCTORIO (20 Palabras Esenciales de Supervivencia Día 1)
  // =========================================================================
  {
    id: 'vw-mizu',
    level: 'intro',
    category: 'comida',
    es: 'Agua',
    kanji: '水 (お水)',
    hiragana: 'みず (おみず)',
    katakana: 'ミズ',
    romaji: 'Mizu (O-mizu)',
    esPhonetic: 'Mí-dzu / O-mí-dzu',
    usualForm: 'Kanji',
    mnemonic: 'Imagina que tienes mucha sed y dices: "¡Cambiaría MI ZUmo por un vaso de AGUA fresca!" → MI-ZU.',
    writingNote: 'En menús y dispensadores verás el Kanji 水. Al pedirla en un restaurante se añade お delante (お水) por cortesía.',
    svgType: 'water'
  },
  {
    id: 'vw-ramen',
    level: 'intro',
    category: 'comida',
    es: 'Ramen (Sopa de fideos)',
    kanji: '拉麺 (rara vez usado)',
    hiragana: 'らーめん',
    katakana: 'ラーメン',
    romaji: 'Rāmen',
    esPhonetic: 'Ráa-men',
    usualForm: 'Katakana',
    mnemonic: 'La primera letra ラ (Ra) parece un cuenco con un palillo encima, y el guion largo ー es un fideo estirado: ラ ー メ ン.',
    writingNote: 'Al tener origen chino, en el 95% de los carteles y cortinas (noren) de Japón lo verás escrito en Katakana: ラーメン.',
    svgType: 'ramen'
  },
  {
    id: 'vw-eki',
    level: 'intro',
    category: 'transporte',
    es: 'Estación de tren',
    kanji: '駅',
    hiragana: 'えき',
    katakana: 'エキ',
    romaji: 'Eki',
    esPhonetic: 'É-ki',
    usualForm: 'Kanji',
    mnemonic: 'En el mapa turístico, la ESTACIÓN de tren está marcada con una gran EQUIS: "E-KI" (Equis).',
    writingNote: 'Aparece al final del nombre de todas las estaciones: 東京駅 (Tōkyō-eki), 京都駅 (Kyōto-eki).',
    svgType: 'station'
  },
  {
    id: 'vw-densha',
    level: 'intro',
    category: 'transporte',
    es: 'Tren eléctrico',
    kanji: '電車',
    hiragana: 'でんしゃ',
    katakana: 'デンシャ',
    romaji: 'Densha',
    esPhonetic: 'Dén-sha',
    usualForm: 'Kanji',
    mnemonic: 'En hora punta el tren de Tokio va tan lleno y DENSO de gente que recuerdas al instante: DEN-SHA = Tren.',
    writingNote: 'Unión de 電 (electricidad) + 車 (vehículo). Es la palabra clave para moverte por Tokio, Kioto y Osaka.',
    svgType: 'train'
  },
  {
    id: 'vw-toire',
    level: 'intro',
    category: 'lugares',
    es: 'Baño / Aseo',
    kanji: 'お手洗い (O-tearai)',
    hiragana: 'といれ / おてあらい',
    katakana: 'トイレ',
    romaji: 'Toire',
    esPhonetic: 'Tói-re',
    usualForm: 'Katakana',
    mnemonic: 'Viene de "TOILET" (baño en inglés) quitando la T final y con R suave: "TÓI-RE".',
    writingNote: 'En carteles verás トイレ (Katakana) o los Kanji formales お手洗い (lavamanos) y 化粧室 (tocador).',
    svgType: 'toilet'
  },
  {
    id: 'vw-hoteru',
    level: 'intro',
    category: 'lugares',
    es: 'Hotel',
    kanji: 'ホテル (Sin Kanji)',
    hiragana: 'ほてる',
    katakana: 'ホテル',
    romaji: 'Hoteru',
    esPhonetic: 'Jo-té-ru',
    usualForm: 'Katakana',
    mnemonic: 'Es la palabra "HOTEL" pronunciada con acento japonés cambiando la L final por RU: "JO-TE-RU".',
    writingNote: 'Palabra adaptada del inglés "Hotel". Siempre se escribe en Katakana: ホテル.',
    svgType: 'hotel'
  },
  {
    id: 'vw-konbini',
    level: 'intro',
    category: 'lugares',
    es: 'Tienda 24h (7-Eleven / Lawson)',
    kanji: 'コンビニ (Abreviatura)',
    hiragana: 'こんびに',
    katakana: 'コンビニ',
    romaji: 'Konbini',
    esPhonetic: 'Kon-bí-ni',
    usualForm: 'Katakana',
    mnemonic: 'Una tienda 24h que "COMBINA (KON-BI-NI)" todo lo que necesitas: cajero, comida caliente y bebida.',
    writingNote: 'Abreviatura japonesa de "Convenience store". Abiertos las 24h con cajeros ATM, comida caliente y baños.',
    svgType: 'konbini'
  },
  {
    id: 'vw-en',
    level: 'intro',
    category: 'objetos',
    es: 'Yen (Moneda japonesa)',
    kanji: '円',
    hiragana: 'えん',
    katakana: 'エン',
    romaji: 'En',
    esPhonetic: 'Én (sin Y inicial)',
    usualForm: 'Kanji',
    mnemonic: 'En Japón pagas todo "EN efectivo / EN yenes" → recuerda quitarle la Y a "Yen" y decir solo "EN".',
    writingNote: 'En todas las etiquetas de precio verás el Kanji 円 (ej. 500円 = Go-hyaku en). Significa "círculo / redondo".',
    svgType: 'yen'
  },
  {
    id: 'vw-deguchi',
    level: 'intro',
    category: 'lugares',
    es: 'Salida (Estación o edificio)',
    kanji: '出口',
    hiragana: 'でぐち',
    katakana: 'デグチ',
    romaji: 'Deguchi',
    esPhonetic: 'Dé-gu-chi',
    usualForm: 'Kanji',
    mnemonic: 'Sales de la estación directo a una tienda "DE GUCCI (DE-GU-CHI)" → Salida.',
    writingNote: 'En todas las estaciones de metro y tren los carteles amarillos con 出口 indican las salidas a la calle.',
    svgType: 'station'
  },
  {
    id: 'vw-iriguchi',
    level: 'intro',
    category: 'lugares',
    es: 'Entrada / Acceso',
    kanji: '入口',
    hiragana: 'いりぐち',
    katakana: 'イリグチ',
    romaji: 'Iriguchi',
    esPhonetic: 'I-ri-gú-chi',
    usualForm: 'Kanji',
    mnemonic: '"IR Y... ¡adentro por la entrada! (I-RI-GU-CHI)". El Kanji 入 parece una tienda de campaña a la que entras.',
    writingNote: 'Combinación de 入 (entrar) + 口 (boca/puerta). Fundamental en templos, museos y vagones de autobús.',
    svgType: 'station'
  },
  {
    id: 'vw-takushi',
    level: 'intro',
    category: 'transporte',
    es: 'Taxi',
    kanji: 'タクシー (Sin Kanji)',
    hiragana: 'たくしー',
    katakana: 'タクシー',
    romaji: 'Takushī',
    esPhonetic: 'Ta-ku-shíi',
    usualForm: 'Katakana',
    mnemonic: 'Es la palabra "TAXI" pronunciada desglosando la X como KU-SHI: "TA-KU-SHĪ".',
    writingNote: 'En Japón las puertas traseras de los taxis se abren y cierran solas de forma automática: ¡no las empujes con la mano!',
    svgType: 'train'
  },
  {
    id: 'vw-basu',
    level: 'intro',
    category: 'transporte',
    es: 'Autobús',
    kanji: 'バス (Sin Kanji)',
    hiragana: 'ばす',
    katakana: 'バス',
    romaji: 'Basu',
    esPhonetic: 'Bá-su',
    usualForm: 'Katakana',
    mnemonic: 'Viene del inglés "BUS" pronunciado "BA-SU". "¡En Kioto BA-SUbiendo al autobús!".',
    writingNote: 'Siempre en Katakana (バス). En paradas verás バス停 (Basu-tei = parada de autobús).',
    svgType: 'train'
  },
  {
    id: 'vw-menyuu',
    level: 'intro',
    category: 'objetos',
    es: 'Menú / Carta de restaurante',
    kanji: 'メニュー (献立)',
    hiragana: 'めにゅー',
    katakana: 'メニュー',
    romaji: 'Menyū',
    esPhonetic: 'Me-nyúu',
    usualForm: 'Katakana',
    mnemonic: 'Es "MENU" con sonido de Ñ suave y U alargada: "¡Pásame el ME-NYŪ, por favor!".',
    writingNote: 'Para pedir la carta en inglés di "Eigo no menyū" (英語のメニュー).',
    svgType: 'ticket'
  },
  {
    id: 'vw-pan',
    level: 'intro',
    category: 'comida',
    es: 'Pan / Bollería',
    kanji: 'パン (Sin Kanji)',
    hiragana: 'ぱん',
    katakana: 'パン',
    romaji: 'Pan',
    esPhonetic: 'Pán',
    usualForm: 'Katakana',
    mnemonic: '¡Exactamente igual que "PAN" en español! Llegó a Japón en el siglo XVI a través del portugués "pão".',
    writingNote: 'Se escribe siempre en Katakana (パン). Las panaderías japonesas (パン屋, Pan-ya) son famosísimas por su Melon-pan y Kare-pan.',
    svgType: 'rice'
  },
  {
    id: 'vw-tamago',
    level: 'intro',
    category: 'comida',
    es: 'Huevo',
    kanji: '卵 (玉子)',
    hiragana: 'たまご',
    katakana: 'タマゴ',
    romaji: 'Tamago',
    esPhonetic: 'Ta-má-go',
    usualForm: 'Kanji',
    mnemonic: '¿Recuerdas el juguete "TAMAGOTCHI"? Venía de "TAMAGO" (huevo) + "Watch" (reloj).',
    writingNote: 'Cuando está crudo suele escribirse 卵 y cuando ya está cocinado en sushi o tortilla verás 玉子.',
    svgType: 'rice'
  },
  {
    id: 'vw-onigiri',
    level: 'intro',
    category: 'comida',
    es: 'Bola de arroz rellena (Onigiri)',
    kanji: 'おにぎり (おむすび)',
    hiragana: 'おにぎり',
    katakana: 'オニギリ',
    romaji: 'Onigiri',
    esPhonetic: 'O-ni-guí-ri',
    usualForm: 'Hiragana',
    mnemonic: 'Para abrir el plástico del triángulo de arroz en el Konbini "lo GIRAS (O-NI-GI-RI)" siguiendo los números 1, 2 y 3.',
    writingNote: 'El snack estrella de cualquier Konbini por unos 150 yenes. Suele escribirse directamente en Hiragana: おにぎり.',
    svgType: 'rice'
  },
  {
    id: 'vw-kaado',
    level: 'intro',
    category: 'objetos',
    es: 'Tarjeta (Crédito / Transporte Suica)',
    kanji: 'カード (Sin Kanji)',
    hiragana: 'かーど',
    katakana: 'カード',
    romaji: 'Kādo',
    esPhonetic: 'Káa-do',
    usualForm: 'Katakana',
    mnemonic: 'Viene del inglés "CARD" alargando la A y añadiendo DO al final: "KĀ-DO".',
    writingNote: 'Sirve tanto para tarjeta de crédito (クレジットカード) como para tu tarjeta de transporte IC (ICカード).',
    svgType: 'ticket'
  },
  {
    id: 'vw-waifai',
    level: 'intro',
    category: 'objetos',
    es: 'Wi-Fi / Conexión a Internet',
    kanji: 'Wi-Fi (無線LAN)',
    hiragana: 'わいふぁい',
    katakana: 'ワイファイ',
    romaji: 'Waifai',
    esPhonetic: 'Uái-fai',
    usualForm: 'Katakana',
    mnemonic: 'Se pronuncia igual que en inglés: "UÁI-FAI". En Japón muchos viajeros alquilan un "Pocket Wi-Fi".',
    writingNote: 'En cafeterías y trenes verás el símbolo Wi-Fi o 無料Wi-Fi (Wi-Fi gratuito).',
    svgType: 'ticket'
  },
  {
    id: 'vw-fukuro',
    level: 'intro',
    category: 'objetos',
    es: 'Bolsa de compra',
    kanji: '袋 (レジ袋)',
    hiragana: 'ふくろ',
    katakana: 'フクロ',
    romaji: 'Fukuro',
    esPhonetic: 'Fu-kú-ro',
    usualForm: 'Kanji',
    mnemonic: 'En el Konbini siempre te preguntan por la bolsa: "¡Te JURO (FU-KU-RO) que cabe todo en mi mochila!".',
    writingNote: 'La frase que oirás en todas las tiendas de Japón es: 袋はいりますか？ (¿Necesita bolsa?).',
    svgType: 'konbini'
  },
  {
    id: 'vw-hashi',
    level: 'intro',
    category: 'objetos',
    es: 'Palillos japoneses',
    kanji: 'お箸 (箸)',
    hiragana: 'おはし',
    katakana: 'オハシ',
    romaji: 'O-hashi',
    esPhonetic: 'O-já-shi',
    usualForm: 'Kanji',
    mnemonic: 'Al usar palillos por primera vez dices: "¡OH, ASÍ (O-HA-SHI) se sujetan los palillos!".',
    writingNote: 'Los palillos desechables de madera que te dan en los Konbini se llaman 割り箸 (Waribashi).',
    svgType: 'ramen'
  },

  // =========================================================================
  // NIVEL 1 · BÁSICO (20 Palabras de Restaurantes, Bebidas, Billetes y Ciudad)
  // =========================================================================
  {
    id: 'vw-ocha',
    level: 'nivel-1',
    category: 'comida',
    es: 'Té Verde',
    kanji: 'お茶',
    hiragana: 'おちゃ',
    katakana: 'オチャ',
    romaji: 'O-cha',
    esPhonetic: 'O-chá',
    usualForm: 'Kanji',
    mnemonic: 'Imagina tomar el té verde caliente a las OCHO de la mañana: "¡A las O-CHA tomo mi té verde!".',
    writingNote: 'Combina el prefijo cortés en Hiragana (お) con el Kanji de té (茶). Lo verás en todas las máquinas expendedoras.',
    svgType: 'tea'
  },
  {
    id: 'vw-biiru',
    level: 'nivel-1',
    category: 'comida',
    es: 'Cerveza',
    kanji: '麦酒 (solo en etiquetas retro)',
    hiragana: 'びーる',
    katakana: 'ビール',
    romaji: 'Bīru',
    esPhonetic: 'Bíi-ru',
    usualForm: 'Katakana',
    mnemonic: 'Suena casi igual que "BEER" (cerveza en inglés) pero terminando en "-ru": ¡BÍI-RU bien fría!',
    writingNote: 'Viene del neerlandés "bier", por lo que siempre se escribe en Katakana (ビール) con el guion largo ー que alarga la "i".',
    svgType: 'beer'
  },
  {
    id: 'vw-gohan',
    level: 'nivel-1',
    category: 'comida',
    es: 'Arroz cocido / Comida',
    kanji: 'ご飯',
    hiragana: 'ごはん',
    katakana: 'ゴハン',
    romaji: 'Gohan',
    esPhonetic: 'Go-ján',
    usualForm: 'Kanji',
    mnemonic: '¡Sí, como Son GOHAN de Dragon Ball! Su nombre significa literalmente "Arroz cocido / Comida".',
    writingNote: 'Significa tanto "arroz blanco cocido" como "comida" en general (ej. Asa-gohan = Desayuno).',
    svgType: 'rice'
  },
  {
    id: 'vw-sushi',
    level: 'nivel-1',
    category: 'comida',
    es: 'Sushi',
    kanji: '寿司 (お寿司)',
    hiragana: 'すし (おすし)',
    katakana: 'スシ',
    romaji: 'Sushi (O-sushi)',
    esPhonetic: 'Sú-shi / O-sú-shi',
    usualForm: 'Kanji',
    mnemonic: 'En Japón es costumbre añadir "O-" delante por respeto a la gastronomía tradicional: "¡O-SU-SHI!".',
    writingNote: 'En restaurantes de cinta transportadora verás 回転寿司 (Kaiten-zushi). También se escribe すし en Hiragana.',
    svgType: 'rice'
  },
  {
    id: 'vw-kippu',
    level: 'nivel-1',
    category: 'transporte',
    es: 'Billete / Ticket',
    kanji: '切符',
    hiragana: 'きっぷ',
    katakana: 'キップ',
    romaji: 'Kippu',
    esPhonetic: 'Kíp-pu (pausa en la doble p)',
    usualForm: 'Kanji',
    mnemonic: 'Si pierdes tu billete antes de salir del torno te preguntas: "¿Y ahora QUÉ PUse (KIP-PU) en mi bolsillo?".',
    writingNote: 'El pequeño つ (っ) en きっぷ indica un pequeño silencio antes de pronunciar "pu".',
    svgType: 'ticket'
  },
  {
    id: 'vw-kuko',
    level: 'nivel-1',
    category: 'transporte',
    es: 'Aeropuerto',
    kanji: '空港',
    hiragana: 'くうこう',
    katakana: 'クウコウ',
    romaji: 'Kūkō',
    esPhonetic: 'Kúu-koo',
    usualForm: 'Kanji',
    mnemonic: 'Imagina un pájaro CUCO gigante despegando como un avión desde el AEROPUERTO: "¡KÚU-KOO al aeropuerto!".',
    writingNote: 'Literalmente 空 (cielo) + 港 (puerto) = "Puerto del cielo". Vital al tomar el tren hacia Narita o Haneda.',
    svgType: 'airport'
  },
  {
    id: 'vw-kasa',
    level: 'nivel-1',
    category: 'objetos',
    es: 'Paraguas',
    kanji: '傘',
    hiragana: 'かさ',
    katakana: 'カサ',
    romaji: 'Kasa',
    esPhonetic: 'Ká-sa',
    usualForm: 'Kanji',
    mnemonic: 'El paraguas te cubre de la lluvia como si llevaras el techo de tu CASA encima: "¡Mi paraguas es mi KA-SA!".',
    writingNote: 'El Kanji 傘 parece literalmente un paraguas abierto. En Japón todo el mundo compra paraguas transparentes en los Konbini.',
    svgType: 'umbrella'
  },
  {
    id: 'vw-kohi',
    level: 'nivel-1',
    category: 'comida',
    es: 'Café',
    kanji: '珈琲 (en cafeterías retro Kissaten)',
    hiragana: 'こーひー',
    katakana: 'コーヒー',
    romaji: 'Kōhī',
    esPhonetic: 'Kóo-jii (dos vocales largas)',
    usualForm: 'Katakana',
    mnemonic: 'Viene de "COFFEE" cambiando la F por una J suave aspirada: "¡Tomo mi KÓO-JII por la mañana!".',
    writingNote: 'En máquinas expendedoras verás コーヒー (frío o en lata caliente). Hot coffee = ホットコーヒー.',
    svgType: 'tea'
  },
  {
    id: 'vw-matcha',
    level: 'nivel-1',
    category: 'comida',
    es: 'Té Matcha (Té verde molido)',
    kanji: '抹茶',
    hiragana: 'まっちゃ',
    katakana: 'マッチャ',
    romaji: 'Matcha',
    esPhonetic: 'Mát-cha',
    usualForm: 'Kanji',
    mnemonic: 'Hacen el polvo verde "MACHAcando (MAT-CHA)" las hojas de té en molino de piedra.',
    writingNote: 'Literalmente 抹 (polvo/moler) + 茶 (té). En Kioto (especialmente en Uji) encontrarás helados y postres con el cartel 抹茶.',
    svgType: 'tea'
  },
  {
    id: 'vw-udon',
    level: 'nivel-1',
    category: 'comida',
    es: 'Fideos Udon (Trigo grueso)',
    kanji: 'うどん (饂飩)',
    hiragana: 'うどん',
    katakana: 'ウドン',
    romaji: 'Udon',
    esPhonetic: 'Ú-don',
    usualForm: 'Hiragana',
    mnemonic: 'Son fideos blancos tan gruesos y reconfortantes que dices: "¡Tienen UN DON (U-DON) para quitar el hambre!".',
    writingNote: 'Casi siempre se escribe en Hiragana redondeado (うどん) en las cortinas de los restaurantes.',
    svgType: 'ramen'
  },
  {
    id: 'vw-soba',
    level: 'nivel-1',
    category: 'comida',
    es: 'Fideos Soba (Trigo sarraceno)',
    kanji: 'そば (蕎麦)',
    hiragana: 'そば',
    katakana: 'ソバ',
    romaji: 'Soba',
    esPhonetic: 'Só-ba',
    usualForm: 'Hiragana',
    mnemonic: 'Fideos finos oscuros tan ricos que "no SOBRA (SO-BA) ni uno en el plato".',
    writingNote: 'Se pueden tomar calientes en caldo o fríos sobre una esterilla de bambú (ざるそば, Zaru-soba).',
    svgType: 'ramen'
  },
  {
    id: 'vw-tempura',
    level: 'nivel-1',
    category: 'comida',
    es: 'Tempura (Rebozado ligero japonés)',
    kanji: '天ぷら (天麩羅)',
    hiragana: 'てんぷら',
    katakana: 'テンプラ',
    romaji: 'Tenpura',
    esPhonetic: 'Tén-pu-ra',
    usualForm: 'Kanji',
    mnemonic: 'Crujiente de gambas y verduras a la "TEMPERAtura (TEN-PU-RA)" perfecta del aceite.',
    writingNote: 'Suele escribirse mezclando el Kanji 天 (cielo) con Hiragana: 天ぷら.',
    svgType: 'ramen'
  },
  {
    id: 'vw-gyoza',
    level: 'nivel-1',
    category: 'comida',
    es: 'Gyoza (Empanadillas a la plancha)',
    kanji: '餃子',
    hiragana: 'ぎょうざ',
    katakana: 'ギョウザ',
    romaji: 'Gyōza',
    esPhonetic: 'Guióo-dza',
    usualForm: 'Kanji',
    mnemonic: 'El acompañante inseparable del ramen: "¡Cómo se GOZA (GYŌ-ZA) comiendo empanadillas calientes!".',
    writingNote: 'En todas las tiendas de Ramen verás el cartel 餃子 (Gyōza) para pedir una ración de 5 o 6 unidades.',
    svgType: 'ramen'
  },
  {
    id: 'vw-noriba',
    level: 'nivel-1',
    category: 'transporte',
    es: 'Andén / Zona de embarque',
    kanji: '乗り場',
    hiragana: 'のりば',
    katakana: 'ノリバ',
    romaji: 'Noriba',
    esPhonetic: 'No-rí-ba',
    usualForm: 'Kanji',
    mnemonic: '"NORI" (subir a un vehículo) + "BA" (lugar): "¡En el NO-RI-BA nos subimos al tren o taxi!".',
    writingNote: 'Aparece en todos los carteles de estaciones: タクシー乗り場 (parada de taxis), バス乗り場 (andén de autobuses).',
    svgType: 'station'
  },
  {
    id: 'vw-kippu-uriba',
    level: 'nivel-1',
    category: 'transporte',
    es: 'Máquina / Taquilla de billetes',
    kanji: 'きっぷうりば (切符売場)',
    hiragana: 'きっぷうりば',
    katakana: 'キップウリバ',
    romaji: 'Kippu-uriba',
    esPhonetic: 'Kíp-pu u-rí-ba',
    usualForm: 'Hiragana',
    mnemonic: '"KIPPU" (billete) + "URIBA" (lugar de venta): donde compras o recargas tu tarjeta de tren.',
    writingNote: 'En las estaciones JR suele estar escrito en Hiragana grande (きっぷうりば) encima de las máquinas automáticas.',
    svgType: 'ticket'
  },
  {
    id: 'vw-depato',
    level: 'nivel-1',
    category: 'lugares',
    es: 'Grandes Almacenes / Centro Comercial',
    kanji: 'デパート (百貨店)',
    hiragana: 'でぱーと',
    katakana: 'デパート',
    romaji: 'Depāto',
    esPhonetic: 'De-páa-to',
    usualForm: 'Katakana',
    mnemonic: 'Abreviatura japonesa de "DEPARTMENT store" → "DE-PĀ-TO".',
    writingNote: 'El sótano de los grandes almacenes (デパ地下, Depachika) es un paraíso gastronómico de comida preparada.',
    svgType: 'hotel'
  },
  {
    id: 'vw-koen',
    level: 'nivel-1',
    category: 'lugares',
    es: 'Parque / Jardín público',
    kanji: '公園',
    hiragana: 'こうえん',
    katakana: 'コウエン',
    romaji: 'Kōen',
    esPhonetic: 'Kóo-en',
    usualForm: 'Kanji',
    mnemonic: 'Un parque precioso lleno de cerezos donde todos "COmEn (KŌ-EN)" haciendo picnic bajo las flores.',
    writingNote: 'Lo verás en parques famosos como 上野公園 (Ueno-kōen), 代々木公園 (Yoyogi-kōen) o 奈良公園 (Nara-kōen).',
    svgType: 'torii'
  },
  {
    id: 'vw-reshiito',
    level: 'nivel-1',
    category: 'objetos',
    es: 'Recibo / Ticket de compra',
    kanji: 'レシート (領収書)',
    hiragana: 'れしーと',
    katakana: 'レシート',
    romaji: 'Reshīto',
    esPhonetic: 'Re-shíi-to',
    usualForm: 'Katakana',
    mnemonic: 'Viene del inglés "RECEIPT" (pronunciado "re-sít") adaptado como "RE-SHĪ-TO".',
    writingNote: 'En los Konbini te preguntarán: レシートはよろしいですか？ (¿Quiere el recibo?). Guárdalos para tus compras Tax-Free.',
    svgType: 'ticket'
  },
  {
    id: 'vw-kagi',
    level: 'nivel-1',
    category: 'objetos',
    es: 'Llave (Habitación o Taquilla)',
    kanji: '鍵 (キー)',
    hiragana: 'かぎ',
    katakana: 'カギ',
    romaji: 'Kagi',
    esPhonetic: 'Ká-gui',
    usualForm: 'Kanji',
    mnemonic: 'No pierdas la llave del hotel o dirás: "¡CAGUÉ (KA-GI), me dejé la llave dentro de la habitación!".',
    writingNote: 'En hoteles modernos también usan カードキー (Kādo-kī = tarjeta llave).',
    svgType: 'hotel'
  },
  {
    id: 'vw-kori',
    level: 'nivel-1',
    category: 'comida',
    es: 'Hielo (Con o sin hielo)',
    kanji: '氷',
    hiragana: 'こおり',
    katakana: 'コオリ',
    romaji: 'Kōri',
    esPhonetic: 'Kóo-ri',
    usualForm: 'Kanji',
    mnemonic: 'El Kanji 氷 es idéntico al de agua (水) pero con una gotita congelada extra a la izquierda.',
    writingNote: 'Para pedir una bebida sin hielo di: 氷なし (Kōri nashi). En verano verás banderas con 氷 que venden granizado Kakigōri.',
    svgType: 'water'
  },

  // =========================================================================
  // NIVEL 2 · INTERMEDIO (20 Palabras de Cultura, Metro, Carnes en Menú y Pagos)
  // =========================================================================
  {
    id: 'vw-jinja',
    level: 'nivel-2',
    category: 'lugares',
    es: 'Santuario Sintoísta (Torii)',
    kanji: '神社',
    hiragana: 'じんじゃ',
    katakana: 'ジンジャ',
    romaji: 'Jinja',
    esPhonetic: 'Yín-ya',
    usualForm: 'Kanji',
    mnemonic: 'Imagina a un NINJA silencioso meditando bajo el arco rojo de un santuario: "NINJA en el JIN-JA (Yín-ya)".',
    writingNote: 'Se distingue por tener un arco rojo 鳥居 (Torii) en la entrada, como Fushimi Inari en Kioto.',
    svgType: 'torii'
  },
  {
    id: 'vw-otera',
    level: 'nivel-2',
    category: 'lugares',
    es: 'Templo Budista',
    kanji: 'お寺 (寺)',
    hiragana: 'おてら',
    katakana: 'オテラ',
    romaji: 'O-tera',
    esPhonetic: 'O-té-ra',
    usualForm: 'Kanji',
    mnemonic: 'Un templo budista antiguo construido con TIERRA sagrada: "¡Qué paz se respira en el O-TE-RA!".',
    writingNote: 'Aparece al final del nombre de templos famosos (se lee "-ji" o "-dera"): 浅草寺 (Sensō-ji), 清水寺 (Kiyomizu-dera).',
    svgType: 'torii'
  },
  {
    id: 'vw-yama',
    level: 'nivel-2',
    category: 'lugares',
    es: 'Montaña / Monte Fuji',
    kanji: '山 (富士山)',
    hiragana: 'やま (ふじさん)',
    katakana: 'ヤマ',
    romaji: 'Yama (Fuji-san)',
    esPhonetic: 'Yá-ma / Fú-yi-san',
    usualForm: 'Kanji',
    mnemonic: 'Desde la cima de la MONTAÑA (山) ves una LLAMA de fuego: "La LLAMA (YA-MA) en la montaña".',
    writingNote: 'El Kanji 山 tiene forma de tres picos de montaña. Cuando va unido al nombre de un monte se lee "-san" (富士山 = Fujisan).',
    svgType: 'fuji'
  },
  {
    id: 'vw-chikatetsu',
    level: 'nivel-2',
    category: 'transporte',
    es: 'Metro Subterráneo',
    kanji: '地下鉄',
    hiragana: 'ちかてつ',
    katakana: 'チカテツ',
    romaji: 'Chikatetsu',
    esPhonetic: 'Chi-ka-té-tzu',
    usualForm: 'Kanji',
    mnemonic: 'Una CHICA en el TEcho esperando el tren subterráneo: "CHI-KA-TE-TSU = Metro bajo tierra".',
    writingNote: 'Literalmente 地下 (bajo tierra) + 鉄 (hierro/ferrocarril). Esencial para distinguir el Metro de las líneas JR.',
    svgType: 'train'
  },
  {
    id: 'vw-shinkansen',
    level: 'nivel-2',
    category: 'transporte',
    es: 'Tren Bala (Shinkansen)',
    kanji: '新幹線',
    hiragana: 'しんかんせん',
    katakana: 'シンカンセン',
    romaji: 'Shinkansen',
    esPhonetic: 'Shin-kan-sén',
    usualForm: 'Kanji',
    mnemonic: 'Viaja a 320 km/h "SIN CANSARSE (SHIN-KAN-SEN)" de Tokio a Kioto.',
    writingNote: 'Significa "Nueva Línea Troncal". Busca siempre los carteles azules o verdes con 新幹線 en las grandes estaciones.',
    svgType: 'train'
  },
  {
    id: 'vw-gyuniku',
    level: 'nivel-2',
    category: 'comida',
    es: 'Carne de Res / Ternera (Wagyu)',
    kanji: '牛肉',
    hiragana: 'ぎゅうにく',
    katakana: 'ギュウニク',
    romaji: 'Gyūniku',
    esPhonetic: 'Guiúu-ni-ku',
    usualForm: 'Kanji',
    mnemonic: '"GYŪ" (vaca) + "NIKU" (carne): "¡Qué rico el GYŪ-NIKU (carne de vaca) a la parrilla!".',
    writingNote: 'Vital en menús: 牛 (vaca), 豚肉 (Butaniku = cerdo), 鶏肉 (Toriniku = pollo).',
    svgType: 'ramen'
  },
  {
    id: 'vw-genkin',
    level: 'nivel-2',
    category: 'objetos',
    es: 'Dinero en Efectivo',
    kanji: '現金',
    hiragana: 'げんきん',
    katakana: 'ゲンキン',
    romaji: 'Genkin',
    esPhonetic: 'Guén-kin',
    usualForm: 'Kanji',
    mnemonic: 'En mercados callejeros y templos "¿QUIÉN (GEN-KIN) paga? ¡El efectivo!".',
    writingNote: 'Si ves un cartel que dice 現金のみ (Genkin nomi) significa "Solo se acepta efectivo (no tarjetas)".',
    svgType: 'yen'
  },
  {
    id: 'vw-nimotsu',
    level: 'nivel-2',
    category: 'objetos',
    es: 'Equipaje / Maletas',
    kanji: '荷物',
    hiragana: 'にもつ',
    katakana: 'ニモツ',
    romaji: 'Nimotsu',
    esPhonetic: 'Ni-mó-tzu',
    usualForm: 'Kanji',
    mnemonic: 'Tus maletas pesan tanto que dices: "NI MODO (NI-MO-TSU), las dejo en una taquilla".',
    writingNote: 'Lo verás en carteles de consignas (手荷物一時預かり) y zonas de recogida de equipaje en aeropuertos.',
    svgType: 'hotel'
  },
  {
    id: 'vw-butaniku',
    level: 'nivel-2',
    category: 'comida',
    es: 'Carne de Cerdo (Tonkatsu / Ramen)',
    kanji: '豚肉',
    hiragana: 'ぶたにく',
    katakana: 'ブタニク',
    romaji: 'Butaniku',
    esPhonetic: 'Bu-tá-ni-ku',
    usualForm: 'Kanji',
    mnemonic: '"BUTA" (cerdo) + "NIKU" (carne): "¡El cerdo BU-TA-NI-KU del Tonkatsu está buenísimo!".',
    writingNote: 'El Kanji 豚 (cerdo) aparece en platos famosos como 豚骨ラーメン (Tonkotsu Ramen) y 豚丼 (Butadon).',
    svgType: 'ramen'
  },
  {
    id: 'vw-toriniku',
    level: 'nivel-2',
    category: 'comida',
    es: 'Carne de Pollo (Yakitori / Karaage)',
    kanji: '鶏肉',
    hiragana: 'とりにく',
    katakana: 'トリニク',
    romaji: 'Toriniku',
    esPhonetic: 'To-rí-ni-ku',
    usualForm: 'Kanji',
    mnemonic: '"TORI" (ave/pollo, como en Yaki-tori) + "NIKU" (carne): "¡Pollo TO-RI-NI-KU crujiente!".',
    writingNote: 'Aparece en brochetas 焼き鳥 (Yakitori) y pollo frito japonés 唐揚げ (Karaage).',
    svgType: 'ramen'
  },
  {
    id: 'vw-sakana',
    level: 'nivel-2',
    category: 'comida',
    es: 'Pescado',
    kanji: '魚 (お魚)',
    hiragana: 'さかな',
    katakana: 'サカナ',
    romaji: 'Sakana',
    esPhonetic: 'Sa-ká-na',
    usualForm: 'Kanji',
    mnemonic: 'El pescador "SACA NAda más que pescado fresco del mar (SA-KA-NA)".',
    writingNote: 'El Kanji 魚 dibuja la cabeza, las escamas del cuerpo y las cuatro aletas de la cola de un pez.',
    svgType: 'rice'
  },
  {
    id: 'vw-yasai',
    level: 'nivel-2',
    category: 'comida',
    es: 'Verduras / Vegetales',
    kanji: '野菜',
    hiragana: 'やさい',
    katakana: 'ヤサイ',
    romaji: 'Yasai',
    esPhonetic: 'Ya-sái',
    usualForm: 'Kanji',
    mnemonic: 'Cuando pides un plato saludable dices: "¡YA SABÉIS (YA-SAI) que quiero verduras frescas!".',
    writingNote: 'Muy útil si eres vegetariano o quieres pedir verduras salteadas (野菜炒め, Yasai-itame).',
    svgType: 'tea'
  },
  {
    id: 'vw-kudamono',
    level: 'nivel-2',
    category: 'comida',
    es: 'Fruta fresca',
    kanji: '果物 (フルーツ)',
    hiragana: 'くだもの',
    katakana: 'クダモノ',
    romaji: 'Kudamono',
    esPhonetic: 'Ku-dá-mo-no',
    usualForm: 'Kanji',
    mnemonic: '¿A quién le encanta la fruta en los árboles? "¡CADA MONO (KU-DA-MO-NO) come fruta!".',
    writingNote: 'En pastelerías y mercados también verás la palabra en Katakana フルーツ (Furūtsu = Fruits).',
    svgType: 'tea'
  },
  {
    id: 'vw-okashi',
    level: 'nivel-2',
    category: 'comida',
    es: 'Dulces y Snacks Japoneses',
    kanji: 'お菓子 (和菓子)',
    hiragana: 'おかし',
    katakana: 'オカシ',
    romaji: 'O-kashi',
    esPhonetic: 'O-ká-shi',
    usualForm: 'Kanji',
    mnemonic: 'Entras a un pasillo de dulces en Japón y dices: "¡OH, CASI (O-KA-SHI) me compro toda la tienda!".',
    writingNote: 'Los dulces tradicionales japoneses que acompañan al té Matcha se llaman 和菓子 (Wagashi).',
    svgType: 'rice'
  },
  {
    id: 'vw-kaisatsu',
    level: 'nivel-2',
    category: 'transporte',
    es: 'Tornos de acceso al tren (Kaisatsu)',
    kanji: '改札口 (改札)',
    hiragana: 'かいさつぐち',
    katakana: 'カイサツグチ',
    romaji: 'Kaisatsu-guchi',
    esPhonetic: 'Kai-sá-tzu-gu-chi',
    usualForm: 'Kanji',
    mnemonic: 'Donde pasas tu tarjeta Suica al entrar o salir del andén: "¡Casi SALen todos por el KAI-SATSU!".',
    writingNote: 'Los japoneses siempre quedan en las estaciones diciendo "Nos vemos frente al 改札口 (tornos)".',
    svgType: 'station'
  },
  {
    id: 'vw-tokkyu',
    level: 'nivel-2',
    category: 'transporte',
    es: 'Tren Expreso Limitado (Limited Express)',
    kanji: '特急',
    hiragana: 'とっきゅう',
    katakana: 'トッキュウ',
    romaji: 'Tokkyū',
    esPhonetic: 'Tók-kyuu',
    usualForm: 'Kanji',
    mnemonic: 'Un tren rápido directo a "¡TOKIO (TOK-KYŪ) sin parar en estaciones pequeñas!".',
    writingNote: 'Trenes como el Narita Express o Haruka son 特急 (Tokkyū) y suelen requerir un suplemento de velocidad.',
    svgType: 'train'
  },
  {
    id: 'vw-ichiba',
    level: 'nivel-2',
    category: 'lugares',
    es: 'Mercado Tradicional (Tsukiji / Nishiki)',
    kanji: '市場',
    hiragana: 'いちば',
    katakana: 'イチバ',
    romaji: 'Ichiba',
    esPhonetic: 'I-chí-ba',
    usualForm: 'Kanji',
    mnemonic: 'En el mercado callejero pruebas pinchos tan ricos que dices: "¡Y CHIVA (I-CHI-BA) de alegría mi paladar!".',
    writingNote: 'Lo verás en mercados gastronómicos famosos como 築地場外市場 (Tsukiji) en Tokio o 錦市場 (Nishiki Ichiba) en Kioto.',
    svgType: 'konbini'
  },
  {
    id: 'vw-shiro',
    level: 'nivel-2',
    category: 'lugares',
    es: 'Castillo Japonés (Samurái)',
    kanji: 'お城 (城)',
    hiragana: 'おしろ',
    katakana: 'オシロ',
    romaji: 'O-shiro',
    esPhonetic: 'O-shí-ro',
    usualForm: 'Kanji',
    mnemonic: 'Curiosamente "SHIRO" significa tanto "Castillo" (城) como "Blanco" (白), ¡como el famoso Castillo Blanco de Himeji!',
    writingNote: 'Unido al nombre de una ciudad se lee "-jō": 大阪城 (Ōsaka-jō = Castillo de Osaka), 姫路城 (Himeji-jō).',
    svgType: 'torii'
  },
  {
    id: 'vw-koin-rokka',
    level: 'nivel-2',
    category: 'objetos',
    es: 'Taquilla Guardamaletas (Coin Locker)',
    kanji: 'コインロッカー',
    hiragana: 'こいんろっかー',
    katakana: 'コインロッカー',
    romaji: 'Koin-rokkā',
    esPhonetic: 'Kó-in rók-kaa',
    usualForm: 'Katakana',
    mnemonic: 'Viene del inglés "COIN LOCKER" (taquilla de monedas): "KOIN ROKKĀ".',
    writingNote: 'En todas las estaciones de Japón hay pasillos de コインロッカー donde puedes pagar con monedas o con tu tarjeta Suica.',
    svgType: 'hotel'
  },
  {
    id: 'vw-atm',
    level: 'nivel-2',
    category: 'objetos',
    es: 'Cajero Automático (Sacar Yenes)',
    kanji: 'ATM (現金自動預払機)',
    hiragana: 'えーてぃーえむ',
    katakana: 'エーティーエム',
    romaji: 'Ē-tī-emu (ATM)',
    esPhonetic: 'Ée-tíi-e-mu',
    usualForm: 'Katakana',
    mnemonic: 'Las siglas internacionales "A-T-M" pronunciadas a la japonesa: "Ē-TĪ-EMU".',
    writingNote: 'Los cajeros ATM de 7-Eleven (Seven Bank) y oficinas de correos (JP Post) aceptan tarjetas extranjeras las 24 horas.',
    svgType: 'yen'
  },

  // =========================================================================
  // NIVEL 3 · AVANZADO (20 Palabras de Experiencias Tradicionales y Emergencias)
  // =========================================================================
  {
    id: 'vw-onsen',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Aguas Termales (Onsen)',
    kanji: '温泉',
    hiragana: 'おんせん',
    katakana: 'オンセン',
    romaji: 'Onsen',
    esPhonetic: 'Ón-sen',
    usualForm: 'Kanji',
    mnemonic: 'Once amigos relajándose en el agua caliente del volcán: "¡Qué relax en el ON-SEN!".',
    writingNote: 'Literalmente 温 (cálido) + 泉 (manantial). En los mapas se identifica con el símbolo humeante ♨️.',
    svgType: 'water'
  },
  {
    id: 'vw-ryokan',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Posada Tradicional Japonesa',
    kanji: '旅館',
    hiragana: 'りょかん',
    katakana: 'リョカン',
    romaji: 'Ryokan',
    esPhonetic: 'Ryó-kan',
    usualForm: 'Kanji',
    mnemonic: 'Duermes en tatami junto a un "RÍO con CANto de pájaros (RYO-KAN)".',
    writingNote: 'Unión de 旅 (viaje) + 館 (mansión/edificio). Incluye suelo de tatami, futón y cena tradicional Kaiseki.',
    svgType: 'hotel'
  },
  {
    id: 'vw-omiyage',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Recuerdo / Souvenir de Viaje',
    kanji: 'お土産',
    hiragana: 'おみやげ',
    katakana: 'オミヤゲ',
    romaji: 'O-miyage',
    esPhonetic: 'O-mi-yá-gue',
    usualForm: 'Kanji',
    mnemonic: 'Compras dulces típicos y dices: "¡OH, MI YAGUE (O-MI-YA-GE) de regalos para la familia!".',
    writingNote: 'En Japón los souvenirs suelen ser cajas de dulces regionales bellamente envueltas que se venden en las estaciones.',
    svgType: 'ticket'
  },
  {
    id: 'vw-yakkyoku',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Farmacia / Droguería (Kusuri)',
    kanji: '薬局 (薬)',
    hiragana: 'やっきょく (くすり)',
    katakana: 'ヤッキョク',
    romaji: 'Yakkyoku (Kusuri = medicina)',
    esPhonetic: 'Yák-kyo-ku / Ku-sú-ri',
    usualForm: 'Kanji',
    mnemonic: 'El Kanji grande 薬 (Kusuri = medicina) en los letreros de Matsumoto Kiyoshi te indica que "CURA" cualquier dolor.',
    writingNote: 'En las calles de Japón verás enormes carteles amarillos con el carácter 薬 (Kusuri = medicamento) en todas las droguerías.',
    svgType: 'konbini'
  },
  {
    id: 'vw-koban',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Puesto de Policía Vecinal (Koban)',
    kanji: '交番',
    hiragana: 'こうばん',
    katakana: 'コウバン',
    romaji: 'Kōban',
    esPhonetic: 'Kóo-ban',
    usualForm: 'Kanji',
    mnemonic: 'Los policías del barrio que "COoperan y VAN (KŌ-BAN)" a ayudarte si pierdes el pasaporte o la cartera.',
    writingNote: 'En cada estación y cruce importante hay un pequeño puesto policial 交番. Son famosos por devolver objetos perdidos.',
    svgType: 'station'
  },
  {
    id: 'vw-yoyaku',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Reserva (Restaurante / Hotel / Tren)',
    kanji: '予約',
    hiragana: 'よやく',
    katakana: 'ヨヤク',
    romaji: 'Yoyaku',
    esPhonetic: 'Yo-yá-ku',
    usualForm: 'Kanji',
    mnemonic: '"¡YO YA CUmplí (YO-YA-KU) con reservar mesa antes del viaje!".',
    writingNote: 'Si en la puerta de un restaurante ves 予約のみ (Yoyaku nomi) o 満席 (Manseki = lleno), significa que solo entran con reserva.',
    svgType: 'ticket'
  },
  {
    id: 'vw-pasupoto',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Pasaporte (Para Tax-Free y Hoteles)',
    kanji: '旅券 (en documentos oficiales)',
    hiragana: 'ぱすぽーと',
    katakana: 'パスポート',
    romaji: 'Pasupōto',
    esPhonetic: 'Pa-su-póo-to',
    usualForm: 'Katakana',
    mnemonic: 'Viene del inglés "PASSPORT" pronunciado sílaba por sílaba: "PA-SU-PŌ-TO".',
    writingNote: 'Por ley en Japón debes llevar siempre tu pasaporte original contigo para el Tax-Free (免税) y el check-in.',
    svgType: 'ticket'
  },
  {
    id: 'vw-bento',
    level: 'nivel-3',
    category: 'comida',
    es: 'Bandeja de Comida para Viaje (Bento)',
    kanji: 'お弁当 (駅弁 Ekiben)',
    hiragana: 'おべんとう',
    katakana: 'オベントウ',
    romaji: 'O-bentō',
    esPhonetic: 'O-bén-too',
    usualForm: 'Kanji',
    mnemonic: '"¡OH, VEN TOdo listo en esta caja de comida (O-BEN-TŌ) para comer en el Shinkansen!".',
    writingNote: 'En las estaciones de tren bala venden los famosos 駅弁 (Ekiben = Bento de estación) con especialidades de cada región.',
    svgType: 'rice'
  },
  {
    id: 'vw-izakaya',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Taberna Japonesa de Tapas (Izakaya)',
    kanji: '居酒屋',
    hiragana: 'いざかや',
    katakana: 'イザカヤ',
    romaji: 'Izakaya',
    esPhonetic: 'I-dza-ká-ya',
    usualForm: 'Kanji',
    mnemonic: 'Un bar tradicional con farolillos rojos donde dices: "¡Y SACA YA (I-ZA-KA-YA) unas tapas y cervezas!".',
    writingNote: 'Literalmente 居 (quedarse) + 酒 (alcohol/sake) + 屋 (tienda). Ideales para cenar compartiendo pequeños platos.',
    svgType: 'beer'
  },
  {
    id: 'vw-wagyu',
    level: 'nivel-3',
    category: 'comida',
    es: 'Carne Wagyu / Parrilla Yakiniku',
    kanji: '和牛 (焼肉)',
    hiragana: 'わぎゅう (やきにく)',
    katakana: 'ワギュウ',
    romaji: 'Wagyū (Yakiniku)',
    esPhonetic: 'Uá-guiuu / Ya-ki-ní-ku',
    usualForm: 'Kanji',
    mnemonic: '"WA" (armonía / Japón) + "GYŪ" (res): "¡GUAU (WA-GYŪ), qué tierna es la carne japonesa!".',
    writingNote: 'En restaurantes de parrilla en tu propia mesa verás el cartel 焼肉 (Yakiniku = carne asada).',
    svgType: 'ramen'
  },
  {
    id: 'vw-nihonshu',
    level: 'nivel-3',
    category: 'comida',
    es: 'Sake Tradicional de Arroz (Nihonshu)',
    kanji: '日本酒 (お酒)',
    hiragana: 'にほんしゅ (おさけ)',
    katakana: 'ニホンシュ',
    romaji: 'Nihonshu (O-sake)',
    esPhonetic: 'Ni-jón-shu / O-sá-ke',
    usualForm: 'Kanji',
    mnemonic: 'En Japón "Sake" significa alcohol en general; para pedir licor de arroz di "NIHON-SHU" (licor de Nihon/Japón).',
    writingNote: 'Puede servirse frío (冷酒, Reishu) o templado en jarrita de cerámica (熱燗, Atsukan).',
    svgType: 'beer'
  },
  {
    id: 'vw-arerugi',
    level: 'nivel-3',
    category: 'comida',
    es: 'Alergia Alimentaria',
    kanji: 'アレルギー (Sin Kanji)',
    hiragana: 'あれるぎー',
    katakana: 'アレルギー',
    romaji: 'Arerugī',
    esPhonetic: 'A-re-ru-guíi',
    usualForm: 'Katakana',
    mnemonic: 'Viene del alemán/inglés "ALLERGIE" pronunciado con R suave y G suave: "A-RE-RU-GĪ".',
    writingNote: 'Si tienes alergia a algún ingrediente, muestra el nombre del alimento + アレルギーがあります (Tengo alergia).',
    svgType: 'water'
  },
  {
    id: 'vw-norikae',
    level: 'nivel-3',
    category: 'transporte',
    es: 'Transbordo de Línea de Tren',
    kanji: '乗り換え (乗換)',
    hiragana: 'のりかえ',
    katakana: 'ノリカエ',
    romaji: 'Norikae',
    esPhonetic: 'No-ri-ká-e',
    usualForm: 'Kanji',
    mnemonic: '"NORI" (subir) + "KAE" (cambiar): "¡Cambia de tren sin que se te CAIGA (NORI-KAE) el billete!".',
    writingNote: 'En las pantallas del metro y tren verás el cartel 乗換案内 (Norikae annai = Información de transbordos).',
    svgType: 'train'
  },
  {
    id: 'vw-shiteiseki',
    level: 'nivel-3',
    category: 'transporte',
    es: 'Asiento Reservado (Shinkansen)',
    kanji: '指定席',
    hiragana: 'していせき',
    katakana: 'シテイセキ',
    romaji: 'Shiteiseki',
    esPhonetic: 'Shi-téi-se-ki',
    usualForm: 'Kanji',
    mnemonic: '"¡SÍ TENGO (SHI-TEI) mi asiento (SEKI) numerado y reservado en el tren bala!".',
    writingNote: 'En los andenes del Shinkansen mira el cartel electrónico de cada vagón: 指定席 indica vagones con asiento asignado.',
    svgType: 'ticket'
  },
  {
    id: 'vw-jiyuseki',
    level: 'nivel-3',
    category: 'transporte',
    es: 'Asiento Libre sin Reserva',
    kanji: '自由席',
    hiragana: 'じゆうせき',
    katakana: 'ジユウセキ',
    romaji: 'Jiyūseki',
    esPhonetic: 'Yi-yúu-se-ki',
    usualForm: 'Kanji',
    mnemonic: '"JIYŪ" (libertad) + "SEKI" (asiento): te sientas libremente por orden de llegada en los vagones 1 a 3.',
    writingNote: 'Suelen ser los primeros vagones del Shinkansen (vagones 1, 2 y 3). Si vas con maletas grandes, es mejor reservar 指定席.',
    svgType: 'ticket'
  },
  {
    id: 'vw-byoin',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Hospital / Clínica Médica',
    kanji: '病院',
    hiragana: 'びょういん',
    katakana: 'ビョウイン',
    romaji: 'Byōin',
    esPhonetic: 'Byóo-in (con o larga)',
    usualForm: 'Kanji',
    mnemonic: 'En el hospital te atienden tan bien que sales diciendo: "¡Ya me encuentro BIEN (BYŌ-IN)!".',
    writingNote: 'Pronuncia la "o" larga (Byōin = 病院), porque con "o" corta (Byōin = 美容院, Biyōin) significa salón de belleza.',
    svgType: 'hotel'
  },
  {
    id: 'vw-taishikan',
    level: 'nivel-3',
    category: 'lugares',
    es: 'Embajada / Consulado',
    kanji: '大使館',
    hiragana: 'たいしかん',
    katakana: 'タイシカン',
    romaji: 'Taishikan',
    esPhonetic: 'Tai-shí-kan',
    usualForm: 'Kanji',
    mnemonic: 'Un edificio oficial tan importante que dices: "¡Ahí están los embajadores (TAI-SHI-KAN)!".',
    writingNote: 'Si pierdes tu pasaporte, primero pide un justificante en el 交番 (Kōban) y luego acude a tu 大使館 (Embajada).',
    svgType: 'hotel'
  },
  {
    id: 'vw-menzei',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Libre de Impuestos (Tax-Free -10%)',
    kanji: '免税 (Tax-Free)',
    hiragana: 'めんぜい',
    katakana: 'メンゼイ',
    romaji: 'Menzei',
    esPhonetic: 'Mén-dzei',
    usualForm: 'Kanji',
    mnemonic: 'Compras electrónica o recuerdos y te descuentan el 10% de impuestos: "¡MENos impuestos (MEN-ZEI)!".',
    writingNote: 'Busca los mostradores con el cartel rojo 免税カウンター (Menzei kauntā) en compras superiores a 5.500 yenes.',
    svgType: 'yen'
  },
  {
    id: 'vw-judenki',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Cargador de Móvil / Batería',
    kanji: '充電器 (コンセント = Enchufe)',
    hiragana: 'じゅうでんき',
    katakana: 'ジュウデンキ',
    romaji: 'Jūdenki (Konsento = enchufe)',
    esPhonetic: 'Yúu-den-ki / Kon-sén-to',
    usualForm: 'Kanji',
    mnemonic: '"JŪDEN" (cargar) + "KI" (aparato): vital cuando te quedas sin batería usando Google Maps en Tokio.',
    writingNote: 'En Japón el enchufe de pared se llama コンセント (Konsento) y usa clavijas planas tipo A (100V).',
    svgType: 'konbini'
  },
  {
    id: 'vw-gomibako',
    level: 'nivel-3',
    category: 'objetos',
    es: 'Papelera / Cubo de Basura',
    kanji: 'ゴミ箱',
    hiragana: 'ごみばこ',
    katakana: 'ゴミバコ',
    romaji: 'Gomibako',
    esPhonetic: 'Go-mi-bá-ko',
    usualForm: 'Kanji',
    mnemonic: '"GOMI" (basura, como cuando tiras una GOMA de mascar) + "BAKO" (caja): "¡Dónde hay un GO-MI-BA-KO!".',
    writingNote: 'En las calles de Japón apenas hay papeleras públicas; encontrarás ゴミ箱 junto a las máquinas de bebidas o dentro del Konbini.',
    svgType: 'konbini'
  }
];

export interface GrammarSlotOption {
  id: string;
  jp: string;
  kana: string;
  romaji: string;
  esPhonetic: string;
  es: string;
  particleTag: string;
  roleNote: string;
  groupTag?: string; // Para compatibilidad semántica entre bloques
}

export interface GrammarFormulaTemplate {
  id: string;
  titleEs: string;
  structureFormula: string;
  grammarRule: string;
  slot1Label: string;
  slot2Label: string;
  slot3Label: string;
  slot1Options: GrammarSlotOption[];
  slot2Options: GrammarSlotOption[];
  slot3Options: GrammarSlotOption[];
}

export interface GrammarScrambleChallenge {
  id: string;
  promptEs: string;
  hintGrammar: string;
  blocks: {
    jp: string;
    romaji: string;
    esPhonetic: string;
    role: string;
  }[];
  fullJp: string;
  fullPhonetic: string;
  explanation: string;
}

export interface GrammarLevelData {
  id: 'intro' | 'nivel-1' | 'nivel-2' | 'nivel-3';
  badge: string;
  shortTitle: string;
  title: string;
  subtitle: string;
  grammarFocus: string[];
  targetMasteryCount: number;
  templates: GrammarFormulaTemplate[];
  challenges: GrammarScrambleChallenge[];
}

export const GRAMMAR_BUILDER_LEVELS: GrammarLevelData[] = [
  {
    id: 'intro',
    badge: 'Nivel 0 · Introductorio',
    shortTitle: '0 · Introductorio',
    title: 'Nivel Introductorio: Supervivencia Instantánea (2 Bloques)',
    subtitle: 'Tu primer contacto: une una palabra clave con una pregunta o petición directa. En japonés el verbo o pregunta va siempre al final.',
    grammarFocus: ['Orden Sustantivo + Final', 'Partícula は (wa)', 'Partícula を (o)', 'Pregunta con か (ka)'],
    targetMasteryCount: 4,
    templates: [],
    challenges: [
      {
        id: 'ch-intro-1',
        promptEs: '¿Dónde está la estación de tren?',
        hintGrammar: 'Primero el lugar (Estación) + partícula de tema (wa) + dónde está (doko desu ka)',
        blocks: [
          { jp: '駅', romaji: 'Eki', esPhonetic: 'É-ki', role: 'Sustantivo (Estación)' },
          { jp: 'は', romaji: 'wa', esPhonetic: 'ua', role: 'Partícula de Tópico' },
          { jp: 'どこですか？', romaji: 'doko desu ka?', esPhonetic: 'dó-ko des-ká', role: 'Pregunta (¿Dónde está?)' }
        ],
        fullJp: '駅はどこですか？',
        fullPhonetic: 'É-ki ua dó-ko des-ká',
        explanation: 'は (wa) marca de qué hablamos (la estación) y どこですか pregunta su ubicación.'
      },
      {
        id: 'ch-intro-2',
        promptEs: 'Me da un ramen, por favor',
        hintGrammar: 'Primero el objeto (Ramen) + partícula de objeto directo (o) + deme por favor (kudasai)',
        blocks: [
          { jp: 'ラーメン', romaji: 'Rāmen', esPhonetic: 'Ráa-men', role: 'Objeto (Ramen)' },
          { jp: 'を', romaji: 'o', esPhonetic: 'o', role: 'Partícula de Objeto' },
          { jp: 'ください', romaji: 'kudasai', esPhonetic: 'ku-da-sái', role: 'Petición (Deme por favor)' }
        ],
        fullJp: 'ラーメンをください',
        fullPhonetic: 'Ráa-men o ku-da-sái',
        explanation: 'を (o) conecta cualquier cosa que quieras pedir con ください (kudasai).'
      },
      {
        id: 'ch-intro-3',
        promptEs: '¿Cuánto cuesta esto?',
        hintGrammar: 'Primero "Esto" (Kore) + partícula de tema (wa) + cuánto es (ikura desu ka)',
        blocks: [
          { jp: 'これ', romaji: 'Kore', esPhonetic: 'Kó-re', role: 'Pronombre (Esto)' },
          { jp: 'は', romaji: 'wa', esPhonetic: 'ua', role: 'Partícula de Tópico' },
          { jp: 'いくらですか？', romaji: 'ikura desu ka?', esPhonetic: 'í-ku-ra des-ká', role: 'Pregunta de precio' }
        ],
        fullJp: 'これはいくらですか？',
        fullPhonetic: 'Kó-re ua í-ku-ra des-ká',
        explanation: 'これ (Kore = esto) + は (wa) + いくらですか (¿cuánto cuesta?).'
      }
    ]
  },
  {
    id: 'nivel-1',
    badge: 'Nivel 1 · Cantidades, Posesión y Adjetivos',
    shortTitle: '1 · Nivel 1 (Básico)',
    title: 'Nivel 1: Oraciones con Contadores, Adjetivos y Partícula の',
    subtitle: 'Pasa de frases sueltas a oraciones de 3 bloques: pide cantidades exactas en restaurantes, describe cosas con adjetivos (afirmativo/negativo) y conecta sustantivos con の.',
    grammarFocus: ['Contadores (ひとつ, ふたつ, みっつ)', 'Adjetivos + です / じゃないです', 'Conector posesivo の (no)'],
    targetMasteryCount: 5,
    templates: [
      {
        id: 'n1-cantidades',
        titleEs: '1A · Pedir Cantidades Exactas (Sustantivo + を + Contador + ください)',
        structureFormula: '[Objeto] + を (o) + [Cantidad / Contador] + [Verbo de petición]',
        grammarRule: 'En japonés la cantidad va DESPUÉS de la partícula を (o) y justo antes del verbo ください. ¡Usa ひとつ (1), ふたつ (2) o みっつ (3) para cualquier plato u objeto!',
        slot1Label: 'Bloque 1 · Objeto + Partícula を',
        slot2Label: 'Bloque 2 · Contador Universal / Personas',
        slot3Label: 'Bloque 3 · Cierre Cortés de la Oración',
        slot1Options: [
          { id: 's1-ramen', jp: 'ラーメンを', kana: 'らーめんを', romaji: 'Rāmen o', esPhonetic: 'Ráa-men o', es: 'Ramen', particleTag: 'を (Objeto)', roleNote: 'Sustantivo + を (marca lo que pides)' },
          { id: 's1-biiru', jp: 'ビールを', kana: 'びーるを', romaji: 'Bīru o', esPhonetic: 'Bíi-ru o', es: 'Cerveza', particleTag: 'を (Objeto)', roleNote: 'Sustantivo + を (objeto directo)' },
          { id: 's1-mizu', jp: 'お水を', kana: 'おみずを', romaji: 'O-mizu o', esPhonetic: 'O-mí-dzu o', es: 'Vasos de agua', particleTag: 'を (Objeto)', roleNote: 'Prefijo cortés お + 水 + を' },
          { id: 's1-kippu', jp: '切符を', kana: 'きっぷを', romaji: 'Kippu o', esPhonetic: 'Kíp-pu o', es: 'Billetes de tren', particleTag: 'を (Objeto)', roleNote: 'Sustantivo + を (objeto directo)' }
        ],
        slot2Options: [
          { id: 's2-hitotsu', jp: 'ひとつ', kana: 'ひとつ', romaji: 'hitotsu', esPhonetic: 'ji-tó-tzu', es: '1 unidad (uno)', particleTag: 'Contador (1)', roleNote: 'Contador universal para 1 cosa' },
          { id: 's2-futatsu', jp: 'ふたつ', kana: 'ふたつ', romaji: 'futatsu', esPhonetic: 'fu-tá-tzu', es: '2 unidades (dos)', particleTag: 'Contador (2)', roleNote: 'Contador universal para 2 cosas' },
          { id: 's2-mittsu', jp: 'みっつ', kana: 'みっつ', romaji: 'mittsu', esPhonetic: 'mít-tzu', es: '3 unidades (tres)', particleTag: 'Contador (3)', roleNote: 'Contador universal para 3 cosas' },
          { id: 's2-mouhitotsu', jp: 'もうひとつ', kana: 'もうひとつ', romaji: 'mō hitotsu', esPhonetic: 'móo ji-tó-tzu', es: '1 más (otro más)', particleTag: 'Adverbio + Contador', roleNote: 'もう (mō = más/otro) + ひとつ (uno)' }
        ],
        slot3Options: [
          { id: 's3-kudasai', jp: 'ください', kana: 'ください', romaji: 'kudasai', esPhonetic: 'ku-da-sái', es: 'me da, por favor', particleTag: 'Imperativo cortés', roleNote: 'Petición directa educada' },
          { id: 's3-onegai', jp: 'お願いします', kana: 'おねがいします', romaji: 'onegaishimasu', esPhonetic: 'o-ne-gai-shi-más', es: 'encargo, por favor (más formal)', particleTag: 'Fórmula honorífica', roleNote: 'Petición muy educada en restaurantes' }
        ]
      },
      {
        id: 'n1-adjetivos',
        titleEs: '1B · Describir y Preguntar Cualidades (Tópico は + Adjetivo + です / ですか)',
        structureFormula: '[Sujeto / Lugar] + は (wa) + [Adjetivo] + [Afirmación / Negación / Pregunta]',
        grammarRule: 'Para describir algo, colocas el tema con は (wa), luego el adjetivo (como おいしい = rico, o 高い = caro) y cierras con です (es), ですか？ (¿es?) o とても (muy).',
        slot1Label: 'Bloque 1 · Sujeto / Tópico con は',
        slot2Label: 'Bloque 2 · Adjetivo Calificativo',
        slot3Label: 'Bloque 3 · Verbo Copulativo (Ser / Estar)',
        slot1Options: [
          { id: 'adj1-kono-ramen', jp: 'このラーメンは', kana: 'このらーめんは', romaji: 'Kono rāmen wa', esPhonetic: 'Kó-no ráa-men ua', es: 'Este ramen', particleTag: 'この + Tópico は', roleNote: 'この (este) + Sustantivo + は' },
          { id: 'adj1-kyoto', jp: '京都は', kana: 'きょうとは', romaji: 'Kyōto wa', esPhonetic: 'Kyóo-to ua', es: 'Kioto', particleTag: 'Tópico は', roleNote: 'Ciudad + partícula de tema は' },
          { id: 'adj1-hoteru', jp: 'このホテルは', kana: 'このほてるは', romaji: 'Kono hoteru wa', esPhonetic: 'Kó-no jo-té-ru ua', es: 'Este hotel', particleTag: 'この + Tópico は', roleNote: 'Demostrativo + Hotel + は' },
          { id: 'adj1-kore', jp: 'これは', kana: 'これは', romaji: 'Kore wa', esPhonetic: 'Kó-re ua', es: 'Esto', particleTag: 'Pronombre + は', roleNote: 'Pronombre demostrativo + は' }
        ],
        slot2Options: [
          { id: 'adj2-oishii', jp: 'とてもおいしい', kana: 'とてもおいしい', romaji: 'totemo oishii', esPhonetic: 'to-té-mo oi-shíi', es: 'muy delicioso', particleTag: 'Adjetivo -i', roleNote: 'とても (muy) + おいしい (delicioso)' },
          { id: 'adj2-takai', jp: 'ちょっと高い', kana: 'ちょっとたかい', romaji: 'chotto takai', esPhonetic: 'chót-to ta-kái', es: 'un poco caro', particleTag: 'Adjetivo -i', roleNote: 'ちょっと (un poco) + 高い (caro/alto)' },
          { id: 'adj2-kirei', jp: 'きれい', kana: 'きれい', romaji: 'kirei', esPhonetic: 'kí-rei', es: 'bonito / limpio', particleTag: 'Adjetivo -na', roleNote: 'Adjetivo de belleza o limpieza' },
          { id: 'adj2-benri', jp: '便利 (べんり)', kana: 'べんり', romaji: 'benri', esPhonetic: 'bén-ri', es: 'práctico / bien ubicado', particleTag: 'Adjetivo -na', roleNote: 'Muy usado para transporte y hoteles' }
        ],
        slot3Options: [
          { id: 'adj3-desu', jp: 'です', kana: 'です', romaji: 'desu', esPhonetic: 'des', es: '(Afirmación: Es / Está)', particleTag: 'Cópula Afirmativa', roleNote: 'Equivale a "es / está" cortés' },
          { id: 'adj3-desuka', jp: 'ですか？', kana: 'ですか？', romaji: 'desu ka?', esPhonetic: 'des-ká', es: '(Pregunta: ¿Es / Está...?)', particleTag: 'Cópula Interrogativa', roleNote: 'Añadir か convierte la frase en pregunta' },
          { id: 'adj3-desune', jp: 'ですね！', kana: 'ですね！', romaji: 'desu ne!', esPhonetic: 'des-né', es: '(Empatía: ¡Verdad que sí!)', particleTag: 'Partícula ね (ne)', roleNote: 'ね busca acuerdo amigable ("¿verdad?")' }
        ]
      },
      {
        id: 'n1-posesion-no',
        titleEs: '1C · Conectar Sustantivos con の (Especificar Lugares y Pertenencia)',
        structureFormula: '[Sustantivo Principal] + の (no) + [Parte / Lugar Específico] + [Pregunta]',
        grammarRule: 'La partícula の (no) funciona al revés que el "de" español: primero dices el lugar grande o dueño (ej. Estación / Hotel) + の + lo específico que buscas (Salida / Wi-Fi / Baño).',
        slot1Label: 'Bloque 1 · Lugar Principal + Partícula の',
        slot2Label: 'Bloque 2 · Elemento Específico + は',
        slot3Label: 'Bloque 3 · Pregunta Final',
        slot1Options: [
          { id: 'no1-eki', jp: '駅の', kana: 'えきの', romaji: 'Eki no', esPhonetic: 'É-ki no', es: 'De la estación', particleTag: 'Posesivo の', roleNote: '駅 (estación) + の (de)' },
          { id: 'no1-hoteru', jp: 'ホテルの', kana: 'ほてるの', romaji: 'Hoteru no', esPhonetic: 'Jo-té-ru no', es: 'Del hotel', particleTag: 'Posesivo の', roleNote: 'ホテル (hotel) + の (de)' },
          { id: 'no1-shinkansen', jp: '新幹線の', kana: 'しんかんせんの', romaji: 'Shinkansen no', esPhonetic: 'Shin-kan-sén no', es: 'Del Shinkansen', particleTag: 'Posesivo の', roleNote: '新幹線 (tren bala) + の (de)' }
        ],
        slot2Options: [
          { id: 'no2-deguchi', jp: '出口は', kana: 'でぐちは', romaji: 'deguchi wa', esPhonetic: 'dé-gu-chi ua', es: 'la salida', particleTag: 'Núcleo + は', roleNote: '出口 (salida) + tópico は' },
          { id: 'no2-noriba', jp: '乗り場は', kana: 'のりばは', romaji: 'noriba wa', esPhonetic: 'no-rí-ba ua', es: 'el andén / parada', particleTag: 'Núcleo + は', roleNote: '乗り場 (zona de abordar) + は' },
          { id: 'no2-wifi', jp: 'Wi-Fiのパスワードは', kana: 'わいふぁいのぱすわーどは', romaji: 'Waifai no pasuwādo wa', esPhonetic: 'Uái-fai no pa-su-uáa-do ua', es: 'la contraseña del Wi-Fi', particleTag: 'Doble の + は', roleNote: 'Cadena de sustantivos con の' }
        ],
        slot3Options: [
          { id: 'no3-doko', jp: 'どこですか？', kana: 'どこですか？', romaji: 'doko desu ka?', esPhonetic: 'dó-ko des-ká', es: '¿dónde está?', particleTag: 'Ubicación', roleNote: 'Pregunta por el lugar' },
          { id: 'no3-nan', jp: '何ですか？', kana: 'なんですか？', romaji: 'nan desu ka?', esPhonetic: 'nán des-ká', es: '¿cuál es / qué es?', particleTag: 'Identificación', roleNote: '何 (nan = qué / cuál) + ですか' }
        ]
      }
    ],
    challenges: [
      {
        id: 'ch-n1-1',
        promptEs: 'Me da dos cervezas, por favor',
        hintGrammar: 'Objeto con を (Bīru o) + Contador de 2 unidades (futatsu) + Petición (kudasai)',
        blocks: [
          { jp: 'ビールを', romaji: 'Bīru o', esPhonetic: 'Bíi-ru o', role: 'Objeto + を' },
          { jp: 'ふたつ', romaji: 'futatsu', esPhonetic: 'fu-tá-tzu', role: 'Contador (2 unidades)' },
          { jp: 'ください', romaji: 'kudasai', esPhonetic: 'ku-da-sái', role: 'Verbo (Deme por favor)' }
        ],
        fullJp: 'ビールをふたつください',
        fullPhonetic: 'Bíi-ru o fu-tá-tzu ku-da-sái',
        explanation: 'En japonés el número o contador (ふたつ = 2) se coloca después de を y antes de ください.'
      },
      {
        id: 'ch-n1-2',
        promptEs: '¡Este ramen está muy delicioso!',
        hintGrammar: 'Tópico (Kono rāmen wa) + Adverbio y Adjetivo (totemo oishii) + Cópula (desu)',
        blocks: [
          { jp: 'このラーメンは', romaji: 'Kono rāmen wa', esPhonetic: 'Kó-no ráa-men ua', role: 'Sujeto con は' },
          { jp: 'とてもおいしい', romaji: 'totemo oishii', esPhonetic: 'to-té-mo oi-shíi', role: 'Adverbio + Adjetivo' },
          { jp: 'です', romaji: 'desu', esPhonetic: 'des', role: 'Cópula cortés' }
        ],
        fullJp: 'このラーメンはとてもおいしいです',
        fullPhonetic: 'Kó-no ráa-men ua to-té-mo oi-shíi des',
        explanation: 'この (este) + ラーメンは (ramen) + とてもおいしい (muy rico) + です (es/está).'
      },
      {
        id: 'ch-n1-3',
        promptEs: '¿Dónde está el andén del Shinkansen?',
        hintGrammar: 'Lugar general + の (Shinkansen no) + Lugar específico + は (noriba wa) + Pregunta (doko desu ka)',
        blocks: [
          { jp: '新幹線の', romaji: 'Shinkansen no', esPhonetic: 'Shin-kan-sén no', role: 'Modificador con の' },
          { jp: '乗り場は', romaji: 'noriba wa', esPhonetic: 'no-rí-ba ua', role: 'Sustantivo + は' },
          { jp: 'どこですか？', romaji: 'doko desu ka?', esPhonetic: 'dó-ko des-ká', role: 'Pregunta final' }
        ],
        fullJp: '新幹線の乗り場はどこですか？',
        fullPhonetic: 'Shin-kan-sén no no-rí-ba ua dó-ko des-ká',
        explanation: 'La partícula の une 新幹線 (Shinkansen) con 乗り場 (andén de embarque).'
      }
    ]
  },
  {
    id: 'nivel-2',
    badge: 'Nivel 2 · Verbos, Transporte (で/へ) y Deseos (~たい)',
    shortTitle: '2 · Nivel 2 (Intermedio)',
    title: 'Nivel 2: Movimiento, Medios con で y Conjugación de Deseo (~たいです)',
    subtitle: 'Domina las partículas de viaje: で (en qué transporte o en qué lugar actúas), へ/に (hacia dónde vas) y conjuga verbos en presente (~ます), deseo (~たいです) o invitación (~ませんか).',
    grammarFocus: ['Partícula で (Medio / Lugar de acción)', 'Partícula へ / に (Dirección)', 'Forma ~たいです (Quiero hacer)', 'Forma ~ます / ~ませんか'],
    targetMasteryCount: 5,
    templates: [
      {
        id: 'n2-movimiento',
        titleEs: '2A · Desplazarse por Japón (Tiempo + Medio con で + Destino con へ + Verbo)',
        structureFormula: '[Tiempo / medio con で] + [Destino con へ/に] + [Verbo de Movimiento conjugado]',
        grammarRule: 'La partícula で (de) marca el MEDIO de transporte (電車で = en tren), mientras que へ (se lee "e") o に (ni) marca la DIRECCIÓN o destino (京都へ = hacia Kioto).',
        slot1Label: 'Bloque 1 · Medio de Transporte (Partícula で)',
        slot2Label: 'Bloque 2 · Destino (Partícula へ / に)',
        slot3Label: 'Bloque 3 · Verbo Conjugado (~ます / ~たいです / ~ますか)',
        slot1Options: [
          { id: 'mov1-shinkansen', jp: '新幹線で', kana: 'しんかんせんで', romaji: 'Shinkansen de', esPhonetic: 'Shin-kan-sén de', es: 'En tren bala (Shinkansen)', particleTag: 'Medio で', roleNote: 'Transporte + で (por medio de)' },
          { id: 'mov1-densha', jp: '電車で', kana: 'でんしゃで', romaji: 'Densha de', esPhonetic: 'Dén-sha de', es: 'En tren eléctrico', particleTag: 'Medio で', roleNote: '電車 (tren) + で' },
          { id: 'mov1-takushi', jp: 'タクシーで', kana: 'たくしーで', romaji: 'Takushī de', esPhonetic: 'Ta-ku-shíi de', es: 'En taxi', particleTag: 'Medio で', roleNote: 'タクシー (taxi) + で' },
          { id: 'mov1-aruite', jp: '歩いて', kana: 'あるいて', romaji: 'Aruite', esPhonetic: 'A-rúi-te', es: 'Caminando (a pie)', particleTag: 'Forma -Te', roleNote: 'Excepción: "a pie" usa la forma 歩いて sin で' }
        ],
        slot2Options: [
          { id: 'mov2-kyoto', jp: '京都へ', kana: 'きょうとへ', romaji: 'Kyōto e', esPhonetic: 'Kyóo-to e', es: 'hacia Kioto', particleTag: 'Dirección へ (e)', roleNote: 'La letra へ como partícula se lee "e"' },
          { id: 'mov2-kuko', jp: '空港に', kana: 'くうこうに', romaji: 'Kūkō ni', esPhonetic: 'Kúu-koo ni', es: 'al aeropuerto', particleTag: 'Destino に (ni)', roleNote: 'に marca el punto de llegada' },
          { id: 'mov2-hoteru', jp: 'ホテルに', kana: 'ほてるに', romaji: 'Hoteru ni', esPhonetic: 'Jo-té-ru ni', es: 'al hotel', particleTag: 'Destino に (ni)', roleNote: 'ホテル (hotel) + に' },
          { id: 'mov2-shibuya', jp: '渋谷へ', kana: 'しぶやへ', romaji: 'Shibuya e', esPhonetic: 'Shi-bú-ya e', es: 'hacia Shibuya', particleTag: 'Dirección へ (e)', roleNote: '渋谷 (Shibuya) + へ' }
        ],
        slot3Options: [
          { id: 'mov3-ikimasu', jp: '行きます', kana: 'いきます', romaji: 'ikimasu', esPhonetic: 'i-ki-más', es: 'voy / iré (afirmación)', particleTag: 'Verbo ~ます', roleNote: 'Presente/futuro cortés de 行く (ir)' },
          { id: 'mov3-ikitai', jp: '行きたいです', kana: 'いきたいです', romaji: 'ikitai desu', esPhonetic: 'i-ki-tái des', es: 'quiero ir (deseo)', particleTag: 'Deseo ~たいです', roleNote: 'Raíz 行き + たいです = Quiero ir' },
          { id: 'mov3-kaerimasu', jp: '帰ります', kana: 'かえります', romaji: 'kaerimasu', esPhonetic: 'ka-e-ri-más', es: 'regreso / vuelvo', particleTag: 'Verbo ~ます', roleNote: '帰る (volver a casa o al hotel)' }
        ]
      },
      {
        id: 'n2-acciones-lugar',
        titleEs: '2B · Acciones y Deseos en un Lugar (Lugar con で + Objeto con を + Verbo ~たい / ~ます)',
        structureFormula: '[Lugar con で] + [Objeto Directo con を] + [Verbo en forma ~たいです o ~ます]',
        grammarRule: 'Cuando realizas una acción activa (comer, comprar, ver) DENTRO de un lugar, ese lugar lleva la partícula で (de), el objeto lleva を (o), y al verbo le cambias ~ます por ~たいです para decir "¡Quiero hacerlo!".',
        slot1Label: 'Bloque 1 · Lugar donde ocurre la acción (で)',
        slot2Label: 'Bloque 2 · Objeto de la acción (を)',
        slot3Label: 'Bloque 3 · Verbo de Acción o Deseo',
        slot1Options: [
          { id: 'act1-tokyo', jp: '東京で', kana: 'とうきょうで', romaji: 'Tōkyō de', esPhonetic: 'Too-kyoo de', es: 'En Tokio', particleTag: 'Lugar de acción で', roleNote: 'Indica dónde ocurre el evento' },
          { id: 'act1-konbini', jp: 'コンビニで', kana: 'こんびにで', romaji: 'Konbini de', esPhonetic: 'Kon-bí-ni de', es: 'En el Konbini', particleTag: 'Lugar de acción で', roleNote: 'Tienda 24h + で' },
          { id: 'act1-koko', jp: 'ここで', kana: 'ここで', romaji: 'Koko de', esPhonetic: 'Kó-ko de', es: 'Aquí (en este lugar)', particleTag: 'Lugar de acción で', roleNote: 'ここ (aquí) + で' }
        ],
        slot2Options: [
          { id: 'act2-sushi', jp: 'お寿司を', kana: 'おすしを', romaji: 'o-sushi o', esPhonetic: 'o-sú-shi o', es: 'sushi', particleTag: 'Objeto を', roleNote: 'Sustantivo + partícula de objeto を' },
          { id: 'act2-omiyage', jp: 'お土産を', kana: 'おみやげを', romaji: 'o-miyage o', esPhonetic: 'o-mi-yá-gue o', es: 'souvenirs / recuerdos', particleTag: 'Objeto を', roleNote: 'お土産 (regalos típicos de viaje) + を' },
          { id: 'act2-bento', jp: 'お弁当を', kana: 'おべんとうを', romaji: 'o-bentō o', esPhonetic: 'o-bén-too o', es: 'una bandeja bento', particleTag: 'Objeto を', roleNote: 'お弁当 + を' }
        ],
        slot3Options: [
          { id: 'act3-tabetai', jp: '食べたいです', kana: 'たべたいです', romaji: 'tabetai desu', esPhonetic: 'ta-be-tái des', es: 'quiero comer', particleTag: 'Deseo ~たいです', roleNote: '食べます (comer) → 食べたいです (quiero comer)' },
          { id: 'act3-kaitai', jp: '買いたいです', kana: 'かいたいです', romaji: 'kaitai desu', esPhonetic: 'kai-tái des', es: 'quiero comprar', particleTag: 'Deseo ~たいです', roleNote: '買います (comprar) → 買いたいです (quiero comprar)' },
          { id: 'act3-kaimasu', jp: '買います', kana: 'かいます', romaji: 'kaimasu', esPhonetic: 'kai-más', es: 'compro / compraré', particleTag: 'Presente ~ます', roleNote: 'Afirmación directa en presente/futuro' },
          { id: 'act3-tabemasenka', jp: '食べませんか？', kana: 'たべませんか？', romaji: 'tabemasen ka?', esPhonetic: 'ta-be-ma-sén ka', es: '¿comemos juntos? (invitación)', particleTag: 'Invitación ~ませんか', roleNote: 'Verbo negativo + か = invitación cortés' }
        ]
      }
    ],
    challenges: [
      {
        id: 'ch-n2-1',
        promptEs: 'Quiero ir hacia Kioto en tren bala (Shinkansen)',
        hintGrammar: 'Medio con で (Shinkansen de) + Destino con へ (Kyōto e) + Verbo en forma deseo (ikitai desu)',
        blocks: [
          { jp: '新幹線で', romaji: 'Shinkansen de', esPhonetic: 'Shin-kan-sén de', role: 'Medio de transporte (で)' },
          { jp: '京都へ', romaji: 'Kyōto e', esPhonetic: 'Kyóo-to e', role: 'Dirección (へ)' },
          { jp: '行きたいです', romaji: 'ikitai desu', esPhonetic: 'i-ki-tái des', role: 'Verbo deseo (~たいです)' }
        ],
        fullJp: '新幹線で京都へ行きたいです',
        fullPhonetic: 'Shin-kan-sén de Kyóo-to e i-ki-tái des',
        explanation: 'で indica el medio (en Shinkansen), へ indica la dirección (hacia Kioto) e 行きたいです expresa "quiero ir".'
      },
      {
        id: 'ch-n2-2',
        promptEs: 'Quiero comprar recuerdos (souvenirs) en Tokio',
        hintGrammar: 'Lugar de acción con で (Tōkyō de) + Objeto con を (o-miyage o) + Quiero comprar (kaitai desu)',
        blocks: [
          { jp: '東京で', romaji: 'Tōkyō de', esPhonetic: 'Too-kyoo de', role: 'Lugar de acción (で)' },
          { jp: 'お土産を', romaji: 'o-miyage o', esPhonetic: 'o-mi-yá-gue o', role: 'Objeto directo (を)' },
          { jp: '買いたいです', romaji: 'kaitai desu', esPhonetic: 'kai-tái des', role: 'Verbo deseo (Quiero comprar)' }
        ],
        fullJp: '東京でお土産を買いたいです',
        fullPhonetic: 'Too-kyoo de o-mi-yá-gue o kai-tái des',
        explanation: '東京で marca dónde compras, お土産を marca qué compras y 買いたいです es "quiero comprar".'
      },
      {
        id: 'ch-n2-3',
        promptEs: 'Regreso al hotel en taxi',
        hintGrammar: 'Medio con で (Takushī de) + Destino con に (Hoteru ni) + Verbo regresar (kaerimasu)',
        blocks: [
          { jp: 'タクシーで', romaji: 'Takushī de', esPhonetic: 'Ta-ku-shíi de', role: 'Medio (で)' },
          { jp: 'ホテルに', romaji: 'Hoteru ni', esPhonetic: 'Jo-té-ru ni', role: 'Destino (に)' },
          { jp: '帰ります', romaji: 'kaerimasu', esPhonetic: 'ka-e-ri-más', role: 'Verbo (Regreso)' }
        ],
        fullJp: 'タクシーでホテルに帰ります',
        fullPhonetic: 'Ta-ku-shíi de Jo-té-ru ni ka-e-ri-más',
        explanation: '帰ります (kaerimasu) se usa específicamente para regresar a casa o a tu hotel.'
      }
    ]
  },
  {
    id: 'nivel-3',
    badge: 'Nivel 3 · Oraciones Compuestas, Razones (から) y Permiso (~てもいい)',
    shortTitle: '3 · Nivel 3 (Avanzado)',
    title: 'Nivel 3: Oraciones Compuestas con Conectores (から / けど), Peticiones (~てください) y Permiso',
    subtitle: 'Construye oraciones completas de viajero avanzado: explica el motivo de algo con から ("porque / así que"), pide acciones específicas con la Forma Te (~てください) y solicita permiso educadamente (~てもいいですか).',
    grammarFocus: ['Conector causal から (porque / por eso)', 'Petición cortés ~てください', 'Permiso ~てもいいですか', 'Conector suave ~けど (pero...)'],
    targetMasteryCount: 5,
    templates: [
      {
        id: 'n3-causa-peticion',
        titleEs: '3A · Dar una Razón con から y Hacer una Petición (~てください)',
        structureFormula: '[Oración de Causa] + から (porque/así que) + [Adverbio / Lugar] + [Verbo en ~てください]',
        grammarRule: 'En japonés primero dices el MOTIVO seguido de から (kara = "porque / como...") y al final la petición con el verbo en Forma Te + ください (por favor haga...). ¡Es la forma más educada de pedir ayuda!',
        slot1Label: 'Bloque 1 · Causa o Motivo + Conector から',
        slot2Label: 'Bloque 2 · Modo o Complemento',
        slot3Label: 'Bloque 3 · Petición en Forma Te (~てください)',
        slot1Options: [
          { id: 'c1-nihongo', jp: '日本語がわかりませんから、', kana: 'にほんごがわかりませんから、', romaji: 'Nihongo ga wakarimasen kara,', esPhonetic: 'Ni-jón-go ga ua-ka-ri-ma-sén ka-ra,', es: 'Como no entiendo bien japonés,', particleTag: 'Causa + から', roleNote: 'わかりません (no entiendo) + から (porque/así que)' },
          { id: 'c1-kanji', jp: '漢字が読めませんから、', kana: 'かんじがよめませんから、', romaji: 'Kanji ga yomemasen kara,', esPhonetic: 'Kán-yi ga yo-me-ma-sén ka-ra,', es: 'Como no puedo leer Kanji,', particleTag: 'Potencial neg. + から', roleNote: '読めません (no puedo leer) + から' },
          { id: 'c1-michini', jp: '道に迷いましたから、', kana: 'みちにまよいいましたから、', romaji: 'Michi ni mayoimashita kara,', esPhonetic: 'Mí-chi ni ma-yoi-másh-ta ka-ra,', es: 'Como me he perdido en el camino,', particleTag: 'Pasado + から', roleNote: '道に迷いました (me perdí) + から' }
        ],
        slot2Options: [
          { id: 'c2-yukkuri', jp: 'ゆっくり', kana: 'ゆっくり', romaji: 'yukkuri', esPhonetic: 'yúk-ku-ri', es: 'despacio / lentamente', particleTag: 'Adverbio de modo', roleNote: 'Modifica directamente al verbo siguiente' },
          { id: 'c2-kokoni', jp: 'ここに', kana: 'ここに', romaji: 'koko ni', esPhonetic: 'kó-ko ni', es: 'aquí (en este papel/mapa)', particleTag: 'Ubicación に', roleNote: 'Indica dónde escribir o señalar' },
          { id: 'c2-mouichido', jp: 'もう一度', kana: 'もういちど', romaji: 'mō ichido', esPhonetic: 'móo i-chi-dó', es: 'una vez más (otra vez)', particleTag: 'Expresión adverbial', roleNote: 'もう一度 = otra vez' }
        ],
        slot3Options: [
          { id: 'c3-hanashite', jp: '話してください', kana: 'はなしてください', romaji: 'hanashite kudasai', esPhonetic: 'ja-ná-shi-te ku-da-sái', es: 'hable, por favor', particleTag: 'Forma Te + ください', roleNote: '話します (hablar) → 話して + ください' },
          { id: 'c3-oshiete', jp: '教えてください', kana: 'おしえてください', romaji: 'oshiete kudasai', esPhonetic: 'o-shi-é-te ku-da-sái', es: 'enséñeme / indíqueme, por favor', particleTag: 'Forma Te + ください', roleNote: '教えます (enseñar/indicar) → 教えて + ください' },
          { id: 'c3-kaite', jp: '書いてください', kana: 'かいてください', romaji: 'kaite kudasai', esPhonetic: 'kái-te ku-da-sái', es: 'escríbalo, por favor', particleTag: 'Forma Te + ください', roleNote: '書きます (escribir) → 書いて + ください' }
        ]
      },
      {
        id: 'n3-permiso-contraste',
        titleEs: '3B · Pedir Permiso (~てもいいですか) e Introducir con ~けど (Pero...)',
        structureFormula: '[Introducción / Contexto] + [Lugar / Objeto] + [Verbo en ~てもいいですか？]',
        grammarRule: 'Para preguntar "¿Puedo hacer X?" en templos, tiendas o restaurantes, tomas el verbo en Forma Te y le añades もいいですか (mo ii desu ka = "¿está bien incluso si...?").',
        slot1Label: 'Bloque 1 · Apertura Cortés o Contexto con ~けど',
        slot2Label: 'Bloque 2 · Lugar u Objeto de la Acción',
        slot3Label: 'Bloque 3 · Solicitud de Permiso (~てもいいですか)',
        slot1Options: [
          { id: 'p1-sumimasen', jp: 'すみません、', kana: 'すみません、', romaji: 'Sumimasen,', esPhonetic: 'Su-mi-ma-sén,', es: 'Disculpe,', particleTag: 'Apertura cortés', roleNote: 'Llama la atención educadamente' },
          { id: 'p1-yoyaku', jp: '予約していませんけど、', kana: 'よやくしていませんけど、', romaji: 'Yoyaku shite imasen kedo,', esPhonetic: 'Yo-yá-ku shi-te i-ma-sén ke-do,', es: 'No tengo reserva, pero...', particleTag: 'Conector ~けど', roleNote: 'けど suaviza una consulta difícil' },
          { id: 'p1-kado', jp: '現金がありませんけど、', kana: 'げんきんがありませんけど、', romaji: 'Genkin ga arimasen kedo,', esPhonetic: 'Guén-kin ga a-ri-ma-sén ke-do,', es: 'No llevo efectivo, pero...', particleTag: 'Conector ~けど', roleNote: '現金 (efectivo) + がありません (no tengo) + けど' }
        ],
        slot2Options: [
          { id: 'p2-shashin', jp: 'ここで写真を', kana: 'ここでしゃしんを', romaji: 'koko de shashin o', esPhonetic: 'kó-ko de sha-shín o', es: 'fotos aquí', particleTag: 'で + Objeto を', roleNote: 'ここで (aquí) + 写真を (fotos)' },
          { id: 'p2-kado-de', jp: 'クレジットカードで', kana: 'くれじっとかーどで', romaji: 'kurejitto kādo de', esPhonetic: 'ku-re-yít-to káa-do de', es: 'con tarjeta de crédito', particleTag: 'Medio で', roleNote: 'Indica el método de pago' },
          { id: 'p2-nakani', jp: '今、中に', kana: 'いま、なかに', romaji: 'ima, naka ni', esPhonetic: 'í-ma, ná-ka ni', es: 'ahora adentro (al local)', particleTag: 'Dirección に', roleNote: '中に (hacia el interior)' }
        ],
        slot3Options: [
          { id: 'p3-totte', jp: '撮ってもいいですか？', kana: 'とってもいいですか？', romaji: 'totte mo ii desu ka?', esPhonetic: 'tót-te mo íi des-ká', es: '¿puedo tomar (fotos)?', particleTag: 'Permiso ~てもいい', roleNote: '撮ります (tomar foto) → 撮ってもいいですか' },
          { id: 'p3-haratte', jp: '払ってもいいですか？', kana: 'はらってもいいですか？', romaji: 'haratte mo ii desu ka?', esPhonetic: 'ja-rát-te mo íi des-ká', es: '¿puedo pagar?', particleTag: 'Permiso ~てもいい', roleNote: '払います (pagar) → 払ってもいいですか' },
          { id: 'p3-haitte', jp: '入ってもいいですか？', kana: 'はいってもいいですか？', romaji: 'haitte mo ii desu ka?', esPhonetic: 'jáit-te mo íi des-ká', es: '¿puedo entrar?', particleTag: 'Permiso ~てもいい', roleNote: '入ります (entrar) → 入ってもいいですか' }
        ]
      }
    ],
    challenges: [
      {
        id: 'ch-n3-1',
        promptEs: 'Como no entiendo japonés, hable despacio por favor',
        hintGrammar: 'Causa con から (Nihongo ga wakarimasen kara) + Adverbio (yukkuri) + Petición ~てください (hanashite kudasai)',
        blocks: [
          { jp: '日本語がわかりませんから、', romaji: 'Nihongo ga wakarimasen kara,', esPhonetic: 'Ni-jón-go ga ua-ka-ri-ma-sén ka-ra,', role: 'Causa con から (Como no entiendo...)' },
          { jp: 'ゆっくり', romaji: 'yukkuri', esPhonetic: 'yúk-ku-ri', role: 'Adverbio (despacio)' },
          { jp: '話してください', romaji: 'hanashite kudasai', esPhonetic: 'ja-ná-shi-te ku-da-sái', role: 'Petición (~てください)' }
        ],
        fullJp: '日本語がわかりませんから、ゆっくり話してください',
        fullPhonetic: 'Ni-jón-go ga ua-ka-ri-ma-sén ka-ra, yúk-ku-ri ja-ná-shi-te ku-da-sái',
        explanation: 'から une la causa ("no entiendo japonés") con la petición cortés en Forma Te ("hable despacio, por favor").'
      },
      {
        id: 'ch-n3-2',
        promptEs: 'Disculpe, ¿puedo tomar una foto aquí?',
        hintGrammar: 'Disculpe (Sumimasen) + Lugar y objeto (koko de shashin o) + Permiso ~てもいいですか (totte mo ii desu ka)',
        blocks: [
          { jp: 'すみません、', romaji: 'Sumimasen,', esPhonetic: 'Su-mi-ma-sén,', role: 'Apertura cortés' },
          { jp: 'ここで写真を', romaji: 'koko de shashin o', esPhonetic: 'kó-ko de sha-shín o', role: 'Lugar (で) + Objeto (を)' },
          { jp: '撮ってもいいですか？', romaji: 'totte mo ii desu ka?', esPhonetic: 'tót-te mo íi des-ká', role: 'Permiso (~てもいいですか)' }
        ],
        fullJp: 'すみません、ここで写真を撮ってもいいですか？',
        fullPhonetic: 'Su-mi-ma-sén, kó-ko de sha-shín o tót-te mo íi des-ká',
        explanation: '撮ってもいいですか (totte mo ii desu ka) es la fórmula esencial para pedir permiso antes de fotografiar en templos o tiendas.'
      },
      {
        id: 'ch-n3-3',
        promptEs: 'No tengo reserva, pero ¿puedo entrar ahora?',
        hintGrammar: 'Conector contrastivo ~けど (Yoyaku shite imasen kedo) + Dirección (ima, naka ni) + Permiso (haitte mo ii desu ka)',
        blocks: [
          { jp: '予約していませんけど、', romaji: 'Yoyaku shite imasen kedo,', esPhonetic: 'Yo-yá-ku shi-te i-ma-sén ke-do,', role: 'Oración previa con ~けど (pero...)' },
          { jp: '今、中に', romaji: 'ima, naka ni', esPhonetic: 'í-ma, ná-ka ni', role: 'Tiempo + Dirección (に)' },
          { jp: '入ってもいいですか？', romaji: 'haitte mo ii desu ka?', esPhonetic: 'jáit-te mo íi des-ká', role: 'Permiso (~てもいいですか)' }
        ],
        fullJp: '予約していませんけど、今、中に入ってもいいですか？',
        fullPhonetic: 'Yo-yá-ku shi-te i-ma-sén ke-do, í-ma, ná-ka ni jáit-te mo íi des-ká',
        explanation: 'けど ("pero...") prepara al oyente de forma suave y educada antes de pedir entrar sin reserva.'
      }
    ]
  }
];



